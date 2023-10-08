import { Routes, Route } from 'react-router-dom'
import { MainPage } from '../../../pages/MainPage/MainPage';
import { RoomsPage } from '../../../pages/RoomsPage/RoomsPage';

export const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path={'/'} element={<MainPage />}></Route>
                <Route path={'/rooms'} element={<RoomsPage />}></Route>
            </Routes>
        </>
    );
}
