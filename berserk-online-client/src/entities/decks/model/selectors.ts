import { RootState } from 'src/app/store'
import { createStatusObjectSelector } from 'src/shared/lib'

export const decksSelector = (state: RootState) => state.decks.decks
export const currentDeckSelector = (state: RootState) => state.decks.currentDeck
export const fetchDecksStatusSelector = createStatusObjectSelector(
    (state) => state.decks.fetchDecksStatus
)
export const deleteDeckStatusSelector = createStatusObjectSelector(
    (state) => state.decks.deleteDeckStatus
)
export const createDeckStatusSelector = createStatusObjectSelector(
    (state) => state.decks.createDeckStatus
)
export const getDeckStatusSelector = createStatusObjectSelector(
    (state) => state.decks.getDeckStatus
)
export const updateDeckStatusSelector = createStatusObjectSelector(
    (state) => state.decks.updateDeckStatus
)
