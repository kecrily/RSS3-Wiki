import type { SidebarConfig } from '@vuepress/theme-default'

export const en: SidebarConfig = {
    '/tech-weekly/': [
        {
            text: 'Tech Weekly',
            children: [
                '/tech-weekly/README.md',
            ],
        },
    ],
    '/': [
        {
            text: '👋 Guide',
            collapsible: true,
            link: '/README.md',
            children: [
                '/README.md',
                '/products.md',
                '/faq.md',
                '/thanks.md',
            ],
        },
        {
            text: '🕊 Protocol',
            collapsible: true,
            sidebarDepth: 5,
            link: '/protocol/README.md',
            children: [
                '/protocol/README.md',
                '/protocol/v0.4.0-rc.1.md',
                {
                    text: 'RSS3 Improvement Proposals',
                    children: [
                        '/protocol/RIPs/RIP-1.md',
                        '/protocol/RIPs/RIP-2.md',
                        '/protocol/RIPs/RIP-3.md',
                        '/protocol/RIPs/RIP-4.md',
                        '/protocol/RIPs/RIP-5.md',
                    ],
                },
            ],
        },
        {
            text: '🐿 SDK',
            collapsible: true,
            link: '/sdk/list.md',
            children: [
                '/sdk/list.md',
                '/sdk/rss3-sdk-for-javascript.md',
            ],
        },
        {
            text: '🦈 Network',
            collapsible: true,
            link: '/network/roadmap.md',
            children: [
                '/network/roadmap.md',
                '/network/api.md',
                '/network/data.md',
            ],
        },
        '/design.md',
        '/events.md',
        '/token.md',
    ],
}