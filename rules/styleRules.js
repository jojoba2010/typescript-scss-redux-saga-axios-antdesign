const cssLoader = modules => ({
    loader: 'css-loader',
    options: {
        modules:  {
                  mode: 'local',
                  localIdentName: '[local]--[contenthash:base64:8]'
              }
    }
})

const sassLoader = {
    loader: 'sass-loader',
    options: {
        // `dart-sass` Is the first choice
        implementation: require('sass'),
        //additionalData: `@import "${os.platform() === 'win32' ? '~src/styles' : resolve('src/styles')}";`,
        // sassOptions: {
        //     includePaths: [require('bourbon').includePaths[0]]
        // }
    }
}

const lessLoader = {
    loader: 'less-loader',
    options: {
        lessOptions: {
            javascriptEnabled: true
        }
    }
}

const baseLoaders = modules => [
    'style-loader',
    cssLoader(modules),
    'postcss-loader'
]

module.exports = [
    {
        test: /\.css$/,
        //include: [resolve('node_modules')],
        use: baseLoaders(false)
    },
    {
        test: /\.scss$/,
        //include: [resolve('src'), resolve('node_modules')],
        use: [...baseLoaders(true), sassLoader]
    },
    {
        // for ant design
        test: /\.less$/,
        // less do not use threadLoader
        // https://github.com/webpack-contrib/thread-loader/issues/10
        use: [...baseLoaders(false), lessLoader]
    }
]
