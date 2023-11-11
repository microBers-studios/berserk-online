import { Routes, Route, Navigate } from 'react-router-dom'
import { MainPage } from 'src/pages/MainPage/MainPage';
import { RoomsPage } from 'src/pages/RoomsPage/RoomsPage';
import { RouterPaths } from './router-paths';
import { PasswordResetPage } from 'src/pages/PasswordResetPage/PasswordResetPage';
import { EmailConfirmPage } from 'src/pages/EmailConfirmPage/EmailConfirmPage';
import { ErrorModalPage } from 'src/pages/ErrorModalPage/ErrorModalPage';
// import { DeckPage } from 'src/pages/DeckPage/DeckPage';
import { DeckCreatingPage } from 'src/pages/DeckCreatingPage/DeckCreatingPage';
import { DeckPage } from 'src/pages/DeckPage/DeckPage';
interface AppRouterProps {
    setPage: (page: RouterPaths | null) => void
}

export const AppRouter = ({ setPage }: AppRouterProps) => {
    return (
        <Routes>
            <Route path={RouterPaths.MAIN} element={<MainPage setPage={setPage} />} />
            <Route path={RouterPaths.ROOMS} element={<RoomsPage setPage={setPage} />} />
            <Route path={RouterPaths.RESET_PASSWORD} element={<PasswordResetPage />} />
            <Route path={RouterPaths.CONFIRM_EMAIL} element={<EmailConfirmPage />} />
            <Route path={RouterPaths.ERROR} element={<ErrorModalPage />} />
            <Route path={`${RouterPaths.DECK}/:id`} element={<DeckPage />} />
            <Route path={RouterPaths.CREATE_DECK} element={<DeckCreatingPage />} />
            <Route path={RouterPaths.DECK} element={<Navigate to={`${RouterPaths.DECK}/1`} />} />
        </Routes>
    );
}
