import { Context, useContext } from "react";

export const useRequiredContext = <T>(ctx: Context<T | null>): T =>
    useContext(ctx) ?? throwError('Context error')

function throwError(str: string): never {
    throw new Error(str)
}
