import { useEffect, useState } from 'react'
import {
    SCREEN_LG,
    SCREEN_MD,
    SCREEN_SM,
    SCREEN_XL,
    SCREEN_XXL,
} from '../const'

export const useResize = () => {
    const [width, setWidth] = useState(window.innerWidth)

    const handleResize = (e: UIEvent) => {
        const w = e.target as Window
        setWidth(w.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return {
        width,
        isScreenSm: width >= SCREEN_SM,
        isScreenMd: width >= SCREEN_MD,
        isScreenLg: width >= SCREEN_LG,
        isScreenXl: width >= SCREEN_XL,
        isScreenXxl: width >= SCREEN_XXL,
    }
}
