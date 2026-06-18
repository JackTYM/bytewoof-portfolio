export default defineEventHandler(() => {
  const R2 = 'https://cdn.bytewoof.dog/gallery'
  return [
    {
      loc: '/',
      images: [
        { loc: `${R2}/byte-bust.webp`,         title: 'bust',                  caption: 'bust by Noah' },
        { loc: `${R2}/byte-lick.webp`,          title: 'blep',                  caption: 'blep by Noah' },
        { loc: `${R2}/byte-refsheet.webp`,      title: 'ref sheet',             caption: 'ref sheet by Noah' },
        { loc: `${R2}/byte-puppified.webp`,     title: 'Puppy Pride YCH',       caption: 'Puppy Pride YCH by 14pup' },
        { loc: `${R2}/byte-icon.webp`,          title: 'love emoticon',         caption: 'love emoticon by zanky' },
        { loc: `${R2}/byte-hug.webp`,           title: 'Waiting For Moment YCH', caption: 'Waiting For Moment YCH by velvetbun' },
        { loc: `${R2}/byte-bellyrub.webp`,      title: 'Belly Rub YCH',         caption: 'Belly Rub YCH by kiro' },
        { loc: `${R2}/byte-livevibrantly.webp`, title: 'Live Vibrantly YCH',    caption: 'Live Vibrantly YCH by Kaiju' },
      ],
    },
  ]
})
