import { groq } from 'next-sanity'

export const projectsQuery = groq`*[_type == "project"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  description,
  "isFreelance": coalesce(isFreelance, false),
  technologies,
  "link": linkToCode,
  "live": linkToLive,
  "details": pt::text(details)
}`

export const educationQuery = groq`*[_type == "education"] | order(order asc, startDate desc) {
  _id,
  institution,
  degree,
  fieldOfStudy,
  location,
  startDate,
  endDate,
  current,
  gpa,
  description,
  order
}`

export const experienceQuery = groq`*[_type == "experience"] | order(order asc, startDate desc) {
  _id,
  role,
  company,
  type,
  location,
  startDate,
  endDate,
  current,
  summary,
  highlights,
  technologies,
  companyUrl,
  order
}`

export const leadershipQuery = groq`*[_type == "leadershipActivity"] | order(order asc) {
  _id,
  title,
  description,
  source,
  order
}`

export const profileSummaryQuery = groq`*[_type == "profileSummary" && _id == "profile-summary"][0] {
  _id,
  title,
  summary,
  shortSummary,
  highlights,
  isCustomOverride,
  source,
  lastUpdated
}`
