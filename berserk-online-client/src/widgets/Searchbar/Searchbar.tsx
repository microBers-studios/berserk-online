import cls from "./Searchbar.module.scss"

// interface SearchBarProps {
//     className?: string;
// }

export const Searchbar = () => {
    return (
        <div className={cls.Searchbar} >
            <label
                className={cls.SearchbarLabel}>
                <h3
                    className={cls.SearchbarHeader}
                >Введите название карты: </h3>
                <input
                    className={cls.SearchbarInput}
                    type="text"
                />

            </label>

        </div >
    );
}
