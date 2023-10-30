type CookiedFunction = <T>(callback: (...args: any) => Promise<T>, args?: any[]) => Promise<null | T>

export const useCookie = (): CookiedFunction => {

    return async <T>(callback: (...args: any) => Promise<T>, args?: any[]): Promise<null | T> => {

        if (!localStorage.getItem('cookie')) {
            return null
        } else {
            return args === undefined
                ? await callback()
                : await callback(...args)
        }
    }
}