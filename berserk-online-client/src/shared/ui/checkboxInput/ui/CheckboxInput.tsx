import { useState } from 'react'
import cls from './CheckboxInput.module.scss'
import checked from 'src/shared/assets/images/checked.svg'
import unchecked from 'src/shared/assets/images/unchecked.svg'

interface CheckboxInputProps {
    isChecked: boolean
    setIsChecked: (b: boolean) => void
}

export const CheckboxInput = ({
    isChecked,
    setIsChecked,
}: CheckboxInputProps) => {
    const [isAnimated, setIsAnimated] = useState<boolean>(false)

    const onInputChange = () => {
        setIsChecked(!isChecked)
        setIsAnimated(true)
    }

    return (
        <label className={cls.rememberLabel}>
            <img
                src={isChecked ? checked : unchecked}
                className={`${cls.checkboxImage} ${
                    isAnimated && cls.checkboxAnimated
                }`}
                onAnimationEnd={() => setIsAnimated(false)}
            />
            <input
                type="checkbox"
                name="remember"
                className={cls.rememberInput}
                onChange={onInputChange}
                checked={isChecked}
            />
            Запомнить меня
        </label>
    )
}
