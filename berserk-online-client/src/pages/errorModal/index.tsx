import { ErrorModal } from 'src/shared/ui'
import cls from './ErrorModalPage.module.scss'
import { Layout } from 'src/shared/layouts'

export const ErrorModalPage = () => {
    return (
        <Layout
            header={false}
            content={
                <div className={cls.ErrorModalPage}>
                    <ErrorModal />
                </div>
            }
            footer={false}
            title="Ошибка!"
        />
    )
}
