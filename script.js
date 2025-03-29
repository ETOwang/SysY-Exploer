document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror for source editor
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

    // Initialize CodeMirror for output editor
    const outputEditor = CodeMirror.fromTextArea(document.getElementById('output-editor'), {
        mode: 'text/x-csrc',
        theme: 'dracula',
        lineNumbers: true,
        readOnly: true,
        viewportMargin: Infinity
    });

    // Set initial content
    sourceEditor.setValue('// Write your SysY code here\nint main() {\n    return 0;\n}');
    outputEditor.setValue('// Compilation output will appear here');

    // Example selection handler
    document.getElementById('example-select').addEventListener('change', function() {
        const selectedExample = this.value;
        if (selectedExample && examples[selectedExample]) {
            sourceEditor.setValue(examples[selectedExample].code);
            
            // Reset output when a new example is selected
            outputEditor.setValue('// Compilation output will appear here');
        }
    });

    // Compile button handler
    document.getElementById('compile-btn').addEventListener('click', function() {
        const sourceCode = sourceEditor.getValue();
        const targetArch = document.getElementById('target-arch').value;
        const outputFormat = document.getElementById('output-format').value;
        const optimization = document.getElementById('optimization').value;
        
        // In a real implementation, this would send a request to a server
        // For this demo, we'll use pre-compiled examples
        
        const selectedExample = document.getElementById('example-select').value;
        
        if (selectedExample && examples[selectedExample]) {
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
        } else {
            // If it's not a preset example, show a demo message
            outputEditor.setValue('Demo mode: This web demonstration only shows compilation results for the preset examples.\n\nPlease select an example from the dropdown menu, or download the full compiler to compile your own code.');
        }
    });

    // Copy output button handler
    document.getElementById('copy-output').addEventListener('click', function() {
        const outputText = outputEditor.getValue();
        navigator.clipboard.writeText(outputText).then(() => {
            // You could add a temporary visual feedback here
            alert('Output copied to clipboard!');
        }).catch(err => {
            console.error('Error copying text: ', err);
        });
    });
    
    // Set the mode based on output format selection
    document.getElementById('output-format').addEventListener('change', function() {
        if (this.value === 'llvm') {
            outputEditor.setOption('mode', 'text/x-llvm');
        } else {
            outputEditor.setOption('mode', 'text/x-asm');
        }
    });
    
    // Initial setup for responsive layout
    function handleResize() {
        if (window.innerWidth < 1200) {
            document.querySelector('.container').style.gridTemplateColumns = '1fr';
        } else {
            document.querySelector('.container').style.gridTemplateColumns = '1fr 0.2fr 1fr';
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
}); 