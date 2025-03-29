const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');
const os = require('os');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 临时文件目录
const TEMP_DIR = path.join(os.tmpdir(), 'sysy-compiler');

// 确保临时目录存在
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// 状态检查端点
app.get('/status', (req, res) => {
    const memoryUsage = process.memoryUsage();
    const memoryInfo = `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`;
    const cpuInfo = os.cpus()[0].model;
    
    res.json({
        available: true,
        version: '1.0.0',
        memory: memoryInfo,
        cpu: cpuInfo
    });
});

// 编译端点
app.post('/compile', async (req, res) => {
    try {
        const { code, targetArch, outputFormat, optimization } = req.body;
        
        if (!code) {
            return res.status(400).json({ success: false, errors: 'No source code provided' });
        }
        
        // 创建唯一ID用于临时文件
        const jobId = uuidv4();
        const inputFile = path.join(TEMP_DIR, `${jobId}.sy`);
        const outputFile = path.join(TEMP_DIR, `${jobId}.out`);
        
        // 写入源代码到临时文件
        fs.writeFileSync(inputFile, code);
        
        // 构建编译命令
        let compileCommand = `java -jar ./compiler.jar ${inputFile}`;
        
        // 添加输出格式选项
        if (outputFormat === 'llvm') {
            compileCommand += ' --emit-llvm';
        } else {
            compileCommand += ' -S';
        }
        
        // 添加目标架构
        if (targetArch === 'riscv') {
            compileCommand += ' --target riscv';
        }
        
        // 添加优化级别
        if (optimization === 'O1' || optimization === 'O2') {
            compileCommand += ` -${optimization}`;
        }
        
        // 添加输出文件
        compileCommand += ` -o ${outputFile}`;
        
        console.log(`Executing: ${compileCommand}`);
        
        // 执行编译命令
        exec(compileCommand, { timeout: 10000 }, (error, stdout, stderr) => {
            try {
                // 检查是否存在编译错误
                if (error) {
                    console.error(`Compilation error: ${error.message}`);
                    return res.json({
                        success: false,
                        errors: stderr || error.message
                    });
                }
                
                // 读取编译输出
                let outputContent;
                try {
                    outputContent = fs.readFileSync(outputFile, 'utf-8');
                } catch (readError) {
                    // 如果无法读取输出文件，可能是编译产生了错误但进程未返回错误状态
                    console.error(`Error reading output: ${readError.message}`);
                    return res.json({
                        success: false,
                        errors: `Failed to read compilation output: ${readError.message}`
                    });
                }
                
                // 返回编译结果
                res.json({
                    success: true,
                    output: outputContent
                });
            } finally {
                // 清理临时文件
                try {
                    if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
                    if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
                } catch (cleanupError) {
                    console.error(`Cleanup error: ${cleanupError.message}`);
                }
            }
        });
    } catch (error) {
        console.error(`Server error: ${error.message}`);
        res.status(500).json({
            success: false,
            errors: `Server error: ${error.message}`
        });
    }
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`SysY Compiler API running on port ${PORT}`);
}); 