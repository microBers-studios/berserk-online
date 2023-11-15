import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { APIStatus } from "src/shared/lib";
import { fetchDecks } from "../api/fetch-decks";
import { deleteDeck } from "../api/delete-deck";
import { createDeck } from "../api/create-deck";
import { getDeck } from "../api/get-deck";
import { updateDeck } from "../api/update-deck";

export interface IDecksState {
    decks: DeckType[];
    currentDeck: null | DeckType;
    fetchDecksStatus: APIStatus;
    deleteDeckStatus: APIStatus;
    createDeckStatus: APIStatus;
    getDeckStatus: APIStatus;
    updateDeckStatus: APIStatus;
}

const initialState: IDecksState = {
    decks: [],
    currentDeck: null,
    fetchDecksStatus: APIStatus.Idle,
    deleteDeckStatus: APIStatus.Idle,
    createDeckStatus: APIStatus.Idle,
    getDeckStatus: APIStatus.Idle,
    updateDeckStatus: APIStatus.Idle
}

export const decksSlice = createSlice({
    name: 'decks',
    initialState,
    reducers: {
        changeCardAmount: (state, action: PayloadAction<{ cardId: number, isIncrease: boolean, isSide: boolean }>) => {
            const { cardId, isIncrease, isSide } = action.payload

            const newDeck = JSON.parse(JSON.stringify(state.currentDeck))
            const cardsList = isSide
                ? newDeck.sideboard
                : newDeck.main

            const card = cardsList.find((c: IDeckCard) => c.id === cardId)
            let amount: number;

            if (isIncrease) {
                amount = card.amount + 1
            } else {
                if (card.amount - 1 < 1) {
                    amount = 1
                } else {
                    amount = card.amount - 1
                }
            }

            if (!isSide) {
                newDeck.main = cardsList.map((c: IDeckCard) => {
                    return c.id === cardId
                        ? { ...c, amount }
                        : c
                })
            } else {
                if (!newDeck.sideboard) {
                    throw new Error('Sideboard Error')
                }

                newDeck.sideboard = cardsList.map((c: IDeckCard) => {
                    return c.id === cardId
                        ? { ...c, amount }
                        : c
                })
            }

            state.currentDeck = newDeck
        },
        deleteCard: (state, action: PayloadAction<{ cardId: number, isSide: boolean }>) => {
            const { cardId, isSide } = action.payload

            const newDeck = JSON.parse(JSON.stringify(state.currentDeck))

            const cardsList = isSide
                ? newDeck.sideboard
                : newDeck.main

            if (isSide) {
                newDeck.sideboard = cardsList.filter((c: CardType) => c.id !== cardId)
            } else {
                newDeck.main = cardsList.filter((c: CardType) => c.id !== cardId)
            }

            state.currentDeck = newDeck
        },
        addCard: (state, action: PayloadAction<{ card: CardType }>) => {
            if (!state.currentDeck) return
            const { card } = action.payload

            let newDeck: DeckType = JSON.parse(JSON.stringify(state.currentDeck));
            const isInDeck = newDeck.main.find((c: CardType) => c.id === card.id)

            if (!isInDeck) {
                newDeck.main.push({ ...card, amount: 1 })
                newDeck.main = newDeck.main.sort((a: IDeckCard, b: IDeckCard) => a.price - b.price)

                state.currentDeck = newDeck
            }
        },
        setCurrentDeck: (state, action: PayloadAction<{ deck: DeckType | null }>) => {
            state.currentDeck = action.payload.deck
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchDecks.pending, (state) => {
                state.fetchDecksStatus = APIStatus.Pending;
            })
            .addCase(fetchDecks.fulfilled, (state, action) => {
                state.fetchDecksStatus = APIStatus.Fulfilled;
                state.decks = action.payload
            })
            .addCase(fetchDecks.rejected, (state, action) => {
                state.fetchDecksStatus = APIStatus.Rejected;
                toast(action.payload)
            })
            .addCase(deleteDeck.pending, (state) => {
                state.deleteDeckStatus = APIStatus.Pending;
            })
            .addCase(deleteDeck.fulfilled, (state, action) => {
                state.deleteDeckStatus = APIStatus.Fulfilled;
                state.decks = action.payload
                toast('Колода удалена')
            })
            .addCase(deleteDeck.rejected, (state, action) => {
                state.deleteDeckStatus = APIStatus.Rejected;
                toast(action.payload)
            })
            .addCase(createDeck.pending, (state) => {
                state.createDeckStatus = APIStatus.Pending;
            })
            .addCase(createDeck.fulfilled, (state, action) => {
                state.decks.push(action.payload)
                state.currentDeck = action.payload
                state.createDeckStatus = APIStatus.Fulfilled;
            })
            .addCase(createDeck.rejected, (state, action) => {
                state.createDeckStatus = APIStatus.Rejected;
                toast(action.payload)
            })
            .addCase(getDeck.pending, (state) => {
                state.getDeckStatus = APIStatus.Pending;
            })
            .addCase(getDeck.fulfilled, (state, action) => {
                state.currentDeck = action.payload
                state.getDeckStatus = APIStatus.Fulfilled;
            })
            .addCase(getDeck.rejected, (state, action) => {
                state.getDeckStatus = APIStatus.Rejected;
                toast(action.payload)
            })
            .addCase(updateDeck.pending, (state) => {
                state.updateDeckStatus = APIStatus.Pending;
            })
            .addCase(updateDeck.fulfilled, (state) => {
                state.updateDeckStatus = APIStatus.Fulfilled;
            })
            .addCase(updateDeck.rejected, (state, action) => {
                state.updateDeckStatus = APIStatus.Rejected;
                toast(action.payload)
            })
    }
})

export const { changeCardAmount, deleteCard, addCard, setCurrentDeck } = decksSlice.actions