import { IDeck } from 'src/app/store/utils/types'
import { v4 } from 'uuid'

export const createDeck = (name: string): IDeck => ({
    id: v4(),
    name,
    elements: [],
    main: [],
})
