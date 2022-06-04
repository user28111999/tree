const { merge } = require("webpack-merge")
const commonConfiguration = require("./webpack.common.js")

module.exports = merge(
    commonConfiguration, {
        mode: "development",
        devServer: {
            host: "local-ip",
            port: 8080,
            open: true,
            https: false,
            allowedHosts: "all",
            static: {
                directory: "../dist",
                watch: true
            },
            client: {
                overlay: {
                    warnings: true,
                    errors: true
                },
                overlay: true
            }
        }
    }
)
