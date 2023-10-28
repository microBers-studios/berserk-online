import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AlertContextProvider } from './app/providers/AlertProvider/lib/AlertContextProvider.tsx'
import App from './app/App.tsx'
import { UserContextProvider } from './app/providers/UserProvider/index.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AlertContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </AlertContextProvider>
  </BrowserRouter>,
)
