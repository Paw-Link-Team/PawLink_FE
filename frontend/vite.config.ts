import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: true,
    port: 3000,
    proxy: {
      '/socket.io': {
        target: 'https://api-pawlink.duckdns.org:9092',
        ws: true,
      }
    }
  }
})
