import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    build:{
      outDir: "release/public",
    },
    server:{
      port:3000,
      proxy:{
        "/api":{
          target: env.VITE_PROXY,
          changeOrigin: true,
          secure: false,
          headers:{
            "referer": env.VITE_PROXY,
            "origin": env.VITE_PROXY,
          },
        }
      }
    }
  }
})
