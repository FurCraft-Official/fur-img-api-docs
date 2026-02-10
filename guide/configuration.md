# 配置指南

Fur-img-api-next 通过 `config/config.json` 文件进行配置。本指南详细说明了所有可用的配置选项。

## 配置文件位置

配置文件位于项目根目录的 `config/config.json`。

## 完整配置示例

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
      "methods": "GET, POST, PUT, DELETE, OPTIONS",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    },
    "rateLimit": {
      "enable": true,
      "windowMS": 15,
      "limit": 100,
      "statusCode": 429,
      "message": "too many requests",
      "standardHeaders": "draft-8",
      "legacyHeaders": false,
      "validate": {
        "trustProxy": false
      }
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

## 配置选项详解

### 服务器配置 (server)

#### 基本设置

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `addr` | string | localhost | 服务器监听地址 |
| `httpport` | number | 3000 | HTTP 端口 |
| `httpsport` | number | 3001 | HTTPS 端口 |
| `forcehttps` | boolean | false | 是否强制 HTTPS（暂未开发） |
| `gzip` | boolean | false | 是否启用 Gzip 压缩 |

#### SSL/TLS 配置

```json
"ssl": {
  "enable": false,
  "cert": "./ssl/fullchain.pem",
  "key": "./ssl/privkey.pem"
}
```

- `enable` - 是否启用 SSL/TLS
- `cert` - SSL 证书文件路径
- `key` - SSL 私钥文件路径

#### CORS 配置

```json
"cors": {
  "enabled": true,
  "origins": "*",
  "methods": "GET, POST, PUT, DELETE, OPTIONS",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
```

- `enabled` - 是否启用 CORS
- `origins` - 允许的源（`*` 表示允许所有）
- `methods` - 允许的 HTTP 方法
- `preflightContinue` - 是否继续处理预检请求
- `optionsSuccessStatus` - OPTIONS 请求的成功状态码

#### 速率限制配置

```json
"rateLimit": {
  "enable": true,
  "windowMS": 15,
  "limit": 100,
  "statusCode": 429,
  "message": "too many requests",
  "standardHeaders": "draft-8",
  "legacyHeaders": false,
  "validate": {
    "trustProxy": false
  }
}
```

- `enable` - 是否启用速率限制
- `windowMS` - 时间窗口（分钟）
- `limit` - 时间窗口内允许的最大请求数
- `statusCode` - 超限时返回的 HTTP 状态码
- `message` - 超限时的错误消息
- `standardHeaders` - 是否返回标准的 RateLimit 头
- `legacyHeaders` - 是否返回旧版本的 RateLimit 头
- `validate.trustProxy` - 是否信任代理 IP

### 数据库配置 (db)

```json
"db": {
  "sqlite3": {
    "file": "./data/app.db"
  }
}
```

- `file` - SQLite 数据库文件路径

### 日志配置 (log)

```json
"log": {
  "path": "./logs",
  "level": 4,
  "console": true,
  "file": true,
  "maxFiles": 7,
  "maxSize": 1
}
```

| 选项 | 类型 | 说明 |
|------|------|------|
| `path` | string | 日志文件存储目录 |
| `level` | number | 日志级别（0=silent, 1=fatal, 2=error, 3=warn, 4=info, 5=debug, 6=trace） |
| `console` | boolean | 是否输出到控制台 |
| `file` | boolean | 是否输出到文件 |
| `maxFiles` | number | 保留的最大日志文件数 |
| `maxSize` | number | 单个日志文件的最大大小（MB） |

### 路径配置 (paths)

```json
"paths": {
  "html": "./public",
  "images": "./tupian"
}
```

- `html` - 静态网站文件目录
- `images` - 图片/文件存储目录

### 管理员配置

```json
"admintoken": "114514"
```

- `admintoken` - 管理员 Token，用于访问受保护的管理员端点

> ⚠️ **安全提示**：请修改为强密码，不要使用默认值。

## 常见配置场景

### 场景 1：启用 HTTPS

1. 将 SSL 证书放在 `./ssl/` 目录下
2. 修改配置：

```json
"ssl": {
  "enable": true,
  "cert": "./ssl/fullchain.pem",
  "key": "./ssl/privkey.pem"
}
```

3. 重启服务

### 场景 2：提高速率限制

如果需要允许更多请求，修改配置：

```json
"rateLimit": {
  "enable": true,
  "windowMS": 15,
  "limit": 500
}
```

这将允许每 15 分钟 500 个请求。

### 场景 3：启用 Gzip 压缩

```json
"gzip": true
```

这将自动压缩响应，减少带宽使用。

### 场景 4：调整日志级别

开发环境使用 debug 级别：

```json
"log": {
  "level": 5
}
```

生产环境使用 info 级别：

```json
"log": {
  "level": 4
}
```

## 配置验证

修改配置后，可以通过以下方式验证：

1. 重启服务
2. 查看日志输出
3. 调用 `/health` 端点检查服务状态

## 环境变量支持

目前配置文件不支持环境变量，但你可以在启动脚本中动态修改配置文件。

## 配置热重载

目前不支持配置热重载，修改配置后需要重启服务。
