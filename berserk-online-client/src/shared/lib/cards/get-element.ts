import mountainsImage from 'src/shared/assets/images/mountains.png'
import plainsImage from 'src/shared/assets/images/plains.png'
import forestsImage from 'src/shared/assets/images/forests.png'
import swampsImage from 'src/shared/assets/images/swamps.png'
import darknessImage from 'src/shared/assets/images/darkness.png'
import neutralImage from 'src/shared/assets/images/neutral.png'
import { Elements } from './const'

export const getElement = (element: Elements) => {
    switch (element) {
        case Elements.MOUNTAINS:
            return mountainsImage
        case Elements.PLAINS:
            return plainsImage
        case Elements.FORESTS:
            return forestsImage
        case Elements.SWAMPS:
            return swampsImage
        case Elements.DARKNESS:
            return darknessImage
        default:
            return neutralImage
    }
}
