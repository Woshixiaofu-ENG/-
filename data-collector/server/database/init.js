const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'database.sqlite');

let db;

const init = async () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  db = new sqlite3.Database(DB_PATH);
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS collections (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          artist TEXT,
          description TEXT,
          price TEXT,
          priceNum REAL,
          change TEXT,
          changeType TEXT,
          icon TEXT,
          image TEXT,
          aiScore REAL,
          tags TEXT,
          rank INTEGER,
          volume TEXT,
          volumeNum REAL,
          creator TEXT,
          totalSupply INTEGER,
          issuedDate TEXT,
          blockchain TEXT,
          rarity TEXT,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      db.run(`
        CREATE TABLE IF NOT EXISTS market_stats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          totalMarketCap TEXT,
          change24h TEXT,
          change24hColor TEXT,
          volumeRate TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      db.run(`
        CREATE TABLE IF NOT EXISTS price_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          collectionId TEXT,
          price REAL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (collectionId) REFERENCES collections (id)
        )
      `);
      
      console.log('数据库表已创建/验证');
      resolve();
    });
  });
};

const getDatabase = () => db;

module.exports = { init, getDatabase };
