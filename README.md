# SysY Compiler Explorer

A web-based tool for exploring the SysY Compiler, allowing you to see how SysY code is compiled to LLVM IR, ARM, and RISC-V assembly with different optimization levels.

## Overview

This web application provides an interactive interface similar to the popular [Compiler Explorer](https://godbolt.org/) but focused specifically on the SysY language. It allows you to:

- Write or load SysY code examples
- Choose target architecture (ARM or RISC-V)
- Select output format (Assembly or LLVM IR)
- Set optimization levels (-O0, -O1, -O2)
- View the generated compilation output

## Features

- **User-Friendly Interface**: Clear, responsive design that works on both desktop and mobile
- **Syntax Highlighting**: Code highlighting for better readability
- **Pre-loaded Examples**: Several example programs to demonstrate language features
- **Multiple Target Architectures**: Support for both ARM and RISC-V output
- **Optimization Levels**: See how different optimization levels affect code generation
- **Comparison View**: Side-by-side display of source code and compiled output

## About SysY Compiler

SysY-Compiler is a powerful compiler for the SysY programming language, a subset of C used for educational purposes. This compiler translates SysY source code into LLVM IR, ARM assembly, or RISC-V assembly.

For the full compiler, visit [SysY-Compiler GitHub repository](https://github.com/ETOwang/SysY-Compiler).

## Demo Mode

This web application runs in demo mode, showing pre-compiled examples to demonstrate the compiler's capabilities. For full compilation functionality, please download and run the compiler locally.

## Deployment

This site is deployed using GitHub Pages at [https://etowang.github.io/SysY-Explorer/](https://etowang.github.io/SysY-Explorer/).

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](https://github.com/ETOwang/SysY-Compiler/blob/main/LICENSE) file for details. 