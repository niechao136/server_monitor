module.exports = {
    // 所有的資源都會被鏈接為相對路徑
    publicPath: '/',

    // 把包後的資料夾名稱
    outputDir: 'dist',

    // 打包後如果不需要 source map，可以將其設置為 false 以加速打包環境構建
    isOutputSourceMap: false,

    pages: {
        title: 'WISE-iService'
    },

    devServer: {
        open: false, // 啟動server後是否自動打開瀏覽器，true-每次啟動都會打開新的
        host: '0.0.0.0', // 允許外部ip訪問
        port: 8080, // 埠號
        https: false, // 是否啟用https
    },

    configureWebpack: {},
};
