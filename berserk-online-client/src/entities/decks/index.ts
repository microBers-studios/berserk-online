export { decksSlice } from './model/decksSlice'

export { fetchDecks } from './api/fetch-decks'
export { createDeck } from './api/create-deck'
export { deleteDeck } from './api/delete-deck'
export { updateDeck } from './api/update-deck'
export { getDeck } from './api/get-deck'

export {
    decksSelector,
    currentDeckSelector,
    fetchDecksStatusSelector,
    createDeckStatusSelector,
    deleteDeckStatusSelector,
    updateDeckStatusSelector,
    getDeckStatusSelector,
} from './model/selectors'

export {
    changeCardAmount,
    deleteCard,
    addCard,
    setCurrentDeck,
} from './model/decksSlice'
