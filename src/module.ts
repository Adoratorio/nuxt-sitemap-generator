import { defineNuxtModule, createResolver } from '@nuxt/kit'
import fs from 'fs'
import path from 'path';
import { cyan } from 'colorette';

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-sitemap-generator',
    configKey: 'sitemap',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },

  defaults: {
    hostname: '',
    routes: [],
    path: '/sitemap.xml',
  },

  setup (options, nuxt) {
    nuxt.hook('nitro:build:public-assets', (nitro) => {
      const { resolve } = createResolver(import.meta.url);

      const outputPath = path.join(resolve(nitro.options.output.publicDir), (options as any).path);

      const layout = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{{ urls }}</urlset>`

      const today = new Date();
      let sitemapString = '';
      ((options as any).routes as Array<string>).forEach((route : string) => {
        sitemapString += `\t<url><loc>${(options as any).hostname}${route}</loc><lastmod>${today.getFullYear()}-${today.getMonth() + 1}-${today.getDay()}</lastmod><changefreq>monthly</changefreq></url>\n`;
      });

      fs.writeFileSync(outputPath, layout.replace('{{ urls }}', sitemapString)); 

      nitro.logger.success(`Generated sitemap: ${cyan(outputPath)}`);
    })
  }
})
