import { IUser } from "src/app/providers/UserProvider/lib/types/types";

export interface IRegistration {
    name: string;
    email: string;
    password: string;
}

export interface ILogin {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface IResponseInfo {
    code: number;
    obj: IUser | IError;
}

export interface IError {
    id: number;
    message: string;
}