// index.js
Page({
  data: {
    stockData: []
  },

  onLoad() {
    // 获取全局应用实例
    const app = getApp()
    
    // 注册全局事件监听
    app.registerGlobalEvent(this, 'stockDataUpdated', () => {
      this.updateStockData(app);
    });

    // 初始加载数据
    this.updateStockData(app);
  },

  updateStockData(app) {
    if (app.globalData.stockData.length > 0) {
      this.setData({
        stockData: app.globalData.stockData
      });
      console.log('页面股票数据已更新');
    }
  },

  onUnload() {
    // 移除事件监听（可选，小程序会自动清理）
    this.onGlobalEvent = null;
  }
})