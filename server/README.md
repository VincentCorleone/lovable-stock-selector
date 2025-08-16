# 高股息股票排名服务端

这个服务端程序用于抓取股票数据，计算高股息股票排名，并向前端提供API接口。

## 功能特点
- 每天定时抓取股票数据
- 计算高股息股票排名
- 提供API接口供前端获取排名数据
- 使用SQLite数据库存储排名结果

## 技术栈
- Node.js
- Express
- SQLite
- node-schedule（定时任务）
- axios（HTTP请求）

## 安装说明

1. 确保已安装Node.js（推荐v14+）

2. 克隆或下载此项目

3. 进入项目目录
```bash
cd /Users/gxc/Codes/profit-share/server
```

4. 安装依赖
```bash
npm install
```

## 运行说明

### 开发环境
```bash
npm run dev
```

### 生产环境
```bash
npm start
```

服务器将运行在 http://localhost:3000

## API接口

### 获取高股息股票排名
- URL: /api/stock-ranking
- 方法: GET
- 返回示例:
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "name": "贵州茅台",
      "code": "600519",
      "dividendRate": 15.8
    },
    // 更多股票数据...
  ]
}
```

## 定时任务
- 每天凌晨2点自动抓取并更新股票数据
- 可在index.js中修改定时任务时间

## 注意事项
1. 本项目使用模拟数据，实际应用中需要替换为真实的股票数据API
2. 确保在微信小程序中正确配置服务器地址
3. 如需部署到生产环境，建议使用PM2等进程管理工具

## 联系方式
如有问题，请联系开发者