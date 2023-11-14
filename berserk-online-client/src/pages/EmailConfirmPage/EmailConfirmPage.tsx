import { useEffect } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from 'src/shared/lib/redux/redux-hook';
import { RouterPaths } from 'src/app/providers/router/router-paths';
import { confirmUserEmail } from 'src/app/store/slices/userSlice/userSlice';
import { setMode } from 'src/app/store/slices/modalSlice/modalSlice';

export const EmailConfirmPage = () => {
    const [params] = useSearchParams()
    const token = params.get('token')

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!token) throw new Error('Token Error')

        dispatch(confirmUserEmail([token, () => navigate(RouterPaths.MAIN), () => {
            dispatch(setMode({ mode: null }))
            navigate(RouterPaths.ERROR)
        }]))
    }, [])

    return <></>
}
