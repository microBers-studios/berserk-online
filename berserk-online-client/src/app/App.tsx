// import { MainPage } from '../pages/MainPage/MainPage'
import { Navbar } from 'src/widgets/Navbar/Navbar'
import { useEffect, useState } from 'react'
import { AlertContext } from 'src/app/providers/AlertProvider'
import { AppRouter } from 'src/app/providers/router/AppRouter'
import './styles/index.scss'
import { useRequiredContext } from 'src/helpers/hooks/useRequiredContext'
import { AlertContextProps } from 'src/app/providers/AlertProvider/lib/AlertContext'
import { AlertsContainer } from 'src/widgets/Alert/AlertsContainer'
import { RouterPaths } from './providers/router/router-paths'
import { IUser, UserContextProps } from './providers/UserProvider/lib/types/types'
import { UserContext } from './providers/UserProvider'
import APIController from 'src/API/Controller'
import { useCookie } from 'src/helpers/hooks/useCookie'
import { CookieModalContext, CookieModalContextProps } from './providers/CookieModalProvider/lib/CookieModalContext'

function App() {
  const { alerts } = useRequiredContext<AlertContextProps>(AlertContext)
  const { user, setUser } = useRequiredContext<UserContextProps>(UserContext)
  const [currentPage, setCurrentPage] = useState<RouterPaths>(RouterPaths.MAIN)

  const { setIsCookieModal } = useRequiredContext<CookieModalContextProps>(CookieModalContext)
  const cookied = useCookie()

  useEffect(() => {
    new Promise(async () => {
      const res = await cookied(APIController.getMe)

      if (!res) {
        setIsCookieModal(true)
        return
      }

      if (res.code === 200) {
        setUser(res.obj as IUser)
      }
    })
  }, [])

  return (
    <>
      <Navbar
        currentPage={currentPage}
        user={user}
      />

      {Boolean(alerts.length) &&
        <AlertsContainer alerts={alerts} />
      }

      <AppRouter setPage={setCurrentPage} />
    </>
  )
}

export default App
