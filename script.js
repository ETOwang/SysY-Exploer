document.addEventListener('DOMContentLoaded', function() {
    // 初始化 GitHub 编译器服务
    const compilerService = new GithubCompilerService({
        owner: 'ETOwang', // 替换为您的 GitHub 用户名
        debug: true
    });
    
    // 初始化CodeMirror编辑器
    const sourceEditor = CodeMirror.fromTextArea(document.getElementById('source-editor'), {
        mode: 'text/x-csrc',
        theme: 'dracula',
        lineNumbers: true,
        indentUnit: 4,
        styleActiveLine: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        extraKeys: {"Ctrl-Space": "autocomplete"},
        tabSize: 4,
        indentWithTabs: true,
        viewportMargin: Infinity
    });

    // 初始化输出编辑器
    const outputEditor = CodeMirror.fromTextArea(document.getElementById('output-editor'), {
        mode: 'text/x-csrc',
        theme: 'dracula',
        lineNumbers: true,
        readOnly: true,
        viewportMargin: Infinity
    });

    // 显示编译过程状态
    const compileStatusElement = document.getElementById('compile-status');
    function showStatus(message, isError = false) {
        compileStatusElement.textContent = message;
        compileStatusElement.className = isError ? 'status-error' : 'status-ok';
        compileStatusElement.style.display = 'block';
    }

    function hideStatus() {
        compileStatusElement.style.display = 'none';
    }

    // 设置初始内容
    sourceEditor.setValue('// Write your SysY code here\nint main() {\n    return 0;\n}');
    outputEditor.setValue('// Compilation output will appear here');

    // 示例选择处理
    document.getElementById('example-select').addEventListener('change', function() {
        const selectedExample = this.value;
        if (selectedExample && examples[selectedExample]) {
            sourceEditor.setValue(examples[selectedExample].code);
            
            // 重置输出
            outputEditor.setValue('// Compilation output will appear here');
            hideStatus();
        }
    });

    // 编译按钮事件处理
    document.getElementById('compile-btn').addEventListener('click', async function() {
        const compileBtn = this;
        const originalBtnText = compileBtn.innerHTML;
        
        // 显示加载状态
        compileBtn.disabled = true;
        compileBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Compiling...';
        showStatus('Preparing compilation...');
        
        const sourceCode = sourceEditor.getValue();
        const targetArch = document.getElementById('target-arch').value;
        const outputFormat = document.getElementById('output-format').value;
        const optimization = document.getElementById('optimization').value;
        
        try {
            // 检查是否选择了示例
            const selectedExample = document.getElementById('example-select').value;
            
            if (selectedExample && examples[selectedExample] && document.getElementById('use-examples').checked) {
                // 使用预编译示例
                const example = examples[selectedExample];
                
                let output;
                if (outputFormat === 'llvm') {
                    output = example.llvm[optimization] || 'LLVM IR not available for this optimization level';
                } else { // assembly
                    if (targetArch === 'arm') {
                        output = example.arm[optimization] || 'ARM assembly not available for this optimization level';
                    } else { // riscv
                        output = example.riscv[optimization] || 'RISC-V assembly not available for this optimization level';
                    }
                }
                
                outputEditor.setValue(output);
                showStatus('Compilation completed using pre-compiled example');
            } else {
                // 使用 GitHub Actions 编译服务
                showStatus('Initiating GitHub Actions compilation...');
                
                const result = await compilerService.compileCode(sourceCode, {
                    targetArch,
                    outputFormat,
                    optimization
                });
                
                if (result.success) {
                    outputEditor.setValue(result.output);
                    showStatus('GitHub Actions workflow triggered. Follow instructions in output.');
                } else {
                    outputEditor.setValue(result.errors || 'Failed to trigger GitHub Actions workflow');
                    showStatus('Failed to initiate compilation', true);
                }
            }
        } catch (error) {
            console.error('Compilation error:', error);
            outputEditor.setValue(`Error: ${error.message}\n\nNote: If you're seeing this error, it might be because of a problem with the GitHub Actions service. You can still use the demo mode with pre-compiled examples.`);
            showStatus('Error initiating compilation', true);
        } finally {
            // 恢复按钮状态
            compileBtn.disabled = false;
            compileBtn.innerHTML = originalBtnText;
        }
    });

    // 复制输出按钮处理
    document.getElementById('copy-output').addEventListener('click', function() {
        const outputText = outputEditor.getValue();
        navigator.clipboard.writeText(outputText).then(() => {
            // 提供临时视觉反馈
            const originalTitle = this.title;
            this.title = 'Copied!';
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.title = originalTitle;
                this.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        }).catch(err => {
            console.error('Error copying text: ', err);
            alert('Failed to copy to clipboard');
        });
    });
    
    // 根据输出格式设置编辑器模式
    document.getElementById('output-format').addEventListener('change', function() {
        if (this.value === 'llvm') {
            outputEditor.setOption('mode', 'text/x-llvm');
        } else {
            outputEditor.setOption('mode', 'text/x-asm');
        }
    });
    
    // 初始响应式布局设置
    function handleResize() {
        if (window.innerWidth < 1200) {
            document.querySelector('.container').style.gridTemplateColumns = '1fr';
        } else {
            document.querySelector('.container').style.gridTemplateColumns = '1fr 0.2fr 1fr';
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始调用
}); 