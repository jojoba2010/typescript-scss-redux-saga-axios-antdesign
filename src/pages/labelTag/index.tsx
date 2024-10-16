import React, { useEffect } from 'react'
import {  useSelector } from 'react-redux'
import { RootState } from '@store/store'
// import { rootActions } from '@app-store/slices'
// import { $inQuerySearch } from '@utils/helpers/queryHelpers'
import Main from './main'
const LabelTag = () => {
    // const dispatch = useDispatch()
    const { data: tagList } = useSelector((state: RootState) => state.labelTag.list)

    useEffect(() => {
        Main()
        // const data = {
        //     startAt: 0,
        //     maxResults: 10,
        //     jql: 'creator=user1 ORDER BY created DESC'
        // }
        // dispatch(
        //     rootActions.labelTag.list.onRequest({
        //         data
        //         //query: $inQuerySearch('type', ['Directory', 'Company', 'Generic', 'Contact'], false)
        //     })
        // )
        //rootActions[modelName][actionName].onRequest
        /*
              const data = {
                name: 'name',
                textColor: '#ff681a',
                backgroundColor: '#ff681a30',
                type: 'type'
            }
              dispatch( rootActions.labelTag.create.onRequest({
                    data,
                    sagaCB: {
                        onSuccess: response => {
                            console.log(response)
                        }
                    }
                })
            )*/
        //remove
        /*dispatch(
            rootActions[modelName][actionName].onRequest({
                id: newRecord._id || newRecord.id,
                data: { badges },
                sagaCB: {
                    onSuccess: response => {
                        updateRecordBadge(response.badges)
                    }
                }
            })
        )*/

        //edit
        /*dispatch(
            rootActions.labelTag.edit.onRequest({
                id: tag._id,
                data: { ...tag, _id: undefined },
                sagaCB: {
                    onSuccess: () => {
                        setEditKey('')
                    }
                }
            })
        )*/
    }, [])
    return (
        <div>
            Hi
            <div>{tagList?.issues?.map(issue => <div key={issue.id}>{issue.fields.summary}</div>)}</div>
        </div>
    )
}
export default LabelTag
