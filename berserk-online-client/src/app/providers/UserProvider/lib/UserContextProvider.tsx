import { useState, useMemo, ReactNode } from 'react'
import { UserContext } from "./UserContext";
import { IUser } from './types/types';
import defaultAvatar from "src/shared/assets/images/default-avatar.jpg"

export const defaultUser = {
    id: -1,
    email: '',
    name: '',
    avatarUrl: defaultAvatar,
}

interface UserContextProviderProps {
    children: ReactNode
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [user, setUser] = useState<IUser>(defaultUser)

    const defaultValue = useMemo(() => {
        return {
            user,
            setUser: (u: IUser) => setUser(u)
        }
    }, [user])

    return (
        <UserContext.Provider value={defaultValue}>
            {children}
        </UserContext.Provider>
    );
}
