interface NotificationComponentProps {
    title: string
    path?: string
    onClick: () => void
}

export const NotificationComponent = ({
    title,
    onClick,
}: NotificationComponentProps) => <div {...onClick}>{title}</div>
