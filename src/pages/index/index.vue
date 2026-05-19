<template>
  <view class="cyber-container">
    <canvas canvas-id="particleCanvas" class="particle-canvas"></canvas>
    
    <view class="header-section">
      <view class="user-profile">
        <view class="avatar-ring">
          <view class="avatar">👤</view>
          <view class="level-badge">LV.{{ userLevel }}</view>
        </view>
        <view class="user-info">
          <text class="username">{{ username }}</text>
          <view class="exp-bar">
            <view class="exp-fill" :style="{ width: expProgress + '%' }"></view>
          </view>
          <text class="exp-text">{{ userExp }}/{{ nextLevelExp }} EXP</text>
        </view>
      </view>
      <view class="header-actions">
        <view class="action-btn pulse-btn" @click="toggleAssistant">
          <text class="btn-icon">🤖</text>
        </view>
        <view class="action-btn" @click="openNotifications">
          <text class="btn-icon">🔔</text>
          <view class="notification-dot"></view>
        </view>
      </view>
    </view>

    <view class="market-overview">
      <view class="overview-card main-card">
        <view class="card-glow"></view>
        <view class="card-header">
          <text class="card-title">市场总览</text>
          <view class="live-indicator">
            <view class="live-dot"></view>
            <text>LIVE</text>
          </view>
        </view>
        <view class="market-stats">
          <view class="stat-item highlight">
            <text class="stat-value neon-text">{{ totalMarketCap }}</text>
            <text class="stat-label">总市值</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ change24h }}</text>
            <text class="stat-label">24h涨跌</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ volumeRate }}</text>
            <text class="stat-label">成交量</text>
          </view>
        </view>
        <view class="mini-chart">
          <view class="chart-line">
            <view class="line-point" v-for="(h, i) in marketChart" :key="i" :style="{ height: h + '%' }"></view>
          </view>
        </view>
      </view>
    </view>

    <view class="hot-collections">
      <view class="section-header">
        <text class="section-title glitch-text" data-text="🔥 热门藏品">🔥 热门藏品</text>
        <view class="filter-chips">
          <view class="chip active">🔥 HOT</view>
          <view class="chip">📈 涨幅榜</view>
          <view class="chip">🆕 新品</view>
        </view>
      </view>
      <scroll-view scroll-x class="collections-scroll">
        <view class="collection-cards">
          <view 
            class="collection-card" 
            v-for="(item, index) in hotCollections" 
            :key="item.id"
            :class="{ 'card-featured': index === 0 }"
            @click="viewCollection(item)"
          >
            <view class="card-visual">
              <text class="visual-icon">{{ item.icon }}</text>
              <view class="card-rank">#{{ index + 1 }}</view>
              <view class="price-tag">{{ item.price }}</view>
            </view>
            <view class="card-info">
              <text class="collection-name">{{ item.name }}</text>
              <view class="collection-meta">
                <text class="meta-artist">{{ item.artist }}</text>
                <text class="meta-change" :class="item.changeType">{{ item.change }}</text>
              </view>
            </view>
            <view class="card-hover-effect"></view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="quick-actions">
      <view class="action-grid">
        <view class="grid-item" v-for="(action, index) in quickActions" :key="index" @click="handleAction(action)">
          <view class="item-icon" :style="{ background: action.bgGradient }">
            <text>{{ action.icon }}</text>
          </view>
          <text class="item-label">{{ action.label }}</text>
        </view>
      </view>
    </view>

    <view class="personalized-section">
      <view class="section-header">
        <text class="section-title">✨ 为你推荐</text>
        <view class="ai-badge">
          <text>🤖 AI驱动</text>
        </view>
      </view>
      <view class="recommendation-list">
        <view class="rec-card" v-for="item in recommendations" :key="item.id" @click="viewCollection(item)">
          <view class="rec-image">
            <text class="image-placeholder">{{ item.icon }}</text>
          </view>
          <view class="rec-content">
            <text class="rec-name">{{ item.name }}</text>
            <text class="rec-reason">{{ item.reason }}</text>
            <view class="rec-tags">
              <text class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</text>
            </view>
          </view>
          <view class="rec-action">
            <text class="action-price">{{ item.price }}</text>
            <view class="action-btn-small">{{ item.actionText }}</view>
          </view>
        </view>
      </view>
    </view>

    <view class="achievement-section" v-if="showAchievement">
      <view class="achievement-card">
        <view class="achievement-icon">🏆</view>
        <view class="achievement-content">
          <text class="achievement-title">🎉 新成就解锁！</text>
          <text class="achievement-desc">{{ achievementText }}</text>
        </view>
        <view class="achievement-close" @click="closeAchievement">×</view>
      </view>
    </view>

    <view class="ai-assistant" v-if="showAssistant" @click="toggleAssistant">
      <view class="assistant-panel" @click.stop="() => {}">
        <view class="panel-header">
          <text class="panel-title">🤖 AI 智能助手</text>
          <view class="close-btn" @click="toggleAssistant">×</view>
        </view>
        <view class="chat-history">
          <view class="chat-message" v-for="(msg, index) in chatHistory" :key="index" :class="msg.type">
            <text class="message-text">{{ msg.text }}</text>
          </view>
        </view>
        <view class="chat-input">
          <input 
            class="input-field" 
            placeholder="问我任何关于藏品的问题..." 
            v-model="userMessage"
            @confirm="sendMessage"
          />
          <view class="send-btn" @click="sendMessage">
            <text>➤</text>
          </view>
        </view>
        <view class="quick-questions">
          <view class="quick-q" v-for="q in quickQuestions" :key="q" @click="askQuestion(q)">
            {{ q }}
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-nav">
      <view class="nav-item active">
        <text class="nav-icon">🏠</text>
        <text class="nav-label">首页</text>
      </view>
      <view class="nav-item" @click="goTo('market')">
        <text class="nav-icon">📊</text>
        <text class="nav-label">行情</text>
      </view>
      <view class="nav-item center-nav" @click="goTo('discover')">
        <view class="center-btn">
          <text>⚡</text>
        </view>
      </view>
      <view class="nav-item" @click="goTo('community')">
        <text class="nav-icon">💬</text>
        <text class="nav-label">社区</text>
      </view>
      <view class="nav-item" @click="goTo('profile')">
        <text class="nav-icon">👤</text>
        <text class="nav-label">我的</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const username = ref('加密探险家')
