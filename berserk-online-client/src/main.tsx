import ReactDOM from 'react-dom/client'
import { Provider } from "react-redux"
import App from './app/App.tsx'
import store from './app/store'
import { DecksContextProvider } from './app/providers/DecksProvider/utils/DecksContextProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <DecksContextProvider>
      <App />
    </DecksContextProvider>
  </Provider>
)
