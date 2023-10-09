// import { MainPage } from '../pages/MainPage/MainPage'
import { Navbar } from '../widgets/Navbar/Navbar'
import { AlertContext } from './providers/AlertProvider'
import { AppRouter } from './providers/router/AppRouter'
import './styles/index.scss'
import { Alert } from '../widgets/Alert/Alert'
import { useRequiredContext } from '../helpers/hooks/useRequiredContext'
import { AlertContextProps } from './providers/AlertProvider/lib/AlertContext'

function App() {
  const { alerts } = useRequiredContext<AlertContextProps>(AlertContext)

  return (
    <>
      <Navbar />

      {alerts.map(alert => <Alert message={alert} />)}
      <AppRouter />
    </>
  )
}

export default App
