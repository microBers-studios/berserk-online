import { useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from 'src/shared/lib/redux/redux-hook'
import { toast } from 'react-toastify'
import ReactLoading from 'react-loading'
import cls from './ChangeAvatarInput.module.scss'
import camera from 'src/shared/assets/images/photo.svg'
import defaultAvatar from 'src/shared/assets/images/default-avatar.jpg'
import { loadAvatar, deleteAvatar } from 'src/entities/user'
import {
    deleteAvatarStatusSelector,
    loadAvatarStatusSelector,
    updateUserStatusSelector,
} from 'src/entities/user/model/selectors'

export const ChangeAvatarInput = () => {
    const { user } = useAppSelector((state) => state.user)
    const loadAvatarStatus = useAppSelector(loadAvatarStatusSelector)
    const deleteAvatarStatus = useAppSelector(deleteAvatarStatusSelector)
    const updateUserStatus = useAppSelector(updateUserStatusSelector)
    const dispatch = useAppDispatch()
    const [isMouseOver, setIsMouseOver] = useState(false)
    const inputRef = useRef(null)

    const changeAvatar = () => {
        if (
            !loadAvatarStatus.isPending &&
            !deleteAvatarStatus.isPending &&
            !updateUserStatus.isPending
        ) {
            try {
                if (!inputRef.current) {
                    throw new Error('Avatar Error')
                }

                dispatch(loadAvatar(inputRef.current))
            } catch (e) {
                toast('Ошибка!')
            }
        }
    }

    const deleteUserAvatar = () => {
        if (
            !loadAvatarStatus.isPending &&
            !deleteAvatarStatus.isPending &&
            !updateUserStatus.isPending
        ) {
            dispatch(deleteAvatar())
        }
    }

    return (
        <div className={cls.ImageInput}>
            {loadAvatarStatus.isPending || deleteAvatarStatus.isPending ? (
                <ReactLoading type="spin" color="orange" height={110} />
            ) : (
                <div
                    className={cls.imageContainer}
                    onMouseEnter={() => setIsMouseOver(true)}
                    onMouseLeave={() => setIsMouseOver(false)}
                >
                    <img src={user.avatarUrl} className={cls.userImage} />
                    {isMouseOver && (
                        <label className={cls.avatarLabel}>
                            <input
                                accept="image/*"
                                type="file"
                                placeholder="Загрузить аватарку"
                                name="avatar-input"
                                ref={inputRef}
                                onChange={changeAvatar}
                            />
                            <img src={camera} className={cls.cameraImage} />
                        </label>
                    )}
                </div>
            )}

            {user.avatarUrl !== defaultAvatar && (
                <span className={cls.deleteAvatar} onClick={deleteUserAvatar}>
                    Удалить
                </span>
            )}
        </div>
    )
}
