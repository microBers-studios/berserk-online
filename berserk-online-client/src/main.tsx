import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AlertContextProvider } from './app/providers/AlertProvider/lib/AlertContextProvider.tsx'
import App from './app/App.tsx'
import { UserContextProvider } from './app/providers/UserProvider/index.ts'
import { CookieModalContextProvider } from './app/providers/CookieModalProvider/index.ts'
import { DecksContextProvider } from './app/providers/DecksProvider/utils/DecksContextProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AlertContextProvider>
      <CookieModalContextProvider>
        <UserContextProvider>
          <DecksContextProvider>
            <App />
          </DecksContextProvider>
        </UserContextProvider>
      </CookieModalContextProvider>
    </AlertContextProvider>
  </BrowserRouter>,
)
