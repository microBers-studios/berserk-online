import cls from "./ImageInput.module.scss"

interface ImageInputProps {
    className?: string;
}

export const ImageInput = () => {
    return (
        <div className={cls.ImageInput} >
            <input
                accept="image/*"
                type="file"
                placeholder="Загрузить аватарку"
                className={cls.imageInput}
            />
        </div >
    );
}