const userLevel = ref(12)
const userExp = ref(8560)
const nextLevelExp = ref(10000)
const expProgress = ref(85.6)

const totalMarketCap = ref('¥11.23亿')
const change24h = ref('+8.6%')
const volumeRate = ref('¥6008万')
const marketChart = ref([30, 45, 35, 60, 50, 75, 65, 80, 70, 90, 85, 95])

const hotCollections = ref([
  { id: '1', name: '忒PANDA-Z世代', artist: 'CCTV数藏', price: '¥2,500', change: '+12.5%', changeType: 'up', icon: '🐼' },
  { id: '2', name: '敦煌秘境45窟', artist: '敦煌研究院', price: '¥3,200', change: '+5.6%', changeType: 'up', icon: '🏛️' },
  { id: '3', name: '清明上河图', artist: '故宫博物院', price: '¥450', change: '-2.1%', changeType: 'down', icon: '🎨' },
  { id: '4', name: '红陶兽形器', artist: '山东博物馆', price: '¥1,219', change: '+15.8%', changeType: 'up', icon: '🐉' },
  { id: '5', name: '后母戊鼎', artist: '国家博物馆', price: '¥2,800', change: '+3.2%', changeType: 'up', icon: '🏺' }
])

const quickActions = ref([
  { icon: '🔍', label: '搜索藏品', action: 'search', bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { icon: '📈', label: '我的持仓', action: 'portfolio', bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { icon: '⏰', label: '价格预警', action: 'alert', bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { icon: '🎁', label: '限时抢购', action: 'flash', bgGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { icon: '🏆', label: '竞拍大厅', action: 'auction', bgGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { icon: '👥', label: '藏友动态', action: 'social', bgGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
])

const recommendations = ref([
  { 
    id: 'r1', 
    name: '千里江山图数字场景', 
    price: '¥1,150', 
    reason: '基于你的收藏偏好推荐',
    tags: ['国风', '限量'],
    actionText: '查看详情',
    icon: '🗺️'
  },
  { 
    id: 'r2', 
    name: '夏嵌绿松石兽面纹铜牌饰', 
    price: '¥899', 
    reason: '今日涨幅强劲，值得关注',
    tags: ['青铜器', '历史'],
    actionText: '加入自选',
    icon: '🔷'
  }
])

const showAchievement = ref(false)
const achievementText = ref('你已收藏10件藏品，获得"初露锋芒"成就！')

const showAssistant = ref(false)
const userMessage = ref('')
const chatHistory = ref([
  { type: 'ai', text: '你好！我是你的数藏AI助手。有什么可以帮你的吗？' }
])
const quickQuestions = ref([
  '今日热门藏品有哪些？',
  '帮我分析市场趋势',
  '推荐一些国风藏品'
])

onMounted(() => {
  setTimeout(() => {
    showAchievement.value = true
  }, 2000)
})

const viewCollection = (item: { id: string }) => {
  uni.navigateTo({ url: `/pages/detail/detail?id=${item.id}` })
}

const handleAction = (action: { action: string }) => {
  uni.showToast({ title: action.action, icon: 'none' })
}

const goTo = (page: string) => {
  uni.showToast({ title: `前往${page}`, icon: 'none' })
}

const toggleAssistant = () => {
  showAssistant.value = !showAssistant.value
}

const openNotifications = () => {
  uni.showToast({ title: '通知列表', icon: 'none' })
}

const closeAchievement = () => {
  showAchievement.value = false
}

const sendMessage = () => {
  if (!userMessage.value.trim()) return
  
  chatHistory.value.push({ type: 'user', text: userMessage.value })
  const question = userMessage.value
  userMessage.value = ''
  
  setTimeout(() => {
    let response = '我来帮你分析这个问题...'
    if (question.includes('热门')) {
      response = '今日最热门的藏品是"忒PANDA-Z世代"，24h交易额达¥2.5万，涨幅12.5%。'
    } else if (question.includes('趋势')) {
      response = '根据数据分析，市场整体呈上涨趋势，预计本周成交量将继续增长。'
    } else if (question.includes('国风')) {
      response = '为你推荐几款国风藏品：敦煌秘境、千里江山图、清明上河图等，都是近期热门。'
    }
    chatHistory.value.push({ type: 'ai', text: response })
  }, 1000)
}

const askQuestion = (q: string) => {
  userMessage.value = q
  sendMessage()
}
</script>

<style lang="scss" scoped>
.cyber-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow-x: hidden;
  padding-bottom: 140rpx;
}

.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.header-section {
  position: relative;
  z-index: 1;
  padding: 80rpx 32rpx 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.avatar-ring {
  position: relative;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  box-shadow: 0 0 20rpx rgba(102, 126, 234, 0.5);
}

.level-badge {
  position: absolute;
  bottom: -10rpx;
  right: -10rpx;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #fff;
  font-size: 18rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-weight: 600;
  box-shadow: 0 0 10rpx rgba(245, 158, 11, 0.5);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.username {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 10rpx rgba(102, 126, 234, 0.5);
}

.exp-bar {
  width: 200rpx;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4rpx;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.exp-text {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.6);
}

.header-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  position: relative;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.pulse-btn {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.notification-dot {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 16rpx;
  height: 16rpx;
  background: #ef4444;
  border-radius: 50%;
}

.market-overview {
  position: relative;
  z-index: 1;
  padding: 20rpx 32rpx;
}

.overview-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24rpx;
  padding: 32rpx;
  position: relative;
  overflow: hidden;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.main-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: rgba(239, 68, 68, 0.2);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.live-dot {
  width: 12rpx;
  height: 12rpx;
  background: #ef4444;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.live-indicator text {
  font-size: 20rpx;
  color: #ef4444;
  font-weight: 600;
}

.market-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.stat-item {
  text-align: center;
}

.stat-item.highlight {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8rpx;
}

.neon-text {
  text-shadow: 0 0 20rpx rgba(102, 126, 234, 0.8);
}

.stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
}

.mini-chart {
  height: 100rpx;
  position: relative;
}

.chart-line {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  gap: 8rpx;
}

.line-point {
  flex: 1;
  background: linear-gradient(180deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.4) 100%);
  border-radius: 4rpx 4rpx 0 0;
  transition: height 0.5s ease;
  animation: growUp 1s ease-out forwards;
}

@keyframes growUp {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

.hot-collections {
  position: relative;
  z-index: 1;
  padding: 20rpx 0;
}

.section-header {
  padding: 0 32rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}

.glitch-text {
  position: relative;
  animation: glitch 3s infinite;
}

@keyframes glitch {
  0%, 90%, 100% { transform: translate(0); }
  92% { transform: translate(-2px, 2px); }
  94% { transform: translate(2px, -2px); }
  96% { transform: translate(-2px, -2px); }
  98% { transform: translate(2px, 2px); }
}

.filter-chips {
  display: flex;
  gap: 12rpx;
}

.chip {
  padding: 8rpx 16rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-color: transparent;
  }
}

.collections-scroll {
  white-space: nowrap;
  padding: 0 32rpx;
}

.collection-cards {
  display: inline-flex;
  gap: 20rpx;
}

.collection-card {
  width: 280rpx;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20rpx;
  overflow: hidden;
  position: relative;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
  }

  &.card-featured {
    width: 320rpx;
    box-shadow: 0 10rpx 40rpx rgba(102, 126, 234, 0.3);
  }
}

.card-visual {
  height: 200rpx;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.visual-icon {
  font-size: 80rpx;
  filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.3));
}

.card-rank {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #fff;
  font-size: 22rpx;
  font-weight: 700;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(251, 191, 36, 0.4);
}

.price-tag {
  position: absolute;
  bottom: 16rpx;
  right: 16rpx;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  color: #fff;
  font-size: 24rpx;
  font-weight: 600;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}

.card-info {
  padding: 20rpx;
}

.collection-name {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.collection-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-artist {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.meta-change {
  font-size: 22rpx;
  font-weight: 600;

  &.up {
    color: #10b981;
  }

  &.down {
    color: #ef4444;
  }
}

.card-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.collection-card:hover .card-hover-effect {
  opacity: 1;
}

.quick-actions {
  position: relative;
  z-index: 1;
  padding: 20rpx 32rpx;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx 16rpx;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;

  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.08);
  }
}

.item-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
}

.item-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.personalized-section {
  position: relative;
  z-index: 1;
  padding: 20rpx 32rpx;
}

.ai-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  color: #fff;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 20rpx;
}

.rec-card {
  display: flex;
  gap: 20rpx;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16rpx;
  padding: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
    background: rgba(255, 255, 255, 0.08);
  }
}

.rec-image {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 48rpx;
}

.rec-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.rec-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
}

