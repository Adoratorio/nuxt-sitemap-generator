# Nuxt Sitemap Generator
## nuxt-sitemap-generator

A custom nuxt module to generate XML sitemaps based on a list of routes

Install the package with npm

```bash
npm i @adoratorio/nuxt-sitemap-generator
```

Then extend add the module to your `nuxt.config.ts` and add a configuration object for `sitemap`

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@adoratorio/nuxt-sitemap-generator'],
  // ...
  sitemap: {
    hostname: 'https://my-website.demo.com', // Full hostname
    routes: [
      // ... list of routes like '/', '/page'
    ],
    path: '/sitemap.xml' // The relative path to the sitemap file
  }
})
```