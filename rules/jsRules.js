const { resolve } = require('../utils')

module.exports = [
    {
        test: /\.tsx?$/, // Use ts-loader for .ts and .tsx files
        use: 'ts-loader',
        exclude: /node_modules/,
        include: [resolve('src')]
    },
    /* {
         test: /\.(j|t)sx?$/,
         include: [resolve('src')],
         exclude: /node_modules/,
         use: [
             {
                 loader: 'babel-loader',
                 options: {
                     babelrc: false,
                     presets: [
                         [
                             '@babel/preset-env',
                             // https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/plugins.json#L32
                             { targets: { browsers: ['chrome >= 47'] }, useBuiltIns: 'usage', corejs: 3 }
                         ],
                         '@babel/preset-typescript',
                         '@babel/preset-react'
                     ],
                     plugins: [
                         ['@babel/plugin-proposal-decorators', { legacy: true }],
                         ['@babel/plugin-proposal-class-properties', { loose: true }],
                         ['@babel/plugin-proposal-private-methods', { loose: true }],
                         '@babel/plugin-syntax-dynamic-import',
                         'lodash'
                     ]
                 }
             }
         ]
     }*/
]
