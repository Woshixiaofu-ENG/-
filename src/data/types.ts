export interface Collection {
  id: string;
  name: string;
  artist: string;
  description?: string;
  price: string;
  priceNum: number;
  change: string;
  changeType: 'up' | 'down';
  icon: string;
  image?: string;
  aiScore?: number;
  tags?: string[];
  rank?: number;
  volume?: string;
  volumeNum?: number;
  creator?: string;
  totalSupply?: number;
  issuedDate?: string;
  blockchain?: string;
  rarity?: string;
}

export interface MarketStats {
  totalMarketCap: string;
  change24h: string;
  change24hColor: 'positive' | 'negative';
  volumeRate: string;
  timestamp: number;
  chartData: ChartData[];
}

export interface ChartData {
  label: string;
  value: number;
  timestamp: number;
}

export interface Dynamic {
  id: string;
  type: 'collect' | 'trade' | 'achievement' | 'follow';
  user: User;
  title: string;
  description?: string;
  collection?: Collection;
  timeAgo: string;
  timestamp: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  showComments: boolean;
  commentList?: Comment[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  isFollowing: boolean;
  avatarBg?: string;
  collections?: number;
  followers?: number;
  following?: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  time: string;
  likes?: number;
  replies?: Comment[];
}

export interface PriceAlert {
  id: string;
  name: string;
  type: 'rise' | 'fall';
  targetPrice: string;
  status: 'active' | 'triggered';
}

export interface UserPortfolio {
  totalValue: string;
  totalProfit: string;
  profitRate: string;
  holdings: Collection[];
}

export interface TransactionRecord {
  id: string;
  type: 'buy' | 'sell';
  collection: Collection;
  price: string;
  time: string;
  timeAgo: string;
}

export interface DataSource {
  name: string;
  type: 'mock' | 'api' | 'custom';
  baseUrl?: string;
  enabled: boolean;
}
