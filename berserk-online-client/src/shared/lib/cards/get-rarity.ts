import elementsWarCommon from 'src/shared/assets/images/elements-war-common.png'
import elementsWarUncommon from 'src/shared/assets/images/elements-war-uncommon.png'
import elementsWarRare from 'src/shared/assets/images/elements-war-rare.png'
import elementsWarUltrarare from 'src/shared/assets/images/elements-war-ultrarare.png'
import darknessInvasionCommon from 'src/shared/assets/images/elements-war-common.png'
import darknessInvasionUncommon from 'src/shared/assets/images/elements-war-uncommon.png'
import darknessInvasionRare from 'src/shared/assets/images/elements-war-rare.png'
import darknessInvasionUltrarare from 'src/shared/assets/images/elements-war-ultrarare.png'
import { Rarities, Sets } from './const'

export const getRarity = (rarity: Rarities, set: Sets): string => {
    let rarityStr: string

    const elementsWarRarities: Record<string, string> = {
        common: elementsWarCommon,
        uncommon: elementsWarUncommon,
        rare: elementsWarRare,
        ultrarare: elementsWarUltrarare,
    }

    const darknessInvasionRarities: Record<string, string> = {
        common: darknessInvasionCommon,
        uncommon: darknessInvasionUncommon,
        rare: darknessInvasionRare,
        ultrarare: darknessInvasionUltrarare,
    }

    switch (rarity) {
        case Rarities.COMMON:
            rarityStr = 'common'
            break
        case Rarities.UNCOMMON:
            rarityStr = 'uncommon'
            break
        case Rarities.RARE:
            rarityStr = 'rare'
            break
        case Rarities.ULTRARARE:
            rarityStr = 'ultrarare'
            break
    }

    switch (set) {
        case Sets.ELEMENTS_WAR:
            return elementsWarRarities[rarityStr]
        case Sets.DARKNESS_INVASION:
            return darknessInvasionRarities[rarityStr]
    }
}
