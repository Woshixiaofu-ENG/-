<template>
  <view class="cyber-container">
    <view class="header-section">
      <view class="user-profile">
        <view class="avatar-ring" @click="goToProfile">
          <view class="avatar">{{ userAvatar }}</view>
          <view class="level-badge">LV.{{ userLevel }}</view>
        </view>
        <view class="user-info">
          <text class="username">{{ username }}</text>
          <view class="exp-bar" @click="showExpDetails">
            <view class="exp-fill" :style="{ width: expProgress + '%' }"></view>
          </view>
          <view class="exp-info">
            <text class="exp-text">EXP {{ userExp }}/{{ nextLevelExp }}</text>
            <text class="points-text">💎 {{ totalPoints }} 积分</text>
          </view>
        </view>
      </view>
      <view class="header-actions">
        <view class="action-btn pulse-btn" @click="toggleAssistant">
          <text class="btn-icon">🤖</text>
        </view>
        <view class="action-btn" @click="openNotifications">
          <text class="btn-icon">🔔</text>
          <view class="notification-dot" v-if="hasNotifications"></view>
        </view>
      </view>
    </view>

    <view class="market-overview">
      <view class="overview-card main-card">
        <view class="card-header">
          <view class="header-left">
            <text class="card-title">市场总览</text>
            <view class="live-indicator">
              <view class="live-dot"></view>
              <text>LIVE</text>
            </view>
          </view>
          <view class="chart-toggle" @click="toggleChartMode">
            <text>{{ chartMode === 'line' ? '📊' : '📈' }}</text>
          </view>
        </view>
        
        <view class="market-stats">
          <view class="stat-item highlight">
            <text class="stat-value neon-text">{{ totalMarketCap }}</text>
            <text class="stat-label">总市值</text>
          </view>
          <view class="stat-item">
            <text class="stat-value" :class="change24hColor">{{ change24h }}</text>
            <text class="stat-label">24h涨跌</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ volumeRate }}</text>
            <text class="stat-label">成交量</text>
          </view>
        </view>

        <view class="chart-section">
          <view class="mini-chart">
            <view class="chart-labels-top">
              <text class="chart-max">¥{{ chartMax }}</text>
              <text class="chart-min">¥{{ chartMin }}</text>
            </view>
            <view class="chart-container" v-if="chartMode === 'line'">
              <svg class="line-svg" viewBox="0 0 200 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#667eea;stop-opacity:0" />
                  </linearGradient>
                </defs>
                <path :d="chartAreaPath" fill="url(#lineGradient)" />
                <polyline :points="chartPoints" fill="none" stroke="#667eea" stroke-width="1.5" />
              </svg>
            </view>
            <view class="bar-chart" v-else>
              <view 
                class="bar" 
                v-for="(h, i) in barChartData" 
                :key="i" 
                :style="{ height: h + '%', animationDelay: i * 0.05 + 's' }"
                :class="{ 'bar-up': h > 50, 'bar-down': h <= 50 }"
              ></view>
            </view>
          </view>
          <view class="chart-labels">
            <text class="chart-label" v-for="label in chartLabels" :key="label">{{ label }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="price-alert-section">
      <view class="section-header-compact">
        <text class="section-title">⏰ 价格预警</text>
        <view class="alert-count" v-if="priceAlerts.length > 0">
          {{ priceAlerts.length }}个活跃预警
        </view>
        <view class="add-alert-btn" @click="openAlertModal">
          <text>+ 添加预警</text>
        </view>
      </view>
      <view class="alert-list">
        <view class="alert-item" v-for="(alert, index) in priceAlerts.slice(0, 2)" :key="index">
          <view class="alert-icon" :class="alert.type">
            {{ alert.type === 'rise' ? '📈' : '📉' }}
          </view>
          <view class="alert-info">
            <text class="alert-name">{{ alert.name }}</text>
            <text class="alert-condition">
              {{ alert.type === 'rise' ? '上涨至' : '下跌至' }} ¥{{ alert.targetPrice }}
            </text>
          </view>
          <view class="alert-status" :class="alert.status">
            {{ alert.status === 'active' ? '监控中' : '已触发' }}
          </view>
          <view class="alert-delete" @click="deleteAlert(index)">×</view>
        </view>
      </view>
    </view>

    <view class="hot-collections">
      <view class="section-header">
        <text class="section-title glitch-text">🔥 热门藏品</text>
        <view class="filter-chips">
          <view 
            class="chip" 
            :class="{ active: activeFilter === 'hot' }"
            @click="activeFilter = 'hot'"
          >🔥 HOT</view>
          <view 
            class="chip" 
            :class="{ active: activeFilter === 'rise' }"
            @click="activeFilter = 'rise'"
          >📈 涨幅</view>
          <view 
            class="chip" 
            :class="{ active: activeFilter === 'new' }"
            @click="activeFilter = 'new'"
          >🆕 新品</view>
        </view>
      </view>
      <scroll-view scroll-x class="collections-scroll">
        <view class="collection-cards">
          <view 
            class="collection-card" 
            v-for="(item, index) in filteredCollections" 
            :key="item.id"
            :class="{ 'card-featured': index === 0 }"
            @click="viewCollection(item)"
            @longpress="showCollectionActions(item)"
          >
            <view class="card-visual">
              <text class="visual-icon">{{ item.icon }}</text>
              <view class="card-rank" :class="getRankClass(index + 1)">#{{ index + 1 }}</view>
              <view class="price-tag" :class="item.changeType">
                {{ item.price }}
              </view>
              <view class="change-badge" :class="item.changeType">
                {{ item.change }}
              </view>
            </view>
            <view class="card-info">
              <text class="collection-name">{{ item.name }}</text>
              <view class="collection-meta">
                <text class="meta-artist">{{ item.artist }}</text>
                <view class="meta-actions">
                  <text class="action-icon" @click.stop="setAlert(item)">🔔</text>
                  <text class="action-icon" @click.stop="addToFavorite(item)">⭐</text>
                </view>
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
          <view class="item-badge" v-if="action.badge">{{ action.badge }}</view>
        </view>
      </view>
    </view>

    <view class="personalized-section">
      <view class="section-header-compact">
        <text class="section-title">✨ 为你推荐</text>
        <view class="ai-badge">
          <text>🤖 AI驱动</text>
        </view>
      </view>
      <view class="recommendation-list">
        <view class="rec-card" v-for="item in recommendations" :key="item.id" @click="viewCollection(item)">
          <view class="rec-image">
            <text class="image-placeholder">{{ item.icon }}</text>
            <view class="ai-score" v-if="item.aiScore">
              <text>AI评分 {{ item.aiScore }}</text>
            </view>
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
          <view class="achievement-reward">
            <text>+500 💎 积分</text>
          </view>
        </view>
        <view class="achievement-close" @click="closeAchievement">×</view>
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

    <view class="ai-assistant" v-if="showAssistant" @click="toggleAssistant">
      <view class="assistant-panel" @click.stop="() => {}">
        <view class="panel-header">
          <view class="panel-title-section">
            <text class="panel-title">🤖 AI 智能助手</text>
            <view class="ai-status">
              <view class="status-dot"></view>
              <text>在线</text>
            </view>
          </view>
          <view class="close-btn" @click="toggleAssistant">×</view>
        </view>
        
        <view class="chat-history" ref="chatHistoryRef">
          <view class="welcome-message" v-if="chatHistory.length === 0">
            <text class="welcome-icon">🤖</text>
            <text class="welcome-text">我是你的专属数藏AI助手，可以帮你：</text>
            <view class="welcome-features">
              <text>📊 分析市场趋势</text>
              <text>🔍 推荐优质藏品</text>
              <text>💰 评估投资价值</text>
              <text>⏰ 设置价格预警</text>
            </view>
          </view>
          <view class="chat-message" v-for="(msg, index) in chatHistory" :key="index" :class="msg.type">
            <text class="message-text">{{ msg.text }}</text>
            <text class="message-time" v-if="msg.time">{{ msg.time }}</text>
          </view>
        </view>
        
        <view class="quick-questions" v-if="chatHistory.length < 3">
          <text class="quick-title">快捷问题：</text>
          <view class="quick-q-list">
            <view class="quick-q" v-for="q in quickQuestions" :key="q.text" @click="askQuestion(q.text)">
              {{ q.icon }} {{ q.text }}
            </view>
          </view>
        </view>
        
        <view class="chat-input">
          <input 
            class="input-field" 
            placeholder="问我任何关于藏品的问题..." 
            v-model="userMessage"
            @confirm="sendMessage"
          />
          <view class="send-btn" @click="sendMessage" :class="{ active: userMessage.trim() }">
            <text>➤</text>
          </view>
        </view>
      </view>
    </view>

    <view class="alert-modal" v-if="showAlertModal" @click="closeAlertModal">
      <view class="modal-content" @click.stop="() => {}">
        <view class="modal-header">
          <text class="modal-title">设置价格预警</text>
          <view class="close-btn" @click="closeAlertModal">×</view>
        </view>
        <view class="modal-body">
          <view class="form-group">
            <text class="form-label">选择藏品</text>
            <picker 
              mode="selector" 
              :range="collectionOptions" 
              range-key="name"
              @change="onCollectionChange"
            >
              <view class="picker-value">
                {{ newAlert.name || '请选择藏品' }}
              </view>
            </picker>
          </view>
          <view class="form-group">
            <text class="form-label">预警类型</text>
            <view class="type-selector">
              <view 
                class="type-btn" 
                :class="{ active: newAlert.type === 'rise' }"
                @click="newAlert.type = 'rise'"
              >
                📈 价格上涨
              </view>
              <view 
                class="type-btn" 
                :class="{ active: newAlert.type === 'fall' }"
                @click="newAlert.type = 'fall'"
              >
                📉 价格下跌
              </view>
            </view>
          </view>
          <view class="form-group">
            <text class="form-label">目标价格 (¥)</text>
            <input 
              class="form-input" 
              type="digit" 
              v-model="newAlert.targetPrice"
              placeholder="输入目标价格"
            />
          </view>
          <view class="form-group">
            <text class="form-label">当前价格参考</text>
            <text class="current-price">{{ newAlert.currentPrice || '¥0' }}</text>
          </view>
        </view>
        <view class="modal-footer">
          <view class="cancel-btn" @click="closeAlertModal">取消</view>
          <view class="confirm-btn" @click="confirmAlert">确认添加</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const userAvatar = ref('👤')
const username = ref('加密探险家')
const userLevel = ref(12)
const userExp = ref(8560)
const nextLevelExp = ref(10000)
const expProgress = computed(() => (userExp.value / nextLevelExp.value) * 100)
const totalPoints = ref(24580)
const hasNotifications = ref(true)

const totalMarketCap = ref('¥11.23亿')
const change24h = ref('+8.6%')
const change24hColor = computed(() => change24h.value.startsWith('+') ? 'positive' : 'negative')
const volumeRate = ref('¥6008万')
const chartMode = ref<'line' | 'bar'>('line')
const chartMax = ref('11.5亿')
const chartMin = ref('10.8亿')
const chartLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '现在']
const lineChartData = ref([45, 52, 48, 65, 58, 72, 68, 78, 75, 85, 80, 88])
const barChartData = ref([45, 52, 48, 65, 58, 72, 68, 78, 75, 85, 80, 88])

