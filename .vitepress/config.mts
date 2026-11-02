import { defineConfig, type DefaultTheme } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

/*
 * One sidebar and nav, rendered in seven languages. English is the source of truth;
 * every other locale lives in its own folder (/zh/, /es/, …) with the same file names.
 */

type Labels = {
  lang: string
  label: string
  description: string
  nav: { guide: string; providers: string; reference: string; upgrading: string; changelog: string }
  groups: { start: string; sending: string; further: string; overview: string; global: string; regional: string; utility: string; reference: string }
  pages: Record<string, string>
  ui: {
    edit: string; outline: string; footer: string; prev: string; next: string; updated: string
    appearance: string; menu: string; top: string; language: string
    search: { button: string; placeholder: string; noResults: string; reset: string; select: string; navigate: string; close: string }
  }
}

const locales: Record<string, Labels> = {
  root: {
    lang: 'en-US',
    label: 'English',
    description: 'One fluent API for sending SMS from Laravel through twenty providers.',
    nav: { guide: 'Guide', providers: 'Providers', reference: 'Reference', upgrading: 'Upgrading from 1.x', changelog: 'Changelog' },
    groups: { start: 'Getting started', sending: 'Sending', further: 'Going further', overview: 'Overview', global: 'Global', regional: 'Regional', utility: 'Utility', reference: 'Reference' },
    pages: {
      features: 'Features', templates: 'Templates', environment: 'Environment variables',
      introduction: 'Introduction', installation: 'Installation', 'quick-start': 'Your first message',
      sending: 'Composing messages', results: 'Results and errors', queueing: 'Queueing', failover: 'Failover and load balancing', notifications: 'Notifications',
      events: 'Events', webhooks: 'Webhooks', testing: 'Testing', 'custom-drivers': 'Custom drivers', performance: 'Performance', security: 'Security',
      choosing: 'Choosing a provider', failoverDriver: 'Failover', log: 'Log', fake: 'Fake',
      configuration: 'Configuration', api: 'API', artisan: 'Artisan commands',
    },
    ui: {
      edit: 'Suggest a change to this page', outline: 'On this page', footer: 'Released under the MIT License.',
      prev: 'Previous', next: 'Next', updated: 'Last updated', appearance: 'Appearance', menu: 'Menu', top: 'Back to top', language: 'Change language',
      search: { button: 'Search', placeholder: 'Search the docs', noResults: 'No results for', reset: 'Clear', select: 'to select', navigate: 'to navigate', close: 'to close' },
    },
  },
  zh: {
    lang: 'zh-CN',
    label: '简体中文',
    description: '一套流畅的 API，在 Laravel 中通过二十家服务商发送短信。',
    nav: { guide: '指南', providers: '服务商', reference: '参考', upgrading: '从 1.x 升级', changelog: '更新日志' },
    groups: { start: '快速上手', sending: '发送短信', further: '进阶', overview: '概览', global: '全球服务商', regional: '区域服务商', utility: '辅助驱动', reference: '参考' },
    pages: {
      features: '功能一览', templates: '短信模板', environment: '环境变量',
      introduction: '简介', installation: '安装', 'quick-start': '发送第一条短信',
      sending: '编写短信', results: '发送结果与错误', queueing: '队列发送', failover: '故障转移与负载均衡', notifications: '通知',
      events: '事件', webhooks: 'Webhook 回调', testing: '测试', 'custom-drivers': '自定义驱动', performance: '性能', security: '安全',
      choosing: '如何选择服务商', failoverDriver: '故障转移', log: 'Log 驱动', fake: 'Fake 驱动',
      configuration: '配置', api: 'API', artisan: 'Artisan 命令',
    },
    ui: {
      edit: '对本页提出修改建议', outline: '本页目录', footer: '基于 MIT 许可证发布。',
      prev: '上一页', next: '下一页', updated: '最后更新于', appearance: '外观', menu: '菜单', top: '回到顶部', language: '切换语言',
      search: { button: '搜索', placeholder: '搜索文档', noResults: '没有找到相关结果', reset: '清除', select: '选择', navigate: '切换', close: '关闭' },
    },
  },
  es: {
    lang: 'es-ES',
    label: 'Español',
    description: 'Una sola API fluida para enviar SMS desde Laravel a través de veinte proveedores.',
    nav: { guide: 'Guía', providers: 'Proveedores', reference: 'Referencia', upgrading: 'Actualizar desde 1.x', changelog: 'Cambios' },
    groups: { start: 'Primeros pasos', sending: 'Envío', further: 'Para ir más allá', overview: 'Panorama', global: 'Globales', regional: 'Regionales', utility: 'Utilidades', reference: 'Referencia' },
    pages: {
      features: 'Funcionalidades', templates: 'Plantillas', environment: 'Variables de entorno',
      introduction: 'Introducción', installation: 'Instalación', 'quick-start': 'Tu primer mensaje',
      sending: 'Redactar mensajes', results: 'Resultados y errores', queueing: 'Colas', failover: 'Failover y balanceo de carga', notifications: 'Notificaciones',
      events: 'Eventos', webhooks: 'Webhooks', testing: 'Pruebas', 'custom-drivers': 'Drivers propios', performance: 'Rendimiento', security: 'Seguridad',
      choosing: 'Cómo elegir proveedor', failoverDriver: 'Failover', log: 'Log', fake: 'Fake',
      configuration: 'Configuración', api: 'API', artisan: 'Comandos de Artisan',
    },
    ui: {
      edit: 'Sugerir un cambio en esta página', outline: 'En esta página', footer: 'Publicado bajo la licencia MIT.',
      prev: 'Anterior', next: 'Siguiente', updated: 'Última actualización', appearance: 'Apariencia', menu: 'Menú', top: 'Volver arriba', language: 'Cambiar idioma',
      search: { button: 'Buscar', placeholder: 'Buscar en la documentación', noResults: 'Sin resultados para', reset: 'Borrar', select: 'para elegir', navigate: 'para moverte', close: 'para cerrar' },
    },
  },
  fr: {
    lang: 'fr-FR',
    label: 'Français',
    description: 'Une seule API fluide pour envoyer des SMS depuis Laravel via vingt fournisseurs.',
    nav: { guide: 'Guide', providers: 'Fournisseurs', reference: 'Référence', upgrading: 'Migrer depuis la 1.x', changelog: 'Nouveautés' },
    groups: { start: 'Premiers pas', sending: 'Envoyer', further: 'Pour aller plus loin', overview: "Vue d'ensemble", global: 'Internationaux', regional: 'Régionaux', utility: 'Utilitaires', reference: 'Référence' },
    pages: {
      features: 'Fonctionnalités', templates: 'Modèles de message', environment: 'Variables d\'environnement',
      introduction: 'Introduction', installation: 'Installation', 'quick-start': 'Votre premier SMS',
      sending: 'Composer un message', results: 'Résultats et erreurs', queueing: "Files d'attente", failover: 'Basculement et répartition de charge', notifications: 'Notifications',
      events: 'Événements', webhooks: 'Webhooks', testing: 'Tests', 'custom-drivers': 'Drivers sur mesure', performance: 'Performances', security: 'Sécurité',
      choosing: 'Choisir un fournisseur', failoverDriver: 'Basculement', log: 'Log', fake: 'Fake',
      configuration: 'Configuration', api: 'API', artisan: 'Commandes Artisan',
    },
    ui: {
      edit: 'Proposer une modification', outline: 'Sur cette page', footer: 'Publié sous licence MIT.',
      prev: 'Précédent', next: 'Suivant', updated: 'Mis à jour le', appearance: 'Apparence', menu: 'Menu', top: 'Haut de page', language: 'Changer de langue',
      search: { button: 'Rechercher', placeholder: 'Rechercher dans la documentation', noResults: 'Aucun résultat pour', reset: 'Effacer', select: 'pour choisir', navigate: 'pour naviguer', close: 'pour fermer' },
    },
  },
  pt: {
    lang: 'pt-BR',
    label: 'Português',
    description: 'Uma única API fluente para enviar SMS no Laravel por vinte provedores.',
    nav: { guide: 'Guia', providers: 'Provedores', reference: 'Referência', upgrading: 'Atualizando da 1.x', changelog: 'Novidades' },
    groups: { start: 'Primeiros passos', sending: 'Envio', further: 'Indo além', overview: 'Visão geral', global: 'Globais', regional: 'Regionais', utility: 'Utilitários', reference: 'Referência' },
    pages: {
      features: 'Recursos', templates: 'Templates', environment: 'Variáveis de ambiente',
      introduction: 'Introdução', installation: 'Instalação', 'quick-start': 'Sua primeira mensagem',
      sending: 'Montando mensagens', results: 'Resultados e erros', queueing: 'Filas', failover: 'Failover e balanceamento de carga', notifications: 'Notificações',
      events: 'Eventos', webhooks: 'Webhooks', testing: 'Testes', 'custom-drivers': 'Drivers próprios', performance: 'Desempenho', security: 'Segurança',
      choosing: 'Como escolher um provedor', failoverDriver: 'Failover', log: 'Log', fake: 'Fake',
      configuration: 'Configuração', api: 'API', artisan: 'Comandos Artisan',
    },
    ui: {
      edit: 'Sugerir uma alteração nesta página', outline: 'Nesta página', footer: 'Distribuído sob a licença MIT.',
      prev: 'Anterior', next: 'Próxima', updated: 'Atualizado em', appearance: 'Aparência', menu: 'Menu', top: 'Voltar ao topo', language: 'Mudar idioma',
      search: { button: 'Buscar', placeholder: 'Buscar na documentação', noResults: 'Nada encontrado para', reset: 'Limpar', select: 'para escolher', navigate: 'para navegar', close: 'para fechar' },
    },
  },
  ko: {
    lang: 'ko-KR',
    label: '한국어',
    description: 'API 하나로 스무 곳의 문자 서비스를 통해 Laravel에서 SMS를 보내세요.',
    nav: { guide: '가이드', providers: '제공업체', reference: '레퍼런스', upgrading: '1.x에서 업그레이드', changelog: '변경 내역' },
    groups: { start: '시작하기', sending: '발송', further: '더 알아보기', overview: '개요', global: '글로벌', regional: '지역 특화', utility: '유틸리티', reference: '레퍼런스' },
    pages: {
      features: '기능 한눈에 보기', templates: '템플릿', environment: '환경 변수',
      introduction: '소개', installation: '설치', 'quick-start': '첫 문자 보내기',
      sending: '메시지 작성', results: '발송 결과와 오류', queueing: '큐로 보내기', failover: '페일오버와 부하 분산', notifications: '알림',
      events: '이벤트', webhooks: '웹훅', testing: '테스트', 'custom-drivers': '직접 만드는 드라이버', performance: '성능', security: '보안',
      choosing: '제공업체 고르기', failoverDriver: '페일오버', log: 'Log', fake: 'Fake',
      configuration: '설정', api: 'API', artisan: 'Artisan 명령어',
    },
    ui: {
      edit: '이 페이지 수정 제안하기', outline: '이 페이지의 내용', footer: 'MIT 라이선스로 배포됩니다.',
      prev: '이전', next: '다음', updated: '최종 수정', appearance: '화면 모드', menu: '메뉴', top: '맨 위로', language: '언어 변경',
      search: { button: '검색', placeholder: '문서 검색', noResults: '검색 결과가 없습니다:', reset: '지우기', select: '선택', navigate: '이동', close: '닫기' },
    },
  },
  ja: {
    lang: 'ja-JP',
    label: '日本語',
    description: 'ひとつの API で、20 社のプロバイダーから Laravel の SMS を送信できます。',
    nav: { guide: 'ガイド', providers: 'プロバイダー', reference: 'リファレンス', upgrading: '1.x からのアップグレード', changelog: '変更履歴' },
    groups: { start: 'はじめに', sending: '送信する', further: 'さらに詳しく', overview: '概要', global: 'グローバル', regional: '地域別', utility: 'ユーティリティ', reference: 'リファレンス' },
    pages: {
      features: '機能一覧', templates: 'テンプレート', environment: '環境変数',
      introduction: 'このパッケージについて', installation: 'インストール', 'quick-start': '最初の SMS を送る',
      sending: 'メッセージを組み立てる', results: '送信結果とエラー', queueing: 'キューで送る', failover: 'フェイルオーバーと負荷分散', notifications: '通知',
      events: 'イベント', webhooks: 'Webhook', testing: 'テスト', 'custom-drivers': 'カスタムドライバー', performance: 'パフォーマンス', security: 'セキュリティ',
      choosing: 'プロバイダーの選び方', failoverDriver: 'フェイルオーバー', log: 'Log', fake: 'Fake',
      configuration: '設定', api: 'API', artisan: 'Artisan コマンド',
    },
    ui: {
      edit: 'このページの修正を提案する', outline: '目次', footer: 'MIT ライセンスで公開しています。',
      prev: '前のページ', next: '次のページ', updated: '最終更新', appearance: '表示モード', menu: 'メニュー', top: 'ページの先頭へ', language: '言語を切り替える',
      search: { button: '検索', placeholder: 'ドキュメントを検索', noResults: '見つかりませんでした：', reset: 'クリア', select: '選択', navigate: '移動', close: '閉じる' },
    },
  },
}

