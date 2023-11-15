import { useEffect, useState } from 'react'
import { useAppDispatch, RouterPaths } from 'src/shared/lib'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.scss'
import AppRouter from 'src/app/AppRouter'
import { GlobalModal } from 'src/entities/modal/ui/GlobalModal'
import { Header } from 'src/widgets/header'
import { Footer } from 'src/widgets/footer'
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
      <Header currentPage={currentPage} />
      <main>
        <AppRouter setPage={setCurrentPage} />

        <ToastContainer />
        <GlobalModal />
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default withHelmet(App)
