const fs = require('fs');
const path = require('path');

class SummaryPlugin {
  constructor() {
    this.name = '工作总结';
    this.description = '将详细工作汇报总结为周例会可汇报的精简内容';
    this.config = {
      defaultTimeRange: '本周'
    };
  }

  async initialize(config) {
    this.config = { ...this.config, ...config };
    console.log('工作总结插件已初始化');
  }

  async handleMessage(message) {
    const content = message.content.toLowerCase();
    
    if (content.includes('总结') && (content.includes('工作') || content.includes('汇报'))) {
      // 提取文件路径
      const filePathMatch = content.match(/文件\s*[:：]?\s*([^\s]+\.md)/);
      const timeRangeMatch = content.match(/(第\d+周|\d+月\d+日-\d+月\d+日)/);
      
      const filePath = filePathMatch ? filePathMatch[1] : null;
      const timeRange = timeRangeMatch ? timeRangeMatch[0] : this.config.defaultTimeRange;
      
      if (filePath) {
        try {
          const summary = await this.generateSummary(filePath, timeRange);
          return {
            type: 'text',
            content: summary
          };
        } catch (error) {
          return {
            type: 'text',
            content: `生成总结失败: ${error.message}`
          };
        }
      } else {
        return {
          type: 'text',
          content: '请提供工作汇报文件路径，例如："请总结文件 /path/to/report.md 的内容"'
        };
      }
    }
    
    return null;
  }

  async generateSummary(filePath, timeRange) {
    // 确保文件路径存在
    if (!fs.existsSync(filePath)) {
      throw new Error(`文件不存在: ${filePath}`);
    }
    
    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 分析内容并提取关键信息
    const analysis = this.analyzeContent(content);
    
    // 生成总结
    return this.formatSummary(analysis, timeRange);
  }

  analyzeContent(content) {
    const lines = content.split('\n');
    const analysis = {
      completed: [],
      problems: [],
      plans: []
    };
    
    let currentSection = null;
    
    lines.forEach(line => {
      line = line.trim();
      
      // 识别章节
      if (line.includes('完成') || line.includes('已做') || line.includes('工作内容')) {
        currentSection = 'completed';
      } else if (line.includes('问题') || line.includes('困难') || line.includes('挑战')) {
        currentSection = 'problems';
      } else if (line.includes('计划') || line.includes('下一步') || line.includes('下周')) {
        currentSection = 'plans';
      }
      
      // 提取内容
      if (currentSection && line && !line.startsWith('#') && !line.includes('：') && !line.includes(':')) {
        if (line.startsWith('-') || line.startsWith('*')) {
          const item = line.substring(1).trim();
          if (item) {
            analysis[currentSection].push(item);
          }
        } else if (line.length > 10) {
          // 处理非列表形式的内容
          analysis[currentSection].push(line);
        }
      }
    });
    
    return analysis;
  }

  formatSummary(analysis, timeRange) {
    let summary = `# ${timeRange}工作汇报\n\n`;
    
    // 工作完成情况
    summary += '## 工作完成情况\n';
    if (analysis.completed.length > 0) {
      analysis.completed.forEach((item, index) => {
        summary += `- 项目${index + 1}：${this.trimContent(item)}\n`;
      });
    } else {
      summary += '- 暂无完成的工作项目\n';
    }
    
    // 遇到的问题
    summary += '\n## 遇到的问题\n';
    if (analysis.problems.length > 0) {
      analysis.problems.forEach((item, index) => {
        summary += `- 问题${index + 1}：${this.trimContent(item)}\n`;
      });
    } else {
      summary += '- 暂无遇到的问题\n';
    }
    
    // 下周计划
    summary += '\n## 下周计划\n';
    if (analysis.plans.length > 0) {
      analysis.plans.forEach((item, index) => {
        summary += `- 计划${index + 1}：${this.trimContent(item)}\n`;
      });
    } else {
      summary += '- 暂无下周计划\n';
    }
    
    return summary;
  }

  trimContent(content) {
    // 精简内容，控制在2-3句话内
    const sentences = content.split(/[。！？.!?]/).filter(s => s.trim());
    if (sentences.length > 3) {
      return sentences.slice(0, 3).join('。') + '。';
    }
    return content;
  }

  getCommands() {
    return [
      {
        name: 'summary',
        description: '总结工作汇报',
        usage: 'summary <file_path> [time_range]',
        handler: async (args) => {
          const filePath = args[0];
          const timeRange = args[1] || this.config.defaultTimeRange;
          
          if (!filePath) {
            return '请提供工作汇报文件路径';
          }
          
          try {
            return await this.generateSummary(filePath, timeRange);
          } catch (error) {
            return `生成总结失败: ${error.message}`;
          }
        }
      }
    ];
  }
}

// 导出插件工厂函数
module.exports = function createSummaryPlugin() {
  return new SummaryPlugin();
};