const globalProviders: [string, string][] = [
  ['Twilio', 'twilio'], ['Vonage', 'vonage'], ['Sinch', 'sinch'], ['Bird', 'bird'], ['Plivo', 'plivo'],
  ['Telnyx', 'telnyx'], ['Infobip', 'infobip'], ['ClickSend', 'clicksend'], ['Clickatell', 'clickatell'],
  ['Brevo', 'brevo'], ['Bandwidth', 'bandwidth'], ['SendPulse', 'sendpulse'], ['Amazon SNS', 'aws-sns'], ['WhatsApp', 'whatsapp'],
]

const regionalProviders: [string, string][] = [
  ['MSG91', 'msg91'], ['Sparrow SMS', 'sparrow'], ['Termii', 'termii'], ['Sendchamp', 'sendchamp'],
  ["Africa's Talking", 'africastalking'], ['BulkSMS', 'bulksms'],
]

function themeFor(key: string, l: Labels): DefaultTheme.Config {
  const p = key === 'root' ? '' : `/${key}`
  const page = (slug: string) => ({ text: l.pages[slug], link: `${p}/guide/${slug}` })
  const provider = ([text, slug]: [string, string]) => ({ text, link: `${p}/providers/${slug}` })

  return {
    nav: [
      { text: l.nav.guide, link: `${p}/guide/introduction`, activeMatch: `${p}/guide/` },
      { text: l.nav.providers, link: `${p}/providers/`, activeMatch: `${p}/providers/` },
      { text: l.nav.reference, link: `${p}/reference/configuration`, activeMatch: `${p}/reference/` },
      {
        text: 'v2.0',
        items: [
          { text: l.nav.upgrading, link: `${p}/reference/upgrading` },
          { text: l.nav.changelog, link: 'https://github.com/mr-rijal/laravel-sms/blob/main/CHANGELOG.md' },
        ],
      },
    ],

    sidebar: {
      [`${p}/guide/`]: [
        { text: l.groups.start, items: ['introduction', 'features', 'installation', 'quick-start'].map(page) },
        { text: l.groups.sending, items: ['sending', 'templates', 'results', 'queueing', 'failover', 'notifications'].map(page) },
        { text: l.groups.further, items: ['events', 'webhooks', 'testing', 'custom-drivers', 'performance', 'security'].map(page) },
      ],
      [`${p}/providers/`]: [
        {
          text: l.groups.overview,
          items: [
            { text: l.pages.choosing, link: `${p}/providers/` },
            { text: l.pages.environment, link: `${p}/providers/environment` },
          ],
        },
        { text: l.groups.global, items: globalProviders.map(provider) },
        { text: l.groups.regional, items: regionalProviders.map(provider) },
        {
          text: l.groups.utility,
          items: [
            { text: l.pages.failoverDriver, link: `${p}/guide/failover` },
            { text: l.pages.log, link: `${p}/providers/log` },
            { text: l.pages.fake, link: `${p}/guide/testing` },
          ],
        },
      ],
      [`${p}/reference/`]: [
        {
          text: l.groups.reference,
          items: [
            { text: l.pages.configuration, link: `${p}/reference/configuration` },
            { text: l.pages.api, link: `${p}/reference/api` },
            { text: l.pages.artisan, link: `${p}/reference/artisan` },
            { text: l.nav.upgrading, link: `${p}/reference/upgrading` },
          ],
        },
      ],
    },

    editLink: { pattern: 'https://github.com/mr-rijal/laravel-sms-docs/edit/main/:path', text: l.ui.edit },
    outline: { level: [2, 3], label: l.ui.outline },
    docFooter: { prev: l.ui.prev, next: l.ui.next },
    lastUpdated: { text: l.ui.updated },
    darkModeSwitchLabel: l.ui.appearance,
    sidebarMenuLabel: l.ui.menu,
    returnToTopLabel: l.ui.top,
    langMenuLabel: l.ui.language,
    footer: { message: l.ui.footer, copyright: 'Copyright © Prashant Rijal and contributors' },
  }
}

