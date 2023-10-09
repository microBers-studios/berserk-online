import { useState } from 'react'

export const useAlert = (str: string) => {
    const [alert, setAlert] = useState<string>(str)

    return [alert, setAlert]
}