import { useEffect } from 'react'

export default function useStopPropagarionClickPopup(containerId) {
    useEffect(() => {
        document
            .getElementById(containerId)
            .getElementsByClassName('rc-virtual-list-holder-inner')?.[0]
            ?.addEventListener('click', event => {
                event.stopPropagation()
            })
    }, [containerId])
}
