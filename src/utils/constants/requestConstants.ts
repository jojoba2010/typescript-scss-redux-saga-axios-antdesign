import { IListState } from '@typings/requestPayloads'
import { STATUS } from '@features/General'

export const listInitialState: IListState = {
    status: STATUS.IDLE,
    data: [],
    pagination: {
        skip: 0,
        hasTotal: true,
        total: 0,
        limit: 10
    },
    errors: null
}