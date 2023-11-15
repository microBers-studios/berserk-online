import cls from "./LoginModal.module.scss"
import { IAnimator, useAnimate } from 'src/helpers/hooks/useAnimate';
import { Modal } from 'src/shared/ui/modal/ui/Modal';
import { LoginForm } from 'src/features/authorization';
import { useAppDispatch, useAppSelector } from 'src/shared/lib';
import { Mode, setMode } from 'src/entities/modal';
import { modalSelector } from 'src/entities/modal/model/selectors';
import { loginUserStatusSelector, registrateUserStatusSelector } from 'src/entities/user';

export const LoginModal = () => {
    const {
        isAnimation, setIsAnimation,
        isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation
    }: IAnimator = useAnimate()

    const dispatch = useAppDispatch()
    const loginUserStatus = useAppSelector(loginUserStatusSelector)
    const registrateUserStatus = useAppSelector(registrateUserStatusSelector)


    const { mode } = useAppSelector(modalSelector)
    const isRegistration = mode === Mode.REGISTRATION

    const onPasswordResetClick = async () => {
        if (!loginUserStatus.isPending && !registrateUserStatus.isPending) {
            await closeModal(false)
            dispatch(setMode({ mode: Mode.EMAIL }))
        }
    }

    const onFormChangeClick = () => {
        setIsAnimation(true)
        dispatch(setMode({ mode: isRegistration ? Mode.LOGIN : Mode.REGISTRATION }))
        // setNameError(false)
        // setEmailError(0)
        // setPasswordError(0)
    }

    const closeModal = async (isOverflowHidden = true) => {
        if (!loginUserStatus.isPending && !registrateUserStatus.isPending) {
            setIsCloseAnimation(true)

            if (isOverflowHidden) {
                document.body.style.overflow = ''
            }

            await new Promise((resolve) => {
                setTimeout(() => {
                    dispatch(setMode({ mode: null }))
                    resolve(0)
                }, 300)
            })
        }
    }

    return (
        <Modal
            isAnimation={isAnimation}
            isCloseAnimation={isCloseAnimation}
            isOpenAnimation={isOpenAnimation}
            setIsAnimation={setIsAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            closeModal={closeModal}
        >
            <div className={cls.FormWrapper}>
                <LoginForm
                    isRegistration={isRegistration}
                    closeModal={closeModal}
                />
                <div className={cls.ButtonsWrapper}>
                    {!isRegistration &&
                        <span
                            className={cls.PasswordResetButton}
                            onClick={onPasswordResetClick}
                        >
                            Забыли пароль?
                        </span>
                    }
                    <span
                        onClick={onFormChangeClick}
                        className={cls.changeFormButton}
                    >{isRegistration
                        ? 'Войти'
                        : 'Зарегистрироваться'}
                    </span>
                </div>
            </div>
        </Modal>
    );
}
