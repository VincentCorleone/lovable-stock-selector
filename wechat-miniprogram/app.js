// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 加载WASM模块
    this.loadWasmModule()
  },
  globalData: {
    stockData: [],
    wasmModule: null
  },
  loadWasmModule() {
    // 尝试使用微信小程序文件系统加载WASM模块
    // 使用相对路径加载WASM模块
    const wasmPath = '/utils/main.wasm.br';
    console.log('尝试加载WASM模块:', wasmPath)
    
    // 使用新的API获取系统信息，替换已弃用的wx.getSystemInfoSync
    try {
      // 尝试使用新的API获取基础库版本
      const appBaseInfo = wx.getAppBaseInfo();
      console.log('当前基础库版本:', appBaseInfo.SDKVersion);
    } catch (e) {
      // 降级使用旧API
      try {
        const systemInfo = wx.getSystemInfoSync();
        console.log('当前基础库版本(兼容模式):', systemInfo.SDKVersion);
      } catch (e2) {
        console.error('获取系统信息失败:', e2);
      }
    }

    // 检查文件是否存在
    const fs = wx.getFileSystemManager();
    try {
      const fileInfo = fs.statSync(wasmPath)
      console.log('WASM文件信息:')
      console.log('  路径:', wasmPath)
      console.log('  大小:', fileInfo.size, 'bytes')
      console.log('  最后修改时间:', new Date(fileInfo.lastModifiedTime * 1000).toLocaleString())
      console.log('  文件类型:', wasmPath.endsWith('.br') ? 'br压缩格式' : '普通wasm格式')

      // 直接使用文件路径实例化WASM模块
      try {
        console.log('开始实例化WASM模块，路径:', wasmPath);
        console.log('文件类型检查:', wasmPath.endsWith('.wasm') || wasmPath.endsWith('.wasm.br') ? '有效' : '无效');

        WXWebAssembly.instantiate(wasmPath, {
          env: {
            memoryBase: 0,
            tableBase: 0,
            memory: new WXWebAssembly.Memory({ initial: 256 }),
            table: new WXWebAssembly.Table({ initial: 0, element: 'anyfunc' })
          },
          // 添加spectest模块以满足WASM模块的导入需求
          spectest: {
            print_char: function(charCode) {
              // 实现print_char函数，将字符码转换为字符并输出到控制台
              console.log(String.fromCharCode(charCode));
            }
          }
          
        }).then(result => {
          this.globalData.wasmModule = result.instance.exports;
          console.log('WASM模块加载成功 (instantiate with path)');
          console.log('WASM导出函数:', Object.keys(result.instance.exports));
          this.fetchStockData();
        }).catch(e => {
          console.error('WASM模块实例化失败:', e);
          console.error('错误堆栈:', e.stack);
          // 检查是否是路径问题导致的错误
          if (e.message.includes('only support file type')) {
            console.error('错误分析: 可能是文件路径或类型问题，请检查文件扩展名和路径格式');
          }
          this.loadWasmModuleFallback();
        });
      } catch (e) {
        console.error('调用WASM API失败:', e);
        this.loadWasmModuleFallback();
      }
    } catch (e) {
      console.error('WASM文件不存在或无法访问:', e);
      this.loadWasmModuleFallback();
    }
  },

  // 降级加载方式
  // 使用原始.wasm文件进行加载
  loadWasmModuleFallback() {
    console.log('进入降级加载模式，尝试使用原始.wasm文件')
    const wasmPath = '/utils/main.wasm';
    
    try {
          const fs = wx.getFileSystemManager();
          const fileInfo = fs.statSync(wasmPath);
          console.log('WASM文件信息(降级模式):');
          console.log('  路径:', wasmPath);
          console.log('  大小:', fileInfo.size, 'bytes');
          console.log('  最后修改时间:', new Date(fileInfo.lastModifiedTime * 1000).toLocaleString());
          
          // 直接使用文件路径实例化WASM模块(降级模式)
          try {
            console.log('开始实例化WASM模块(降级模式)，路径:', wasmPath);
            console.log('文件类型检查(降级模式):', wasmPath.endsWith('.wasm') || wasmPath.endsWith('.wasm.br') ? '有效' : '无效');

            WXWebAssembly.instantiate(wasmPath, {
              env: {
                memoryBase: 0,
                tableBase: 0,
                memory: new WXWebAssembly.Memory({ initial: 256 }),
                table: new WXWebAssembly.Table({ initial: 0, element: 'anyfunc' })
              },
              // 添加spectest模块以满足WASM模块的导入需求
              spectest: {
                  print_char: function(charCode) {
                    // 实现print_char函数，将字符码转换为字符并输出到控制台
                    console.log(String.fromCharCode(charCode));
                  }
                }
              

            }).then(result => {
              this.globalData.wasmModule = result.instance.exports;
              console.log('WASM模块加载成功 (降级模式)');
              console.log('WASM导出函数:', Object.keys(result.instance.exports));
              this.fetchStockData();
            }).catch(e => {
              console.error('WASM模块实例化失败(降级模式):', e);
              console.error('错误堆栈:', e.stack);
              // 检查是否是路径问题导致的错误
              if (e.message.includes('only support file type')) {
                console.error('错误分析(降级模式): 可能是文件路径或类型问题，请检查文件扩展名和路径格式');
              }
            });
          } catch (e) {
            console.error('调用WASM API失败(降级模式):', e);
          }
        } catch (e) {
          console.error('WASM文件不存在或无法访问(降级模式):', e);
        }
  },
  fetchStockData() {
    // 从服务端API获取股票数据
    wx.request({
      url: 'http://localhost:3000/api/stock-ranking',
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          this.globalData.stockData = res.data.data;
          console.log('股票数据获取成功:', this.globalData.stockData);
          // 触发一个全局事件，通知页面数据已更新
          this.globalData.stockDataUpdated = true;
          this.triggerEvent('stockDataUpdated');
        } else {
          console.error('获取股票数据失败:', res.data.message);
          // 使用模拟数据作为备用
          this.useMockStockData();
        }
      },
      fail: (err) => {
        console.error('请求股票数据接口失败:', err);
        // 使用模拟数据作为备用
        this.useMockStockData();
      }
    });
  },
  
  // 使用模拟数据作为备用
  useMockStockData() {
    console.log('使用模拟数据作为备用');
    const mockData = [
      { id: 1, name: '贵州茅台', code: '600519', dividend: 15.8 },
      { id: 2, name: '工商银行', code: '601398', dividend: 7.2 },
      { id: 3, name: '中国平安', code: '601318', dividend: 6.5 },
      { id: 4, name: '建设银行', code: '601939', dividend: 6.2 },
      { id: 5, name: '农业银行', code: '601288', dividend: 5.8 },
      { id: 6, name: '中国银行', code: '601988', dividend: 5.5 },
      { id: 7, name: '招商银行', code: '600036', dividend: 5.2 },
      { id: 8, name: '交通银行', code: '601328', dividend: 5.0 },
      { id: 9, name: '中国石化', code: '600028', dividend: 4.8 },
      { id: 10, name: '中国联通', code: '600050', dividend: 4.5 }
    ];
    this.globalData.stockData = mockData;
    this.globalData.stockDataUpdated = true;
    this.triggerEvent('stockDataUpdated');
  },
  
  // 触发全局事件
  triggerEvent(eventName) {
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      currentPage.onGlobalEvent && currentPage.onGlobalEvent(eventName);
    }
  },
  
  // 页面注册全局事件监听
  registerGlobalEvent(page, eventName, callback) {
    page.onGlobalEvent = function(e) {
      if (e === eventName) {
        callback();
      }
    };
  }
})