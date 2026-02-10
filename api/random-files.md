# 随机文件 API

获取随机文件是 Fur-img-api-next 的核心功能。本页面详细介绍了如何使用随机文件 API。

## 获取随机文件

从所有文件中随机返回一个文件。

### 请求

```http
GET /api
GET /api?json=true
```

### 查询参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `json` | string | 否 | 设置为 `true` 时返回 JSON 格式的文件信息，否则返回文件本身 |

### 响应

#### 成功响应（JSON 格式）

状态码：`200 OK`

```json
{
  "file": "photo.jpg",
  "path": "photos/2024",
  "size": 2048576,
  "url": "https://img.furapi.top/files/photos/2024/photo.jpg"
}
```

#### 成功响应（文件格式）

状态码：`200 OK`

返回文件的二进制内容，Content-Type 根据文件类型自动设置。

#### 错误响应

状态码：`404 Not Found`

```json
{
  "error": "No files found"
}
```

### 示例

#### 获取随机文件信息

```bash
curl "https://img.furapi.top/api?json=true"
```

响应：

```json
{
  "file": "sunset.jpg",
  "path": "photos/2024",
  "size": 3145728,
  "url": "https://img.furapi.top/files/photos/2024/sunset.jpg"
}
```

#### 获取随机文件（直接下载）

```bash
curl "https://img.furapi.top/api" -o random_file.jpg
```

#### 使用 JavaScript

```javascript
async function getRandomFile() {
  const response = await fetch('https://img.furapi.top/api?json=true');
  const data = await response.json();
  console.log('Random file:', data);
  return data;
}

getRandomFile();
```

---

## 从指定目录获取随机文件

从指定文件夹中随机返回一个文件。支持多级目录路径。

### 请求

```http
GET /api/{folderPath}
GET /api/{folderPath}?json=true
```

### 路径参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `folderPath` | string | 是 | 文件夹路径，支持多级目录（如 `photos/2024`） |

### 查询参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `json` | string | 否 | 设置为 `true` 时返回 JSON 格式的文件信息 |

### 响应

#### 成功响应（JSON 格式）

状态码：`200 OK`

```json
{
  "file": "photo.jpg",
  "path": "photos/2024",
  "size": 2048576,
  "url": "https://img.furapi.top/files/photos/2024/photo.jpg"
}
```

#### 错误响应

状态码：`404 Not Found`

```json
{
  "error": "No files found in this folder"
}
```

### 示例

#### 从特定目录获取随机文件

```bash
curl "https://img.furapi.top/api/photos/2024?json=true"
```

响应：

```json
{
  "file": "beach.jpg",
  "path": "photos/2024",
  "size": 4194304,
  "url": "https://img.furapi.top/files/photos/2024/beach.jpg"
}
```

#### 多级目录

```bash
curl "https://img.furapi.top/api/photos/2024/january?json=true"
```

#### 使用 JavaScript

```javascript
async function getRandomFileFromFolder(folderPath) {
  const response = await fetch(`https://img.furapi.top/api/${folderPath}?json=true`);
  if (!response.ok) {
    throw new Error('Folder not found or no files in folder');
  }
  const data = await response.json();
  return data;
}

getRandomFileFromFolder('photos/2024');
```

---

## 直接下载文件

从配置的图片目录中直接下载文件。

### 请求

```http
GET /files/{filePath}
```

### 路径参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `filePath` | string | 是 | 文件路径 |

### 响应

#### 成功响应

状态码：`200 OK`

返回文件的二进制内容。

#### 错误响应

状态码：`404 Not Found`

```json
{
  "error": "File not found"
}
```

### 示例

#### 下载文件

```bash
curl "https://img.furapi.top/files/photos/2024/photo.jpg" -o photo.jpg
```

#### 在浏览器中打开

```
https://img.furapi.top/files/photos/2024/photo.jpg
```

#### 使用 JavaScript

```javascript
async function downloadFile(filePath, filename) {
  const response = await fetch(`https://img.furapi.top/files/${filePath}`);
  const blob = await response.blob();
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

downloadFile('photos/2024/photo.jpg', 'photo.jpg');
```

---

## 常见用例

### 1. 随机图片轮播

```javascript
async function startImageCarousel() {
  const imageElement = document.getElementById('carousel-image');
  
  setInterval(async () => {
    const data = await fetch('https://img.furapi.top/api?json=true')
      .then(r => r.json());
    imageElement.src = data.url;
  }, 5000);
}
```

### 2. 特定分类的随机图片

```javascript
async function getRandomPhotoFromCategory(category) {
  const response = await fetch(`https://img.furapi.top/api/${category}?json=true`);
  return response.json();
}

getRandomPhotoFromCategory('photos/2024');
```

### 3. 批量获取随机文件

```javascript
async function getMultipleRandomFiles(count) {
  const files = [];
  for (let i = 0; i < count; i++) {
    const data = await fetch('https://img.furapi.top/api?json=true')
      .then(r => r.json());
    files.push(data);
  }
  return files;
}

getMultipleRandomFiles(10);
```

---

## 速率限制

随机文件 API 受速率限制保护。默认配置：

- **时间窗口**：15 分钟
- **请求限制**：100 个请求

超限时返回 `429 Too Many Requests`。

## 缓存建议

为了提高性能，建议在客户端实现缓存：

```javascript
const cache = new Map();

async function getCachedRandomFile(cacheTime = 60000) {
  const now = Date.now();
  
  if (cache.has('randomFile')) {
    const { data, timestamp } = cache.get('randomFile');
    if (now - timestamp < cacheTime) {
      return data;
    }
  }
  
  const data = await fetch('https://img.furapi.top/api?json=true')
    .then(r => r.json());
  
  cache.set('randomFile', { data, timestamp: now });
  return data;
}
```
