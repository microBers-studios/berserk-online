import { useEffect, useState } from 'react'
import { useAppDispatch, RouterPaths } from 'src/shared/lib'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.scss'
import AppRouter from 'src/app/AppRouter'
import { GlobalModal } from 'src/entities/modal/ui/GlobalModal'
import { fetchUser } from 'src/entities/user'
import { withHelmet } from './providers/withHelmet';

function App() {
  const [currentPage, setCurrentPage] = useState<RouterPaths | null>(RouterPaths.MAIN)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchUser())
  }, [])

  return (
    <BrowserRouter>
      <main>
        <AppRouter
          setPage={setCurrentPage}
          currentPage={currentPage}
        />

        <ToastContainer />
        <GlobalModal />
      </main>
    </BrowserRouter>
  )
}

export default withHelmet(App)
