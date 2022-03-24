import type { SidebarConfig } from '@vuepress/theme-default'

export const zh: SidebarConfig = {
    '/zh/tech-weekly/': [
        {
            text: '技术周刊',
            children: [
                '/zh/tech-weekly/README.md',
            ],
        },
    ],
    '/zh/': [
        {
            text: '👋 指南',
            collapsible: true,
            link: '/zh/README.md',
            children: [
                '/zh/README.md',
                '/zh/products.md',
                '/zh/faq.md',
                '/zh/thanks.md',
            ],
        },
        {
            text: '🕊 协议',
            collapsible: true,
            sidebarDepth: 5,
            link: '/zh/protocol/README.md',
            children: [
                '/zh/protocol/README.md',
                '/zh/protocol/v0.4.0-rc.1.md',
                {
                    text: 'RSS3 Improvement Proposals',
                    children: [
                        '/zh/protocol/RIPs/RIP-1.md',
                        '/zh/protocol/RIPs/RIP-2.md',
                        '/zh/protocol/RIPs/RIP-3.md',
                        '/zh/protocol/RIPs/RIP-4.md',
                        '/zh/protocol/RIPs/RIP-5.md',
                    ],
                },
            ],
        },
        {
            text: '🐿 SDK',
            collapsible: true,
            link: '/zh/sdk/list.md',
            children: [
                '/zh/sdk/list.md',
                '/zh/sdk/rss3-sdk-for-javascript.md',
            ],
        },
        {
            text: '🦈 网络',
            collapsible: true,
            link: '/zh/network/roadmap.md',
            children: [
                '/zh/network/roadmap.md',
                '/zh/network/api.md',
                '/zh/network/data.md',
            ],
        },
        '/zh/design.md',
        '/zh/events.md',
        '/zh/token.md',
    ],
}