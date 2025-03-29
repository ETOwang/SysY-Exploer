/**
 * GitHub Actions 编译器服务客户端
 * 这个客户端使用GitHub Actions作为"无服务器"编译后端
 */
class GithubCompilerService {
  constructor(options = {}) {
    this.owner = options.owner || 'ETOwang'; // 替换为您的 GitHub 用户名
    this.repo = options.repo || 'SysY-Compiler-Service';
    this.workflowId = 'compile.yml';
    this.debug = options.debug || false;
  }

  /**
   * 启动代码编译
   * 注意：这个方法打开GitHub Actions页面供用户手动触发编译
   */
  async compileCode(code, options = {}) {
    const requestId = this._generateRequestId();
    
    if (this.debug) console.log(`[GithubCompilerService] Compiling with request ID: ${requestId}`);
    
    const { targetArch = 'arm', outputFormat = 'assembly', optimization = 'O0' } = options;
    
    // 构建GitHub Actions手动触发URL
    const actionUrl = `https://github.com/${this.owner}/${this.repo}/actions/workflows/${this.workflowId}`;
    
    // 在新窗口打开GitHub Actions
    window.open(actionUrl, '_blank');
    
    // 返回包含说明的结果
    return {
      success: true,
      output: this._getInstructionsText(code, targetArch, outputFormat, optimization, requestId, actionUrl),
      requestId
    };
  }

  /**
   * 生成编译说明文本
   */
  _getInstructionsText(code, targetArch, outputFormat, optimization, requestId, actionUrl) {
    return `# GitHub Actions 编译服务说明

请按照以下步骤在新打开的窗口中完成编译：

1. 在 GitHub Actions 页面，点击 "Run workflow" 按钮
2. 在弹出的表单中填入以下内容：
   - code: 粘贴您的代码
   - targetArch: ${targetArch}
   - outputFormat: ${outputFormat}
   - optimization: ${optimization}
   - requestId: ${requestId} (或任意唯一字符串)
3. 点击绿色的 "Run workflow" 按钮启动编译
4. 等待编译完成（约1-2分钟）
5. 编译完成后，点击生成的工作流运行，查看详细信息
6. 在工作流运行日志中找到编译结果的Gist链接

请注意：这种编译方式需要您有一个GitHub账号才能运行工作流。

## 您的代码
\`\`\`c
${code}
\`\`\`

## 编译选项
- 目标架构: ${targetArch}
- 输出格式: ${outputFormat}
- 优化级别: ${optimization}
- 请求ID: ${requestId}

工作流URL: ${actionUrl}`;
  }

  /**
   * 生成唯一请求 ID
   */
  _generateRequestId() {
    return `req-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
}

// 导出服务类
window.GithubCompilerService = GithubCompilerService; 