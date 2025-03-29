FROM openjdk:17-slim

# 安装Node.js
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# 创建工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 从 GitHub 下载最新的 SysY 编译器 JAR 文件
RUN apt-get update && apt-get install -y wget unzip \
    && wget https://github.com/ETOwang/SysY-Compiler/releases/download/v1.0.0/compiler-1.0-SNAPSHOT-jar-with-dependencies.jar -O compiler.jar \
    && rm -rf /var/lib/apt/lists/*

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"] 