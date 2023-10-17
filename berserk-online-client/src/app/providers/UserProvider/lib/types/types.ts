export interface UserContextProps {
    user: IUser;
    setUser: (user: IUser) => void
}

export interface IUser {
    id: number;
    avatarUrl: string;
    email: string;
    name: string;
}