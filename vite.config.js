import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server : {
    '/api':{
      target : 'http://localhost:8080',
      changeOrigin : true,
      plugins: [react()],
      rewrite: (path) => path.replace(/^\/api/, '') // /api 제거
    }
  }

})
