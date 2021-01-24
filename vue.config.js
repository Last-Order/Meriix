const path = require('path');
module.exports = {
    devServer: {
        host: 'localhost',
        disableHostCheck: true
    },
    transpileDependencies: [

    ],
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', path.resolve('src'))
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            chainWebpackMainProcess: config => {
                // Chain webpack config for electron main process only
                config.mode('development');
            },
            externals: ['iconv-lite', 'music-metadata'],
            builderOptions: {
                appId: 'moe.sound.sora.meriix',
                artifactName: "meriix-${os}-${version}.${ext}",
                productName: 'Meriix',
                win: {
                    target: ['nsis'],
                    icon: 'build/icons/icon.ico',
                },
                nsis: {
                    oneClick: false,
                    allowToChangeInstallationDirectory: true
                },
                extraResources: [
                    {
                        "from": "./lib/",
                        "to": "lib",
                        "filter": [
                            "**/*"
                        ]
                    }
                ]
            }
        }
    }
}