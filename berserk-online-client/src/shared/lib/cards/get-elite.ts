import ordinary from 'src/shared/assets/images/ordinary.png'
import ordinaryUnique from 'src/shared/assets/images/ordinary-unique.png'
import eliteImage from 'src/shared/assets/images/elite.png'
import eliteUnique from 'src/shared/assets/images/elite-unique.png'

export const getElite = (elite: boolean, unique: boolean): string =>
    elite
        ? unique
            ? eliteUnique
            : eliteImage
        : unique
          ? ordinaryUnique
          : ordinary
