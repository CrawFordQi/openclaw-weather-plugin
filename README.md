# 天气查询插件

OpenClaw的天气查询插件，用于查询今天的天气信息。

## 功能

- 查询指定城市的天气信息
- 支持默认城市设置
- 提供命令行接口
- 支持聊天界面集成

## 安装方法

### 方法1：本地安装

1. 将插件文件夹复制到 `~/.openclaw/extensions/` 目录
2. 重启OpenClaw

### 方法2：通过GitHub安装

1. 将插件上传到GitHub
2. 在OpenClaw的插件管理页面中添加GitHub仓库
3. 安装插件

## 配置

在 `openclaw.json` 文件中添加插件配置：

```json
"plugins": {
  "weather-plugin": {
    "apiKey": "YOUR_OPENWEATHERMAP_API_KEY",
    "defaultCity": "北京"
  }
}
```

## 获取API密钥

OpenWeatherMap提供免费的API密钥，获取步骤如下：

1. 访问 [OpenWeatherMap](https://openweathermap.org/)
2. 点击右上角的"Sign Up"注册账号
3. 登录后，进入 [API Keys](https://home.openweathermap.org/api_keys) 页面
4. 在"Create key"部分输入一个名称（例如"OpenClaw"）
5. 点击"Generate"按钮生成API密钥
6. 将生成的API密钥填入配置文件中

**注意**：免费API密钥每天有60次调用限制，足够个人使用。

## 使用方法

### 聊天界面

在聊天界面中发送包含"天气"关键词的消息，例如：
- "今天天气怎么样？"
- "北京天气"
- "上海天气如何？"

### 命令行

使用 `weather` 命令查询天气：

```
weather [城市]
```

例如：
- `weather` - 查询默认城市的天气
- `weather 上海` - 查询上海的天气

## 示例

**输入：**
```
北京天气
```

**输出：**
```
🌤️ 北京今天的天气：
温度：22.5°C
天气：晴
湿度：45%
风速：3.2m/s
```

## 支持的城市

目前支持以下城市：
- 北京
- 上海
- 广州
- 深圳
- 杭州
- 成都
- 武汉
- 西安
- 南京
- 重庆

## 上传到GitHub的步骤

1. **创建GitHub仓库**
   - 登录GitHub账号
   - 点击右上角的"+"按钮，选择"New repository"
   - 输入仓库名称，例如 "openclaw-weather-plugin"
   - 选择公开或私有
   - 点击"Create repository"

2. **初始化本地仓库**
   ```bash
   cd weather-plugin
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **关联远程仓库**
   ```bash
   git remote add origin https://github.com/your-username/openclaw-weather-plugin.git
   ```

4. **推送到GitHub**
   ```bash
   git push -u origin main
   ```

5. **在OpenClaw中安装**
   - 打开OpenClaw的插件管理页面
   - 点击"添加市场"
   - 输入GitHub仓库地址：`your-username/openclaw-weather-plugin`
   - 点击"提交"
   - 找到天气查询插件并点击安装

## 技术实现

本插件使用OpenWeatherMap的免费API：
- API地址：`https://api.openweathermap.org/data/2.5/weather`
- 数据格式：JSON
- 调用频率：免费API每天60次调用限制

## 注意事项

- 需要有效的OpenWeatherMap API密钥
- API密钥可以免费获取，每天有60次调用限制
- 如需添加更多城市支持，可修改 `index.js` 文件中的城市匹配正则表达式

## 故障排除

1. **API密钥错误**：确保输入了正确的OpenWeatherMap API密钥
2. **网络问题**：检查网络连接是否正常
3. **城市未找到**：确保输入的城市名称在支持列表中
4. **插件未加载**：重启OpenClaw后再试
5. **API调用超限**：免费API每天有60次调用限制，超过后需要等待24小时

## 许可证

MIT License