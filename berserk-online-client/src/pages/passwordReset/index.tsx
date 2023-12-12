import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import cls from './PasswordResetPage.module.scss'
import { PasswordResetModal } from 'src/features/authorization'

export const PasswordResetPage = () => {
    const [isModal, setIsModal] = useState<boolean>(true)
    const [isNavigate, setIsNavigate] = useState<boolean>(false)

    const [params] = useSearchParams()
    const token = params.get('token')

    if (!token) {
        throw new Error('Token Error')
    }

    const closeModal = () => {
        setIsModal(false)
        setIsNavigate(true)
    }

    return isNavigate ? (
        <Navigate to={'/'} />
    ) : (
        <div className={cls.PasswordResetPage}>
            {isModal && (
                <PasswordResetModal closeModal={closeModal} token={token} />
            )}
        </div>
    )
}
