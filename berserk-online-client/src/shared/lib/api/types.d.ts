interface IError {
    id: number
    message: string
    context?: {
        email?: string
    }
}