const searchLocales = Object.fromEntries(
  Object.entries(locales).map(([key, l]) => [
    key,
    {
      translations: {
        button: { buttonText: l.ui.search.button, buttonAriaLabel: l.ui.search.button },
        modal: {
          displayDetails: l.ui.search.button,
          resetButtonTitle: l.ui.search.reset,
          backButtonTitle: l.ui.search.close,
          noResultsText: l.ui.search.noResults,
          footer: {
            selectText: l.ui.search.select,
            navigateText: l.ui.search.navigate,
            closeText: l.ui.search.close,
          },
        },
      },
    },
  ]),
)

export default withMermaid(
  defineConfig({
    title: 'Laravel SMS',
    cleanUrls: true,
    lastUpdated: true,
    srcExclude: ['README.md', 'dist/**'],
    // Build into a plain folder: some static hosts refuse to serve hidden folders like .vitepress/.
    outDir: 'dist',

    vite: {
      // Mermaid ships some CommonJS dependencies that Vite must pre-bundle in dev.
      optimizeDeps: { include: ['mermaid', 'fastdom', 'dayjs', 'debug', '@braintree/sanitize-url', 'cytoscape', 'cytoscape-cose-bilkent'] },
    },

    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
      ['meta', { name: 'theme-color', content: '#0b7a5c' }],
      ['meta', { property: 'og:title', content: 'Laravel SMS' }],
    ],

    markdown: {
      theme: { light: 'github-light', dark: 'github-dark-dimmed' },
    },

    locales: Object.fromEntries(
      Object.entries(locales).map(([key, l]) => [
        key,
        {
          label: l.label,
          lang: l.lang,
          link: key === 'root' ? '/' : `/${key}/`,
          description: l.description,
          themeConfig: themeFor(key, l),
        },
      ]),
    ),

    themeConfig: {
      logo: '/logo.svg',
      siteTitle: 'Laravel SMS',
      socialLinks: [{ icon: 'github', link: 'https://github.com/mr-rijal/laravel-sms' }],
      search: { provider: 'local', options: { locales: searchLocales } },
    },

    mermaid: {
      theme: 'base',
      themeVariables: {
        primaryColor: '#e7f6f0',
        primaryBorderColor: '#0e9370',
        primaryTextColor: '#12291f',
        lineColor: '#5b7a70',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      },
    },
  }),
)
