const cron = require('node-cron');
const scraper = require('../scraper/index');

let task = null;
let isRunning = false;

const start = () => {
  const schedule = process.env.CRON_SCHEDULE || '0 */30 * * * *';
  
  task = cron.schedule(schedule, async () => {
    if (isRunning) {
      console.log('⚠️  上一次任务还在运行中，跳过本次执行');
      return;
    }
    
    console.log('⏰ 定时任务触发 - 开始更新数据');
    await runUpdate();
  }, {
    scheduled: true
  });
  
  console.log(`🕐 定时任务已启动，调度规则: ${schedule}`);
};

const stop = () => {
  if (task) {
    task.stop();
    task = null;
    console.log('🛑 定时任务已停止');
  }
};

const runUpdate = async () => {
  if (isRunning) {
    return { success: false, message: '任务正在运行中' };
  }
  
  isRunning = true;
  const startTime = Date.now();
  
  try {
    console.log('📡 开始数据更新...');
    
    const collections = await scraper.scrapeCollections();
    const stats = await scraper.scrapeMarketStats();
    
    const duration = Date.now() - startTime;
    console.log(`✅ 数据更新完成，耗时: ${duration}ms`);
    
    if (global.broadcastUpdate) {
      global.broadcastUpdate('DATA_UPDATED', {
        collectionsCount: collections.length,
        stats,
        timestamp: Date.now()
      });
    }
    
    return { 
      success: true, 
      message: '数据更新完成',
      collectionsCount: collections.length,
      duration
    };
  } catch (error) {
    console.error('❌ 数据更新失败:', error);
    return { 
      success: false, 
      message: error.message 
    };
  } finally {
    isRunning = false;
  }
};

const getStatus = () => ({
  isRunning,
  nextRun: task ? task.nextDates().toString() : null
});

module.exports = { start, stop, runUpdate, getStatus };
