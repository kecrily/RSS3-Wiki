import type { NavbarConfig } from '@vuepress/theme-default'

export const zh: NavbarConfig = [
    {
        text: '指南',
        link: '/zh/',
    },
    {
        text: '技术周刊',
        link: '/zh/tech-weekly/',
    },
    {
        text: '白皮书',
        link: 'https://rss3.io/RSS3-Whitepaper.pdf'
    },
    {
        text: '博客',
        link: 'https://rss3.notion.site/'
    },
    {
        text: '💌 加入我们',
        link: 'https://rss3.notion.site/Open-Source-Remote-RSS3-Offering-the-Dopest-Positions-b6fdbffee017449797397f45340de9d4'
    },
    {
        text: '了解更多',
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
                text: '支持 RSS3',
                link: '/zh/support.md'
            },
        ]
    },
]