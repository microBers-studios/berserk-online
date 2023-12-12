import cls from './TextInput.module.scss'

interface TextInputProps {
    title: string
    value: string
    setValue: (value: string) => void
    isRequired?: boolean
    placeholder?: string
}

export const TextInput = ({
    title,
    value,
    setValue,
    isRequired,
    placeholder,
}: TextInputProps) => {
    return (
        <label className={`${cls.FormLabel} ${cls.loginLabel}`}>
            <span>
                {title}
                {isRequired ? <span className={cls.red}> *</span> : ''}
            </span>
            <div className={cls.inputContainer}>
                <input
                    value={value}
                    type="text"
                    name="name"
                    className={cls.FormInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setValue(e.target.value)
                    }}
                    required={isRequired}
                    placeholder={placeholder ? placeholder : ''}
                />
            </div>
        </label>
    )
}
