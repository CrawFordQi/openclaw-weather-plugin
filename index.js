const https = require('https');

class WeatherPlugin {
  constructor() {
    this.name = '天气查询';
    this.description = '查询今天的天气信息';
    this.config = {
      defaultCity: '北京',
      amapKey: 'YOUR_AMAP_API_KEY' // 高德地图API密钥
    };
  }

  async initialize(config) {
    this.config = { ...this.config, ...config };
    console.log('天气查询插件已初始化');
  }

  async handleMessage(message) {
    const content = message.content.toLowerCase();
    
    if (content.includes('天气') || content.includes('weather')) {
      let city = this.config.defaultCity;
      
      // 提取城市名称
      const cityMatch = content.match(/(北京|上海|广州|深圳|杭州|成都|武汉|西安|南京|重庆)/);
      if (cityMatch) {
        city = cityMatch[1];
      }
      
      try {
        const weatherInfo = await this.getWeather(city);
        return {
          type: 'text',
          content: weatherInfo
        };
      } catch (error) {
        return {
          type: 'text',
          content: `查询天气失败: ${error.message}`
        };
      }
    }
    
    return null;
  }

  async getWeather(city) {
    const amapKey = this.config.amapKey || 'YOUR_AMAP_API_KEY';
    
    // 使用高德地图天气API
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${encodeURIComponent(city)}&key=${amapKey}&extensions=base`;
    
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (result.status === '1' && result.lives && result.lives.length > 0) {
              const weather = result.lives[0];
              const weatherInfo = `🌤️ ${city}今天的天气：\n` +
                                `温度：${weather.temperature}°C\n` +
                                `天气：${weather.weather}°C\n` +
                                `湿度：${weather.humidity}%\n` +
                                `风向：${weather.winddirection}\n` +
                                `风速：${weather.windpower}级`;
              resolve(weatherInfo);
            } else {
              reject(new Error(result.info || '查询失败'));
            }
          } catch (error) {
            reject(new Error('解析数据失败'));
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    });
  }

  getCommands() {
    return [
      {
        name: 'weather',
        description: '查询天气',
        usage: 'weather [城市]',
        handler: async (args) => {
          const city = args[0] || this.config.defaultCity;
          try {
            const weatherInfo = await this.getWeather(city);
            return weatherInfo;
          } catch (error) {
            return `查询天气失败: ${error.message}`;
          }
        }
      }
    ];
  }
}

module.exports = WeatherPlugin;
