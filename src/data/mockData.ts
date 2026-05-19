import type { CollectionStats, CollectionItem, MarketItem, CalendarItem, UserPortfolio, TransactionRecord } from './types'

export const collectionStats: CollectionStats = {
  consignmentTotal: '14.16万',
  chainTotal: '155.07万',
  consignmentRate: '9.13%',
  salesTotal: '¥6008.17万',
  chainValue: '¥11.23亿',
  premiumRate: '+1769.08%',
  holderCount: '35176',
  updateTime: '2026-05-19 09:30'
}

export const rankingList: CollectionItem[] = [
  { id: '1', name: '忒PANDA-Z世代', rank: 1, volume24h: '¥2.50万', volume24hNum: 25000, count24h: 1, circulation: 1774, change: '+12.5%' },
  { id: '2', name: '忒PANDA-复古', rank: 2, volume24h: '¥2.46万', volume24hNum: 24600, count24h: 1, circulation: 1735, change: '+8.3%' },
  { id: '3', name: '忒PANDA-国风', rank: 3, volume24h: '¥4,200', volume24hNum: 4200, count24h: 1, circulation: 1666, change: '-2.1%' },
  { id: '4', name: '敦煌秘境45窟数字场景', rank: 4, volume24h: '¥3,200', volume24hNum: 3200, count24h: 1, circulation: 683, change: '+5.6%' },
  { id: '5', name: '清明上河图', rank: 5, volume24h: '¥1,350', volume24hNum: 1350, count24h: 1, circulation: 2438, change: '-1.2%' },
  { id: '6', name: '红陶兽形器', rank: 6, volume24h: '¥1,219', volume24hNum: 1219, count24h: 6, circulation: 865, change: '+15.8%' },
  { id: '7', name: '天地之中·观星台数字场景', rank: 7, volume24h: '¥1,200', volume24hNum: 1200, count24h: 1, circulation: 1365, change: '+3.2%' },
  { id: '8', name: '后母戊鼎', rank: 8, volume24h: '¥1,150', volume24hNum: 1150, count24h: 1, circulation: 2728, change: '-0.8%' },
  { id: '9', name: '千里江山图', rank: 9, volume24h: '¥1,150', volume24hNum: 1150, count24h: 1, circulation: 2410, change: '+6.4%' },
  { id: '10', name: '猫石图', rank: 10, volume24h: '¥1,066', volume24hNum: 1066, count24h: 5, circulation: 2447, change: '+9.1%' },
  { id: '11', name: '草书诗帖', rank: 11, volume24h: '¥1,050', volume24hNum: 1050, count24h: 2, circulation: 1593, change: '-3.5%' },
  { id: '12', name: '五星出东方利中国织锦护臂', rank: 12, volume24h: '¥1,050', volume24hNum: 1050, count24h: 2, circulation: 2111, change: '+4.7%' },
  { id: '13', name: '草书千字文', rank: 13, volume24h: '¥1,050', volume24hNum: 1050, count24h: 2, circulation: 2111, change: '+1.2%' },
  { id: '14', name: '研山铭', rank: 14, volume24h: '¥977', volume24hNum: 977, count24h: 4, circulation: 972, change: '-2.8%' },
  { id: '15', name: '汉宫春晓图', rank: 15, volume24h: '¥900', volume24hNum: 900, count24h: 1, circulation: 1512, change: '+7.3%' },
  { id: '16', name: '战国彩漆木雕鸳鸯形盒', rank: 16, volume24h: '¥828', volume24hNum: 828, count24h: 2, circulation: 1592, change: '-4.1%' },
  { id: '17', name: '秦石鼓-乍原', rank: 17, volume24h: '¥810', volume24hNum: 810, count24h: 2, circulation: 380, change: '+11.5%' },
  { id: '18', name: '枯木寒鸦图', rank: 18, volume24h: '¥757.59', volume24hNum: 757.59, count24h: 7, circulation: 1981, change: '+2.9%' },
  { id: '19', name: '长信宫灯', rank: 19, volume24h: '¥710', volume24hNum: 710, count24h: 1, circulation: 907, change: '-1.5%' },
  { id: '20', name: '石头桐子图', rank: 20, volume24h: '¥703', volume24hNum: 703, count24h: 11, circulation: 1816, change: '+8.7%' }
]

