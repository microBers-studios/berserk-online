import { Routes, Route } from 'react-router-dom'
import { MainPage } from 'src/pages/MainPage/MainPage';
import { RoomsPage } from 'src/pages/RoomsPage/RoomsPage';
import { RouterPaths } from './router-paths';
import { PageComponent } from 'src/helpers/HOC/PageComponent/PageComponent';

interface AppRouterProps {
    setPage: (page: RouterPaths) => void
}

export const AppRouter = ({ setPage }: AppRouterProps) => {
    return (
        <>
            <Routes>
                <Route path={'/'} element={<MainPage setPage={setPage} />} />
                <Route path={'/rooms'} element={<RoomsPage setPage={setPage} />} />
            </Routes>
        </>
    );
}
