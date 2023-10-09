import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AlertContextProvider } from './app/providers/AlertProvider/lib/AlertContextProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AlertContextProvider>
        <App />
      </AlertContextProvider>
    </BrowserRouter>

  </React.StrictMode>,
)
