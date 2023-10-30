import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AlertContextProvider } from './app/providers/AlertProvider/lib/AlertContextProvider.tsx'
import App from './app/App.tsx'
import { UserContextProvider } from './app/providers/UserProvider/index.ts'
import { CookieModalContextProvider } from './app/providers/CookieModalProvider/index.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AlertContextProvider>
      <CookieModalContextProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </CookieModalContextProvider>
    </AlertContextProvider>
  </BrowserRouter>,
)
