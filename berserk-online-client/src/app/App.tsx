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
import { Footer } from 'src/widgets/Footer/Footer'

function App() {
  const { alerts } = useRequiredContext<AlertContextProps>(AlertContext)
  const { setUser, setIsUserLoading, isUserLoading } = useRequiredContext<UserContextProps>(UserContext)
  const [currentPage, setCurrentPage] = useState<RouterPaths>(RouterPaths.MAIN)

  const { setIsCookieModal } = useRequiredContext<CookieModalContextProps>(CookieModalContext)
  const cookied = useCookie()

  useEffect(() => {
    new Promise(async () => {
      const res = await cookied(APIController.getMe)

      if (!res) {
        setIsUserLoading(false)
        setIsCookieModal(true)
        return
      }

      console.log('before setting')

      setIsUserLoading(false)

      console.log('after setting')

      if (res.code === 200) {
        setUser(res.obj as IUser)
      }
    })
  }, [])

  useEffect(() => console.log(isUserLoading), [setIsUserLoading])

  return (
    <>
      <Navbar
        currentPage={currentPage}
      />
      <main>
        {Boolean(alerts.length) &&
          <AlertsContainer alerts={alerts} />
        }

        <AppRouter setPage={setCurrentPage} />

      </main>
      <Footer />
    </>
  )
}

export default App
