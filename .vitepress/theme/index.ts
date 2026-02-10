import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  // Layout() {
  //   return h(DefaultTheme.Layout, null, {
  //     'layout-bottom': () => h('div', { class: 'custom-footer' }, [
  //       h('div', { class: 'footer-content' }, [
  //         h('div', { class: 'footer-section' }, [
  //           h('p', { class: 'footer-text' }, 'Copyright © 2023 - 2026 FurCraft. All rights reserved.')
  //         ]),
  //         h('div', { class: 'footer-section' }, [
  //           h('p', { class: 'footer-text' }, [
  //             '基于 ',
  //             h('a', { href: 'https://www.gnu.org/licenses/gpl-3.0.html', target: '_blank', rel: 'noopener' }, 'GPL-3.0'),
  //             ' 许可证开源'
  //           ])
  //         ]),
  //         h('div', { class: 'footer-section' }, [
  //           h('p', { class: 'footer-text' }, [
  //             h('a', { href: 'https://beian.miit.gov.cn/', target: '_blank', rel: 'noopener' }, '苏ICP备2025206224号-1')
  //           ])
  //         ])
  //       ])
  //     ])
  //   })
  // }
}
