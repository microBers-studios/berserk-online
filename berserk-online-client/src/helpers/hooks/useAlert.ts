import { useContext } from 'react';
import { AlertContext } from 'src/app/providers/AlertProvider';
import { AlertContextProps } from 'src/app/providers/AlertProvider/lib/AlertContext';

export const useAlert = () => {
    const { setAlert }: AlertContextProps = useContext(AlertContext) ?? (function () { throw new Error('Alert Error') })()

    return setAlert
}