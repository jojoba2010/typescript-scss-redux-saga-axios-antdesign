const { resolve } = require('../utils')

module.exports = [
    {
        test: /\.tsx?$/, // Use ts-loader for .ts and .tsx files
        use: 'ts-loader',
        exclude: /node_modules/,
        include: [resolve('src')]
    }
]
