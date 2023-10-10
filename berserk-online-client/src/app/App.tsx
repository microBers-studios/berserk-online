// import { MainPage } from '../pages/MainPage/MainPage'
import { Navbar } from 'src/widgets/Navbar/Navbar'
import { AlertContext } from 'src/app/providers/AlertProvider'
import { AppRouter } from 'src/app/providers/router/AppRouter'
import './styles/index.scss'
import { useRequiredContext } from 'src/helpers/hooks/useRequiredContext'
import { AlertContextProps } from 'src/app/providers/AlertProvider/lib/AlertContext'
import { AlertsContainer } from 'src/widgets/Alert/AlertsContainer'

function App() {
  const { alerts } = useRequiredContext<AlertContextProps>(AlertContext)

  return (
    <>
      <Navbar />

      {Boolean(alerts.length) &&
        <AlertsContainer alerts={alerts} />
      }
      <AppRouter />
    </>
  )
}

export default App
