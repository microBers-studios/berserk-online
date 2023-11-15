import { useAppSelector } from "src/shared/lib"
import { CookieModal } from "src/features/authorization/ui/cookieModal/CookieModal"
import { Mode, modalSelector } from "src/entities/modal"
import { LoginModal } from "src/widgets/loginModal"
import { AccountEditModal } from "src/widgets/accountEditModal"
import { EmailModal } from "src/widgets/AccountModals/EmailModal/EmailModal"
import { SendEmailModal } from "src/features/authorization"

export const GlobalModal = () => {
    const isCookieModal = useAppSelector(state => state.user.isCookieModal)
    const isEmailConfirmed = useAppSelector(state => state.user.isEmailConfirmed)
    const { user } = useAppSelector(state => state.user)
    const { mode, extra } = useAppSelector(modalSelector)

    if (isCookieModal) {
        return <CookieModal />
    }

    if (!isEmailConfirmed) {
        return <SendEmailModal
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
        return <EmailModal />
    }

    if (mode === Mode.CLOSE) {
        return <SendEmailModal emailObject={extra} />
    }

    return <></>
}
