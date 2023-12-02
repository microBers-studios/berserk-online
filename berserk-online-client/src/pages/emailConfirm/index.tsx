import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, RouterPaths } from 'src/shared/lib'
import { confirmUserEmail } from 'src/entities/user'

export const EmailConfirmPage = () => {
    const [params] = useSearchParams()
    const token = params.get('token')

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!token) throw new Error('Token Error')

        dispatch(
            confirmUserEmail([
                token,
                () => navigate(RouterPaths.MAIN),
                () => {
                    navigate(RouterPaths.ERROR)
                },
            ])
        )
    }, [dispatch, navigate, token])

    return <></>
}
