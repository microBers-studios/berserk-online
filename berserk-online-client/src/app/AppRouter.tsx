import { Routes, Route, Navigate } from 'react-router-dom'
import { MainPage } from 'src/pages/main'
import { RoomsPage } from 'src/pages/rooms'
import { RouterPaths } from 'src/shared/lib'
import { PasswordResetPage } from 'src/pages/passwordReset'
import { EmailConfirmPage } from 'src/pages/emailConfirm'
import { ErrorModalPage } from 'src/pages/errorModal'
import { DeckCreatingPage } from 'src/pages/deckCreating'
import { DeckPage } from 'src/pages/deckPage'
import { GamePage } from 'src/pages/game'

interface AppRouterProps {
    setPage: (page: RouterPaths | null) => void
    currentPage: RouterPaths | null
}

const AppRouter = ({ setPage, currentPage }: AppRouterProps) => {
    return (
        <Routes>
            <Route
                path={RouterPaths.MAIN}
                element={
                    <MainPage setPage={setPage} currentPage={currentPage} />
                }
            />
            <Route
                path={RouterPaths.ROOMS}
                element={
                    <RoomsPage setPage={setPage} currentPage={currentPage} />
                }
            />
            <Route
                path={RouterPaths.RESET_PASSWORD}
                element={<PasswordResetPage />}
            />
            <Route
                path={RouterPaths.CONFIRM_EMAIL}
                element={<EmailConfirmPage />}
            />
            <Route path={RouterPaths.ERROR} element={<ErrorModalPage />} />
            <Route
                path={`${RouterPaths.DECK}/:id`}
                element={<DeckPage currentPage={currentPage} />}
            />
            <Route
                path={RouterPaths.CREATE_DECK}
                element={<DeckCreatingPage currentPage={currentPage} />}
            />
            <Route
                path={RouterPaths.DECK}
                element={<Navigate to={RouterPaths.MAIN} />}
            />
            <Route
                path={`${RouterPaths.ROOMS}/:id/:mode`}
                element={<GamePage />}
            />
        </Routes>
    )
}

export default AppRouter
