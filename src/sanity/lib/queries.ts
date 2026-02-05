import { groq } from 'next-sanity'

export const projectsQuery = groq`*[_type == "project"] {
  _id,
  title,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  description,
  technologies,
  "link": linkToCode,
  "live": linkToLive,
  "details": pt::text(details)
}`
