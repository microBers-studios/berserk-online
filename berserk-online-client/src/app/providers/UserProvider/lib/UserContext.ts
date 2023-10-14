import { createContext } from 'react'
import { UserContextProps } from './types/types'

export const UserContext = createContext<UserContextProps | null>(null)