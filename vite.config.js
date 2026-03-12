import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Set base to '/ai-payments-strategy/' if deploying to a subdirectory
  // or '/' if deploying to root / custom domain
  base: '/',
})
