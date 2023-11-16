import { useAppSelector } from "src/shared/lib"
import { Mode, modalSelector } from "src/entities/modal"
import { SendPasswordResetModal, CookieModal, SendEmailConfirmModal } from "src/features/authorization"
import { LoginModal } from "src/widgets/loginModal"
import { AccountEditModal } from "src/widgets/accountEditModal"

export const GlobalModal = () => {
    const isCookieModal = useAppSelector(state => state.user.isCookieModal)
    const isEmailConfirmed = useAppSelector(state => state.user.isEmailConfirmed)
    const { user } = useAppSelector(state => state.user)
    const { mode, extra } = useAppSelector(modalSelector)

    if (isCookieModal) {
        return <CookieModal />
    }

    if (!isEmailConfirmed) {
        return <SendEmailConfirmModal
            emailObject={{ email: user.email }}
            isAuto={false}
        />
    }

    if (mode === Mode.LOGIN || mode === Mode.REGISTRATION) {
        return <LoginModal />
    }

    if (mode === Mode.EDIT) {
        console.log(mode)
        return <AccountEditModal />
    }

    if (mode === Mode.EMAIL) {
        return <SendPasswordResetModal />
    }

    if (mode === Mode.CLOSE) {
        return <SendEmailConfirmModal emailObject={extra} />
    }

    return <></>
}
