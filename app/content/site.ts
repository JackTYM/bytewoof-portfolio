/* ============================================================
 * Byte — site content
 * ============================================================
 * EDIT THIS FILE to swap in real values.
 * Every "TODO: real value" comment marks a placeholder.
 * ============================================================ */

// --------------- LINKS ---------------
export interface SiteLink {
  title: string
  sub: string
  href: string
  icon: string   // inline SVG path data
  tone: string   // CSS color hint for the row (used in style attr)
}

export const LINKS: SiteLink[] = [
  {
    title: 'github',
    sub: 'github.com/JackTYM',
    href: 'https://github.com/JackTYM',
    icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z',
    tone: '#271912',
  },
  {
    title: 'x / twitter',
    sub: 'x.com/Byte_Woof',
    href: 'https://x.com/Byte_Woof',
    icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    tone: '#0F0F0F',
  },
  {
    title: 'instagram',
    sub: 'instagram.com/Byte_Woof',
    href: 'https://instagram.com/Byte_Woof',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    tone: '#E1306C',
  },
  {
    title: 'telegram',
    sub: 't.me/Byte_Woof',
    href: 'https://t.me/Byte_Woof',
    icon: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
    tone: '#2AABEE',
  },
  {
    title: 'coding portfolio',
    sub: 'jacktym.dev',
    href: 'https://jacktym.dev',
    icon: 'M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6z',
    tone: '#3B6CB7',
  },
]

// --------------- PROJECTS ---------------
export interface Project {
  slug: string
  name: string
  status: 'open sourced' | 'released' | 'moved on'
  statusColor: string
  description: string
  tags: string[]
  ctaLabel: string
  href: string // TODO: real value
  icon: 'bolt' | 'star' | 'soccer'
}

export const PROJECTS: Project[] = [
  {
    slug: 'marketshark',
    name: 'MarketShark',
    status: 'open sourced',
    statusColor: 'var(--green-600)',
    description: 'full-stack system for automatic auction flipping in hypixel skyblock in minecraft — a backend server, a java mod, and a native c++ client. my first real business and made me $4k in high school.',
    tags: ['c++', 'minecraft', 'discord'],
    ctaLabel: 'view source',
    href: 'https://github.com/JackTYM/MarketShark',
    icon: 'bolt',
  },
  {
    slug: 'jacksunblockedhub',
    name: 'JacksUnblockedHub',
    status: 'released',
    statusColor: 'var(--blue-600)',
    description: 'an ultraviolet proxy with built-in games, chat, full websocket support, and automatic wildcard-domain ssl traffic. spread across my whole school district in high school and almost got me suspended.',
    tags: ['typescript', 'games', 'cybersecurity'],
    ctaLabel: 'check it out',
    href: 'https://github.com/JackTYM/JacksUnblockedHub',
    icon: 'star',
  },
  {
    slug: 'dribble',
    name: 'Dribble',
    status: 'moved on',
    statusColor: 'var(--text-muted)',
    description: 'soccer analytics platform ingesting live from opta, twitter, and youtube. i co-founded it and have since moved on.',
    tags: ['web', 'scraping', 'aws'],
    ctaLabel: 'the story',
    href: 'https://dribble360.com',
    icon: 'soccer',
  },
]

// --------------- GALLERY ---------------
export interface GalleryItem {
  slug: string
  /** path relative to public/, e.g. '/gallery/byte-bust.webp' */
  src: string
  title: string
  desc: string
  credit: string
  creditUrl: string // TODO: real value — artist profile / YCH link
  seedLikes: number
  nsfw?: boolean
}

export const GALLERY: GalleryItem[] = [
  {
    slug: 'byte-bust',
    src: '/gallery/byte-bust.webp',
    title: 'bust',
    desc: 'a clean bust commission.',
    credit: 'artist — add handle', // TODO: real value
    creditUrl: '#', // TODO: real value
    seedLikes: 214,
  },
  {
    slug: 'byte-icon',
    src: '/gallery/byte-icon.webp',
    title: 'happy icon',
    desc: 'round chibi icon commission.',
    credit: 'artist — add handle', // TODO: real value
    creditUrl: '#', // TODO: real value
    seedLikes: 480,
  },
  {
    slug: 'byte-lick',
    src: '/gallery/byte-lick.webp',
    title: 'blep / lick',
    desc: 'a big ol\' blep.',
    credit: 'artist — add handle', // TODO: real value
    creditUrl: '#', // TODO: real value
    seedLikes: 327,
  },
  {
    slug: 'byte-puppified',
    src: '/gallery/byte-puppified.webp',
    title: 'puppified',
    desc: 'full pup mode.',
    credit: 'artist — add handle', // TODO: real value
    creditUrl: '#', // TODO: real value
    seedLikes: 612,
  },
  {
    slug: 'byte-hug',
    src: '/gallery/byte-hug.webp',
    title: 'cozy hug',
    desc: 'boyfriend hug commission — velvetbun · 2022.',
    credit: 'velvetbun', // TODO: real value — add handle
    creditUrl: '#', // TODO: real value
    seedLikes: 905,
  },
  {
    slug: 'byte-refsheet',
    src: '/gallery/byte-refsheet.webp',
    title: 'ref sheet',
    desc: 'the official reference sheet.',
    credit: 'artist — add handle', // TODO: real value
    creditUrl: '#', // TODO: real value
    seedLikes: 158,
  },
]

// --------------- CONS ---------------
export interface Con {
  slug: string
  name: string
  kind: string
  month: string
  day: string
  year: string
  dates: string
  city: string
  venue: string
  blurb: string
  href: string
  accent: string
  accentFg: string
}

export const CONS: Con[] = [
  {
    slug: 'defcon-34',
    name: 'DEF CON 34',
    kind: 'hacking / infosec',
    month: 'AUG', day: '6–9', year: '2026',
    dates: 'aug 6–9, 2026',
    city: 'las vegas, nv',
    venue: 'las vegas convention center',
    blurb: "the big one. four days of talks, villages, and demo labs. this year's theme is “agency.” come find me in the crowd.",
    href: 'https://defcon.org/',
    accent: 'var(--byte-blue)', accentFg: '#06283A',
  },
  {
    slug: 'pdfc-2027',
    name: 'Painted Desert Fur Con',
    kind: 'furry con',
    month: 'JAN', day: '1–3', year: '2027',
    dates: 'jan 1–3, 2027',
    city: 'phoenix, az',
    venue: 'sheraton phoenix downtown',
    blurb: "arizona’s furry con — theme “mad mammal: furry road.” panels, dances, and a lot of fur. say hi if you spot the wolfdog.",
    href: 'https://painteddesertfc.org/',
    accent: 'var(--blush-300)', accentFg: '#6B273C',
  },
]

// --------------- GUESTBOOK DEFAULTS ---------------
export interface GuestEntry {
  id: string
  name: string
  message: string
  doodle?: string
  ts: number
}

export const GUESTBOOK_DEFAULTS: GuestEntry[] = [
  { id: 'default-1', name: 'pixelfox', message: 'cute site!! booped you like 10 times 🐾',    ts: 0 },
  { id: 'default-2', name: 'rootkit',  message: 'the terminal block is so you lol',             ts: 0 },
  { id: 'default-3', name: 'mossy',    message: 'tapped your card at the con — saved!',          ts: 0 },
]
