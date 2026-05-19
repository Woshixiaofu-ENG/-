const express = require('express');
const router = express.Router();
const scraper = require('../scraper/index');
const scheduler = require('../scheduler/index');

// 获取藏品列表
router.get('/collections', async (req, res) => {
  try {
    const collections = await scraper.getAllCollections();
    res.json({
      success: true,
      data: collections,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('获取藏品列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取藏品列表失败'
    });
  }
});

// 获取藏品详情
router.get('/collections/:id', async (req, res) => {
  try {
    const collection = await scraper.getCollectionById(req.params.id);
    if (collection) {
      res.json({
        success: true,
        data: collection
      });
    } else {
      res.status(404).json({
        success: false,
        message: '藏品不存在'
      });
    }
  } catch (error) {
    console.error('获取藏品详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取藏品详情失败'
    });
  }
});

// 获取市场统计
router.get('/market-stats', async (req, res) => {
  try {
    const stats = await scraper.getLatestStats();
    const collections = await scraper.getAllCollections();
    
    // 生成模拟图表数据
    const now = Date.now();
    const chartData = [];
    for (let i = 0; i < 12; i++) {
      const hours = [0, 4, 8, 12, 16, 20, '现在', '', '', '', '', ''];
      chartData.push({
        label: hours[i],
        value: 40 + Math.random() * 60,
        timestamp: now - (11 - i) * 3600000
      });
    }
    
    res.json({
      success: true,
      data: {
        ...stats,
        chartData,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('获取市场统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取市场统计失败'
    });
  }
});

// 手动刷新数据
router.post('/refresh', async (req, res) => {
  try {
    console.log('🔄 收到手动刷新请求');
    const result = await scheduler.runUpdate();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('手动刷新失败:', error);
    res.status(500).json({
      success: false,
      message: '手动刷新失败'
    });
  }
});

// 获取任务状态
router.get('/status', async (req, res) => {
  try {
    const status = scheduler.getStatus();
    res.json({
      success: true,
      data: {
        ...status,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('获取状态失败:', error);
    res.status(500).json({
      success: false,
      message: '获取状态失败'
    });
  }
});

module.exports = router;
