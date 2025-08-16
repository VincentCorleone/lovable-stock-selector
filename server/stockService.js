const axios = require('axios');

// 模拟股票数据抓取（实际应用中需要替换为真实的数据源）
async function fetchStockData() {
  try {
    // 在实际应用中，这里应该调用真实的股票数据API
    // 例如: const response = await axios.get('https://api.example.com/stocks');
    // 这里我们模拟返回一些测试数据
    return [
      { name: '贵州茅台', code: '600519', dividendRate: 15.8, price: 1800 },
      { name: '工商银行', code: '601398', dividendRate: 7.2, price: 5.5 },
      { name: '中国平安', code: '601318', dividendRate: 6.5, price: 50 },
      { name: '建设银行', code: '601939', dividendRate: 6.2, price: 6.3 },
      { name: '农业银行', code: '601288', dividendRate: 5.8, price: 3.2 },
      { name: '中国银行', code: '601988', dividendRate: 5.5, price: 3.8 },
      { name: '招商银行', code: '600036', dividendRate: 5.2, price: 35 },
      { name: '交通银行', code: '601328', dividendRate: 5.0, price: 4.5 },
      { name: '中国石化', code: '600028', dividendRate: 4.8, price: 4.2 },
      { name: '中国联通', code: '600050', dividendRate: 4.5, price: 3.6 },
      { name: '中国石油', code: '601857', dividendRate: 4.2, price: 5.8 },
      { name: '中国神华', code: '601088', dividendRate: 4.0, price: 28 }
    ];

    // 实际抓取代码示例（注释）:
    // const response = await axios.get('https://api.example.com/stocks', {
    //   headers: {
    //     'Authorization': 'Bearer YOUR_API_KEY',
    //     'Content-Type': 'application/json'
    //   }
    // });
    // return response.data.stocks;
  } catch (error) {
    console.error('抓取股票数据失败:', error);
    throw error;
  }
}

// 按股息率排名股票
function rankStocksByDividend(stocks) {
  // 按股息率从高到低排序
  return stocks.sort((a, b) => b.dividendRate - a.dividendRate);
}

module.exports = {
  fetchStockData,
  rankStocksByDividend
};