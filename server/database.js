const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径
const dbPath = path.resolve(__dirname, 'stock_ranking.db');

// 初始化数据库
function init(callback) {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('连接数据库失败:', err.message);
      if (callback) callback(err);
    } else {
      console.log('成功连接到SQLite数据库');
      // 创建表
      createTables(db, (err) => {
        if (callback) callback(err);
      });
    }
  });
}

// 创建表
function createTables(db, callback) {
  // 创建股票排名表
  db.run(`
    CREATE TABLE IF NOT EXISTS stock_ranking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rank INTEGER NOT NULL,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      dividend_rate REAL NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('创建表失败:', err.message);
      callback(err);
    } else {
      console.log('表创建成功或已存在');
      callback(null);
    }
  });
}

// 保存前10名股票到数据库
async function saveTopStocks(stocks) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    // 先清空表
    db.run('DELETE FROM stock_ranking', (err) => {
      if (err) {
        console.error('清空表失败:', err.message);
        reject(err);
        return;
      }

      // 插入新数据
      const stmt = db.prepare(`
        INSERT INTO stock_ranking (rank, name, code, dividend_rate)
        VALUES (?, ?, ?, ?)
      `);

      stocks.forEach((stock, index) => {
        stmt.run(index + 1, stock.name, stock.code, stock.dividendRate);
      });

      stmt.finalize((err) => {
        if (err) {
          console.error('插入数据失败:', err.message);
          reject(err);
        } else {
          console.log('数据插入成功');
          resolve();
        }
      });

      db.close();
    });
  });
}

// 从数据库获取前10名股票
async function getTopStocks() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    db.all('SELECT * FROM stock_ranking ORDER BY rank ASC', (err, rows) => {
      if (err) {
        console.error('查询数据失败:', err.message);
        reject(err);
      } else {
        // 格式化数据，确保字段名称与前端期望一致
        const stocks = rows.map(row => ({
          id: row.id,
          name: row.name,
          code: row.code,
          dividend: row.dividend_rate,
          rank: row.rank
        }));
        resolve(stocks);
      }
    });

    db.close();
  });
}

module.exports = {
  init,
  saveTopStocks,
  getTopStocks
};