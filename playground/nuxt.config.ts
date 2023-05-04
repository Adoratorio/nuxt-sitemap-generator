export default defineNuxtConfig({
  modules: ['../src/module'],
  sitemap: {
    hostname: 'https://demo.com',
    routes: ['/' ,'/chi-siamo'],
  }
})
