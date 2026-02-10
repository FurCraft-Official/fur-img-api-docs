# 状态检查 API

监控服务器状态和获取被禁用 IP 列表。

## 服务器健康检查

获取服务器状态、内存使用、运行时长等信息。

### 请求

```http
GET /health
```

### 查询参数

无

### 响应

#### 成功响应

状态码：`200 OK`

```json
{
  "status": "ok",
  "memory": {
    "rss": "150.25 MB",
    "heapTotal": "200.40 MB",
    "heapUsed": "120.15 MB",
    "external": "5.20 MB"
  },
  "platform": "win32",
  "arch": "x64",
  "nodeVersion": "v20.0.0",
  "uptime": {
    "ms": 3600000,
    "formatted": "0天 1时 0分 0秒"
  },
  "timestamp": "2024-01-15 10:30:45"
}
```

#### 错误响应

状态码：`500 Internal Server Error`

```json
{
  "error": "Health check failed"
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | string | 服务器状态（通常为 "ok"） |
| `memory.rss` | string | 常驻集大小（MB） |
| `memory.heapTotal` | string | 堆总大小（MB） |
| `memory.heapUsed` | string | 堆已用大小（MB） |
| `memory.external` | string | 外部内存（MB） |
| `platform` | string | 操作系统平台 |
| `arch` | string | CPU 架构 |
| `nodeVersion` | string | Node.js 版本 |
| `uptime.ms` | number | 运行时长（毫秒） |
| `uptime.formatted` | string | 格式化的运行时长 |
| `timestamp` | string | 检查时间戳 |

### 示例

#### 基本请求

```bash
curl "https://img.furapi.top/health"
```

#### 使用 JavaScript

```javascript
async function checkHealth() {
  const response = await fetch('https://img.furapi.top/health');
  const data = await response.json();
  
  console.log('Server status:', data.status);
  console.log('Memory usage:', data.memory.heapUsed);
  console.log('Uptime:', data.uptime.formatted);
  
  return data;
}

checkHealth();
```

#### 监控内存使用

```javascript
async function monitorMemory() {
  setInterval(async () => {
    const data = await fetch('https://img.furapi.top/health')
      .then(r => r.json());
    
    const heapUsedMB = parseFloat(data.memory.heapUsed);
    const heapTotalMB = parseFloat(data.memory.heapTotal);
    const usage = (heapUsedMB / heapTotalMB * 100).toFixed(2);
    
    console.log(`Memory usage: ${usage}%`);
    
    if (usage > 80) {
      console.warn('High memory usage detected!');
    }
  }, 60000);
}

monitorMemory();
```

---

## 获取被禁用 IP 列表

返回所有被速率限制触发禁用的 IP 地址和相关信息。

### 请求

```http
GET /banlist
```

### 查询参数

无

### 响应

#### 成功响应（有被禁用的 IP）

状态码：`200 OK`

```json
{
  "ip": "192.168.1.100",
  "totalHits": 150,
  "resetTime": "2024-01-15T11:30:45.000Z"
}
```

#### 成功响应（无被禁用的 IP）

状态码：`200 OK`

```json
{
  "message": "no banned IPs"
}
```

#### 错误响应

状态码：`500 Internal Server Error`

```json
{
  "error": "failed to retrieve banlist"
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `ip` | string | 被禁用的 IP 地址 |
| `totalHits` | number | 该 IP 的请求总数 |
| `resetTime` | string | 禁用重置时间（ISO 8601 格式） |
| `message` | string | 消息（当无被禁用 IP 时） |

### 示例

#### 基本请求

```bash
curl "https://img.furapi.top/banlist"
```

#### 使用 JavaScript

```javascript
async function getBanlist() {
  const response = await fetch('https://img.furapi.top/banlist');
  const data = await response.json();
  
  if (data.message) {
    console.log('No banned IPs');
  } else {
    console.log(`Banned IP: ${data.ip}`);
    console.log(`Total hits: ${data.totalHits}`);
    console.log(`Reset time: ${data.resetTime}`);
  }
  
  return data;
}

getBanlist();
```

#### 定期检查禁用列表

```javascript
async function monitorBanlist() {
  setInterval(async () => {
    const data = await fetch('https://img.furapi.top/banlist')
      .then(r => r.json());
    
    if (data.ip) {
      console.log(`Alert: IP ${data.ip} is banned`);
      console.log(`Hits: ${data.totalHits}`);
    }
  }, 300000);
}

monitorBanlist();
```

---

## 使用场景

### 1. 服务器监控仪表板

```javascript
async function buildMonitoringDashboard() {
  const healthData = await fetch('https://img.furapi.top/health')
    .then(r => r.json());
  
  const banlistData = await fetch('https://img.furapi.top/banlist')
    .then(r => r.json());
  
  const dashboard = {
    status: healthData.status,
    memory: {
      used: healthData.memory.heapUsed,
      total: healthData.memory.heapTotal,
      percentage: (parseFloat(healthData.memory.heapUsed) / 
                   parseFloat(healthData.memory.heapTotal) * 100).toFixed(2)
    },
    uptime: healthData.uptime.formatted,
    bannedIPs: banlistData.message ? 0 : 1,
    timestamp: healthData.timestamp
  };
  
  return dashboard;
}
```

### 2. 自动告警系统

```javascript
async function setupAlerts() {
  setInterval(async () => {
    const data = await fetch('https://img.furapi.top/health')
      .then(r => r.json());
    
    const heapUsedMB = parseFloat(data.memory.heapUsed);
    const heapTotalMB = parseFloat(data.memory.heapTotal);
    const usage = heapUsedMB / heapTotalMB;
    
    if (usage > 0.9) {
      sendAlert(`Critical: Memory usage at ${(usage * 100).toFixed(2)}%`);
    } else if (usage > 0.75) {
      sendWarning(`Warning: Memory usage at ${(usage * 100).toFixed(2)}%`);
    }
  }, 60000);
}
```

### 3. 健康检查端点

```javascript
async function isServerHealthy() {
  try {
    const response = await fetch('https://img.furapi.top/health');
    return response.ok && response.status === 200;
  } catch (error) {
    return false;
  }
}
```

---

## 性能考虑

### 检查频率

建议检查频率：

- **监控仪表板**：每 30 秒
- **告警系统**：每 60 秒
- **定期检查**：每 5 分钟

### 缓存建议

```javascript
const cache = {
  health: { data: null, timestamp: null, ttl: 30000 },
  banlist: { data: null, timestamp: null, ttl: 60000 }
};

async function getCachedHealth() {
  const now = Date.now();
  
  if (cache.health.data && now - cache.health.timestamp < cache.health.ttl) {
    return cache.health.data;
  }
  
  const data = await fetch('https://img.furapi.top/health')
    .then(r => r.json());
  
  cache.health.data = data;
  cache.health.timestamp = now;
  
  return data;
}
```
