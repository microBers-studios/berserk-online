import flyerSymbol from 'src/shared/assets/images/flyer.png'
import companionSymbol from 'src/shared/assets/images/companion.png'
import parasiteSymbol from 'src/shared/assets/images/parasite.png'
import artifactSymbol from 'src/shared/assets/images/artifact.png'
import terrainSymbol from 'src/shared/assets/images/terrain.png'
import { CardTypes } from './const'

export const getTypeSymbol = (type: CardTypes): string => {
    switch (type) {
        case CardTypes.FLYER:
            return flyerSymbol
        case CardTypes.COMPANION:
            return companionSymbol
        case CardTypes.PARASITE:
            return parasiteSymbol
        case CardTypes.ARTIFACT:
            return artifactSymbol
        case CardTypes.TERRAIN:
            return terrainSymbol
        default:
            return ''
    }
}
