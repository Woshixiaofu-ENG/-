# 📊 数据采集与实时更新系统

## ⚠️ 重要声明

**本系统仅供学习研究使用。使用前请务必：**
1. 仔细阅读目标网站的用户协议、robots.txt和相关条款
2. 确保你的使用方式符合法律法规
3. 尊重网站的反爬机制，合理设置请求间隔
4. 不要将抓取的数据用于商业用途
5. 如果网站明确禁止抓取，请立即停止使用

---

## 🚀 快速开始

### 方式一：使用启动脚本（推荐）
```bash
chmod +x start-collector.sh
./start-collector.sh
```

### 方式二：手动启动
```bash
cd data-collector
npm install
cp .env.example .env
npm run dev
```

### 配置环境变量
编辑 `.env` 文件：
```env
# 目标网站配置
TARGET_URL=https://art.ccmgip.com

# 爬虫配置
REQUEST_INTERVAL=3000
MAX_RETRIES=3

# 数据库配置
DB_PATH=./data/database.sqlite

# API服务配置
API_PORT=3000
API_HOST=localhost
```

---

## 📱 小程序对接

小程序已经自动配置为实时API模式，会自动连接到本地数据服务。

在小程序中：
1. 点击首页市场总览的 🔄 按钮刷新数据
2. 数据会自动从API服务获取并更新
3. 如果API服务不可用，会自动降级到本地模拟数据

---

## 🔌 API接口文档

### 获取藏品列表
```
GET /api/collections
```

### 获取藏品详情
```
GET /api/collections/:id
```

### 获取市场统计
```
GET /api/market-stats
```

### 手动刷新数据
```
POST /api/refresh
```

### 获取系统状态
```
GET /api/status
```

---

## 🔧 技术架构

```
┌─────────────────┐
│  目标网站        │
│  (待授权)        │
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│  数据采集服务     │
│  (Node.js)       │
│  ├── 爬虫模块    │
│  ├── 数据库      │
│  └── API服务     │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│  小程序         │
│  (UniApp)       │
└─────────────────┘
```

---

## 📦 项目结构

```
/workspace/
├── data-collector/          # 数据采集服务
│   ├── server/              # 后端服务
│   │   ├── api/            # API接口
│   │   ├── scraper/        # 爬虫模块
│   │   ├── database/       # 数据库层
│   │   └── scheduler/      # 定时任务
│   ├── .env.example        # 环境配置示例
│   ├── package.json        # 依赖配置
│   └── server/index.js     # 入口文件
├── src/                     # 小程序源码
│   ├── data/               # 数据服务层
│   │   ├── dataService.ts  # 统一数据服务
│   │   ├── apiService.ts   # API对接
│   │   └── types.ts        # 类型定义
│   └── ...
└── start-collector.sh      # 快速启动脚本
```

---

## 🎯 下一步：接入真实数据

当前系统使用模拟数据，要接入真实数据需要：

1. **获得网站授权** - 联系网站官方获取API访问权限
2. **浏览器插件模式** - 开发浏览器扩展，在用户授权下采集
3. **用户贡献数据** - 允许用户录入和分享数据
4. **第三方数据源** - 接入合法的第三方数据服务

当获得授权后，只需修改 `data-collector/server/scraper/index.js` 中的采集逻辑即可。

---

## 🔒 数据安全

- 所有数据存储在本地 SQLite 数据库
- 不收集用户隐私信息
- 数据不会上传到任何第三方服务器

---

## 📞 技术支持

如有问题，请检查：
1. Node.js 版本（建议 16+）
2. 端口 3000 是否被占用
3. 网络连接是否正常