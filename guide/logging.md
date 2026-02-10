# 日志系统

Fur-img-api-next 使用 Pino 高性能日志库，提供结构化日志、自动轮换和多输出支持。

## 日志配置

在 `config/config.json` 中配置日志：

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

### 配置选项

| 选项 | 类型 | 说明 |
|------|------|------|
| `path` | string | 日志文件存储目录 |
| `level` | number | 日志级别（0-6） |
| `console` | boolean | 是否输出到控制台 |
| `file` | boolean | 是否输出到文件 |
| `maxFiles` | number | 保留的最大日志文件数 |
| `maxSize` | number | 单个日志文件的最大大小（MB） |

## 日志级别

| 级别 | 值 | 说明 |
|------|-----|------|
| silent | 0 | 不输出任何日志 |
| fatal | 1 | 致命错误 |
| error | 2 | 错误 |
| warn | 3 | 警告 |
| info | 4 | 信息（默认） |
| debug | 5 | 调试信息 |
| trace | 6 | 追踪信息 |

## 日志文件

日志文件按日期自动生成，格式为 `app-YYYY-MM-DD.log`。

### 日志目录结构

```
logs/
├── app-2024-01-15.log
├── app-2024-01-14.log
├── app-2024-01-13.log
└── ...
```

## 日志内容

### 请求日志

所有 HTTP 请求都会被自动记录：

```
[2024-01-15 10:30:45] GET /api 200 45ms
[2024-01-15 10:30:46] GET /health 200 12ms
[2024-01-15 10:30:47] POST /admin/refresh 200 1234ms
```

### 错误日志

所有异常和错误都会被自动捕获并记录完整的堆栈信息：

```
[2024-01-15 10:30:48] ERROR: Database connection failed
  at connectDatabase (db.ts:45)
  at startServer (server.ts:23)
  ...
```

## 日志查看

### 查看实时日志

```bash
tail -f ./logs/app-$(date +%Y-%m-%d).log
```

### 查看最近的日志

```bash
tail -n 100 ./logs/app-$(date +%Y-%m-%d).log
```

### 搜索特定日志

```bash
grep "ERROR" ./logs/app-$(date +%Y-%m-%d).log
```

### 查看所有日志

```bash
cat ./logs/app-*.log | less
```

## 日志轮换

日志会自动按日期轮换。根据配置：

- `maxFiles: 7` - 保留最近 7 天的日志
- `maxSize: 1` - 单个日志文件最大 1MB

超过限制的日志文件会自动删除。

## 日志级别配置建议

### 开发环境

```json
"log": {
  "level": 5,
  "console": true,
  "file": true
}
```

使用 debug 级别可以获得详细的调试信息。

### 生产环境

```json
"log": {
  "level": 4,
  "console": false,
  "file": true,
  "maxFiles": 30,
  "maxSize": 10
}
```

使用 info 级别，只输出到文件，保留更多日志文件。

### 性能测试

```json
"log": {
  "level": 3,
  "console": false,
  "file": true
}
```

使用 warn 级别，减少日志输出，提高性能。

## 日志分析

### 统计请求数

```bash
grep "GET\|POST\|PUT\|DELETE" ./logs/app-$(date +%Y-%m-%d).log | wc -l
```

### 统计错误数

```bash
grep "ERROR\|error" ./logs/app-$(date +%Y-%m-%d).log | wc -l
```

### 查看最慢的请求

```bash
grep "ms" ./logs/app-$(date +%Y-%m-%d).log | sort -t' ' -k4 -rn | head -10
```

## 日志备份

### 手动备份

```bash
cp ./logs/app-$(date +%Y-%m-%d).log ./backups/app-$(date +%Y-%m-%d-%H%M%S).log
```

### 自动备份脚本

创建 `backup-logs.sh`：

```bash
#!/bin/bash

BACKUP_DIR="./backups/logs"
mkdir -p $BACKUP_DIR

find ./logs -name "*.log" -type f | while read file; do
  cp "$file" "$BACKUP_DIR/$(basename $file)-$(date +%s).log"
done

find $BACKUP_DIR -name "*.log" -mtime +30 -delete
```

设置定时任务：

```bash
0 3 * * * /path/to/backup-logs.sh
```

## 日志监控

### 监控错误

```bash
watch -n 5 'grep -c "ERROR" ./logs/app-$(date +%Y-%m-%d).log'
```

### 监控性能

```bash
watch -n 5 'tail -20 ./logs/app-$(date +%Y-%m-%d).log'
```

## 故障排查

### 日志文件过大

如果日志文件过大，可以：

1. 增加 `maxSize` 限制
2. 降低日志级别
3. 手动清理旧日志

### 日志输出不完整

检查以下几点：

1. 确保 `log.path` 目录存在且有写入权限
2. 检查磁盘空间是否充足
3. 查看是否有文件权限问题

### 性能下降

如果启用日志导致性能下降：

1. 降低日志级别
2. 禁用控制台输出
3. 增加 `maxSize` 限制
