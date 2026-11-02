import { defineConfig } from 'vitepress'

const providers = [
  ['Twilio', 'twilio'],
  ['Vonage', 'vonage'],
  ['Sinch', 'sinch'],
  ['Bird', 'bird'],
  ['Plivo', 'plivo'],
  ['Telnyx', 'telnyx'],
  ['Infobip', 'infobip'],
  ['ClickSend', 'clicksend'],
  ['Clickatell', 'clickatell'],
  ['Brevo', 'brevo'],
  ['Bandwidth', 'bandwidth'],
  ['SendPulse', 'sendpulse'],
  ['Amazon SNS', 'aws-sns'],
  ['WhatsApp', 'whatsapp'],
]

const regional = [
  ['MSG91', 'msg91'],
  ['Sparrow SMS', 'sparrow'],
  ['Termii', 'termii'],
  ['Sendchamp', 'sendchamp'],
  ["Africa's Talking", 'africastalking'],
  ['BulkSMS', 'bulksms'],
]

const link = ([text, slug]: string[]) => ({ text, link: `/providers/${slug}` })

export default defineConfig({
  title: 'Laravel SMS',
  description: 'One fluent API for sending SMS from Laravel through twenty providers.',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#0b7a5c' }],
    ['meta', { property: 'og:title', content: 'Laravel SMS' }],
    ['meta', { property: 'og:description', content: 'One fluent API for sending SMS from Laravel through twenty providers.' }],
  ],

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark-dimmed' },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Laravel SMS',

    nav: [
      { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: 'Providers', link: '/providers/', activeMatch: '/providers/' },
      { text: 'Reference', link: '/reference/configuration', activeMatch: '/reference/' },
      {
        text: 'v2.0',
        items: [
          { text: 'Upgrading from 1.x', link: '/reference/upgrading' },
          { text: 'Changelog', link: 'https://github.com/mr-rijal/laravel-sms/blob/main/CHANGELOG.md' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Your first message', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Sending',
          items: [
            { text: 'Composing messages', link: '/guide/sending' },
            { text: 'Results and errors', link: '/guide/results' },
            { text: 'Queueing', link: '/guide/queueing' },
            { text: 'Failover and load balancing', link: '/guide/failover' },
            { text: 'Notifications', link: '/guide/notifications' },
          ],
        },
        {
          text: 'Going further',
          items: [
            { text: 'Events', link: '/guide/events' },
            { text: 'Webhooks', link: '/guide/webhooks' },
            { text: 'Testing', link: '/guide/testing' },
            { text: 'Custom drivers', link: '/guide/custom-drivers' },
            { text: 'Performance', link: '/guide/performance' },
            { text: 'Security', link: '/guide/security' },
          ],
        },
      ],
      '/providers/': [
        { text: 'Overview', items: [{ text: 'Choosing a provider', link: '/providers/' }] },
        { text: 'Global', items: providers.map(link) },
        { text: 'Regional', items: regional.map(link) },
        {
          text: 'Utility',
          items: [
            { text: 'Failover', link: '/guide/failover' },
            { text: 'Log', link: '/providers/log' },
            { text: 'Fake', link: '/guide/testing' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Configuration', link: '/reference/configuration' },
            { text: 'API', link: '/reference/api' },
            { text: 'Artisan commands', link: '/reference/artisan' },
            { text: 'Upgrading from 1.x', link: '/reference/upgrading' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/mr-rijal/laravel-sms' }],

    editLink: {
      pattern: 'https://github.com/mr-rijal/laravel-sms-docs/edit/main/:path',
      text: 'Suggest a change to this page',
    },

    search: { provider: 'local' },

    outline: { level: [2, 3], label: 'On this page' },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Prashant Rijal and contributors',
    },
  },
})