const chartPoints = computed(() => {
  return lineChartData.value.map((val, i) => {
    const x = (i / (lineChartData.value.length - 1)) * 200
    const y = 60 - (val / 100) * 60
    return `${x},${y}`
  }).join(' ')
})

const chartAreaPath = computed(() => {
  const points = lineChartData.value.map((val, i) => {
    const x = (i / (lineChartData.value.length - 1)) * 200
    const y = 60 - (val / 100) * 60
    return `${x},${y}`
  })
  return `M0,60 L${points.join(' L')} L200,60 Z`
})

const activeFilter = ref('hot')
const priceAlerts = ref([
  { name: '忒PANDA-Z世代', type: 'rise', targetPrice: '3000', status: 'active' },
  { name: '敦煌秘境45窟', type: 'fall', targetPrice: '2800', status: 'triggered' }
])

const hotCollections = ref([
  { id: '1', name: '忒PANDA-Z世代', artist: 'CCTV数藏', price: '¥2,500', change: '+12.5%', changeType: 'up', icon: '🐼', aiScore: 95 },
  { id: '2', name: '敦煌秘境45窟', artist: '敦煌研究院', price: '¥3,200', change: '+5.6%', changeType: 'up', icon: '🏛️', aiScore: 92 },
  { id: '3', name: '清明上河图', artist: '故宫博物院', price: '¥450', change: '-2.1%', changeType: 'down', icon: '🎨', aiScore: 78 },
  { id: '4', name: '红陶兽形器', artist: '山东博物馆', price: '¥1,219', change: '+15.8%', changeType: 'up', icon: '🐉', aiScore: 88 },
  { id: '5', name: '后母戊鼎', artist: '国家博物馆', price: '¥2,800', change: '+3.2%', changeType: 'up', icon: '🏺', aiScore: 90 }
])

