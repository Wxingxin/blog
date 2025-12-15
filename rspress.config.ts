import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'My Blog',
  base: '/blog/',
  icon: '/rspress-icon.png',
  description: '一个学习前端的网站',

  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },

  head: [
    // 自定义 <head> 标签
    ['meta', { name: 'keywords', content: '前端,Blog,Rspress' }],
    ['link', { rel: 'stylesheet', href: '/custom.css' }],
  ],
  themeConfig: {
    enableScrollToTop: true,  
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/Wxingxin',
      },
    ],
    footer: {
      message: 'Thank you for visiting my blog! Copyright © 2025 My Blog',
    }
  },
});
