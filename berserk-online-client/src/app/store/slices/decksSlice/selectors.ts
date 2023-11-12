import { RootState } from "src/app/store";
import { createStatusObjectSelector } from "../../utils/const";

export const decksSelector = (state: RootState) => state.decks.decks
export const getDecksStatusSelector = createStatusObjectSelector(state => state.decks.getDecksStatus)
export const deleteDeckStatusSelector = createStatusObjectSelector(state => state.decks.deleteDeckStatus)
export const createDeckStatusSelector = createStatusObjectSelector(state => state.decks.createDeckStatus)
export const getDeckStatusSelector = createStatusObjectSelector(state => state.decks.getDeckStatus)
export const updateDeckStatusSelector = createStatusObjectSelector(state => state.decks.updateDeckStatus)
