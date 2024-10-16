export * from './dataList'
export * from './getDataIncludesSearch'

export const getLabelKeyPair = data =>
    data?.map(item => ({
        label: item,
        value: item
    }))
export const makeid = (length: number) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
        counter += 1
    }
    return result
}
export const sortOrder = (listSort, key) => (listSort === `-${key}` ? 'descend' : listSort === key ? 'ascend' : false)

export const getPlacementDirection = (placement, appDirection) => {
    let tooltipPlacement = placement
    if (appDirection === 'rtl') {
        if (placement === 'left') {
            tooltipPlacement = 'right'
        } else if (placement === 'right') {
            tooltipPlacement = 'left'
        } else if (placement === 'topLeft') {
            tooltipPlacement = 'topRight'
        } else if (placement === 'topRight') {
            tooltipPlacement = 'topLeft'
        } else if (placement === 'bottomLeft') {
            tooltipPlacement = 'bottomRight'
        } else if (placement === 'bottomRight') {
            tooltipPlacement = 'bottomLeft'
        }
    }
    return tooltipPlacement
}

export const openLink = (e, link, target = 'blank') => {
    e.stopPropagation()
    e.preventDefault()
    if (target === 'blank') window.open(link, '_blank', 'noreferrer')
    else window.open(link, target).focus()
}

export const getLocationSearch = () => {
    return window.location.search
        .replace('?', '')
        .split('&')
        .map(item => {
            const keyValue = item.split('=')
            return {
                key: keyValue[0],
                value: keyValue[1]
            }
        })
}
export const getCharacterColor = (str, index = 0) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const h = (30 + (Math.abs(hash) % 100) / (100 / 30)) / 100
    // return 'hsl(' + h + ', 30%, 80%)'
    if (index % 4 === 0) {
        return `linear-gradient(45deg, rgba(255, 104, 26, 1), rgba(255, 104, 26, ${h}))`
    }
    if (index % 4 === 1) {
        return `linear-gradient(45deg, rgba(61, 6, 116, 1), rgba(61, 6, 116, ${h}))`
    }
    if (index % 4 === 2) {
        return `linear-gradient(45deg, rgba(50, 50, 51, 1), rgba(255, 104, 26, ${h}))`
    }
    if (index % 4 === 3) {
        return `linear-gradient(45deg, rgba(114, 69, 203, 1), rgba(114, 69, 203, ${h}))`
    }
}

export const getAvatarCharacters = title => {
    let result = title?.substring(0, 2)
    const modifier = title?.split(' ')
    if (modifier?.length > 1) {
        result = modifier[0][0] || ''
        result += modifier[1][0] || ''
    }
    return result.toUpperCase()
}