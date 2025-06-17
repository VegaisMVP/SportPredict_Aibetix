import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

// Firebase Analytics - Only initialize when environment variables are configured
const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY
if (firebaseApiKey && firebaseApiKey.length > 10 && !firebaseApiKey.includes('your-')) {
  import('firebase/app').then(({ initializeApp }) => {
    import('firebase/analytics').then(({ getAnalytics }) => {
      const firebaseConfig = {
        apiKey: firebaseApiKey,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
      }
      
      const app = initializeApp(firebaseConfig)
      getAnalytics(app)
      console.log('Vegais Sports Predict - Firebase Analytics initialized')
    })
  })
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
) 