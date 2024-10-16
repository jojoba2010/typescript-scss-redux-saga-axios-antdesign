export const BREAKPOINTS = {
    XS: 480,
    SM: 576,
    MD: 768,
    LG: 992,
    XL: 1200,
    XXL: 1600
}

export const STATUS = {
    IDLE: 'idle',
    RUNNING: 'running',
    READY: 'ready',
    ERROR: 'error'
}

export enum LOCALSTORAGE_KEYS {
    TOKEN = 'token'
}

export const csvDownloadOptions = (filename, excelTitle = '') => ({
    filename,
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: !!excelTitle,
    title: excelTitle || '',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true
})