export const marketList: MarketItem[] = [
  { id: '1', name: '清碧玉"乾隆年制"天鸡樽', rank: 1, yesterdayVolume: '¥923.88', yesterdayCount: 16, weekVolume: '¥3.6万', weekCount: 55 },
  { id: '2', name: '[数实] 晚清粉彩提篮花花并纹盘', rank: 2, yesterdayVolume: '¥840', yesterdayCount: 12, weekVolume: '¥1.6万', weekCount: 23 },
  { id: '3', name: '春秋青铜神兽', rank: 3, yesterdayVolume: '¥2,533.95', yesterdayCount: 10, weekVolume: '¥4.34万', weekCount: 40 },
  { id: '4', name: '战国彩漆木雕鸳鸯形盒', rank: 4, yesterdayVolume: '¥4,107', yesterdayCount: 10, weekVolume: '¥3.9万', weekCount: 94 },
  { id: '5', name: '白莲社图卷', rank: 5, yesterdayVolume: '¥662.8', yesterdayCount: 10, weekVolume: '¥1.8万', weekCount: 246 },
  { id: '6', name: '夏嵌绿松石兽面纹铜牌饰', rank: 6, yesterdayVolume: '¥538.39', yesterdayCount: 9, weekVolume: '¥1.95万', weekCount: 33 },
  { id: '7', name: '长江万里图卷', rank: 7, yesterdayVolume: '¥580.6', yesterdayCount: 9, weekVolume: '¥3.97万', weekCount: 59 },
  { id: '8', name: '[数实] 晚清青花开窗花鸟纹花口杯', rank: 8, yesterdayVolume: '¥2,384', yesterdayCount: 8, weekVolume: '¥2.6万', weekCount: 9 },
  { id: '9', name: '[数实] 晚清粉彩暗八仙纹碗', rank: 9, yesterdayVolume: '¥547.99', yesterdayCount: 8, weekVolume: '¥1.00万', weekCount: 15 }
]

export const calendarEvents: CalendarItem[] = [
  {
    date: '2026-05-20',
    events: [
      { id: '1', title: '忒PANDA系列新品发售', type: 'sale', time: '10:00', status: 'upcoming' },
      { id: '2', title: '敦煌秘境专场拍卖', type: 'auction', time: '14:00', status: 'upcoming' },
      { id: '3', title: '新用户空投福利', type: 'airdrop', time: '全天', status: 'ongoing' }
    ]
  },
  {
    date: '2026-05-21',
    events: [
      { id: '4', title: '故宫文物数字藏品首发', type: 'sale', time: '10:00', status: 'upcoming' },
      { id: '5', title: '非遗文化周启动', type: 'event', time: '09:00', status: 'upcoming' }
    ]
  },
  {
    date: '2026-05-22',
    events: [
      { id: '6', title: '数字艺术大师专场', type: 'auction', time: '14:00', status: 'upcoming' }
    ]
  }
]

export const userPortfolio: UserPortfolio = {
  totalAssets: '¥125,800',
  profit: '+¥15,600',
  profitRate: '+14.02%',
  holdings: [
    { id: '1', name: '忒PANDA-Z世代', image: '', quantity: 2, avgCost: '¥1,200', currentPrice: '¥1,250', profit: '+¥100', profitRate: '+4.17%' },
    { id: '2', name: '敦煌秘境45窟', image: '', quantity: 1, avgCost: '¥3,000', currentPrice: '¥3,200', profit: '+¥200', profitRate: '+6.67%' },
    { id: '3', name: '清明上河图', image: '', quantity: 3, avgCost: '¥400', currentPrice: '¥450', profit: '+¥150', profitRate: '+12.5%' }
  ]
}

export const transactionRecords: TransactionRecord[] = [
  { id: '1', type: 'buy', name: '忒PANDA-Z世代', price: '¥1,250', quantity: 1, time: '2026-05-19 10:30', status: 'completed' },
  { id: '2', type: 'sell', name: '红陶兽形器', price: '¥1,219', quantity: 1, time: '2026-05-18 15:45', status: 'completed' },
  { id: '3', type: 'auction', name: '战国彩漆木雕鸳鸯', price: '¥828', quantity: 1, time: '2026-05-17 14:00', status: 'completed' },
  { id: '4', type: 'consignment', name: '长信宫灯', price: '¥710', quantity: 1, time: '2026-05-16 09:20', status: 'pending' }
]

export const monthlyStats = {
  labels: ['1月', '2月', '3月', '4月', '5月'],
  sales: [850, 1200, 980, 1500, 1800],
  volumes: [520, 780, 650, 920, 1100],
  holders: [25000, 28000, 30000, 32000, 35176]
}

export const weeklyStats = {
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  sales: [280, 320, 290, 350, 420, 380, 450],
  volumes: [180, 210, 190, 230, 280, 250, 300]
}

export const auctionStats = {
  todayAuction: 12,
  totalBids: '¥85.6万',
  hotItems: [
    { id: '1', name: '青铜神树', currentBid: '¥15.8万', bids: 23, endTime: '2026-05-20 18:00' },
    { id: '2', name: '千里江山图全卷', currentBid: '¥12.5万', bids: 18, endTime: '2026-05-21 20:00' },
    { id: '3', name: '故宫九龙壁', currentBid: '¥8.6万', bids: 15, endTime: '2026-05-19 22:00' }
  ]
}
