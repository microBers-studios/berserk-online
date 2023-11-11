import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { APIStatus } from "src/app/store/const";
import { Paths, URL } from "src/API/utils/urls";
import { ICard, IDeck, IDeckCard } from "src/API/utils/types";
import { RootState } from "src/app/store";

export interface IDecksState {
    decks: IDeck[];
    currentDeck: null | IDeck;
    getDecksStatus: APIStatus;
    deleteDeckStatus: APIStatus;
    createDeckStatus: APIStatus;
    getDeckStatus: APIStatus;
    updateDeckStatus: APIStatus;
}

const initialState: IDecksState = {
    decks: [],
    currentDeck: null,
    getDecksStatus: APIStatus.Idle,
    deleteDeckStatus: APIStatus.Idle,
    createDeckStatus: APIStatus.Idle,
    getDeckStatus: APIStatus.Idle,
    updateDeckStatus: APIStatus.Idle
}

export const getDecks = createAsyncThunk<IDeck[], undefined, { rejectValue: string }>(
    'decks/getDecks',
    async function (_, { rejectWithValue }) {
        try {
            const path = URL + Paths.GET_DECKS

            const response = await fetch(path, {
                credentials: 'include'
            })

            const obj = await response.json()

            if (response.status !== 200) {
                throw obj
            }

            return obj
        } catch (e: any) {
            return rejectWithValue(e.message)
        }
    })

export const deleteDeck = createAsyncThunk<IDeck[], string, { rejectValue: string }>(
    'decks/deleteDeck',
    async function (id, { rejectWithValue }) {
        try {
            const path = URL + Paths.DELETE_DECK + `?id=${id}`

            const response = await fetch(path, {
                method: 'DELETE',
                credentials: 'include'
            })

            const obj = await response.json()

            if (response.status !== 200) {
                throw obj
            }

            return obj
        } catch (e: any) {
            return rejectWithValue(e.message)
        }
    }
)

export const createDeck = createAsyncThunk<IDeck, IDeck, { rejectValue: string }>(
    'decks/createDeck',
    async function (deck, { rejectWithValue }) {
        try {
            const path = URL + Paths.ADD_DECK

            const response = await fetch(path, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deck)
            })

            if (response.status !== 200) {
                throw new Error('Create Deck Error')
            }

            return deck
        } catch (e: any) {
            return rejectWithValue(e.message)
        }
    }
)

export const getDeck = createAsyncThunk<IDeck, string, { rejectValue: string }>(
    'decks/getDeck',
    async (id, { rejectWithValue }) => {
        try {
            const path = URL + Paths.GET_DECKS + `/${id}`

            const response = await fetch(path, {
                credentials: 'include'
            })

            const obj = await response.json()

            if (response.status !== 200) {
                throw obj
            }

            return obj
        } catch (e: any) {
            return rejectWithValue(e.message)
        }
    })

export const updateDeck = createAsyncThunk<undefined, IDeck, { rejectValue: string }>(
    'decks/updateDeck',
    async function (_, { rejectWithValue, getState }) {
        try {
            const state = getState() as RootState
            const path = URL + Paths.UPDATE_DECK

            if (!state.decks.currentDeck) {
                throw new Error('Deck Updating Error')
            }

            const response = await fetch(path, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(state.decks.currentDeck)
            })

            if (response.status !== 200) {
                throw new Error('Deck Updating Error')
            }

            toast('Изменения сохранены')
        } catch (e: any) {
            return rejectWithValue(e.message)
        }
    }
)

const decksSlice = createSlice({
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
                newDeck.sideboard = cardsList.filter((c: ICard) => c.id !== cardId)
            } else {
                newDeck.main = cardsList.filter((c: ICard) => c.id !== cardId)
            }

            state.currentDeck = newDeck
        },
        addCard: (state, action: PayloadAction<{ card: ICard }>) => {
            if (!state.currentDeck) return
            const { card } = action.payload

            let newDeck: IDeck = JSON.parse(JSON.stringify(state.currentDeck));
            const isInDeck = newDeck.main.find((c: ICard) => c.id === card.id)
            const isInSideDeck = newDeck.sideboard.find((c: ICard) => c.id === card.id)

            if (isInSideDeck && isInDeck) {
                return
            }

            if (isInDeck) {
                newDeck.sideboard
                    .push({ ...card, amount: 1 })
                newDeck.sideboard = newDeck.sideboard.sort((a: IDeckCard, b: IDeckCard) => a.price - b.price)
            } else {
                newDeck.main.push({ ...card, amount: 1 })
                newDeck.main = newDeck.main.sort((a: IDeckCard, b: IDeckCard) => a.price - b.price)
            }

            state.currentDeck = newDeck
        },
        setCurrentDeck: (state, action: PayloadAction<{ deck: IDeck | null }>) => {
            state.currentDeck = action.payload.deck
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getDecks.pending, (state) => {
                state.getDecksStatus = APIStatus.Pending;
            })
            .addCase(getDecks.fulfilled, (state, action) => {
                state.getDecksStatus = APIStatus.Fulfilled;
                state.decks = action.payload
            })
            .addCase(getDecks.rejected, (state, action) => {
                state.getDecksStatus = APIStatus.Rejected;
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
export default decksSlice
