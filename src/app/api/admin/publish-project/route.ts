import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function createPortableTextBlocks(text: string) {
  const sections = text.split('\n\n').map(s => s.trim()).filter(Boolean);
  return sections.map((section, idx) => ({
    _key: `block_${Date.now()}_${idx}`,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _key: `span_${Date.now()}_${idx}`,
        _type: 'span',
        marks: [],
        text: section,
      }
    ]
  }));
}

import { isAuthorizedAdmin } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const dataString = formData.get('projectData') as string | null;

    if (!dataString) {
      return NextResponse.json({ error: 'projectData JSON payload is required.' }, { status: 400 });
    }

    const data = JSON.parse(dataString);

    if (!isAuthorizedAdmin(req, data.token)) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const {
      title,
      slug,
      description,
      technologies,
      linkToCode,
      linkToLive,
      isFreelance,
      detailsText,
    } = data;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Project title and slug are required.' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Handle Image Upload if provided
    let mainImageDoc = undefined;
    const imageFile = formData.get('image') as File | null;

    if (imageFile && imageFile.size > 0) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const asset = await writeClient.assets.upload('image', buffer, {
          filename: imageFile.name || `${cleanSlug}-preview.png`,
          contentType: imageFile.type || 'image/png',
        });

        mainImageDoc = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
          alt: title,
        };
      } catch (assetErr: any) {
        console.error('[Publish Project] Asset upload warning:', assetErr);
        // We will continue publishing the project even if image asset upload had an error
      }
    }

    const projectDoc: any = {
      _id: `project-${cleanSlug}`,
      _type: 'project',
      title: title.trim(),
      slug: {
        _type: 'slug',
        current: cleanSlug,
      },
      description: (description || '').trim(),
      technologies: Array.isArray(technologies) ? technologies.map((t: string) => t.trim()).filter(Boolean) : [],
      linkToCode: linkToCode ? linkToCode.trim() : undefined,
      linkToLive: linkToLive ? linkToLive.trim() : undefined,
      isFreelance: Boolean(isFreelance),
      details: detailsText ? createPortableTextBlocks(detailsText) : [],
    };

    if (mainImageDoc) {
      projectDoc.mainImage = mainImageDoc;
    }

    const result = await writeClient.createOrReplace(projectDoc);

    return NextResponse.json({
      success: true,
      docId: result._id,
      slug: cleanSlug,
      title: projectDoc.title,
      hasImage: Boolean(mainImageDoc),
    });
  } catch (err: any) {
    console.error('[Publish Project Error]', err);
    return NextResponse.json(
      { error: err.message || 'Failed to publish project to Sanity.' },
      { status: 500 }
    );
  }
}
