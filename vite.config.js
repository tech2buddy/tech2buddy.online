import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __firebase_config: process.env.FIREBASE_CONFIG,
    __initial_auth_token: JSON.stringify(process.env.INITIAL_AUTH_TOKEN || ''),
    __app_id: JSON.stringify('tech2buddy-catalog-v2')
  },
})
