import { ComponentType } from 'react'
import { HelmetProvider } from 'react-helmet-async'

export const withHelmet = (Component: ComponentType) => {
    return () => (
        <HelmetProvider>
            <Component />
        </HelmetProvider>
    )
}
