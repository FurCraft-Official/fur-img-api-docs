# 文件列表 API

获取服务器上所有文件的完整列表，按目录组织。

## 获取完整文件列表

### 请求

```http
GET /filelist
```

### 查询参数

无

### 响应

#### 成功响应

状态码：`200 OK`

```json
{
  "photos/2024": {
    "photo1.jpg": "/files/photos/2024/photo1.jpg",
    "photo2.jpg": "/files/photos/2024/photo2.jpg"
  },
  "photos/2023": {
    "sunset.jpg": "/files/photos/2023/sunset.jpg",
    "beach.jpg": "/files/photos/2023/beach.jpg"
  },
  ".": {
    "readme.txt": "/files/readme.txt"
  }
}
```

#### 错误响应

状态码：`500 Internal Server Error`

```json
{
  "error": "get files failed"
}
```

## 响应格式说明

### 目录结构

- **键**：文件夹路径（相对于配置的图片目录）
- **值**：该文件夹中的文件对象
- **根目录**：用 `.` 表示

### 文件对象

- **键**：文件名
- **值**：文件的访问 URL

## 示例

### 基本请求

```bash
curl "https://img.furapi.top/filelist"
```

### 完整响应示例

```json
{
  "photos/2024": {
    "photo1.jpg": "/files/photos/2024/photo1.jpg",
    "photo2.jpg": "/files/photos/2024/photo2.jpg",
    "photo3.png": "/files/photos/2024/photo3.png"
  },
  "photos/2023": {
    "sunset.jpg": "/files/photos/2023/sunset.jpg",
    "beach.jpg": "/files/photos/2023/beach.jpg"
  },
  "videos": {
    "demo.mp4": "/files/videos/demo.mp4"
  },
  ".": {
    "readme.txt": "/files/readme.txt"
  }
}
```

## 使用场景

### 1. 构建文件浏览器

```javascript
async function buildFileExplorer() {
  const response = await fetch('https://img.furapi.top/filelist');
  const fileList = await response.json();
  
  const explorer = document.getElementById('file-explorer');
  
  for (const [folder, files] of Object.entries(fileList)) {
    const folderDiv = document.createElement('div');
    folderDiv.className = 'folder';
    folderDiv.innerHTML = `<h3>${folder === '.' ? 'Root' : folder}</h3>`;
    
    const fileList = document.createElement('ul');
    for (const [filename, url] of Object.entries(files)) {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${url}" target="_blank">${filename}</a>`;
      fileList.appendChild(li);
    }
    
    folderDiv.appendChild(fileList);
    explorer.appendChild(folderDiv);
  }
}

buildFileExplorer();
```

### 2. 统计文件信息

```javascript
async function getFileStats() {
  const response = await fetch('https://img.furapi.top/filelist');
  const fileList = await response.json();
  
  let totalFiles = 0;
  let totalFolders = 0;
  const fileTypes = {};
  
  for (const [folder, files] of Object.entries(fileList)) {
    totalFolders++;
    
    for (const filename of Object.keys(files)) {
      totalFiles++;
      
      const ext = filename.split('.').pop();
      fileTypes[ext] = (fileTypes[ext] || 0) + 1;
    }
  }
  
  console.log('Total files:', totalFiles);
  console.log('Total folders:', totalFolders);
  console.log('File types:', fileTypes);
}

getFileStats();
```

### 3. 搜索文件

```javascript
async function searchFiles(query) {
  const response = await fetch('https://img.furapi.top/filelist');
  const fileList = await response.json();
  
  const results = [];
  
  for (const [folder, files] of Object.entries(fileList)) {
    for (const [filename, url] of Object.entries(files)) {
      if (filename.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          filename,
          folder: folder === '.' ? 'Root' : folder,
          url
        });
      }
    }
  }
  
  return results;
}

searchFiles('photo');
```

### 4. 按文件类型过滤

```javascript
async function getFilesByType(extension) {
  const response = await fetch('https://img.furapi.top/filelist');
  const fileList = await response.json();
  
  const results = [];
  
  for (const [folder, files] of Object.entries(fileList)) {
    for (const [filename, url] of Object.entries(files)) {
      if (filename.endsWith(`.${extension}`)) {
        results.push({
          filename,
          folder: folder === '.' ? 'Root' : folder,
          url
        });
      }
    }
  }
  
  return results;
}

getFilesByType('jpg');
```

## 性能考虑

### 缓存建议

由于文件列表可能很大，建议在客户端实现缓存：

```javascript
const cache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000
};

async function getCachedFileList() {
  const now = Date.now();
  
  if (cache.data && now - cache.timestamp < cache.ttl) {
    return cache.data;
  }
  
  const response = await fetch('https://img.furapi.top/filelist');
  const data = await response.json();
  
  cache.data = data;
  cache.timestamp = now;
  
  return data;
}
```

### 分页加载

对于大型文件列表，考虑分页加载：

```javascript
async function loadFilesInBatches(batchSize = 100) {
  const response = await fetch('https://img.furapi.top/filelist');
  const fileList = await response.json();
  
  let count = 0;
  const batches = [];
  let currentBatch = {};
  
  for (const [folder, files] of Object.entries(fileList)) {
    for (const [filename, url] of Object.entries(files)) {
      currentBatch[filename] = url;
      count++;
      
      if (count >= batchSize) {
        batches.push(currentBatch);
        currentBatch = {};
        count = 0;
      }
    }
  }
  
  if (count > 0) {
    batches.push(currentBatch);
  }
  
  return batches;
}
```

## 限制

- 返回所有文件，可能很大
- 不支持分页或过滤
- 受速率限制保护
