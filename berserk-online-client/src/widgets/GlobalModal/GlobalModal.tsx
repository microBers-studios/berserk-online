import { useAppSelector } from "src/helpers/hooks/redux-hook"
import { CookieModal } from "../AccountModals/CookieModal/CookieModal"
import { Mode } from "src/app/store/slices/modalSlice/modalSlice"
import { LoginModal } from "../AccountModals/LoginModal/LoginModal"
import { AccountEditModal } from "../AccountModals/AccountEditModal/AccountEditModal"
import { EmailModal } from "../AccountModals/EmailModal/EmailModal"
import { CloseModal } from "../AccountModals/CloseModal/CloseModal"
import { modalSelector } from "src/app/store/slices/modalSlice/selectors"

export const GlobalModal = () => {
    const isCookieModal = useAppSelector(state => state.user.isCookieModal)
    const isEmailConfirmed = useAppSelector(state => state.user.isEmailConfirmed)
    const { user } = useAppSelector(state => state.user)
    const { mode, extra } = useAppSelector(modalSelector)

    if (isCookieModal) {
        return <CookieModal />
    }

    if (!isEmailConfirmed) {
        return <CloseModal
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
        return <CloseModal emailObject={extra} />
    }

    return <></>
}
