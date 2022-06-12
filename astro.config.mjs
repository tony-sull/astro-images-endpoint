import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import netlify from "@astrojs/netlify/functions";
import {imagetools} from 'vite-imagetools';

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  integrations: [preact()],
  vite: {
    plugins: [imagetools()]
  }
});