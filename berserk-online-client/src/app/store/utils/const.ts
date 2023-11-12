import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "..";

export enum APIStatus {
    Idle = 'idle',
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected'
}

export const createStatusObjectSelector = (getStatusSelector: (state: RootState) => APIStatus) => createSelector(
    [getStatusSelector],
    (state) => ({
        isIdle: APIStatus.Idle === state,
        isPending: APIStatus.Pending === state,
        isUncompleted: APIStatus.Idle === state || APIStatus.Pending === state,
        isFulfilled: APIStatus.Fulfilled === state,
        isRejected: APIStatus.Rejected === state,
    })
)