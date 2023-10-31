export interface UserContextProps {
    user: IUser;
    setUser: (user: IUser) => void;
    isUserLoading: boolean;
    setIsUserLoading: (b: boolean) => void;
}

export interface IUser {
    id: number;
    avatarUrl: string;
    email: string;
    name: string;
}