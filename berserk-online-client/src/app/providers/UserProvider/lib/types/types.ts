export interface UserContextProps {
    user: IUser;
    setUser: (user: IUser) => void;
    isUserLoading: boolean;
    setIsUserLoading: (b: boolean, significant?: boolean) => void;
    isSignificant: boolean;
    setIsSignificant: (b: boolean) => void;
}

export interface IUser {
    id: number;
    avatarUrl: string;
    email: string;
    name: string;
}