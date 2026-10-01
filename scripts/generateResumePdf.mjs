import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '33fg8g6b';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-02-04',
  useCdn: false,
});

function sanitize(str) {
  if (!str) return '';
  return String(str)
    .replace(/[\u2013\u2014]/g, '-') // en-dash / em-dash
    .replace(/[\u2018\u2019]/g, "'") // smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // smart double quotes
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '-') // bullets
    .replace(/[\r\n]+/g, ' ')
    .trim();
}

async function buildPdf() {
  console.log('📄 Generating IEEE Technical Resume PDF using pdf-lib...');

  let summaryDoc = null;
  let experience = [];
  let education = [];
  let leadership = [];

  try {
    [summaryDoc, experience, education, leadership] = await Promise.all([
      client.fetch('*[_type == "profileSummary" && _id == "profile-summary"][0]'),
      client.fetch('*[_type == "experience"] | order(order asc, startDate desc)'),
      client.fetch('*[_type == "education"] | order(order asc, startDate desc)'),
      client.fetch('*[_type == "leadershipActivity"] | order(order asc)'),
    ]);
  } catch (err) {
    console.warn('⚠️ Could not fetch from Sanity, using verified defaults:', err.message);
  }

  const defaultSummary =
    "As an MCA student at MIT Manipal, I am deeply passionate about technology and continuous learning. My primary expertise spans Artificial Intelligence, software engineering, and full-stack web development, and I am currently expanding my technical horizons by actively exploring IoT and embedded systems. I thrive in collaborative, fast-paced environments and actively participate in technical events, collegiate competitions, and hackathons to build practical solutions and challenge myself alongside my peers.";

  const summaryText = sanitize(summaryDoc?.summary || defaultSummary);

  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  function checkNewPage(neededSpace = 30) {
    if (y < margin + neededSpace) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
  }

  function drawText(rawText, x, size, font = fontRegular, color = rgb(0.1, 0.1, 0.1)) {
    const text = sanitize(rawText);
    if (!text) return;
    currentPage.drawText(text, { x, y, size, font, color });
  }

  function drawBulletDot(x, yPos) {
    currentPage.drawCircle({
      x,
      y: yPos + 3,
      size: 1.5,
      color: rgb(0.1, 0.1, 0.1),
    });
  }

  function drawWrappedText(rawText, x, size, maxWidth, font = fontRegular, color = rgb(0.15, 0.15, 0.15), lineHeight = 12) {
    const text = sanitize(rawText);
    if (!text) return;
    const words = text.split(' ');
    let line = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = line + (line === '' ? '' : ' ') + words[i];
      const width = font.widthOfTextAtSize(testLine, size);
      if (width > maxWidth && line !== '') {
        checkNewPage(lineHeight);
        currentPage.drawText(line, { x, y, size, font, color });
        y -= lineHeight;
        line = words[i];
      } else {
        line = testLine;
      }
    }
    if (line !== '') {
      checkNewPage(lineHeight);
      currentPage.drawText(line, { x, y, size, font, color });
      y -= lineHeight;
    }
  }

  function drawSectionHeader(title) {
    checkNewPage(35);
    y -= 10;
    drawText(title.toUpperCase(), margin, 10.5, fontBold, rgb(0, 0, 0));
    y -= 4;
    currentPage.drawLine({
      start: { x: margin, y },
      end: { x: pageWidth - margin, y },
      thickness: 0.8,
      color: rgb(0, 0, 0),
    });
    y -= 10;
  }

  // Embed profile photo if available
  const photoPath = path.join(process.cwd(), 'public', 'srijanLin.png');
  let photoImg = null;
  if (fs.existsSync(photoPath)) {
    try {
      const photoBytes = fs.readFileSync(photoPath);
      photoImg = await pdfDoc.embedPng(photoBytes);
      console.log('📷 Successfully embedded srijanLin.png in PDF');
    } catch (e) {
      console.warn('⚠️ Could not embed srijanLin.png:', e.message);
    }
  }

  // --- HEADER ---
  if (photoImg) {
    const photoSize = 54;
    const photoX = pageWidth - margin - photoSize;
    const photoY = y - photoSize;

    currentPage.drawImage(photoImg, {
      x: photoX,
      y: photoY,
      width: photoSize,
      height: photoSize,
    });

    currentPage.drawRectangle({
      x: photoX,
      y: photoY,
      width: photoSize,
      height: photoSize,
      borderWidth: 1,
      borderColor: rgb(0.2, 0.2, 0.2),
    });

    // Header text on left
    currentPage.drawText("Srijan K", {
      x: margin,
      y: y - 2,
      size: 18,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    currentPage.drawText("Software Developer | Mangalore / Manipal, Karnataka, India", {
      x: margin,
      y: y - 18,
      size: 9,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    currentPage.drawText("srijankulal1010@gmail.com | +91 8762471304 | srijan-k.me", {
      x: margin,
      y: y - 31,
      size: 8,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });

    currentPage.drawText("github.com/srijankulal | linkedin.com/in/srijan-kulal", {
      x: margin,
      y: y - 43,
      size: 8,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });

    y -= 58;
  } else {
    const name = "Srijan K";
    const nameWidth = fontBold.widthOfTextAtSize(name, 20);
    currentPage.drawText(name, {
      x: (pageWidth - nameWidth) / 2,
      y,
      size: 20,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    y -= 16;

    const subtitle = "Software Developer | Mangalore / Manipal, Karnataka, India";
    const subWidth = fontBold.widthOfTextAtSize(subtitle, 9.5);
    currentPage.drawText(subtitle, {
      x: (pageWidth - subWidth) / 2,
      y,
      size: 9.5,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 14;

    const contactRow = "srijankulal1010@gmail.com | +91 8762471304 | srijan-k.me | github.com/srijankulal | linkedin.com/in/srijan-kulal";
    const contactWidth = fontRegular.widthOfTextAtSize(contactRow, 8);
    currentPage.drawText(contactRow, {
      x: (pageWidth - contactWidth) / 2,
      y,
      size: 8,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 8;
  }

  currentPage.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  y -= 4;

  // --- 1. PROFESSIONAL SUMMARY ---
  drawSectionHeader("Professional Summary");
  drawWrappedText(summaryText, margin, 9, contentWidth, fontRegular, rgb(0.15, 0.15, 0.15), 13);
  y -= 2;

  // --- 2. EDUCATION ---
  drawSectionHeader("Education");
  const eduItems = education.length > 0 ? education.slice(0, 3) : [
    {
      degree: "Master of Computer Applications (M.C.A)",
      institution: "Manipal Institute of Technology (MIT)",
      location: "Manipal, Karnataka, India",
      startDate: "2026",
      endDate: "Present",
      current: true,
      gpa: "In Progress",
      description: "Specializing in Artificial Intelligence, Distributed Systems, Cloud Architecture, and Software Engineering."
    },
    {
      degree: "Bachelor of Computer Applications (B.C.A)",
      institution: "St. Aloysius College / University",
      location: "Mangalore, Karnataka, India",
      startDate: "2023",
      endDate: "2026",
      current: false,
      gpa: "Graduated",
      description: "Coursework in Data Structures, Algorithms, DBMS (PostgreSQL/MySQL), OOP (Java/C++), and Web Technologies."
    }
  ];

  for (const edu of eduItems) {
    checkNewPage(35);
    const period = sanitize(`${edu.startDate} - ${edu.current ? "Present" : edu.endDate || "Present"}`);
    const periodWidth = fontRegular.widthOfTextAtSize(period, 8.5);

    drawText(edu.degree, margin, 9.5, fontBold, rgb(0, 0, 0));
    drawText(period, pageWidth - margin - periodWidth, 8.5, fontRegular, rgb(0.3, 0.3, 0.3));
    y -= 12;

    const schoolLoc = sanitize(`${edu.institution}, ${edu.location || "Mangalore, India"}${edu.gpa ? ` | Status: ${edu.gpa}` : ""}`);
    drawText(schoolLoc, margin, 8.5, fontOblique, rgb(0.25, 0.25, 0.25));
    y -= 11;

    if (edu.description) {
      drawWrappedText(edu.description, margin, 8, contentWidth, fontRegular, rgb(0.3, 0.3, 0.3), 11);
      y -= 3;
    }
  }

  // --- 3. PROFESSIONAL EXPERIENCE & INTERNSHIPS ---
  drawSectionHeader("Professional Experience & Internships");
  const expItems = experience.length > 0 ? experience : [
    {
      role: "Digital Forensic Intern",
      company: "Sanmati Forensic Lab",
      type: "Internship",
      startDate: "Jul 2023",
      endDate: "Jul 2023",
      summary: "Gained practical expertise in real-world digital forensic workflows.",
      highlights: [
        "Applied Windows forensic techniques and explored Windows registry extraction methodologies.",
        "Conducted artifact investigation and extracted actionable system insights."
      ]
    },
    {
      role: "Project Lead / Intern",
      company: "Excelerate",
      type: "Internship",
      startDate: "2023",
      endDate: "2023",
      summary: "Led an engineering team of 8 developing secure software solutions.",
      highlights: [
        "Architected secure Linux environments integrating RMF security controls and network tools (Wireshark, Tripwire, Iftop).",
        "Managed cross-functional task tracking and ensured high milestone quality."
      ]
    },
    {
      role: "Intern",
      company: "Mindler",
      type: "Internship",
      startDate: "2023",
      endDate: "2023",
      summary: "Recognized as top performer for excellence in project execution and delivery."
    }
  ];

  for (const exp of expItems) {
    checkNewPage(45);
    const dateRange = sanitize(`${exp.startDate} - ${exp.current ? "Present" : exp.endDate || "Present"}`);
    const dateWidth = fontRegular.widthOfTextAtSize(dateRange, 8.5);

    const titleStr = sanitize(`${exp.role} | ${exp.company} (${exp.type || "Internship"})`);
    drawText(titleStr, margin, 9.5, fontBold, rgb(0, 0, 0));
    drawText(dateRange, pageWidth - margin - dateWidth, 8.5, fontRegular, rgb(0.3, 0.3, 0.3));
    y -= 12;

    if (exp.summary) {
      drawWrappedText(exp.summary, margin, 8.5, contentWidth, fontRegular, rgb(0.2, 0.2, 0.2), 11);
      y -= 2;
    }

    if (exp.highlights && Array.isArray(exp.highlights)) {
      for (const hl of exp.highlights) {
        checkNewPage(18);
        drawBulletDot(margin + 6, y);
        drawWrappedText(hl, margin + 14, 8.5, contentWidth - 14, fontRegular, rgb(0.2, 0.2, 0.2), 11);
        y -= 2;
      }
    }
    y -= 4;
  }

  // --- 4. TECHNICAL PROJECTS ---
  drawSectionHeader("Technical Projects");
  const projects = [
    {
      name: "PixelCypher - LSB Image Steganography Suite",
      tech: "Next.js, TypeScript, Java, Spring Boot, Python Flask",
      bullets: [
        "Designed privacy-focused steganography tool encrypting secret text payloads into PNG pixel channels.",
        "Built modular Spring Boot & Flask REST APIs with custom encode/decode endpoints and CORS support."
      ]
    },
    {
      name: "ByteSize - AI Flashcard Platform",
      tech: "Next.js, React, Tailwind CSS, AI API",
      bullets: [
        "Constructed intelligent study deck generation tool using Next.js and LLM APIs.",
        "Implemented document import/export, user study collections, and responsive flashcard flip animations."
      ]
    },
    {
      name: "Balipu Club - Event Platform MVP",
      tech: "Next.js, Firebase, QR Scanner, Tailwind CSS",
      bullets: [
        "Developed registration MVP featuring custom admin dashboard and live QR scanner for ticket distribution."
      ]
    },
    {
      name: "SyntiX - Remote PC Media Controller",
      tech: "Python, Flutter, Dart, Windows Core Audio API",
      bullets: [
        "Programmed cross-platform Flutter mobile client controlling PC volume/brightness over local socket network."
      ]
    },
    {
      name: "LED Display Driver Library",
      tech: "C++, Arduino Framework, PlatformIO",
      bullets: [
        "Created embedded C++ library facilitating digital pin control for 7-segment LED modules."
      ]
    }
  ];

  for (const proj of projects) {
    checkNewPage(35);
    const title = sanitize(`${proj.name} | `);
    drawText(title, margin, 9, fontBold, rgb(0, 0, 0));
    const titleWidth = fontBold.widthOfTextAtSize(title, 9);
    drawText(proj.tech, margin + titleWidth, 8.5, fontOblique, rgb(0.3, 0.3, 0.3));
    y -= 11;

    for (const b of proj.bullets) {
      checkNewPage(16);
      drawBulletDot(margin + 6, y);
      drawWrappedText(b, margin + 14, 8.5, contentWidth - 14, fontRegular, rgb(0.2, 0.2, 0.2), 11);
      y -= 1;
    }
    y -= 3;
  }

  // --- 5. TECHNICAL SKILLS ---
  drawSectionHeader("Technical Skills");
  const skills = [
    { cat: "Programming Languages", items: "Python, TypeScript, JavaScript, Java, C++, C#, Dart, SQL (PostgreSQL, MySQL)" },
    { cat: "Frameworks & Web Tech", items: "Next.js, React, Flask, Spring Boot, Flutter, Node.js, Tailwind CSS" },
    { cat: "Databases & Storage", items: "PostgreSQL, MySQL, Vercel Blob Storage, Sanity CMS" },
    { cat: "IoT & Embedded Systems", items: "Arduino, PlatformIO, Microcontroller Interfacing, 7-Segment Controllers, C++" },
    { cat: "Tools & Platforms", items: "Git, GitHub, Vercel, Postman, Linux/Unix, VS Code, CI/CD" }
  ];

  for (const s of skills) {
    checkNewPage(14);
    const cat = sanitize(`${s.cat}: `);
    drawText(cat, margin, 8.5, fontBold, rgb(0, 0, 0));
    const catWidth = fontBold.widthOfTextAtSize(cat, 8.5);
    drawWrappedText(s.items, margin + catWidth, 8.5, contentWidth - catWidth, fontRegular, rgb(0.2, 0.2, 0.2), 11);
    y -= 2;
  }

  // --- 6. LEADERSHIP & TECHNICAL ACTIVITIES ---
  drawSectionHeader("Leadership & Technical Activities");
  const leadItems = leadership.length > 0 ? leadership : [
    {
      title: "Open Source Leadership & Tooling",
      description: "Active contributor and maintainer of open-source utilities and microcontroller libraries on GitHub."
    },
    {
      title: "Engineering Project Leadership",
      description: "Led cross-functional engineering teams in network security, digital cryptography, and web development."
    },
    {
      title: "Hardware & IoT Exploration",
      description: "Prototyping physical computing architectures with microcontrollers and local socket telemetry."
    }
  ];

  for (const l of leadItems) {
    checkNewPage(22);
    drawBulletDot(margin + 6, y);
    const itemText = sanitize(`${l.title}: ${l.description}`);
    drawWrappedText(itemText, margin + 14, 8.5, contentWidth - 14, fontRegular, rgb(0.2, 0.2, 0.2), 11);
    y -= 2;
  }

  const pdfBytes = await pdfDoc.save();
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'Srijan_Kulal_Resume.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`✅ Resume PDF successfully written to ${outputPath} (${(pdfBytes.length / 1024).toFixed(1)} KB)`);
}

buildPdf().catch(err => {
  console.error('❌ Error generating PDF:', err);
  process.exit(1);
});
