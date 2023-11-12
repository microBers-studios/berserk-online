import { CardTypes, Elements, Rarities, Sets } from "src/app/store/utils/enums"
import mountainsImage from "src/shared/assets/images/mountains.png"
import plainsImage from "src/shared/assets/images/plains.png"
import forestsImage from "src/shared/assets/images/forests.png"
import swampsImage from "src/shared/assets/images/swamps.png"
import darknessImage from "src/shared/assets/images/darkness.png"
import neutralImage from "src/shared/assets/images/neutral.png"

import elementsWarCommon from "src/shared/assets/images/elements-war-common.png"
import elementsWarUncommon from "src/shared/assets/images/elements-war-uncommon.png"
import elementsWarRare from "src/shared/assets/images/elements-war-rare.png"
import elementsWarUltrarare from "src/shared/assets/images/elements-war-ultrarare.png"
import darknessInvasionCommon from "src/shared/assets/images/elements-war-common.png"
import darknessInvasionUncommon from "src/shared/assets/images/elements-war-uncommon.png"
import darknessInvasionRare from "src/shared/assets/images/elements-war-rare.png"
import darknessInvasionUltrarare from "src/shared/assets/images/elements-war-ultrarare.png"

import ordinary from "src/shared/assets/images/ordinary.png"
import ordinaryUnique from "src/shared/assets/images/ordinary-unique.png"
import eliteImage from "src/shared/assets/images/elite.png"
import eliteUnique from "src/shared/assets/images/elite-unique.png"

import flyerSymbol from "src/shared/assets/images/flyer.png"
import companionSymbol from "src/shared/assets/images/companion.png"
import parasiteSymbol from "src/shared/assets/images/parasite.png"
import artifactSymbol from "src/shared/assets/images/artifact.png"
import terrainSymbol from "src/shared/assets/images/terrain.png"

export const getElement = (element: Elements) => {
    switch (element) {
        case Elements.MOUNTAINS:
            return mountainsImage;
        case Elements.PLAINS:
            return plainsImage;
        case Elements.FORESTS:
            return forestsImage;
        case Elements.SWAMPS:
            return swampsImage;
        case Elements.DARKNESS:
            return darknessImage;
        default:
            return neutralImage;
    }
}

export const getRarity = (rarity: Rarities, set: Sets): string => {
    let rarityStr: string;

    const elementsWarRarities: Record<string, string> = {
        common: elementsWarCommon,
        uncommon: elementsWarUncommon,
        rare: elementsWarRare,
        ultrarare: elementsWarUltrarare
    }

    const darknessInvasionRarities: Record<string, string> = {
        common: darknessInvasionCommon,
        uncommon: darknessInvasionUncommon,
        rare: darknessInvasionRare,
        ultrarare: darknessInvasionUltrarare
    }

    switch (rarity) {
        case Rarities.COMMON:
            rarityStr = 'common';
            break;
        case Rarities.UNCOMMON:
            rarityStr = 'uncommon';
            break;
        case Rarities.RARE:
            rarityStr = 'rare';
            break;
        case Rarities.ULTRARARE:
            rarityStr = 'ultrarare';
            break;
    }

    switch (set) {
        case Sets.ELEMENTS_WAR:
            return elementsWarRarities[rarityStr]
        case Sets.DARKNESS_INVASION:
            return darknessInvasionRarities[rarityStr]
    }

}

export const getElite = (elite: boolean, unique: boolean): string => {

    return elite
        ? unique
            ? eliteUnique
            : eliteImage
        : unique
            ? ordinaryUnique
            : ordinary

}

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
        default: return ''
    }
}