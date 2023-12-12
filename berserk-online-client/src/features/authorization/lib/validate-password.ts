export const validatePassword = (password: string): boolean => {
    let flag = true
    const alph =
        'abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('')
    const digits = '1234567890'.split('')
    const symbols = '!@#$%^&*()_+-=`~/?<>:"{}|,.;\'\\]['.split('')

    flag = checkEntry(alph, password)
    flag = checkEntry(digits, password)
    flag = checkEntry(symbols, password)

    return flag && password.length > 7
}

function checkEntry(symbols: string[], str: string) {
    let flag = false

    symbols.forEach((s) => {
        flag = flag ? flag : str.includes(s)
    })

    return flag
}
