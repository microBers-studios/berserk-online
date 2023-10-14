export interface UserContextProps {
    user: IUser;
    setUser: (user: IUser) => void
}

export interface IUser {
    id: number;
    avatarUrl: string | null;
    email: string;
    name: string;
}