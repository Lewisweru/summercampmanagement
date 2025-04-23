import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// import path from 'path'; // Import path - REMOVE IF NOT USED FOR ALIASES

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'REACT_APP_']);

  // Construct the define object carefully
  const defineEnv: Record<string, string> = {};
  for (const key in env) {
    if (Object.prototype.hasOwnProperty.call(env, key)) {
       // Ensure value is stringified for define
       defineEnv[`process.env.${key}`] = JSON.stringify(env[key]);
    }
  }

  return {
    plugins: [react()],
    define: defineEnv, // Use the constructed object
     server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
           // Read backend port from ROOT .env or default to 5000
           // Note: Vite's loadEnv loads from project root CWD by default
           target: `http://localhost:${loadEnv(mode, process.cwd(), '').PORT || 5000}`,
           changeOrigin: true,
        }
      }
    },
    // resolve: { // Remove or implement aliases if needed
    //   alias: {
    //     '@': path.resolve(__dirname, './src'),
    //   },
    // },
  };
});