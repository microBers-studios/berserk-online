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
    const [isUserLoading, setIsUserLoading] = useState(true)

    const defaultValue = useMemo(() => {
        return {
            user,
            setUser,
            isUserLoading,
            setIsUserLoading
        }
    }, [user, isUserLoading])

    return (
        <UserContext.Provider value={defaultValue}>
            {children}
        </UserContext.Provider>
    );
}
