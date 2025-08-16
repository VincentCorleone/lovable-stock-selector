const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');
const db = require('./database');
const { fetchStockData, rankStocksByDividend } = require('./stockService');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 设置跨域隔离响应头以支持SharedArrayBuffer
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// 初始化数据库
db.init((err) => {
  if (!err) {
    // 数据库初始化成功，抓取并更新股票数据
    updateStockRanking();
  } else {
    console.error('数据库初始化失败，无法更新股票排名');
  }
});

// 设置定时任务，每天凌晨2点执行
const job = schedule.scheduleJob('0 2 * * *', () => {
  console.log('执行定时任务：更新股票排名');
  updateStockRanking();
});

// 更新股票排名的函数
async function updateStockRanking() {
  try {
    // 抓取股票数据
    const stocks = await fetchStockData();
    if (!stocks || stocks.length === 0) {
      console.error('未获取到股票数据');
      return;
    }

    // 按股息率排名
    const rankedStocks = rankStocksByDividend(stocks);

    // 保存前10名到数据库
    await db.saveTopStocks(rankedStocks.slice(0, 10));

    console.log('股票排名更新成功');
  } catch (error) {
    console.error('更新股票排名失败:', error);
  }
}

// API接口：获取高股息股票排名
app.get('/api/stock-ranking', async (req, res) => {
  try {
    const stocks = await db.getTopStocks();
    res.json({
      success: true,
      data: stocks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取股票排名失败',
      error: error.message
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 导出app用于测试
module.exports = app;