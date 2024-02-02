import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {

    proxy: {
      "/": {
        target: "https://invoiceserver-2vrs.onrender.com",
        changeOrigin: true,
        secure: false
      },
    },
  }
})
