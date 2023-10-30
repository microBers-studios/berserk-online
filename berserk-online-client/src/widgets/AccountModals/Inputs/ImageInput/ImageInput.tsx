import { useState } from 'react';
import cls from "./ImageInput.module.scss"
import { UserContextProps } from "src/app/providers/UserProvider/lib/types/types";
import { UserContext } from "src/app/providers/UserProvider";
import { useRequiredContext } from "src/helpers/hooks/useRequiredContext";
import camera from "src/shared/assets/images/photo.svg"
import APIController from 'src/API/Controller';
import { useRef } from 'react';
import defaultAvatar from 'src/shared/assets/images/default-avatar.jpg'
import { AlertContext, AlertContextProps } from 'src/app/providers/AlertProvider/lib/AlertContext';

// interface ImageInputProps {
//     formRef: React.Ref<HTMLFormElement>
// }

export const ImageInput = () => {
    const { user, setUser } = useRequiredContext<UserContextProps>(UserContext)
    const { setAlert } = useRequiredContext<AlertContextProps>(AlertContext)
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null)

    const changeAvatar = async () => {
        const { obj } = await APIController.loadAvatar(inputRef.current as HTMLInputElement)

        setUser({ ...user, ...obj })
    }

    const deleteAvatar = async () => {
        const { code, obj } = await APIController.deleteAvatar()

        if (code === 200) {
            setUser({ ...user, ...obj })
        } else {
            setAlert('Ошибка!')
        }
    }

    return (
        <div className={cls.ImageInput} >
            <div
                className={cls.imageContainer}
                onMouseEnter={() => setIsMouseOver(true)}
                onMouseLeave={() => setIsMouseOver(false)}
            >
                <img
                    src={user.avatarUrl}
                    className={cls.userImage}
                />
                {isMouseOver && <label
                    className={cls.avatarLabel}
                >
                    <input
                        accept="image/*"
                        type="file"
                        placeholder="Загрузить аватарку"
                        name="avatar-input"
                        ref={inputRef}
                        onChange={changeAvatar}
                    />
                    <img
                        src={camera}
                        className={cls.cameraImage}
                    />
                </label>
                }
            </div>

            {user.avatarUrl !== defaultAvatar && <span
                className={cls.deleteAvatar}
                onClick={deleteAvatar}
            >Удалить</span>}
        </div>
    );
}
