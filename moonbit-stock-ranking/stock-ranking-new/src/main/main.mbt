// 股票数据排序程序

// 定义股票元组类型别名
typealias (Int, String, String, Double) as Stock

// 按股息率从高到低排序股票
pub fn sort_stocks(stocks: Array[Stock]) -> Array[Stock] {
  let n = Array::length(stocks);
  let result = stocks;
  let mut i = 0;
  while i < n-1 {
    let mut j = 0;
    let j_max = n - i - 1;
    while j < j_max {
      // 获取股息率进行比较
      let dividend_j = result[j].3;
      let dividend_j1 = result[j+1].3;
      if dividend_j < dividend_j1 {
        // 交换元素
        let temp = result[j];
        result[j] = result[j+1];
        result[j+1] = temp;
      }
      j = j + 1;
    }
    i = i + 1;
  }
  return result;
}

// 主函数
fn main {
  // 定义测试数据
  let stocks: Array[Stock] = [
    (1, "贵州茅台", "600519", 15.8),
    (2, "工商银行", "601398", 7.2),
    (3, "中国平安", "601318", 6.5),
    (4, "建设银行", "601939", 6.2),
    (5, "农业银行", "601288", 5.8)
  ];

  // 调用排序函数
  let sorted_stocks: Array[Stock] = sort_stocks(stocks);

  // 打印结果
  println("排序后的股票列表:");
  for stock in sorted_stocks {
    println(stock.1 + " (" + stock.2 + "): " + stock.3.to_string() + "%");
  }
}
