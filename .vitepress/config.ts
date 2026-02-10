import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Fur-img-api-next',
  description: '高性能图片/文件服务 API 文档',
  lang: 'zh-CN',
  appearance: 'dark',
  lastUpdated: true,
  
  head: [
    ['meta', { name: 'theme-color', content: '#3c3c44' }],
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Fur-img-api',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/getting-started' },
      { text: 'API 文档', link: '/api/overview' },
      { text: '配置指南', link: '/guide/configuration' },
      { text: '部署', link: '/guide/deployment' },
      { text: '测试', link: '/api/test' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '配置', link: '/guide/configuration' },
            { text: '部署', link: '/guide/deployment' },
            { text: '日志系统', link: '/guide/logging' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 文档',
          items: [
            { text: '概览', link: '/api/overview' },
            { text: '随机文件', link: '/api/random-files' },
            { text: '文件列表', link: '/api/file-list' },
            { text: '状态检查', link: '/api/status' },
            { text: '管理员接口', link: '/api/admin' },
            { text: '测试工具', link: '/api/test' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/114514-lang/Fur-img-api-next' }
    ],

    footer: {
      message: '基于 GPL-3.0 许可证开源',
      copyright: 'Copyright © 2023 - 2026 FurCraft. All rights reserved.'
    },

    editLink: {
      pattern: 'https://github.com/114514-lang/Fur-img-api-next/edit/main/docs/:path',
      text: '编辑此页'
    },

    search: {
      provider: 'local'
    }
  },

  markdown: {
    lineNumbers: true,
    toc: {
      level: [2, 3]
    }
  }
})
