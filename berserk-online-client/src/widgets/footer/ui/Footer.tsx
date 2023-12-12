import cls from './Footer.module.scss'
import hobbyworldImage from 'src/shared/assets/images/hobbyworld.webp'
import githubImage from 'src/shared/assets/images/github.png'

// interface FooterProps {
//     className?: string;
// }

export const Footer = () => {
    return (
        <footer className={cls.Footer}>
            <div className={cls.FooterContent}>
                <a
                    href="https://github.com/microBers-studios"
                    className={cls.GithubLink}
                    target="_blank"
                >
                    <div className={cls.GithubImageWrapper}>
                        <img className={cls.GithubImage} src={githubImage} />
                    </div>
                    microBers studios
                </a>
                <a href="https://hobbyworld.ru/" target="_blank">
                    <img
                        className={cls.HobbyworldImage}
                        src={hobbyworldImage}
                    />
                </a>
                <span className={cls.year}>2023</span>
            </div>
        </footer>
    )
}
