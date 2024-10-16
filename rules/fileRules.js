const { resolve } = require('../utils')

module.exports = [
    {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
    },
    {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
        include: [resolve('src'), resolve('node_modules')]
    },
    {
        test: /\.svg$/,
        type: 'asset/resource',
        include: [resolve('src')]
    }
]
