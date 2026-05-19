const axios = require('axios');
const cheerio = require('cheerio');
const { getDatabase } = require('../database/init');

// 模拟数据（开发阶段使用）
const MOCK_DATA = [
  {
    id: '01',
    name: '忒PANDA-Z世代',
    artist: 'CCTV数藏',
    description: 'CCTV数藏联合出品，国风熊猫系列',
    price: '¥2,500',
    priceNum: 2500,
    change: '+12.5%',
    changeType: 'up',
    icon: '🐼',
    aiScore: 95,
    tags: ['国风', '熊猫', '限量'],
    rank: 1,
    volume: '¥500万',
    volumeNum: 5000000,
    creator: 'CCTV',
    totalSupply: 1000,
    issuedDate: '2026-01-15',
    blockchain: '中传新文创链',
    rarity: '稀世'
  },
  {
    id: '02',
    name: '敦煌秘境45窟',
    artist: '敦煌研究院',
    description: '敦煌博物馆官方授权',
    price: '¥3,200',
    priceNum: 3200,
    change: '+5.6%',
    changeType: 'up',
    icon: '🏛️',
    aiScore: 92,
    tags: ['敦煌', '博物馆', '文化'],
    rank: 2,
    volume: '¥380万',
    volumeNum: 3800000,
    creator: '敦煌研究院',
    totalSupply: 800,
    issuedDate: '2026-01-20',
    blockchain: '中传新文创链',
    rarity: '珍贵'
  },
  {
    id: '03',
    name: '清明上河图',
    artist: '故宫博物院',
    description: '故宫传世名画数字版',
    price: '¥450',
    priceNum: 450,
    change: '-2.1%',
    changeType: 'down',
    icon: '🎨',
    aiScore: 78,
    tags: ['故宫', '名画', '经典'],
    rank: 3,
    volume: '¥220万',
    volumeNum: 2200000,
    creator: '故宫博物院',
    totalSupply: 5000,
    issuedDate: '2025-12-25',
    blockchain: '中传新文创链',
    rarity: '普通'
  },
  {
    id: '04',
    name: '红陶兽形器',
    artist: '山东博物馆',
    description: '山东博物馆馆藏精品',
    price: '¥1,219',
    priceNum: 1219,
    change: '+15.8%',
    changeType: 'up',
    icon: '🐉',
    aiScore: 88,
    tags: ['青铜器', '历史', '收藏'],
    rank: 4,
    volume: '¥180万',
    volumeNum: 1800000,
    creator: '山东博物馆',
    totalSupply: 1500,
    issuedDate: '2026-02-01',
    blockchain: '中传新文创链',
    rarity: '稀有'
  },
  {
    id: '05',
    name: '后母戊鼎',
    artist: '国家博物馆',
    description: '国家博物馆镇馆之宝',
    price: '¥2,800',
    priceNum: 2800,
    change: '+3.2%',
    changeType: 'up',
    icon: '🏺',
    aiScore: 90,
    tags: ['国博', '镇馆', '重器'],
    rank: 5,
    volume: '¥320万',
    volumeNum: 3200000,
    creator: '国家博物馆',
    totalSupply: 1200,
    issuedDate: '2026-01-10',
    blockchain: '中传新文创链',
    rarity: '稀世'
  },
  {
    id: '06',
    name: '千里江山图数字场景',
    artist: '故宫博物院',
    description: '王希孟《千里江山图》数字版',
    price: '¥1,150',
    priceNum: 1150,
    change: '+8.3%',
    changeType: 'up',
    icon: '🗺️',
    aiScore: 94,
    tags: ['山水', '青绿', '名画'],
    rank: 6,
    volume: '¥280万',
    volumeNum: 2800000,
    creator: '故宫博物院',
    totalSupply: 2000,
    issuedDate: '2026-01-28',
    blockchain: '中传新文创链',
    rarity: '珍贵'
  }
];

// 爬虫初始化
const init = async () => {
  console.log('🎯 爬虫模块初始化...');
  console.log('   ⚠️  当前使用模拟数据（开发模式）');
  console.log('   💡  如需真实采集，请先获取网站授权并登录');
};