.rec-reason {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
}

.rec-tags {
  display: flex;
  gap: 8rpx;
  margin-top: 8rpx;
}

.tag {
  padding: 4rpx 12rpx;
  background: rgba(102, 126, 234, 0.3);
  border-radius: 8rpx;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.8);
}

.rec-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.action-price {
  font-size: 28rpx;
  font-weight: 700;
  color: #fff;
}

.action-btn-small {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 10rpx 20rpx;
  border-radius: 10rpx;
  font-size: 22rpx;
  font-weight: 500;
}

.achievement-section {
  position: fixed;
  top: 120rpx;
  left: 32rpx;
  right: 32rpx;
  z-index: 100;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(251, 191, 36, 0.5);
  box-shadow: 0 10rpx 40rpx rgba(251, 191, 36, 0.3);
  animation: slideDown 0.5s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.achievement-icon {
  font-size: 48rpx;
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4rpx;
}

.achievement-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.achievement-close {
  font-size: 40rpx;
  color: rgba(255, 255, 255, 0.6);
  padding: 10rpx;
}

.ai-assistant {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 200;
  display: flex;
  align-items: flex-end;
}

.assistant-panel {
  width: 100%;
  height: 70vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 32rpx 32rpx 0 0;
  display: flex;
  flex-direction: column;
  padding: 32rpx;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.panel-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}

.close-btn {
  font-size: 48rpx;
  color: rgba(255, 255, 255, 0.6);
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 20rpx 0;
}

.chat-message {
  max-width: 80%;
  padding: 16rpx 20rpx;
  border-radius: 16rpx;
  font-size: 26rpx;
  line-height: 1.5;

  &.ai {
    align-self: flex-start;
    background: rgba(102, 126, 234, 0.3);
    color: #fff;
    border-bottom-left-radius: 4rpx;
  }

  &.user {
    align-self: flex-end;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-bottom-right-radius: 4rpx;
  }
}

.chat-input {
  display: flex;
  gap: 16rpx;
  padding: 20rpx 0;
}

.input-field {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 40rpx;
  padding: 20rpx 32rpx;
  font-size: 28rpx;
  color: #fff;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.send-btn {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #fff;
}

.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.quick-q {
  padding: 12rpx 20rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16rpx 0;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  padding: 10rpx 20rpx;
  transition: all 0.3s;

  &.active {
    .nav-icon {
      transform: scale(1.2);
    }
    .nav-label {
      color: #667eea;
    }
  }
}

.nav-icon {
  font-size: 36rpx;
  transition: transform 0.3s;
}

.nav-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.6);
}

.center-nav {
  margin-top: -30rpx;
}

.center-btn {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(102, 126, 234, 0.5);
}
</style>
