import { useState } from 'react'
import cls from "../LoginModal.module.scss"
import checked from "../../../shared/assets/images/checked.svg"
import unchecked from "../../../shared/assets/images/unchecked.svg"

export const CheckboxInput = () => {
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [isAnimated, setIsAnimated] = useState<boolean>(false)


    const onInputChange = () => {
        setIsChecked(!isChecked)
        setIsAnimated(true)
    }

    return (
        <label
            className={cls.rememberLabel}
        >
            <img
                src={isChecked ? checked : unchecked}
                className={`${cls.checkboxImage} ${isAnimated && cls.checkboxAnimated}`}
                onAnimationEnd={() => setIsAnimated(false)}
            />
            <input
                type="checkbox"
                name="remember"
                className={cls.rememberInput}
                onChange={onInputChange}
            />
            Запомнить меня
        </label>
    );
}
