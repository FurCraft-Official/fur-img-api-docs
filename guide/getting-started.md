# 快速开始

欢迎使用 Fur-img-api-next！本指南将帮助你快速上手这个高性能的图片/文件服务 API。

## 环境要求

在开始之前，请确保你的系统满足以下要求：

- **Node.js** >= 18.18.0
- **npm** >= 9.0.0

## 安装

### 1. 克隆项目

```bash
git clone https://github.com/114514-lang/Fur-img-api-next.git
cd Fur-img-api-next
```

### 2. 安装依赖

```bash
npm install
```

项目已预装以下关键依赖：

- `express` - Web 框架
- `better-sqlite3` - SQLite3 数据库
- `pino` - 高性能日志库
- `cors` - CORS 中间件
- `express-rate-limit` - 速率限制
- `compression` - Gzip 压缩
- 以及其他辅助库

## 配置

### 编辑配置文件

编辑 `config/config.json` 配置文件来自定义服务器设置：

```json
{
  "server": {
    "addr": "localhost",
    "httpport": 3000,
    "httpsport": 3001,
    "forcehttps": false,
    "gzip": false,
    "ssl": {
      "enable": false,
      "cert": "./ssl/fullchain.pem",
      "key": "./ssl/privkey.pem"
    },
    "cors": {
      "enabled": true,
      "origins": "*",
      "methods": "GET, POST, PUT, DELETE, OPTIONS"
    },
    "rateLimit": {
      "enable": true,
      "windowMS": 15,
      "limit": 100,
      "statusCode": 429,
      "message": "too many requests"
    }
  },
  "db": {
    "sqlite3": {
      "file": "./data/app.db"
    }
  },
  "log": {
    "path": "./logs",
    "level": 4,
    "console": true,
    "file": true,
    "maxFiles": 7,
    "maxSize": 1
  },
  "paths": {
    "html": "./public",
    "images": "./tupian"
  },
  "admintoken": "114514"
}
```

> ⚠️ **重要提示**：请修改 `admintoken` 为安全的值，不要使用默认值。

## 启动服务

### 本地开发

使用热重载开发模式：

```bash
npm run dev
```

服务将在 `http://localhost:3000` 启动。

### 生产环境

编译 TypeScript 并运行：

```bash
npm run build
npm start
```

## 验证安装

服务启动后，你可以通过以下方式验证：

### 1. 健康检查

```bash
curl http://localhost:3000/health
```

你应该看到类似的响应：

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

### 2. 获取文件列表

```bash
curl http://localhost:3000/filelist
```

### 3. 获取随机文件

```bash
curl http://localhost:3000/api?json=true
```

## 下一步

- 查看 [配置指南](./configuration) 了解更多配置选项
- 阅读 [API 文档](../api/overview) 了解所有可用的 API 端点
- 查看 [部署指南](./deployment) 了解如何部署到生产环境
- 使用 [测试工具](../api/test) 在线测试 API

## 常见问题

### 图片文件夹目录命名规范

配置中 `paths.images` 指向的目录及其所有子目录名称不可包含以下内容：

- **中文字符** - 可能导致路由识别失败
- **特殊URL符号** - `? # & = % : @ ; , [ ] { } ( ) < > \ " ' ` | * + 空格`

**建议**：仅使用 **英文字母、数字、下划线 `_` 和连字符 `-`**

**错误示例**：❌ `./img/摄影作品/2024年` `./img/photo?test` `./img/my files`

**正确示例**：✅ `./img/photography/2024` `./img/photo_test` `./img/my-files`

### 如何修改管理员 Token？

编辑 `config/config.json` 中的 `admintoken` 字段，然后重启服务。

### 如何启用 HTTPS？

1. 将 SSL 证书放在 `./ssl/` 目录下
2. 在配置文件中设置 `ssl.enable` 为 `true`
3. 重启服务
