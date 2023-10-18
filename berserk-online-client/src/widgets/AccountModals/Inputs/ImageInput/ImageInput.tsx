import { useState } from 'react';
import cls from "./ImageInput.module.scss"
import { UserContextProps } from "src/app/providers/UserProvider/lib/types/types";
import { UserContext } from "src/app/providers/UserProvider";
import { useRequiredContext } from "src/helpers/hooks/useRequiredContext";
import av from "src/shared/assets/images/default-avatar.jpg"
import camera from "src/shared/assets/images/photo.svg"
import APIController from 'src/API/Controller';
import { useRef } from 'react';

// interface ImageInputProps {
//     formRef: React.Ref<HTMLFormElement>
// }

export const ImageInput = () => {
    const { user } = useRequiredContext<UserContextProps>(UserContext)

    const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
    const [url, setUrl] = useState<string>(Boolean(user.avatarUrl)
        ? user.avatarUrl
        : av)

    const inputRef = useRef<HTMLInputElement>(null)

    const changeAvatar = async () => {
        APIController.loadAvatar(inputRef.current as HTMLInputElement)
    }

    return (
        <div className={cls.ImageInput} >
            <div
                className={cls.imageContainer}
                onMouseEnter={() => setIsMouseOver(true)}
                onMouseLeave={() => setIsMouseOver(false)}
            >
                <img
                    src={url}
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
            <span
                className={cls.deleteAvatar}
            >Удалить</span>
        </div>
    );
}
