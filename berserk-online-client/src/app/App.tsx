import { useEffect, useState } from 'react'
import { useAppDispatch } from 'src/helpers/hooks/redux-hook'
import { Navbar } from 'src/widgets/Navbar/Navbar'
import { AppRouter } from 'src/app/providers/router/AppRouter'
import './styles/index.scss'
import { RouterPaths } from './providers/router/router-paths'
import { Footer } from 'src/widgets/Footer/Footer'
import { getUser } from './store/slices/userSlice/userSlice'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { GlobalModal } from 'src/widgets/GlobalModal/GlobalModal'

function App() {
  const [currentPage, setCurrentPage] = useState<RouterPaths | null>(RouterPaths.MAIN)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getUser())
  }, [])

  return (
    <BrowserRouter>
      <Navbar currentPage={currentPage} />
      <main>
        <AppRouter setPage={setCurrentPage} />

        <ToastContainer />
        <GlobalModal />
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
