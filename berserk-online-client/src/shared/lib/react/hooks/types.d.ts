interface IAnimator {
    isAnimation: boolean
    isOpenAnimation: boolean
    isCloseAnimation: boolean
    setIsAnimation: (b: boolean) => void
    setIsOpenAnimation: (b: boolean) => void
    setIsCloseAnimation: (b: boolean) => void
}
