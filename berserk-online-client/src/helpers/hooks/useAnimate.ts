import { useState } from "react"

export function useAnimate(): IAnimator {
    const [isAnimation, setIsAnimation] = useState<boolean>(false)
    const [isOpenAnimation, setIsOpenAnimation] = useState<boolean>(true)
    const [isCloseAnimation, setIsCloseAnimation] = useState<boolean>(false)

    return {
        isAnimation,
        setIsAnimation,
        isOpenAnimation,
        setIsOpenAnimation,
        isCloseAnimation,
        setIsCloseAnimation
    }
}


export interface IAnimator {
    isAnimation: boolean
    isOpenAnimation: boolean
    isCloseAnimation: boolean
    setIsAnimation: (b: boolean) => void
    setIsOpenAnimation: (b: boolean) => void
    setIsCloseAnimation: (b: boolean) => void
}