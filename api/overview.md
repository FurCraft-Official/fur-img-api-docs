# API 概览

Fur-img-api-next 提供了一套完整的 RESTful API，用于获取随机文件、管理文件列表、监控服务状态和执行管理员操作。

## 基础信息

**基础 URL**：`https://img.furapi.top` 或 `http://localhost:3000`

**API 版本**：3.0.0

**响应格式**：JSON（除文件下载外）

## 认证

管理员端点需要通过查询参数传递 Token：

```
POST /admin/refresh?token=your_admin_token
POST /admin/unban/192.168.1.1?token=your_admin_token
```

## 速率限制

API 实施速率限制以防止滥用。默认配置：

- **时间窗口**：15 分钟
- **请求限制**：100 个请求
- **超限状态码**：429 Too Many Requests

超限时的响应：

```json
{
  "error": "too many requests"
}
```

## 错误处理

所有错误响应都遵循以下格式：

```json
{
  "error": "错误消息",
  "message": "详细错误信息（可选）"
}
```

### 常见错误码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

## API 端点列表

### 随机文件

- [GET /api](./random-files#获取随机文件) - 获取随机文件
- [GET /api/{folderPath}](./random-files#从指定目录获取随机文件) - 从指定目录获取随机文件

### 文件列表

- [GET /filelist](./file-list) - 获取完整文件列表

### 状态检查

- [GET /health](./status#健康检查) - 服务器健康检查
- [GET /banlist](./status#获取被禁用ip列表) - 获取被禁用 IP 列表

### 管理员接口

- [POST /admin/refresh](./admin#刷新数据库) - 刷新数据库
- [POST /admin/unban/{ip}](./admin#解封单个ip) - 解封单个 IP

### 文件下载

- [GET /files/{filePath}](./random-files#直接下载文件) - 直接下载文件

## 请求示例

### 使用 curl

获取随机文件信息：

```bash
curl "https://img.furapi.top/api?json=true"
```

获取特定目录的随机文件：

```bash
curl "https://img.furapi.top/api/photos/2024?json=true"
```

### 使用 JavaScript

```javascript
fetch('https://img.furapi.top/api?json=true')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 使用 Python

```python
import requests

response = requests.get('https://img.furapi.top/api?json=true')
data = response.json()
print(data)
```

## 响应示例

### 成功响应

```json
{
  "file": "photo.jpg",
  "path": "photos/2024",
  "size": 2048576,
  "url": "https://img.furapi.top/files/photos/2024/photo.jpg"
}
```

### 错误响应

```json
{
  "error": "No files found"
}
```

## 下一步

- 查看 [随机文件 API](./random-files) 了解如何获取随机文件
- 查看 [文件列表 API](./file-list) 了解如何获取完整文件列表
- 查看 [状态检查 API](./status) 了解如何监控服务状态
- 查看 [管理员接口](./admin) 了解管理功能
- 使用 [测试工具](./test) 在线测试 API
