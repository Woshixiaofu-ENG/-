import {
  Collection,
  MarketStats,
  Dynamic,
  User,
  Comment,
  PriceAlert,
  UserPortfolio,
  TransactionRecord
} from './types';

// API配置
const API_CONFIG = {
  baseUrl: 'http://localhost:3000/api',
  timeout: 10000
};

// API请求封装
const request = async (url, options = {}) => {
  try {
    const fullUrl = `${API_CONFIG.baseUrl}${url}`;
    
    return new Promise((resolve, reject) => {
      uni.request({
        url: fullUrl,
        method: options.method || 'GET',
        data: options.data,
        header: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        timeout: API_CONFIG.timeout,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        },
        fail: (err) => {
          console.error('API请求失败:', err);
          reject(err);
        }
      });
    });
  } catch (error) {
    console.error('API请求异常:', error);
    throw error;
  }
};

// API服务
export const apiService = {
  async getCollections() {
    try {
      const res = await request('/collections');
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message || '获取藏品列表失败');
    } catch (error) {
      console.error('获取藏品列表失败，降级到本地数据:', error);
      return null;
    }
  },
  
  async getCollectionDetail(id) {
    try {
      const res = await request(`/collections/${id}`);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message || '获取藏品详情失败');
    } catch (error) {
      console.error('获取藏品详情失败:', error);
      return null;
    }
  },
  
  async getMarketStats() {
    try {
      const res = await request('/market-stats');
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message || '获取市场统计失败');
    } catch (error) {
      console.error('获取市场统计失败，降级到本地数据:', error);
      return null;
    }
  },
  
  async refreshData() {
    try {
      const res = await request('/refresh', { method: 'POST' });
      if (res.success) {
        return res;
      }
      throw new Error(res.message || '刷新数据失败');
    } catch (error) {
      console.error('刷新数据失败:', error);
      throw error;
    }
  },
  
  async getStatus() {
    try {
      const res = await request('/status');
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message || '获取状态失败');
    } catch (error) {
      console.error('获取状态失败:', error);
      return null;
    }
  }
};

// WebSocket连接管理
class WebSocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }
  
  connect() {
    if (this.socket) return;
    
    try {
      const wsUrl = API_CONFIG.baseUrl.replace('http', 'ws');
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log('🔌 WebSocket已连接');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('消息解析失败:', error);
        }
      };
      
      this.socket.onclose = () => {
        console.log('🔌 WebSocket已断开');
        this.isConnected = false;
        this.attemptReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('🔌 WebSocket错误:', error);
      };
    } catch (error) {
      console.error('WebSocket连接失败:', error);
    }
  }
  
  handleMessage(data) {
    console.log('📨 收到WebSocket消息:', data);
    
    if (data.type === 'DATA_UPDATED') {
      uni.$emit('data-updated', data.data);
      uni.showToast({
        title: '数据已更新',
        icon: 'success',
        duration: 1500
      });
    }
  }
  
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('达到最大重连次数，停止重连');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`🔌 尝试第 ${this.reconnectAttempts} 次重连，延迟 ${delay}ms`);
    
    setTimeout(() => {
      if (!this.isConnected) {
        this.connect();
      }
    }, delay);
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export const wsManager = new WebSocketManager();
