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

      const fixedPath = fixPath((options as any).path);
      const fixedHostname = fixHostname((options as any).hostname);
      const outputPath = path.join(resolve(nitro.options.output.publicDir), fixedPath);

      const layout = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n[urls]</urlset>`

      const today = new Date();
      let sitemapString = '';
      ((options as any).routes as Array<string>).forEach((route : string) => {
        const fixedRoute = fixRoute(route);
        sitemapString += `\t<url><loc>${fixedHostname}${fixedRoute}</loc><lastmod>${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDay())}</lastmod><changefreq>monthly</changefreq></url>\n`;
      });

      fs.writeFileSync(outputPath, layout.replace('[urls]', sitemapString)); 

      nitro.logger.success(`Generated sitemap: ${cyan(outputPath)}`);
    })
  },
});

const fixPath = (path : string) => {
  return path.charAt(0) === '/' ? path : `/${path}`;
}

const fixRoute = (route : string) => {
  return route.charAt(0) === '/' ? route : `/${route}`;
}

const fixHostname = (hostname : string) => {
  return hostname.charAt(hostname.length - 1) === '/' ? hostname.substring(0, hostname.length - 1) : hostname;
}

const pad = (i : number) => {
  return i < 10 ? `0${i}` : i;
}