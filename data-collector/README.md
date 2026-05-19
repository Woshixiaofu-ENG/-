# 数据抓取与自动更新系统

## ⚠️ 重要法律声明

**本项目仅供学习研究使用。使用前请务必：**

1. 仔细阅读目标网站的《用户协议》和《 robots.txt》
2. 确保你的使用方式符合相关法律法规
3. 尊重网站的反爬机制，合理设置请求间隔
4. 不将抓取的数据用于商业用途
5. 如网站明确禁止抓取，请立即停止

---

## 🛠️ 技术架构

### 方案概述

采用 **"用户授权+浏览器自动化"** 的方式，在用户明确授权后进行数据采集：

```
用户浏览器 → 采集服务 → 本地数据库 → 小程序API
```

### 目录结构

```
data-collector/
├── server/              # 后端服务
│   ├── api/            # API接口
│   ├── scraper/        # 爬虫模块
│   ├── database/       # 数据库层
│   └── scheduler/      # 定时任务
├── browser-extension/  # 浏览器扩展（用户授权方式）
└── docs/              # 文档
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd data-collector
npm install
```

### 2. 配置环境

创建 `.env` 文件：

```env
# 目标网站配置
TARGET_URL=https://art.ccmgip.com
REQUEST_INTERVAL=3000  # 请求间隔（毫秒）

# 数据库配置
DB_PATH=./data/database.sqlite

# API服务配置
API_PORT=3000
```

### 3. 启动服务

```bash
npm run dev
```

---

## 📋 API文档

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

### 手动触发数据更新

```
POST /api/refresh
```

---

## 🔧 技术实现

### 核心模块

1. **数据采集模块** - 使用 Puppeteer/Playwright 进行浏览器自动化
2. **数据存储模块** - SQLite 本地存储
3. **API服务模块** - Express.js 提供RESTful接口
4. **定时任务模块** - node-cron 定时更新数据
5. **WebSocket推送** - 实时推送更新到小程序

### 爬虫策略

- **智能重试** - 失败自动重试，指数退避
- **请求限流** - 尊重网站，设置合理间隔
- **缓存机制** - 避免重复请求相同数据
- **增量更新** - 只更新变化的数据

---

## 📱 小程序对接

在小程序中配置 API 地址：

```typescript
// src/data/apiService.ts
const API_BASE = 'http://localhost:3000/api';

export const apiService = {
  async getCollections() {
    const res = await uni.request({
      url: `${API_BASE}/collections`
    });
    return res.data;
  },
  
  async getMarketStats() {
    const res = await uni.request({
      url: `${API_BASE}/market-stats`
    });
    return res.data;
  }
};
```

---

## 🚨 使用须知

1. **仅用于个人学习** - 不得用于商业用途
2. **遵守网站规则** - 不得恶意频繁请求
3. **保护隐私数据** - 不得存储用户隐私信息
4. **及时更新协议** - 关注网站服务协议变更
