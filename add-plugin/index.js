class AddPlugin {
  constructor() {
    this.name = '加法插件';
    this.description = '执行加法运算';
  }

  async initialize(config) {
    console.log('加法插件已初始化');
  }

  async handleMessage(message) {
    const content = message.content.toLowerCase();
    
    if (content.includes('加') || content.includes('加法')) {
      // 提取数字
      const numbers = content.match(/\d+(\.\d+)?/g);
      
      if (numbers && numbers.length >= 2) {
        const sum = numbers.map(Number).reduce((a, b) => a + b, 0);
        const chineseSum = this.numberToChinese(sum);
        return {
          type: 'text',
          content: `计算结果：${chineseSum}`
        };
      } else {
        return {
          type: 'text',
          content: '请提供至少两个数字进行加法运算，例如："1+2" 或 "3加4"'
        };
      }
    }
    
    return null;
  }

  getCommands() {
    return [
      {
        name: 'add',
        description: '执行加法运算',
        usage: 'add <num1> <num2> [num3...]',
        handler: async (args) => {
          if (args.length < 2) {
            return '请提供至少两个数字进行加法运算';
          }
          
          const numbers = args.map(Number);
          const sum = numbers.reduce((a, b) => a + b, 0);
          const chineseSum = this.numberToChinese(sum);
          return `计算结果：${chineseSum}`;
        }
      }
    ];
  }

  numberToChinese(num) {
    const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const units = ['', '拾', '佰', '仟'];
    const bigUnits = ['', '万', '亿'];
    
    if (num === 0) return '零';
    
    let result = '';
    let unitIndex = 0;
    let bigUnitIndex = 0;
    
    while (num > 0) {
      const section = num % 10000;
      if (section > 0) {
        let sectionResult = '';
        let temp = section;
        let sectionUnitIndex = 0;
        
        while (temp > 0) {
          const digit = temp % 10;
          if (digit > 0) {
            sectionResult = digits[digit] + units[sectionUnitIndex] + sectionResult;
          } else {
            if (sectionResult && !sectionResult.startsWith('零')) {
              sectionResult = '零' + sectionResult;
            }
          }
          temp = Math.floor(temp / 10);
          sectionUnitIndex++;
        }
        
        result = sectionResult + bigUnits[bigUnitIndex] + result;
      }
      
      num = Math.floor(num / 10000);
      bigUnitIndex++;
    }
    
    // 简化处理，去除多余的零
    result = result.replace(/零+/g, '零');
    result = result.replace(/零$/, '');
    
    return result;
  }
}

// 导出插件工厂函数
module.exports = function createAddPlugin() {
  return new AddPlugin();
};