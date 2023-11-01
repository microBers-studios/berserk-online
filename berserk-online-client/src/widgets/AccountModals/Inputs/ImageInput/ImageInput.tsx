import { useState } from 'react';
import cls from "./ImageInput.module.scss"
import { UserContext } from "src/app/providers/UserProvider";
import { useRequiredContext } from "src/helpers/hooks/useRequiredContext";
import camera from "src/shared/assets/images/photo.svg"
import APIController from 'src/API/Controller';
import { useRef } from 'react';
import defaultAvatar from 'src/shared/assets/images/default-avatar.jpg'
import { useAlert } from 'src/helpers/hooks/useAlert';

// interface ImageInputProps {
//     formRef: React.Ref<HTMLFormElement>
// }

export const ImageInput = () => {
    const { user, setUser } = useRequiredContext(UserContext)
    const setAlert = useAlert()
    const [isMouseOver, setIsMouseOver] = useState(false);
    const inputRef = useRef(null)

    const changeAvatar = async () => {
        try {
            if (!inputRef.current) {
                throw new Error('Avatar Error')
            }

            const { code, obj } = await APIController.loadAvatar(inputRef.current)

            if (code === 200) {
                setUser({ ...user, ...obj })
            } else {
                setAlert('Ошибка!')
            }
        } catch (e) {
            setAlert('Ошибка!')
        }
    }

    const deleteAvatar = async () => {
        try {
            const { code, obj } = await APIController.deleteAvatar()

            if (code === 200) {
                setUser({ ...user, ...obj })
            } else {
                setAlert('Ошибка!')
            }
        } catch (e) {
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
