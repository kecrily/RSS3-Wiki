import type { NavbarConfig } from '@vuepress/theme-default'

export const en: NavbarConfig = [
    {
        text: 'Guide',
        link: '/',
    },
    {
        text: 'Tech Weekly',
        link: '/tech-weekly/',
    },
    {
        text: 'Whitepaper',
        link: 'https://rss3.io/RSS3-Whitepaper.pdf'
    },
    {
        text: 'Blog',
        link: 'https://rss3.notion.site/'
    },
    {
        text: '💌 Join Us',
        link: 'https://rss3.notion.site/Open-Source-Remote-RSS3-Offering-the-Dopest-Positions-b6fdbffee017449797397f45340de9d4'
    },
    {
        text: 'Learn More',
        children: [
            {
                text: 'Discord',
                link: 'https://discord.gg/rss3'
            },
            {
                text: 'Telegram',
                link: 'https://t.me/rss3_en'
            },
            {
                text: 'Twitter',
                link: 'https://twitter.com/rss3_'
            },
            {
                text: 'Support RSS3',
                link: '/support.md'
            },
        ]
    },
]