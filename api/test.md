<script setup>
import { ref, computed } from 'vue'

const apiUrl = ref('https://img.furapi.top')
const adminToken = ref('')
const folderPath = ref('photos/2024')
const ipAddress = ref('192.168.1.100')
const selectedTest = ref('random')
const response = ref(null)
const loading = ref(false)
const error = ref(null)

const testResults = ref([])

async function makeRequest(method, endpoint, params = {}) {
  loading.value = true
  error.value = null
  response.value = null
  
  try {
    let url = `${apiUrl.value}${endpoint}`
    const options = { method }
    
    if (method === 'POST') {
      options.headers = { 'Content-Type': 'application/json' }
    }
    
    if (Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString()
      url += `?${queryString}`
    }
    
    const res = await fetch(url, options)
    const data = await res.json()
    
    response.value = {
      status: res.status,
      statusText: res.statusText,
      data: data,
      timestamp: new Date().toLocaleTimeString()
    }
    
    testResults.value.unshift({
      endpoint,
      method,
      status: res.status,
      timestamp: new Date().toLocaleTimeString()
    })
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function testRandomFile() {
  await makeRequest('GET', '/api', { json: 'true' })
}

async function testRandomFileFromFolder() {
  await makeRequest('GET', `/api/${folderPath.value}`, { json: 'true' })
}

async function testFileList() {
  await makeRequest('GET', '/filelist')
}

async function testHealth() {
  await makeRequest('GET', '/health')
}

async function testBanlist() {
  await makeRequest('GET', '/banlist')
}

async function testRefreshDatabase() {
  if (!adminToken.value) {
    error.value = 'Please enter admin token'
    return
  }
  await makeRequest('POST', '/admin/refresh', { token: adminToken.value })
}

async function testUnbanIP() {
  if (!adminToken.value) {
    error.value = 'Please enter admin token'
    return
  }
  await makeRequest('POST', `/admin/unban/${ipAddress.value}`, { token: adminToken.value })
}

const statusColor = computed(() => {
  if (!response.value) return ''
  if (response.value.status >= 200 && response.value.status < 300) return 'success'
  if (response.value.status >= 400 && response.value.status < 500) return 'warning'
  return 'error'
})
</script>

# API 测试工具

在这个页面上，你可以直接测试所有 API 端点。选择一个测试，输入必要的参数，然后点击测试按钮查看结果。

## 配置

<div class="config-section">

**API 基础 URL**

<input v-model="apiUrl" type="text" placeholder="https://img.furapi.top" class="input-field" />

**管理员 Token（用于管理员操作）**

<input v-model="adminToken" type="password" placeholder="Enter admin token" class="input-field" />

</div>

## 测试

### 随机文件 API

<div class="test-section">

#### 获取随机文件

<button @click="testRandomFile" :disabled="loading" class="test-button">
  {{ loading ? '测试中...' : '测试' }}
</button>

#### 从指定目录获取随机文件

<div class="input-group">
  <label>文件夹路径</label>
  <input v-model="folderPath" type="text" placeholder="photos/2024" class="input-field" />
</div>

<button @click="testRandomFileFromFolder" :disabled="loading" class="test-button">
  {{ loading ? '测试中...' : '测试' }}
</button>

</div>

### 文件列表 API

<div class="test-section">

<button @click="testFileList" :disabled="loading" class="test-button">
  {{ loading ? '测试中...' : '获取文件列表' }}
</button>

</div>

### 状态检查 API

<div class="test-section">

#### 健康检查

<button @click="testHealth" :disabled="loading" class="test-button">
  {{ loading ? '测试中...' : '健康检查' }}
</button>

#### 获取被禁用 IP 列表

<button @click="testBanlist" :disabled="loading" class="test-button">
  {{ loading ? '测试中...' : '获取黑名单' }}
</button>

</div>

### 管理员接口

<div class="test-section">

#### 刷新数据库

<button @click="testRefreshDatabase" :disabled="loading" class="test-button admin-button">
  {{ loading ? '测试中...' : '刷新数据库' }}
</button>

#### 解封 IP

<div class="input-group">
  <label>IP 地址</label>
  <input v-model="ipAddress" type="text" placeholder="192.168.1.100" class="input-field" />
</div>

<button @click="testUnbanIP" :disabled="loading" class="test-button admin-button">
  {{ loading ? '测试中...' : '解封 IP' }}
</button>

</div>

## 响应结果

<div v-if="error" class="error-box">
  <strong>错误：</strong> {{ error }}
</div>

<div v-if="response" :class="['response-box', statusColor]">
  <div class="response-header">
    <span class="status-code">{{ response.status }} {{ response.statusText }}</span>
    <span class="timestamp">{{ response.timestamp }}</span>
  </div>
  <pre class="response-content">{{ JSON.stringify(response.data, null, 2) }}</pre>
</div>

## 测试历史

<div v-if="testResults.length > 0" class="history-section">
  <h3>最近的测试</h3>
  <div class="history-list">
    <div v-for="(result, index) in testResults.slice(0, 10)" :key="index" class="history-item">
      <span class="method" :class="result.method.toLowerCase()">{{ result.method }}</span>
      <span class="endpoint">{{ result.endpoint }}</span>
      <span class="status" :class="result.status >= 200 && result.status < 300 ? 'success' : 'error'">
        {{ result.status }}
      </span>
      <span class="time">{{ result.timestamp }}</span>
    </div>
  </div>
</div>

<style scoped>
.config-section,
.test-section {
  margin: 20px 0;
  padding: 15px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.input-group {
  margin: 10px 0;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.input-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: monospace;
  font-size: 14px;
}

.input-field:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px rgba(var(--vp-c-brand-rgb), 0.1);
}

.test-button {
  padding: 10px 20px;
  margin: 5px 5px 5px 0;
  border: none;
  border-radius: 4px;
  background: var(--vp-c-brand);
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.test-button:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-rgb), 0.3);
}

.test-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.test-button.admin-button {
  background: var(--vp-c-warning);
}

.test-button.admin-button:hover:not(:disabled) {
  background: var(--vp-c-warning-dark);
}

.error-box {
  padding: 12px 16px;
  margin: 15px 0;
  border-radius: 4px;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
  border-left: 4px solid var(--vp-c-danger);
}

.response-box {
  margin: 15px 0;
  border-radius: 4px;
  border-left: 4px solid;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.response-box.success {
  border-left-color: var(--vp-c-success);
}

.response-box.warning {
  border-left-color: var(--vp-c-warning);
}

.response-box.error {
  border-left-color: var(--vp-c-danger);
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.status-code {
  font-weight: 600;
  font-family: monospace;
}

.timestamp {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.response-content {
  padding: 16px;
  margin: 0;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.history-section {
  margin-top: 30px;
  padding: 15px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  background: var(--vp-c-bg);
  font-size: 13px;
  font-family: monospace;
}

.method {
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--vp-c-bg-soft);
}

.method.get {
  color: var(--vp-c-info);
}

.method.post {
  color: var(--vp-c-success);
}

.endpoint {
  flex: 1;
  color: var(--vp-c-text-1);
}

.status {
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--vp-c-bg-soft);
}

.status.success {
  color: var(--vp-c-success);
}

.status.error {
  color: var(--vp-c-danger);
}

.time {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

@media (max-width: 768px) {
  .response-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .history-item {
    flex-wrap: wrap;
  }
}
</style>
