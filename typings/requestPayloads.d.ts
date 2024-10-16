import { Action } from 'redux'

export type PaginationType = {
    hasTotal?: boolean
    skip?: number
    total?: number
    limit?: number
}

export interface ISagaCb {
    sagaCB?: {
        onSuccess?: (payload?: any) => void
        onError?: (error?: any) => void
        successMessage?: string
    }
}

export interface IListState {
    status: string
    data: any
    pagination?: PaginationType
    errors: any
}

export interface IListQueryPaginationPayload extends ISagaCb {
    pagination?: PaginationType
}

export interface ListTaskAction extends Action {
    payload: IListQueryPaginationPayload
}