export function generateColor(): string {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)

    if (r < 128 || g < 128 || b < 128) {
        return generateColor()
    }
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
}
