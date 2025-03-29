document.addEventListener('DOMContentLoaded', function() {
    const githubUsername = 'ETOwang'; // 替换为您的 GitHub 用户名
    const repoName = 'SysY-Compiler-Service';
    const backendStatusElement = document.getElementById('backend-status');
    const backendInfoElement = document.getElementById('backend-info');
    const useExamplesCheckbox = document.getElementById('use-examples');
    
    async function checkBackendStatus() {
        try {
            // 检查 GitHub 仓库是否存在
            const response = await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                },
                signal: AbortSignal.timeout(5000) // 5秒超时
            });
            
            if (!response.ok) {
                throw new Error(`GitHub API error! status: ${response.status}`);
            }
            
            const repoInfo = await response.json();
            
            // 检查工作流文件是否存在
            const workflowResponse = await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}/contents/.github/workflows/compile.yml`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                },
                signal: AbortSignal.timeout(5000)
            }).catch(e => {
                console.warn('Could not check workflow file existence, assuming it exists', e);
                return { ok: true }; // 假设工作流文件存在
            });
            
            if (response.ok && (workflowResponse.ok || !workflowResponse)) {
                backendStatusElement.textContent = 'Available';
                backendStatusElement.className = 'status-ok';
                
                backendInfoElement.innerHTML = `
                    <p><strong>Compiler Service Information:</strong></p>
                    <ul>
                        <li>Service: GitHub Actions</li>
                        <li>Repository: <a href="${repoInfo.html_url}" target="_blank">${repoInfo.full_name}</a></li>
                        <li>Last Updated: ${new Date(repoInfo.updated_at).toLocaleDateString()}</li>
                    </ul>
                    <p class="backend-note">Real-time compilation is available through GitHub Actions! You can write and compile your own SysY code.</p>
                    <p class="backend-note small">Note: Compilation is performed by triggering a GitHub Actions workflow. You will need to have a GitHub account to run the workflow.</p>
                `;
                
                // 默认不勾选"使用预编译示例"
                useExamplesCheckbox.checked = false;
            } else {
                throw new Error('GitHub Actions workflow not found');
            }
        } catch (error) {
            console.error('Backend check error:', error);
            backendStatusElement.textContent = 'Limited';
            backendStatusElement.className = 'status-error';
            
            backendInfoElement.innerHTML = `
                <p>GitHub Actions compilation service is not available or misconfigured.</p>
                <p class="backend-note">Using pre-compiled examples only. To compile your own code, please make sure the GitHub Actions service is properly configured.</p>
                <p class="backend-note small">Error: ${error.message}</p>
            `;
            
            // 默认勾选"使用预编译示例"
            useExamplesCheckbox.checked = true;
        }
    }
    
    // 执行后端状态检查
    checkBackendStatus();
}); 