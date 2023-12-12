type UserType = {
    id: number
    avatarUrl: string
    email: string
    name: string
    password: string
}

type ErrorType = {
    id: number
    message: string
    context?: {
        email?: string
    }
}
