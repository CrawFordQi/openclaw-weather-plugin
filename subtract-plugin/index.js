/**
 * OpenClaw 减法插件
 * 支持消息处理和命令两种方式执行减法运算
 */

const PLUGIN_ID = 'subtract-plugin';
const PLUGIN_NAME = '减法插件';
const PLUGIN_DESCRIPTION = '执行减法运算';

/**
 * 数字转中文大写
 * @param {number} num - 要转换的数字
 * @returns {string} 中文大写数字
 */
function numberToChinese(num) {
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const units = ['', '拾', '佰', '仟'];
  const bigUnits = ['', '万', '亿'];

  if (num === 0) return '零';

  const isNegative = num < 0;
  num = Math.abs(num);

  let result = '';
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

  if (isNegative) {
    result = '负' + result;
  }

  return result;
}

/**
 * 提取表达式中的数字
 * @param {string} content - 消息内容
 * @returns {number[]|null} 提取的数字数组
 */
function extractNumbers(content) {
  const numbers = content.match(/\d+(\.\d+)?/g);
  return numbers ? numbers.map(Number) : null;
}

/**
 * 检查是否是减法相关消息
 * @param {string} content - 消息内容
 * @returns {boolean} 是否是减法消息
 */
function isSubtractionMessage(content) {
  const lowerContent = content.toLowerCase();
  return lowerContent.includes('减') ||
         lowerContent.includes('减法') ||
         (lowerContent.includes('-') && !lowerContent.includes('>'));
}

/**
 * 执行减法计算
 * @param {number[]} numbers - 数字数组
 * @returns {number} 计算结果
 */
function calculateDifference(numbers) {
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return numbers[0];
  return numbers.reduce((a, b) => a - b);
}

/**
 * 减法插件类
 */
class SubtractPlugin {
  constructor() {
    this.id = PLUGIN_ID;
    this.name = PLUGIN_NAME;
    this.description = PLUGIN_DESCRIPTION;
    this.version = '1.0.0';
  }

  /**
   * 插件初始化
   * @param {Object} config - 插件配置
   * @param {Object} api - OpenClaw API
   */
  async initialize(config, api) {
    console.log(`[${PLUGIN_ID}] 插件已初始化`);
  }

  /**
   * 处理消息
   * @param {Object} message - 消息对象
   * @param {Object} context - 上下文对象
   * @returns {Object|null} 响应消息或 null
   */
  async handleMessage(message, context) {
    const content = message.content || message.text || '';

    if (!isSubtractionMessage(content)) {
      return null;
    }

    const numbers = extractNumbers(content);

    if (!numbers || numbers.length < 2) {
      return {
        type: 'text',
        content: '请提供至少两个数字进行减法运算，例如："5-3" 或 "10减2"'
      };
    }

    const result = calculateDifference(numbers);
    const chineseResult = numberToChinese(result);

    return {
      type: 'text',
      content: `计算结果：${chineseResult} (${result})`
    };
  }

  /**
   * 获取插件命令列表
   * @returns {Array} 命令列表
   */
  getCommands() {
    return [
      {
        name: 'subtract',
        description: '执行减法运算',
        usage: 'subtract <num1> <num2> [num3...]',
        handler: async (args, context) => {
          if (args.length < 2) {
            return {
              type: 'text',
              content: '请提供至少两个数字进行减法运算\n用法: subtract <num1> <num2> [num3...]'
            };
          }

          const numbers = args.map(Number);

          if (numbers.some(isNaN)) {
            return {
              type: 'text',
              content: '参数错误：所有参数必须是有效的数字'
            };
          }

          const result = calculateDifference(numbers);
          const chineseResult = numberToChinese(result);

          return {
            type: 'text',
            content: `计算结果：${chineseResult} (${result})`
          };
        }
      }
    ];
  }

  /**
   * 插件销毁
   */
  async destroy() {
    console.log(`[${PLUGIN_ID}] 插件已卸载`);
  }
}

// 导出插件实例
const plugin = new SubtractPlugin();

// OpenClaw 标准导出格式
module.exports = plugin;
module.exports.default = plugin;
module.exports.SubtractPlugin = SubtractPlugin;
