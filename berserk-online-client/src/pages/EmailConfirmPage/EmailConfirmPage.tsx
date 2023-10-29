import { useEffect } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom";
import APIController from 'src/API/Controller';
import { UserContext } from 'src/app/providers/UserProvider';
import { IUser, UserContextProps } from 'src/app/providers/UserProvider/lib/types/types';
import { useRequiredContext } from 'src/helpers/hooks/useRequiredContext';

export const EmailConfirmPage = () => {
    const [params] = useSearchParams()
    const token = params.get('token')

    const { setUser, user } = useRequiredContext<UserContextProps>(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        new Promise(async () => {
            if (!token) throw new Error('Token Error')

            const { code, obj } = await APIController.confirmEmail(token)

            console.log(code)

            if (code === 200) {
                setUser({ ...user, ...obj as IUser })
                navigate('/')
            } else {
                navigate('/error')
            }
        })
    }, [])
}   
