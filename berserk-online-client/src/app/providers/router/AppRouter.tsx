import { Routes, Route } from 'react-router-dom'
import { MainPage } from 'src/pages/MainPage/MainPage';
import { RoomsPage } from 'src/pages/RoomsPage/RoomsPage';
import { RouterPaths } from './router-paths';
import { PasswordResetPage } from 'src/pages/PasswordResetPage/PasswordResetPage';
import { EmailConfirmPage } from 'src/pages/EmailConfirmPage/EmailConfirmPage';
import { ErrorModalPage } from 'src/pages/ErrorModalPage/ErrorModalPage';
interface AppRouterProps {
    setPage: (page: RouterPaths) => void
}

export const AppRouter = ({ setPage }: AppRouterProps) => {
    return (
        <>
            <Routes>
                <Route path={RouterPaths.MAIN} element={<MainPage setPage={setPage} />} />
                <Route path={RouterPaths.ROOMS} element={<RoomsPage setPage={setPage} />} />
                <Route path={RouterPaths.RESET_PASSWORD} element={<PasswordResetPage />} />
                <Route path={RouterPaths.CONFIRM_EMAIL} element={<EmailConfirmPage />} />
                <Route path={RouterPaths.ERROR} element={<ErrorModalPage />} />
            </Routes>
        </>
    );
}
