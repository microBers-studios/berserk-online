interface GraveCellProps {
    className?: string
}

export const GraveCell = ({ className }: GraveCellProps) => {
    return (
        <div className={className} title="Кладбище">
            Кладбище
        </div>
    )
}
