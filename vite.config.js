import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tableauHandler from './api/tableau.js';

function tableauDevApi() {
  return {
    name: 'tableau-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/tableau', (req, res, next) => {
        if (req.url && req.url.split('?')[0] !== '/') return next();
        Promise.resolve(tableauHandler(req, res)).catch(next);
      });
    },
  };
}
export default defineConfig({ plugins: [react(), tableauDevApi()] });
