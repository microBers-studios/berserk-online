import cls from './CookieModal.module.scss'
import cookieSvg from 'src/shared/assets/images/cookie.svg'
import { Modal, ModalButton } from 'src/shared/ui'
import { useAppDispatch, useAnimate } from 'src/shared/lib'
import { closeCookieModal } from 'src/entities/user'

export const CookieModal = () => {
    const {
        isOpenAnimation,
        setIsOpenAnimation,
        isCloseAnimation,
        setIsCloseAnimation,
    }: IAnimator = useAnimate()
    const dispatch = useAppDispatch()

    const closeModal = () => {
        setIsCloseAnimation(true)
        setTimeout(() => {
            dispatch(closeCookieModal())
        }, 300)
        document.body.style.overflow = ''
    }

    const onOkClick = () => {
        localStorage.setItem('cookie', 'true')
        closeModal()
    }

    return (
        <Modal
            isCloseAnimation={isCloseAnimation}
            isOpenAnimation={isOpenAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            closeModal={closeModal}
        >
            <div className={cls.CookieModal}>
                <img className={cls.CookieSvg} src={cookieSvg} alt="" />
                <h1 className={cls.CookieModalHeader}>Мы используем Cookie</h1>
                <ModalButton text={'Ок'} onButtonClick={onOkClick} />
            </div>
        </Modal>
    )
}