const filteredCollections = computed(() => {
  if (activeFilter.value === 'rise') {
    return [...hotCollections.value].sort((a, b) => 
      parseFloat(b.change) - parseFloat(a.change)
    )
  }
  return hotCollections.value
})

const quickActions = ref([
  { icon: '🔍', label: '搜索藏品', action: 'search', bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { icon: '📈', label: '我的持仓', action: 'portfolio', bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', badge: '6件' },
  { icon: '⏰', label: '价格预警', action: 'alert', bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', badge: '2' },
  { icon: '🎁', label: '限时抢购', action: 'flash', bgGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { icon: '🏆', label: '竞拍大厅', action: 'auction', bgGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { icon: '👥', label: '藏友动态', action: 'social', bgGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
])

const recommendations = ref([
  { 
    id: 'r1', 
    name: '千里江山图数字场景', 
    price: '¥1,150', 
    reason: '基于你的收藏偏好，与你持有的国风系列高度匹配',
    tags: ['国风', '限量', '升值潜力'],
    actionText: '查看详情',
    icon: '🗺️',
    aiScore: 94
  },
  { 
    id: 'r2', 
    name: '夏嵌绿松石兽面纹铜牌饰', 
    price: '¥899', 
    reason: '今日涨幅强劲，AI分析显示买入信号',
    tags: ['青铜器', '历史', '热门'],
    actionText: '加入自选',
    icon: '🔷',
    aiScore: 91
  }
])

const showAchievement = ref(false)
const achievementText = ref('你已收藏10件藏品，获得"初露锋芒"成就！')

const showAssistant = ref(false)
const userMessage = ref('')
const chatHistory = ref<Array<{type: string, text: string, time?: string}>>([])
const chatHistoryRef = ref(null)

const quickQuestions = ref([
  { icon: '📊', text: '今日热门藏品有哪些？' },
  { icon: '📈', text: '帮我分析市场趋势' },
  { icon: '🎨', text: '推荐一些国风藏品' },
  { icon: '💰', text: '哪些值得投资？' }
])

const showAlertModal = ref(false)
const newAlert = ref({
  name: '',
  type: 'rise',
  targetPrice: '',
  currentPrice: ''
})
const collectionOptions = ref([
  { name: '忒PANDA-Z世代', price: '2500' },
  { name: '敦煌秘境45窟', price: '3200' },
  { name: '清明上河图', price: '450' },
  { name: '红陶兽形器', price: '1219' }
])

const getRankClass = (rank: number) => {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return ''
}

const toggleChartMode = () => {
  chartMode.value = chartMode.value === 'line' ? 'bar' : 'line'
}

const viewCollection = (item: { id: string }) => {
  uni.navigateTo({ url: `/pages/detail/detail?id=${item.id}` })
}

const showCollectionActions = (item: { name: string }) => {
  uni.showActionSheet({
    itemList: ['设置价格预警', '加入自选', '查看详情', '分享'],
    success: (res) => {
      if (res.tapIndex === 0) setAlert(item)
      if (res.tapIndex === 1) addToFavorite(item)
    }
  })
}

const setAlert = (item: { name: string }) => {
  newAlert.value.name = item.name
  showAlertModal.value = true
}

const addToFavorite = (item: { name: string }) => {
  uni.showToast({ title: `已添加${item.name}到自选`, icon: 'success' })
}

const handleAction = (action: { action: string; label: string }) => {
  if (action.action === 'alert') {
    showAlertModal.value = true
  } else {
    uni.showToast({ title: action.label, icon: 'none' })
  }
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

const goToProfile = () => {
  uni.showToast({ title: '个人中心', icon: 'none' })
}

const showExpDetails = () => {
  uni.showModal({
    title: '经验值详情',
    content: `当前经验: ${userExp.value}\n升级还需: ${nextLevelExp.value - userExp.value}\n获取方式: 收藏、交易、活跃`,
    showCancel: false
  })
}

const openAlertModal = () => {
  showAlertModal.value = true
  newAlert.value = { name: '', type: 'rise', targetPrice: '', currentPrice: '' }
}

const closeAlertModal = () => {
  showAlertModal.value = false
}

const onCollectionChange = (e: { detail: { value: number } }) => {
  const index = e.detail.value
  newAlert.value.name = collectionOptions.value[index].name
  newAlert.value.currentPrice = '¥' + collectionOptions.value[index].price
}

const confirmAlert = () => {
  if (!newAlert.value.name || !newAlert.value.targetPrice) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  priceAlerts.value.push({
    name: newAlert.value.name,
    type: newAlert.value.type as 'rise' | 'fall',
    targetPrice: newAlert.value.targetPrice,
    status: 'active'
  })
  totalPoints.value += 100
  uni.showToast({ title: '预警设置成功，+100积分', icon: 'success' })
  closeAlertModal()
}

const deleteAlert = (index: number) => {
  priceAlerts.value.splice(index, 1)
  uni.showToast({ title: '预警已删除', icon: 'success' })
}

const sendMessage = () => {
  if (!userMessage.value.trim()) return
  
  const now = new Date()
  const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
  chatHistory.value.push({ type: 'user', text: userMessage.value, time })
  const question = userMessage.value
  userMessage.value = ''
  
  setTimeout(() => {
    const aiTime = new Date()
    const aiTimeStr = `${aiTime.getHours()}:${aiTime.getMinutes().toString().padStart(2, '0')}`
    let response = ''
    let reward = 0
    
    if (question.includes('热门') || question.includes('哪些')) {
      response = '根据实时数据，今日最热门的藏品是：\n\n🥇 忒PANDA-Z世代 - ¥2,500 (+12.5%)\n🥈 敦煌秘境45窟 - ¥3,200 (+5.6%)\n🥉 红陶兽形器 - ¥1,219 (+15.8%)\n\n这些藏品近期成交量活跃，建议关注！'
      reward = 50
    } else if (question.includes('趋势') || question.includes('分析')) {
      response = '📊 市场趋势分析报告：\n\n• 整体市场呈上涨趋势 (+8.6%)\n• 国风系列表现强劲\n• 预计本周成交量将继续增长\n• 建议关注低价位藏品的补涨机会\n\n⚠️ 风险提示：市场有风险，投资需谨慎'
      reward = 80
    } else if (question.includes('国风') || question.includes('中国')) {
      response = '🎨 为你推荐优质国风藏品：\n\n1. 敦煌秘境45窟 - 敦煌研究院授权\n2. 千里江山图 - 故宫博物院\n3. 清明上河图 - 传世名画\n4. 后母戊鼎 - 国家博物馆\n\n这些藏品文化价值深厚，长期持有潜力大！'
      reward = 60
    } else if (question.includes('投资') || question.includes('值得')) {
      response = '💰 AI投资建议：\n\n基于多维度分析，推荐以下藏品：\n\n📈 短期潜力：红陶兽形器 (+15.8%)\n📊 中长期：忒PANDA-Z世代\n🏛️ 价值投资：后母戊鼎\n\n⚠️ AI分析仅供参考，不构成投资建议'
      reward = 100
    } else if (question.includes('预警') || question.includes('提醒')) {
      response = '⏰ 价格预警功能使用指南：\n\n1. 点击藏品卡片上的🔔图标\n2. 设置目标价格\n3. 选择上涨/下跌提醒\n4. 确认即可设置成功\n\n每次成功设置预警可得100积分哦！'
      reward = 30
    } else {
      response = `我理解你的问题："${question}"\n\n作为AI助手，我可以帮你：\n• 分析市场趋势\n• 推荐优质藏品\n• 解答投资疑问\n• 设置价格预警\n\n请换个问题试试？`
      reward = 20
    }
    
    chatHistory.value.push({ type: 'ai', text: response, time: aiTimeStr })
    totalPoints.value += reward
    totalExp.value += reward
    
    nextTick(() => {
      if (chatHistoryRef.value) {
        uni.createSelectorQuery().select('.chat-history').scrollTop = 999999
      }
    })
  }, 800)
}

const askQuestion = (q: string) => {
  userMessage.value = q
  sendMessage()
}

onMounted(() => {
  setTimeout(() => {
    showAchievement.value = true
  }, 2000)
})
</script>

<style lang="scss" scoped>
.cyber-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow-x: hidden;
  padding-bottom: 140rpx;
}

.header-section {
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

.exp-info {
  display: flex;
  gap: 16rpx;
}

.exp-text, .points-text {
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
  padding: 20rpx 32rpx;
}

.overview-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24rpx;
  padding: 32rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
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

.chart-toggle {
  width: 56rpx;
  height: 56rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
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

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }
}

.neon-text {
  text-shadow: 0 0 20rpx rgba(102, 126, 234, 0.8);
}

.stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
}

.chart-section {
  position: relative;
}

.mini-chart {
  height: 120rpx;
  position: relative;
  display: flex;
}

.chart-labels-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.4);
}

.chart-container {
  flex: 1;
  margin-top: 30rpx;
}

.line-svg {
  width: 100%;
  height: 100%;
}

.bar-chart {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 6rpx;
  margin-top: 30rpx;
  height: 100%;
}

.bar {
  flex: 1;
  background: linear-gradient(180deg, #667eea 0%, rgba(102, 126, 234, 0.3) 100%);
  border-radius: 4rpx 4rpx 0 0;
  animation: growUp 0.8s ease-out forwards;
  transform-origin: bottom;

  &.bar-up {
    background: linear-gradient(180deg, #10b981 0%, rgba(16, 185, 129, 0.3) 100%);
  }

  &.bar-down {
    background: linear-gradient(180deg, #ef4444 0%, rgba(239, 68, 68, 0.3) 100%);
  }
}

@keyframes growUp {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12rpx;
}

.chart-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.4);
}

.price-alert-section {
  padding: 20rpx 32rpx;
}

.section-header-compact {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
}

.alert-count {
  font-size: 22rpx;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.2);
  padding: 4rpx 12rpx;
  border-radius: 10rpx;
}

.add-alert-btn {
  margin-left: auto;
  font-size: 24rpx;
  color: #667eea;
  background: rgba(102, 126, 234, 0.2);
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12rpx;
  padding: 16rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.alert-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;

  &.rise {
    background: rgba(16, 185, 129, 0.2);
  }

  &.fall {
    background: rgba(239, 68, 68, 0.2);
  }
}

.alert-info {
  flex: 1;
}

.alert-name {
  display: block;
  font-size: 26rpx;
  font-weight: 500;
  color: #fff;
  margin-bottom: 4rpx;
}

.alert-condition {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
}

.alert-status {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;

  &.active {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }

  &.triggered {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
  }
}

.alert-delete {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.4);
  padding: 8rpx;
}

.hot-collections {
  padding: 20rpx 0;
}

.section-header {
  padding: 0 32rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  font-size: 22rpx;
  font-weight: 700;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;

  &.gold {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #fff;
  }

  &.silver {
    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    color: #fff;
  }

  &.bronze {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    color: #fff;
  }
}

.price-tag {
  position: absolute;
  bottom: 16rpx;
  right: 16rpx;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  font-size: 24rpx;
  font-weight: 600;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;

  &.up {
    color: #10b981;
  }

  &.down {
    color: #ef4444;
  }
}

.change-badge {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  font-size: 20rpx;
  font-weight: 600;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;

  &.up {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }

  &.down {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }
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

.meta-actions {
  display: flex;
  gap: 8rpx;
}

.action-icon {
  font-size: 24rpx;
  padding: 4rpx;
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

.quick-actions {
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
  position: relative;

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

.item-badge {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  background: #ef4444;
  color: #fff;
  font-size: 18rpx;
  padding: 2rpx 8rpx;
  border-radius: 10rpx;
}

.personalized-section {
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
  position: relative;
}

.image-placeholder {
  font-size: 48rpx;
}

.ai-score {
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  font-size: 18rpx;
  padding: 2rpx 10rpx;
  border-radius: 8rpx;
  white-space: nowrap;
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
  display: block;
  margin-bottom: 8rpx;
}

.achievement-reward {
  display: inline-block;
  background: rgba(251, 191, 36, 0.3);
  color: #fbbf24;
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.achievement-close {
  font-size: 40rpx;
  color: rgba(255, 255, 255, 0.6);
  padding: 10rpx;
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
  height: 80vh;
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

.panel-title-section {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.panel-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 6rpx;
  background: rgba(16, 185, 129, 0.2);
  padding: 4rpx 12rpx;
  border-radius: 10rpx;
  font-size: 20rpx;
  color: #10b981;
}

.status-dot {
  width: 8rpx;
  height: 8rpx;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
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

.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40rpx 20rpx;
}

.welcome-icon {
  font-size: 64rpx;
  margin-bottom: 20rpx;
}

.welcome-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24rpx;
}

.welcome-features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12rpx;

  text {
    background: rgba(102, 126, 234, 0.2);
    padding: 12rpx 20rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.chat-message {
  max-width: 85%;
  padding: 16rpx 20rpx;
  border-radius: 16rpx;
  font-size: 26rpx;
  line-height: 1.6;

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

.message-text {
  display: block;
  white-space: pre-wrap;
}

.message-time {
  display: block;
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8rpx;
  text-align: right;
}

.quick-questions {
  padding: 16rpx 0;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.quick-title {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 12rpx;
}

.quick-q-list {
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
  background: rgba(102, 126, 234, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s;

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
  }
}

.alert-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.modal-content {
  width: 100%;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24rpx;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}

.modal-body {
  padding: 32rpx;
}

.form-group {
  margin-bottom: 24rpx;
}

.form-label {
  display: block;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12rpx;
}

.picker-value {
  background: rgba(255, 255, 255, 0.1);
  padding: 20rpx 24rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #fff;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.type-selector {
  display: flex;
  gap: 16rpx;
}

.type-btn {
  flex: 1;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  border: 1rpx solid rgba(255, 255, 255, 0.1);

  &.active {
    background: rgba(102, 126, 234, 0.3);
    color: #fff;
    border-color: #667eea;
  }
}

.form-input {
  background: rgba(255, 255, 255, 0.1);
  padding: 20rpx 24rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #fff;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.current-price {
  font-size: 28rpx;
  color: #10b981;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
  text-align: center;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}
</style>
