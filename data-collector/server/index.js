const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
require('dotenv').config();

const database = require('./database/init');
const scraper = require('./scraper/index');
const scheduler = require('./scheduler/index');
const apiRouter = require('./api/routes');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API路由
app.use('/api', apiRouter);

// WebSocket连接处理
wss.on('connection', (ws) => {
  console.log('新的WebSocket连接');
  
  ws.on('message', (data) => {
    console.log('收到消息:', data);
  });
  
  ws.on('close', () => {
    console.log('WebSocket连接关闭');
  });
});

// 广播更新消息
global.broadcastUpdate = (type, data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, data, timestamp: Date.now() }));
    }
  });
};

// 初始化
const init = async () => {
  try {
    // 初始化数据库
    await database.init();
    console.log('✅ 数据库初始化完成');
    
    // 初始化爬虫
    await scraper.init();
    console.log('✅ 爬虫模块初始化完成');
    
    // 启动定时任务
    scheduler.start();
    console.log('✅ 定时任务已启动');
    
    // 启动服务器
    const PORT = process.env.API_PORT || 3000;
    server.listen(PORT, () => {
      console.log(`\n🚀 数据采集服务已启动！`);
      console.log(`📡 API服务: http://${process.env.API_HOST || 'localhost'}:${PORT}`);
      console.log(`⚡ WebSocket: ws://${process.env.API_HOST || 'localhost'}:${PORT}`);
      console.log(`\n📚 API文档:`);
      console.log(`   GET  /api/collections    - 获取藏品列表`);
      console.log(`   GET  /api/collections/:id - 获取藏品详情`);
      console.log(`   GET  /api/market-stats   - 获取市场统计`);
      console.log(`   POST /api/refresh        - 手动刷新数据`);
    });
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
};

init();

module.exports = { app, server, wss };
