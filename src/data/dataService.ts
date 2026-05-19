import { 
  Collection, 
  MarketStats, 
  Dynamic, 
  User, 
  Comment,
  PriceAlert,
  UserPortfolio,
  TransactionRecord,
  DataSource,
  ChartData
} from './types';

export class DataService {
  private static instance: DataService;
  private currentSource: DataSource;
  private mockData: any;
  private cache: Map<string, any>;
  private cacheExpiry: Map<string, number>;
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.currentSource = {
      name: 'Mock Data',
      type: 'mock',
      enabled: true
    };
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.initMockData();
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private initMockData() {
    const now = Date.now();
    const generateId = () => Math.random().toString(36).substr(2, 9);
    
    const collections: Collection[] = [
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
        totalSupply: 2000,
        issuedDate: '2026-01-28',
        blockchain: '中传新文创链',
        rarity: '珍贵'
      }
    ];

    const users: User[] = [
      { id: 'u01', name: '数字收藏家', avatar: '👨‍💻', level: 15, isFollowing: true, avatarBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', collections: 128, followers: 2340, following: 156 },
      { id: 'u02', name: '艺术爱好者', avatar: '👩‍🎨', level: 12, isFollowing: true, avatarBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', collections: 86, followers: 1560, following: 89 },
      { id: 'u03', name: '历史迷', avatar: '🧓', level: 18, isFollowing: true, avatarBg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', collections: 245, followers: 4560, following: 78 },
      { id: 'u04', name: '市场分析师', avatar: '📊', level: 20, isFollowing: false, avatarBg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', collections: 312, followers: 12300, following: 234 },
      { id: 'u05', name: '国风达人', avatar: '🏮', level: 16, isFollowing: false, avatarBg: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', collections: 189, followers: 8900, following: 145 },
      { id: 'u06', name: '新手小白', avatar: '🌱', level: 5, isFollowing: false, avatarBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', collections: 12, followers: 230, following: 45 }
    ];

    const chartData: ChartData[] = [];
    for (let i = 0; i < 12; i++) {
      const hours = [0, 4, 8, 12, 16, 20, '现在'];
      chartData.push({
        label: i < 7 ? hours[i] : '',
        value: 40 + Math.random() * 60,
        timestamp: now - (11 - i) * 3600000
      });
    }

    const followDynamics: Dynamic[] = [
      {
        id: generateId(),
        type: 'collect',
        user: users[0],
        title: '刚收藏了 忒PANDA-Z世代',
        collection: collections[0],
        timeAgo: '2分钟前',
        timestamp: now - 120000,
        likes: 89,
        comments: 23,
        isLiked: false,
        showComments: false,
        commentList: [
          { id: 'c1', userId: 'u10', userName: '小艺', avatar: '👩', content: '这个系列真的很好看！', time: '1分钟前', likes: 12 },
          { id: 'c2', userId: 'u11', userName: '藏友A', avatar: '🧑', content: '恭喜入手！', time: '30秒前', likes: 5 }
        ]
      },
      {
        id: generateId(),
        type: 'collect',
        user: users[1],
        title: '今日涨幅最大藏品 🏛️',
        collection: collections[1],
        timeAgo: '15分钟前',
        timestamp: now - 900000,
        likes: 234,
        comments: 56,
        isLiked: true,
        showComments: false,
        commentList: []
      },
      {
        id: generateId(),
        type: 'achievement',
        user: users[2],
        title: '🎉 解锁成就 青铜器收藏家',
        description: '累计收藏青铜器系列藏品10件，获得独家称号',
        timeAgo: '30分钟前',
        timestamp: now - 1800000,
        likes: 567,
        comments: 89,
        isLiked: false,
        showComments: false,
        commentList: []
      }
    ];

    const hotDynamics: Dynamic[] = [
      {
        id: generateId(),
        type: 'collect',
        user: users[3],
        title: '🔥 今日最热藏品 TOP1',
        collection: collections[0],
        timeAgo: '5分钟前',
        timestamp: now - 300000,
        likes: 2341,
        comments: 456,
        isLiked: false,
        showComments: false,
        commentList: [
          { id: 'c3', userId: 'u20', userName: '投资者', avatar: '👨', content: '这涨幅也太猛了吧！', time: '3分钟前', likes: 89 },
          { id: 'c4', userId: 'u21', userName: '收藏新手', avatar: '👩', content: '还在观望中', time: '2分钟前', likes: 45 }
        ]
      },
      {
        id: generateId(),
        type: 'collect',
        user: users[4],
        title: '刚入手 🗺️',
        collection: collections[5],
        timeAgo: '10分钟前',
        timestamp: now - 600000,
        likes: 1876,
        comments: 234,
        isLiked: true,
        showComments: false,
        commentList: []
      },
      {
        id: generateId(),
        type: 'trade',
        user: users[5],
        title: '👤 关注了 @博物馆君',
        description: '被推荐关注，很喜欢他的藏品推荐',
        timeAgo: '30分钟前',
        timestamp: now - 1800000,
        likes: 56,
        comments: 12,
        isLiked: false,
        showComments: false,
        commentList: []
      }
    ];

    const priceAlerts: PriceAlert[] = [
      { id: 'a1', name: '忒PANDA-Z世代', type: 'rise', targetPrice: '3000', status: 'active' },
      { id: 'a2', name: '敦煌秘境45窟', type: 'fall', targetPrice: '2800', status: 'triggered' }
    ];

    const portfolio: UserPortfolio = {
      totalValue: '¥15.8万',
      totalProfit: '+¥2.3万',
      profitRate: '+17.0%',
      holdings: collections.slice(0, 4)
    };

    const transactions: TransactionRecord[] = [
      { id: 't1', type: 'buy', collection: collections[0], price: '¥2,200', time: '2026-05-15 14:30', timeAgo: '4天前' },
      { id: 't2', type: 'buy', collection: collections[2], price: '¥480', time: '2026-05-10 09:15', timeAgo: '9天前' },
      { id: 't3', type: 'sell', collection: { ...collections[1], name: '旧版藏品' }, price: '¥3,500', time: '2026-05-05 16:45', timeAgo: '14天前' }
    ];

    const marketStats: MarketStats = {
      totalMarketCap: '¥11.23亿',
      change24h: '+8.6%',
      change24hColor: 'positive',
      volumeRate: '¥6008万',
      timestamp: now,
      chartData
    };

    this.mockData = {
      collections,
      users,
      followDynamics,
      hotDynamics,
      priceAlerts,
      portfolio,
      transactions,
      marketStats
    };
  }

  private async getCached<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    if (this.cache.has(key)) {
      const expiry = this.cacheExpiry.get(key);
      if (expiry && now < expiry) {
        return this.cache.get(key);
      }
    }
    const data = await fetchFn();
    this.cache.set(key, data);
    this.cacheExpiry.set(key, now + this.CACHE_DURATION);
    return data;
  }

  async getMarketStats(): Promise<MarketStats> {
    return this.getCached('marketStats', async () => {
      return this.mockData.marketStats;
    });
  }

  async getHotCollections(filter: 'hot' | 'rise' | 'new' = 'hot'): Promise<Collection[]> {
    return this.getCached(`collections_${filter}`, async () => {
      let collections = [...this.mockData.collections];
      if (filter === 'rise') {
        collections.sort((a, b) => parseFloat(b.change) - parseFloat(a.change));
      }
      return collections;
    });
  }

  async getCollectionDetail(id: string): Promise<Collection | null> {
    return this.mockData.collections.find((c: Collection) => c.id === id) || null;
  }

  async getDynamics(type: 'follow' | 'hot' = 'hot'): Promise<Dynamic[]> {
    return this.getCached(`dynamics_${type}`, async () => {
      return type === 'follow' ? this.mockData.followDynamics : this.mockData.hotDynamics;
    });
  }

  async getPriceAlerts(): Promise<PriceAlert[]> {
    return this.mockData.priceAlerts;
  }

  async addPriceAlert(alert: Omit<PriceAlert, 'id'>): Promise<PriceAlert> {
    const newAlert: PriceAlert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.mockData.priceAlerts.push(newAlert);
    this.cache.delete('priceAlerts');
    return newAlert;
  }

  async removePriceAlert(id: string): Promise<void> {
    const index = this.mockData.priceAlerts.findIndex((a: PriceAlert) => a.id === id);
    if (index > -1) {
      this.mockData.priceAlerts.splice(index, 1);
      this.cache.delete('priceAlerts');
    }
  }

  async toggleLike(dynamicId: string, isLiked: boolean): Promise<{ likes: number, isLiked: boolean }> {
    const dynamics = [...this.mockData.followDynamics, ...this.mockData.hotDynamics];
    const dynamic = dynamics.find((d: Dynamic) => d.id === dynamicId);
    if (dynamic) {
      dynamic.isLiked = isLiked;
      dynamic.likes += isLiked ? 1 : -1;
    }
    return { likes: dynamic?.likes || 0, isLiked };
  }

  async addComment(dynamicId: string, content: string, userName: string): Promise<Comment> {
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'current',
      userName,
      avatar: '👤',
      content,
      time: '刚刚',
      likes: 0
    };
    const dynamics = [...this.mockData.followDynamics, ...this.mockData.hotDynamics];
    const dynamic = dynamics.find((d: Dynamic) => d.id === dynamicId);
    if (dynamic && dynamic.commentList) {
      dynamic.commentList.push(newComment);
      dynamic.comments++;
    }
    return newComment;
  }

  async toggleFollowUser(userId: string, isFollowing: boolean): Promise<boolean> {
    const users = [...this.mockData.users];
    const user = users.find((u: User) => u.id === userId);
    if (user) {
      user.isFollowing = isFollowing;
    }
    return isFollowing;
  }

  async getPortfolio(): Promise<UserPortfolio> {
    return this.mockData.portfolio;
  }

  async getTransactionRecords(): Promise<TransactionRecord[]> {
    return this.mockData.transactions;
  }

  async searchCollections(query: string): Promise<Collection[]> {
    const q = query.toLowerCase();
    return this.mockData.collections.filter((c: Collection) => 
      c.name.toLowerCase().includes(q) || 
      c.artist.toLowerCase().includes(q)
    );
  }

  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  refreshData() {
    this.initMockData();
    this.clearCache();
  }

  setDataSource(source: DataSource) {
    this.currentSource = source;
  }

  getCurrentSource(): DataSource {
    return this.currentSource;
  }
}

export const dataService = DataService.getInstance();
