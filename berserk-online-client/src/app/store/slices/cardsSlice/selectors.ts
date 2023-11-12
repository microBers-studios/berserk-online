import { RootState } from "src/app/store";
import { createStatusObjectSelector } from "src/app/store/utils/const";


export const cardsSelector = (state: RootState) => state.cards.cards
export const findCardsStatusSelector = createStatusObjectSelector((state: RootState) => state.cards.findCardsStatus)