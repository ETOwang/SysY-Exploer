# SysY Compiler API Backend

这是SysY Compiler Explorer的后端API服务。它提供了一个HTTP API，用于处理SysY代码的编译请求并返回编译结果。

## 功能

- 编译SysY代码为ARM或RISC-V汇编
- 生成LLVM IR
- 支持不同的优化级别(O0, O1, O2)
- 处理编译错误

## 部署选项

### 本地部署

1. 确保已安装Node.js (v16+)和Java JDK 17+
2. 克隆此仓库
3. 安装依赖：`npm install`
4. 将SysY编译器JAR文件放在根目录下，命名为`compiler.jar`
5. 启动服务：`npm start`

服务将在 http://localhost:3000 上运行。

### 使用Docker部署

1. 确保已安装Docker
2. 构建Docker镜像：`docker build -t sysy-compiler-api .`
3. 运行容器：`docker run -p 3000:3000 sysy-compiler-api`

### 在Render.com上部署

1. 创建一个新的Web Service
2. 连接到包含后端代码的GitHub存储库
3. 选择Docker部署选项
4. 将环境变量设置为：`PORT=10000`（或Render分配的其他端口）
5. 点击"Create Web Service"

## API端点

### 编译代码

```
POST /compile

请求体:
{
  "code": "int main() { return 0; }",  // SysY源代码
  "targetArch": "arm",                 // 目标架构：arm 或 riscv
  "outputFormat": "assembly",          // 输出格式：assembly 或 llvm
  "optimization": "O0"                 // 优化级别：O0, O1, 或 O2
}

响应:
{
  "success": true,
  "output": "编译输出内容..."
}
```

### 检查状态

```
GET /status

响应:
{
  "available": true,
  "version": "1.0.0",
  "memory": "128 MB",
  "cpu": "Intel Core i7"
}
```

### 健康检查

```
GET /health

响应:
{
  "status": "ok"
}
```

## 使用限制

- 编译超时：10秒
- 代码大小限制：由API限制（通常为1MB）

## 技术栈

- Node.js & Express.js
- Java (运行SysY编译器)
- Docker (容器化) 