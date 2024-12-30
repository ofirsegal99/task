import { defineConfig } from 'vite'
import { fileURLToPath, URL} from 'node:url'
import vue from '@vitejs/plugin-vue'
// import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: 
    [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ]
  
    // {
    //   '@': path.resolve(__dirname, './src/'),
    // }
  }
})
