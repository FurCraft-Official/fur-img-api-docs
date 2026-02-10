# 管理员接口

管理员接口提供数据库管理和 IP 禁用管理功能。所有管理员端点都需要有效的管理员 Token。

## 刷新数据库

重新扫描配置目录，更新数据库中的文件索引。

### 请求

```http
POST /admin/refresh?token=your_admin_token
```

### 查询参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `token` | string | 是 | 管理员 Token |

### 响应

#### 成功响应

状态码：`200 OK`

```json
{
  "message": "refresh database start"
}
```

#### 错误响应

**未授权（401）**

```json
{
  "error": "Unauthorized"
}
```

**服务器错误（500）**

```json
{
  "error": "refresh failed"
}
```

### 说明

- 刷新操作是异步的，立即返回
- 实际的数据库更新在后台进行
- 刷新期间可以继续使用 API

### 示例

#### 基本请求

```bash
curl -X POST "https://img.furapi.top/admin/refresh?token=your_admin_token"
```

#### 使用 JavaScript

```javascript
async function refreshDatabase(token) {
  const response = await fetch('https://img.furapi.top/admin/refresh?token=' + token, {
    method: 'POST'
  });
  
  if (!response.ok) {
    throw new Error('Failed to refresh database');
  }
  
  const data = await response.json();
  console.log(data.message);
  return data;
}

refreshDatabase('your_admin_token');
```

#### 定期刷新

```javascript
async function schedulePeriodicRefresh(token, intervalMinutes = 60) {
  setInterval(async () => {
    try {
      await refreshDatabase(token);
      console.log('Database refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh database:', error);
    }
  }, intervalMinutes * 60 * 1000);
}

schedulePeriodicRefresh('your_admin_token', 60);
```

---

## 解封单个 IP

从速率限制黑名单中移除指定的 IP 地址。

### 请求

```http
POST /admin/unban/{ip}?token=your_admin_token
```

### 路径参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `ip` | string | 是 | 需要解封的 IP 地址 |

### 查询参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `token` | string | 是 | 管理员 Token |

### 响应

#### 成功响应

状态码：`200 OK`

```json
{
  "message": "Successfully unbanned 192.168.1.100"
}
```

#### 错误响应

**未授权（401）**

```json
{
  "error": "Unauthorized"
}
```

**IP 未找到（404）**

```json
{
  "error": "IP not found in banlist"
}
```

**服务器错误（500）**

```json
{
  "error": "failed to unban IP"
}
```

### 示例

#### 基本请求

```bash
curl -X POST "https://img.furapi.top/admin/unban/192.168.1.100?token=your_admin_token"
```

#### 使用 JavaScript

```javascript
async function unbanIP(ip, token) {
  const response = await fetch(`https://img.furapi.top/admin/unban/${ip}?token=${token}`, {
    method: 'POST'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  const data = await response.json();
  console.log(data.message);
  return data;
}

unbanIP('192.168.1.100', 'your_admin_token');
```

#### 批量解封

```javascript
async function unbanMultipleIPs(ips, token) {
  const results = [];
  
  for (const ip of ips) {
    try {
      const result = await unbanIP(ip, token);
      results.push({ ip, success: true, message: result.message });
    } catch (error) {
      results.push({ ip, success: false, error: error.message });
    }
  }
  
  return results;
}

unbanMultipleIPs(['192.168.1.100', '192.168.1.101'], 'your_admin_token');
```

---

## 安全建议

### Token 管理

1. **修改默认 Token**

   编辑 `config/config.json`：

   ```json
   "admintoken": "your_secure_token_here"
   ```

2. **使用强密码**

   - 至少 16 个字符
   - 包含大小写字母、数字和特殊字符
   - 避免使用常见单词或模式

3. **定期更换 Token**

   建议每 3 个月更换一次。

### 请求安全

1. **使用 HTTPS**

   始终通过 HTTPS 发送管理员请求，避免 Token 在传输中被拦截。

2. **限制访问**

   在防火墙或反向代理中限制管理员端点的访问：

   ```nginx
   location /admin/ {
     allow 192.168.1.0/24;
     deny all;
   }
   ```

3. **监控日志**

   定期检查日志中的管理员操作：

   ```bash
   grep "admin" ./logs/app-$(date +%Y-%m-%d).log
   ```

---

## 使用场景

### 1. 自动化管理面板

```javascript
class AdminPanel {
  constructor(token) {
    this.token = token;
    this.baseUrl = 'https://img.furapi.top';
  }
  
  async refreshDatabase() {
    const response = await fetch(`${this.baseUrl}/admin/refresh?token=${this.token}`, {
      method: 'POST'
    });
    return response.json();
  }
  
  async unbanIP(ip) {
    const response = await fetch(`${this.baseUrl}/admin/unban/${ip}?token=${this.token}`, {
      method: 'POST'
    });
    return response.json();
  }
  
  async getBanlist() {
    const response = await fetch(`${this.baseUrl}/banlist`);
    return response.json();
  }
}

const admin = new AdminPanel('your_admin_token');
```

### 2. 定时维护任务

```javascript
async function setupMaintenanceTasks(token) {
  const admin = new AdminPanel(token);
  
  setInterval(async () => {
    try {
      await admin.refreshDatabase();
      console.log('Database refreshed');
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  }, 24 * 60 * 60 * 1000);
}
```

### 3. 监控和告警

```javascript
async function monitorBannedIPs(token) {
  const admin = new AdminPanel(token);
  
  setInterval(async () => {
    try {
      const banlist = await admin.getBanlist();
      
      if (banlist.ip) {
        console.log(`Alert: IP ${banlist.ip} is banned`);
        console.log(`Hits: ${banlist.totalHits}`);
        
        if (banlist.totalHits > 500) {
          console.log('High hit count detected, consider investigating');
        }
      }
    } catch (error) {
      console.error('Failed to check banlist:', error);
    }
  }, 5 * 60 * 1000);
}
```

---

## 故障排查

### Token 无效

如果收到 401 错误：

1. 检查 Token 是否正确
2. 确保 Token 与配置文件中的值匹配
3. 检查是否有多余的空格或特殊字符

### 刷新失败

如果刷新操作失败：

1. 检查图片目录是否存在
2. 检查目录权限
3. 查看日志文件获取详细错误信息

### IP 未找到

如果解封 IP 时收到 404 错误：

1. 检查 IP 地址格式是否正确
2. 确认 IP 确实在黑名单中
3. 使用 `/banlist` 端点查看当前黑名单
