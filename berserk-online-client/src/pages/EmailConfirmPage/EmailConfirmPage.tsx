import { useSearchParams } from "react-router-dom";
import cls from "./EmailConfirmPage.module.scss"

// interface EmailConfirmPageProps {
//     className?: string;
// }

export const EmailConfirmPage = () => {
    const [params] = useSearchParams()
    const token = params.get('token')

    return (
        <div className={cls.EmailConfirmPage} >
        </div >
    );
}
