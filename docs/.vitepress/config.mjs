import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Alpine Components',
  description: 'Composants headless réutilisables pour Alpine.js 3',
  base: '/alpine-components/',
  lang: 'fr-FR',
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Composants', link: '/components/select' },
      {
        text: 'npm',
        link: 'https://www.npmjs.com/package/@momoledev/alpine-components',
      },
    ],

    sidebar: {
      '/guide/': [
        { text: 'Installation', link: '/guide/getting-started' },
        { text: 'Architecture', link: '/guide/architecture' },
        { text: 'Livewire', link: '/guide/livewire' },
      ],
      '/components/': [
        { text: 'Select', link: '/components/select' },
        { text: 'Dropdown', link: '/components/dropdown' },
        { text: 'InputText', link: '/components/input-text' },
        { text: 'InputTags', link: '/components/input-tags' },
        { text: 'Switch', link: '/components/switch' },
        { text: 'Slider', link: '/components/slider' },
        { text: 'Form', link: '/components/form' },
        { text: 'InputMask', link: '/components/input-mask' },
        { text: 'Toast', link: '/components/toast' },
      ],
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/momostifler96/alpine-components',
      },
    ],

    footer: {
      message: 'Distribué sous licence MIT.',
      copyright: 'Copyright © 2024 Momoledev',
    },

    search: { provider: 'local' },
  },
})