// 采集藏品数据
const scrapeCollections = async () => {
  const db = getDatabase();
  console.log('🔄 开始采集藏品数据...');
  
  // 当前使用模拟数据
  const collections = MOCK_DATA.map(item => {
    const randomChange = (Math.random() * 10 - 5).toFixed(1);
    const newChange = `${randomChange > 0 ? '+' : ''}${randomChange}%`;
    return {
      ...item,
      priceNum: item.priceNum * (1 + randomChange / 100),
      price: `¥${Math.round(item.priceNum * (1 + randomChange / 100)).toLocaleString()}`,
      change: newChange,
      changeType: parseFloat(randomChange) >= 0 ? 'up' : 'down'
    };
  });
  
  for (const collection of collections) {
    await saveCollection(collection);
  }
  
  console.log(`✅ 成功采集 ${collections.length} 件藏品数据`);
  return collections;
};

// 采集市场统计
const scrapeMarketStats = async () => {
  const db = getDatabase();
  console.log('📊 开始采集市场统计...');
  
  const stats = {
    totalMarketCap: '¥11.23亿',
    change24h: '+8.6%',
    change24hColor: 'positive',
    volumeRate: '¥6008万'
  };
  
  await new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO market_stats (totalMarketCap, change24h, change24hColor, volumeRate) VALUES (?, ?, ?, ?)',
      [stats.totalMarketCap, stats.change24h, stats.change24hColor, stats.volumeRate],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
  
  console.log('✅ 市场统计采集完成');
  return stats;
};

// 保存藏品
const saveCollection = async (collection) => {
  const db = getDatabase();
  const tagsStr = collection.tags ? JSON.stringify(collection.tags) : null;
  
  return new Promise((resolve, reject) => {
    db.get('SELECT id FROM collections WHERE id = ?', [collection.id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      const sql = row ? `
        UPDATE collections 
        SET name = ?, artist = ?, description = ?, price = ?, priceNum = ?, 
            change = ?, changeType = ?, icon = ?, image = ?, aiScore = ?, 
            tags = ?, rank = ?, volume = ?, volumeNum = ?, creator = ?, 
            totalSupply = ?, issuedDate = ?, blockchain = ?, rarity = ?, 
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      ` : `
        INSERT INTO collections 
        (id, name, artist, description, price, priceNum, change, changeType, 
         icon, image, aiScore, tags, rank, volume, volumeNum, creator, 
         totalSupply, issuedDate, blockchain, rarity) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = row ? [
        collection.name, collection.artist, collection.description, 
        collection.price, collection.priceNum, collection.change, 
        collection.changeType, collection.icon, collection.image, 
        collection.aiScore, tagsStr, collection.rank, collection.volume, 
        collection.volumeNum, collection.creator, collection.totalSupply, 
        collection.issuedDate, collection.blockchain, collection.rarity, 
        collection.id
      ] : [
        collection.id, collection.name, collection.artist, collection.description, 
        collection.price, collection.priceNum, collection.change, collection.changeType, 
        collection.icon, collection.image, collection.aiScore, tagsStr, collection.rank, 
        collection.volume, collection.volumeNum, collection.creator, collection.totalSupply, 
        collection.issuedDate, collection.blockchain, collection.rarity
      ];
      
      db.run(sql, params, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        // 保存价格历史
        db.run(
          'INSERT INTO price_history (collectionId, price) VALUES (?, ?)',
          [collection.id, collection.priceNum],
          (err) => {
            if (err) console.error('价格历史保存失败:', err);
            resolve();
          }
        );
      });
    });
  });
};

// 获取所有藏品
const getAllCollections = async () => {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM collections ORDER BY rank ASC', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows.map(row => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : []
      })));
    });
  });
};

// 获取单个藏品
const getCollectionById = async (id) => {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM collections WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row) {
        resolve({
          ...row,
          tags: row.tags ? JSON.parse(row.tags) : []
        });
      } else {
        resolve(null);
      }
    });
  });
};

// 获取最新市场统计
const getLatestStats = async () => {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM market_stats ORDER BY timestamp DESC LIMIT 1', (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row || null);
    });
  });
};

module.exports = {
  init,
  scrapeCollections,
  scrapeMarketStats,
  getAllCollections,
  getCollectionById,
  getLatestStats
};
