import { useState, useEffect } from 'react'
import { Navigate, useSearchParams } from "react-router-dom";
import APIController from 'src/API/Controller';
import { ErrorModal } from 'src/widgets/AccountModals/ErrorModal/ErrorModal';

export const EmailConfirmPage = () => {
    const [params] = useSearchParams()
    const token = params.get('token')

    const [confirmCode, setConfirmCode] = useState<boolean>(false)

    useEffect(() => {
        new Promise(async (res) => {
            if (!token) throw new Error('Token Error')

            const code = await APIController.confirmEmail(token)
            res(code)
        }).then(code => {
            if (code === 200) {
                setConfirmCode(true)
            }
        })
    }, [])
    return confirmCode
        ? <Navigate to='/' />
        : <ErrorModal />
}
