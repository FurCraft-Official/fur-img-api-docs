# 部署指南

本指南介绍如何将 Fur-img-api-next 部署到生产环境。

## Docker 部署（推荐）

### 拉取镜像

```bash
docker pull fasfuah/fur-img-api-next
```

### 运行容器

```bash
docker run -d \
  --name fur-img-api \
  -p 3000:3000 \
  -v /path/to/img:/app/img \
  -v /path/to/ssl:/app/ssl \
  -v /path/to/public:/app/public \
  -v /path/to/data:/app/data \
  fasfuah/fur-img-api-next
```

### 参数说明

| 参数 | 说明 |
|------|------|
| `-d` | 后台运行容器 |
| `--name fur-img-api` | 容器名称 |
| `-p 3000:3000` | 端口映射（宿主机:容器） |
| `-v /path/to/img:/app/img` | 图片目录持久化卷 |
| `-v /path/to/ssl:/app/ssl` | SSL证书目录持久化卷 |
| `-v /path/to/public:/app/public` | 公共文件目录持久化卷 |
| `-v /path/to/data:/app/data` | 数据目录持久化卷 |

### 容器管理

查看日志：
```bash
docker logs -f fur-img-api
```

停止容器：
```bash
docker stop fur-img-api
```

重启容器：
```bash
docker restart fur-img-api
```

删除容器：
```bash
docker rm fur-img-api
```

## 传统部署

### 1. 编译项目

```bash
npm run build
```

这将生成 `dist/` 目录中的编译后的 JavaScript 文件。

### 2. 安装生产依赖

```bash
npm install --production
```

### 3. 启动服务

```bash
npm start
```

或者使用 Node.js 直接运行：

```bash
node dist/app.js
```

## 使用 PM2 进程管理

PM2 是一个流行的 Node.js 进程管理器，可以帮助你管理应用程序的生命周期。

### 安装 PM2

```bash
npm install -g pm2
```

### 创建 PM2 配置文件

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'fur-img-api',
    script: './dist/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

### 启动应用

```bash
pm2 start ecosystem.config.js
```

### PM2 常用命令

```bash
pm2 status              # 查看应用状态
pm2 logs fur-img-api    # 查看日志
pm2 restart fur-img-api # 重启应用
pm2 stop fur-img-api    # 停止应用
pm2 delete fur-img-api  # 删除应用
pm2 save                # 保存 PM2 进程列表
pm2 startup             # 设置开机自启
```

## Nginx 反向代理

### 配置示例

```nginx
upstream fur_img_api {
    server localhost:3000;
}

server {
    listen 80;
    server_name img.furapi.top;

    client_max_body_size 100M;

    location / {
        proxy_pass http://fur_img_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 启用 HTTPS

使用 Let's Encrypt 获取免费 SSL 证书：

```bash
sudo certbot certonly --standalone -d img.furapi.top
```

然后更新 Nginx 配置：

```nginx
server {
    listen 443 ssl http2;
    server_name img.furapi.top;

    ssl_certificate /etc/letsencrypt/live/img.furapi.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/img.furapi.top/privkey.pem;

    # ... 其他配置
}

server {
    listen 80;
    server_name img.furapi.top;
    return 301 https://$server_name$request_uri;
}
```

## 性能优化

### 1. 启用 Gzip 压缩

在配置文件中设置：

```json
"gzip": true
```

### 2. 调整速率限制

根据实际需求调整：

```json
"rateLimit": {
  "enable": true,
  "windowMS": 15,
  "limit": 1000
}
```

### 3. 数据库优化

定期清理日志文件：

```bash
find ./logs -name "*.log" -mtime +7 -delete
```

### 4. 内存管理

监控内存使用情况，必要时增加 Node.js 堆大小：

```bash
node --max-old-space-size=4096 dist/app.js
```

## 监控和日志

### 查看实时日志

```bash
tail -f ./logs/app-$(date +%Y-%m-%d).log
```

### 健康检查

定期检查服务状态：

```bash
curl http://localhost:3000/health
```

### 设置监控告警

使用 cron 定期检查服务：

```bash
*/5 * * * * curl -f http://localhost:3000/health || systemctl restart fur-img-api
```

## 备份策略

### 备份数据库

```bash
cp ./data/app.db ./backups/app-$(date +%Y%m%d-%H%M%S).db
```

### 备份图片目录

```bash
tar -czf ./backups/images-$(date +%Y%m%d).tar.gz ./tupian/
```

### 自动备份脚本

创建 `backup.sh`：

```bash
#!/bin/bash

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p $BACKUP_DIR

cp ./data/app.db $BACKUP_DIR/app-$DATE.db
tar -czf $BACKUP_DIR/images-$DATE.tar.gz ./tupian/

find $BACKUP_DIR -name "app-*.db" -mtime +30 -delete
find $BACKUP_DIR -name "images-*.tar.gz" -mtime +30 -delete
```

设置定时任务：

```bash
0 2 * * * /path/to/backup.sh
```

## 故障排查

### 服务无法启动

1. 检查端口是否被占用：
```bash
lsof -i :3000
```

2. 查看错误日志：
```bash
cat ./logs/app-$(date +%Y-%m-%d).log
```

### 内存泄漏

1. 监控内存使用：
```bash
watch -n 1 'ps aux | grep node'
```

2. 重启服务：
```bash
pm2 restart fur-img-api
```

### 数据库锁定

如果遇到数据库锁定错误，重启服务通常可以解决：

```bash
pm2 restart fur-img-api
```
