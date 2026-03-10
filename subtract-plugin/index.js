class SubtractPlugin {
  constructor() {
    this.name = '减法插件';
    this.description = '执行减法运算';
  }

  async initialize(config) {
    console.log('减法插件已初始化');
  }

  async handleMessage(message) {
    const content = message.content.toLowerCase();
    
    if (content.includes('减') || content.includes('减法')) {
      // 提取数字
      const numbers = content.match(/\d+(\.\d+)?/g);
      
      if (numbers && numbers.length >= 2) {
        const result = numbers.map(Number).reduce((a, b) => a - b);
        return {
          type: 'text',
          content: `计算结果：${result}`
        };
      } else {
        return {
          type: 'text',
          content: '请提供至少两个数字进行减法运算，例如："5-3" 或 "10减2"'
        };
      }
    }
    
    return null;
  }

  getCommands() {
    return [
      {
        name: 'subtract',
        description: '执行减法运算',
        usage: 'subtract <num1> <num2> [num3...]',
        handler: async (args) => {
          if (args.length < 2) {
            return '请提供至少两个数字进行减法运算';
          }
          
          const numbers = args.map(Number);
          const result = numbers.reduce((a, b) => a - b);
          return `计算结果：${result}`;
        }
      }
    ];
  }
}

// 导出插件工厂函数
module.exports = function createSubtractPlugin() {
  return new SubtractPlugin();
};