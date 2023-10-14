export interface IRegistration {
    name: string;
    email: string;
    password: string;
}

export interface IResponseCode {
    code: number;
    text: string;
}

export interface ILogin {
    email: string;
    password: string;
    rememberMe: boolean;
}