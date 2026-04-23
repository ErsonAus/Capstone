// Import the defineConfig function from Vite for type-safe configuration
import { defineConfig } from 'vite'
// Import the React plugin for Vite to enable React Fast Refresh and JSX support
import react from '@vitejs/plugin-react'

/**
 * Vite Configuration File
 * Configures the development server, build process, and plugins for the React application
 * Includes proxy settings to forward API requests to the backend server
 */

// Export the default Vite configuration object
export default defineConfig({
  // Array of Vite plugins to extend functionality
  plugins: [
    // React plugin - enables Hot Module Replacement (HMR) and JSX compilation
    react()
  ],
  
  // Server configuration for the development environment
  server: {
    // Proxy configuration to route API requests to the backend
    proxy: {
      // Match any request path starting with '/api'
      '/api': {
        // Forward these requests to the backend server running on port 5000
        target: 'http://localhost:5000',
        // Change the Origin header in the request to match the target URL
        // This prevents CORS issues when the frontend and backend run on different ports
        changeOrigin: true
      }
    }
  }
})