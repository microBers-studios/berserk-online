// import { MainPage } from '../pages/MainPage/MainPage'
import { Navbar } from 'src/widgets/Navbar/Navbar'
import { useState } from 'react'
import { AlertContext } from 'src/app/providers/AlertProvider'
import { AppRouter } from 'src/app/providers/router/AppRouter'
import './styles/index.scss'
import { useRequiredContext } from 'src/helpers/hooks/useRequiredContext'
import { AlertContextProps } from 'src/app/providers/AlertProvider/lib/AlertContext'
import { AlertsContainer } from 'src/widgets/Alert/AlertsContainer'
import { RouterPaths } from './providers/router/router-paths'
import { UserContextProps } from './providers/UserProvider/lib/types/types'
import { UserContext } from './providers/UserProvider'

function App() {
  const { alerts } = useRequiredContext<AlertContextProps>(AlertContext)
  const { user } = useRequiredContext<UserContextProps>(UserContext)
  const [currentPage, setCurrentPage] = useState<RouterPaths>(RouterPaths.MAIN)

  return (
    <>
      <Navbar currentPage={currentPage} user={user} />

      {Boolean(alerts.length) &&
        <AlertsContainer alerts={alerts} />
      }

      <AppRouter setPage={setCurrentPage} />
    </>
  )
}

export default App
