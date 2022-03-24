import { defineUserConfig } from '@vuepress/cli'
import type { DefaultThemeOptions } from '@vuepress/theme-default'
import { navbar, sidebar } from './configs'
const { description } = require('../../package')

export default defineUserConfig<DefaultThemeOptions>({
    title: 'RSS3',
    description: description,

    locales: {
        '/': {
          lang: 'en-US',
        },
        '/zh/': {
          lang: 'zh-CN',
        },
    },

    head: [
        ['meta', { name: 'theme-color', content: '#fff' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['link', { rel: 'icon', href: 'https://graphics.rss3.workers.dev/' }]
    ],

    markdown: {
        extractHeaders: {
            level: [1, 2, 3, 4],
        },
    },

    plugins: [
        '@vuepress/plugin-shiki',
        ['@vuepress/plugin-docsearch', {
            apiKey: 'a9bd399b495e1f6a542c545d43329f6d',
            indexName: 'rss3',
            appId: '6EJE6R29QB',
        }],
        ['@vuepress/plugin-google-analytics', {
            id: 'G-8BSS4K59LF',
        }],
    ],

    themeConfig: {
        repo: 'NaturalSelectionLabs',
        docsRepo: 'NaturalSelectionLabs/RSS3-Wiki',
        sidebarDepth: 3,
        docsDir: 'src',
        logo: 'https://graphics.rss3.workers.dev/',
        themePlugins: {
            activeHeaderLinks: false,
        },
        locales: {
            '/': {
              selectLanguageName: 'English',
              navbar: navbar.en,
              sidebar: sidebar.en,
            }, 
            '/zh/': {
                selectLanguageName: '中文',
                selectLanguageText: '语言',
                selectLanguageAriaLabel: '语言',
                navbar: navbar.zh,
                sidebar: sidebar.zh,
              },
        },
    },
})
