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
        return {
          type: 'text',
          content: `计算结果：${sum}`
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
          return `计算结果：${sum}`;
        }
      }
    ];
  }
}

// 导出插件工厂函数
module.exports = function createAddPlugin() {
  return new AddPlugin();
};