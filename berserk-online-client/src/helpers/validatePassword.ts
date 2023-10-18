export const validatePassword = (password: string): boolean => {
    let flag = true
    const alph = 'abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('')
    const digits = '1234567890'.split('')
    const symbols = '!@#$%^&*()_+-=`~/?<>:"{}|,.;\'\\]['.split('')

    alph.forEach(s => {
        flag = password.includes(s)
    })

    digits.forEach(s => {
        flag = flag && password.includes(s)
    })

    symbols.forEach(s => {
        flag = flag && password.includes(s)
    })

    return flag && password.length > 7
}