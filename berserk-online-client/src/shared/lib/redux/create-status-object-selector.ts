import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'src/app/store'
import { APIStatus } from 'src/shared/lib/api/const'

export const createStatusObjectSelector = (
    getStatusSelector: (state: RootState) => APIStatus
) =>
    createSelector([getStatusSelector], (state) => ({
        isIdle: APIStatus.Idle === state,
        isPending: APIStatus.Pending === state,
        isUncompleted: APIStatus.Idle === state || APIStatus.Pending === state,
        isFulfilled: APIStatus.Fulfilled === state,
        isRejected: APIStatus.Rejected === state,
    }))
