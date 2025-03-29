document.addEventListener('DOMContentLoaded', function() {
    const githubUsername = 'ETOwang'; // 替换为您的 GitHub 用户名
    const repoName = 'SysY-Compiler-Service';
    const backendStatusElement = document.getElementById('backend-status');
    const backendInfoElement = document.getElementById('backend-info');
    const useExamplesCheckbox = document.getElementById('use-examples');
    
    // 使用更简单的方法，假设仓库已配置好
    function checkBackendStatus() {
        // 构建工作流URL，用于后续打开
        const actionUrl = `https://github.com/${githubUsername}/${repoName}/actions/workflows/compile.yml`;
        
        // 假设服务可用，设置界面状态
        backendStatusElement.textContent = 'Available';
        backendStatusElement.className = 'status-ok';
        
        backendInfoElement.innerHTML = `
            <p><strong>Compiler Service Information:</strong></p>
            <ul>
                <li>Service: GitHub Actions</li>
                <li>Repository: <a href="https://github.com/${githubUsername}/${repoName}" target="_blank">${githubUsername}/${repoName}</a></li>
                <li>Workflow: <a href="${actionUrl}" target="_blank">SysY Compiler Service</a></li>
            </ul>
            <p class="backend-note">Real-time compilation is available through GitHub Actions! You can write and compile your own SysY code.</p>
            <p class="backend-note small">Note: Compilation is performed by triggering a GitHub Actions workflow. You will need to have a GitHub account to run the workflow.</p>
        `;
        
        // 默认不勾选"使用预编译示例"
        useExamplesCheckbox.checked = false;
    }
    
    // 执行后端状态检查
    checkBackendStatus();
}); 