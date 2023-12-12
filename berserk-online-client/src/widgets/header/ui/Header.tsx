import { useState } from 'react'
import { Link } from 'react-router-dom'
import ReactLoading from 'react-loading'
import cls from './Header.module.scss'
import { Burger } from 'src/shared/ui'
import { useAppSelector, RouterPaths } from 'src/shared/lib'
import {
    ChangeAvatarInput,
    CookieModal,
    ProfilePill,
    SendEmailConfirmModal,
    SendPasswordResetModal,
    LoginModal,
    AccountEditModal,
} from 'src/features/authorization'
import {
    confirmUserEmailStatusSelector,
    deleteAvatarStatusSelector,
    fetchUserStatusSelector,
    loadAvatarStatusSelector,
    loginUserStatusSelector,
    registrateUserStatusSelector,
    updateUserStatusSelector,
} from 'src/entities/user'

interface NavbarProps {
    currentPage: RouterPaths | null
}

export const Header = ({ currentPage }: NavbarProps) => {
    const [isBurgerClicked, setIsBurgerClicked] = useState<boolean>(false)
    const { user } = useAppSelector((state) => state.user)

    const getUserStatus = useAppSelector(fetchUserStatusSelector)
    const updateUserStatus = useAppSelector(updateUserStatusSelector)
    const loadAvatarStatus = useAppSelector(loadAvatarStatusSelector)
    const deleteAvatarStatus = useAppSelector(deleteAvatarStatusSelector)
    const loginUserStatus = useAppSelector(loginUserStatusSelector)
    const registrateUserStatus = useAppSelector(registrateUserStatusSelector)
    const isEmailConfirmed = useAppSelector(
        (state) => state.user.isEmailConfirmed
    )
    const isCookieModal = useAppSelector((state) => state.user.isCookieModal)
    const confirmUserEmailStatus = useAppSelector(
        confirmUserEmailStatusSelector
    )

    const [modalMode, setModalMode] = useState<
        'log' | 'reg' | 'edit' | 'pas' | 'confirm' | null
    >(null)
    const [confirmingEmail, setConfirmingEmail] = useState(user.email || '')

    const onLinkClick = () => {
        if (!getUserStatus.isPending) {
            setIsBurgerClicked(false)
        }
    }

    const onLoginClick = () => {
        if (!getUserStatus.isPending) {
            setModalMode('log')
            document.body.style.overflow = 'hidden'
        }
    }

    const onRegistrationClick = () => {
        if (!getUserStatus.isPending) {
            setModalMode('reg')
            document.body.style.overflow = 'hidden'
        }
    }

    return (
        <>
            <header className={cls.Navbar}>
                <Burger
                    isBurgerClicked={isBurgerClicked}
                    setIsBurgerClicked={setIsBurgerClicked}
                />
                <nav
                    className={`${cls.NavbarMenu} ${
                        isBurgerClicked && cls.opened
                    }`}
                >
                    <Link
                        to={RouterPaths.MAIN}
                        onClick={onLinkClick}
                        className={`${cls.NavbarLink}`}
                    >
                        <span
                            className={`${
                                currentPage === RouterPaths.MAIN
                                    ? cls.active
                                    : ''
                            }`}
                        >
                            Главная
                        </span>
                    </Link>
                    <Link
                        to={RouterPaths.ROOMS}
                        onClick={onLinkClick}
                        className={`${cls.NavbarLink}`}
                    >
                        <span
                            className={`${
                                currentPage === RouterPaths.ROOMS
                                    ? cls.active
                                    : ''
                            }`}
                        >
                            Комнаты
                        </span>
                    </Link>
                </nav>

                {getUserStatus.isPending ||
                updateUserStatus.isPending ||
                loadAvatarStatus.isPending ||
                deleteAvatarStatus.isPending ||
                loginUserStatus.isPending ||
                registrateUserStatus.isPending ? (
                    <ReactLoading
                        type={'bubbles'}
                        color={'#ffffff'}
                        height={100}
                        width={90}
                    />
                ) : user.id ? (
                    <ProfilePill openEditModal={() => setModalMode('edit')} />
                ) : (
                    <div className={cls.NavbarLoginButtons}>
                        <span onClick={onLoginClick} className={cls.login}>
                            Войти
                        </span>
                        <span
                            onClick={onRegistrationClick}
                            className={cls.registration}
                        >
                            Зарегистрироваться
                        </span>
                    </div>
                )}
            </header>
            {(modalMode === 'log' || modalMode === 'reg') && (
                <LoginModal
                    closeModal={() => setModalMode(null)}
                    mode={modalMode}
                    setMode={setModalMode}
                    setConfirmingEmail={setConfirmingEmail}
                />
            )}
            {modalMode === 'pas' && (
                <SendPasswordResetModal closeModal={() => setModalMode(null)} />
            )}
            {modalMode === 'edit' && (
                <AccountEditModal
                    closeModal={() => setModalMode(null)}
                    ImageInput={<ChangeAvatarInput />}
                />
            )}
            {modalMode === 'confirm' && (
                <SendEmailConfirmModal email={confirmingEmail || user.email} />
            )}
            {!isEmailConfirmed && !confirmUserEmailStatus.isPending && (
                <SendEmailConfirmModal
                    email={confirmingEmail || user.email}
                    isAuto={false}
                />
            )}
            {isCookieModal && <CookieModal />}
        </>
    )
}
