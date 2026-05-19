export interface CollectionStats {
  consignmentTotal: string
  chainTotal: string
  consignmentRate: string
  salesTotal: string
  chainValue: string
  premiumRate: string
  holderCount: string
  updateTime: string
}

export interface CollectionItem {
  id: string
  name: string
  rank: number
  volume24h: string
  volume24hNum: number
  count24h: number
  circulation: number
  change?: string
  image?: string
}

export interface MarketItem {
  id: string
  name: string
  rank: number
  yesterdayVolume: string
  yesterdayCount: number
  weekVolume?: string
  weekCount?: number
  monthVolume?: string
  monthCount?: number
}

export interface CalendarItem {
  date: string
  events: CalendarEvent[]
}

export interface CalendarEvent {
  id: string
  title: string
  type: 'sale' | 'auction' | 'airdrop' | 'event'
  time: string
  status: 'upcoming' | 'ongoing' | 'ended'
}

export interface UserPortfolio {
  totalAssets: string
  profit: string
  profitRate: string
  holdings: HoldingItem[]
}

export interface HoldingItem {
  id: string
  name: string
  image: string
  quantity: number
  avgCost: string
  currentPrice: string
  profit: string
  profitRate: string
}

export interface TransactionRecord {
  id: string
  type: 'buy' | 'sell' | 'auction' | 'consignment'
  name: string
  price: string
  quantity: number
  time: string
  status: 'completed' | 'pending' | 'cancelled'
}
