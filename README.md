# SysY Compiler Explorer

一个Web应用，用于探索SysY编译器功能，允许查看SysY代码如何被编译为LLVM IR、ARM和RISC-V汇编，并支持不同的优化级别。

## 概述

这个Web应用提供了一个类似于流行的[Compiler Explorer](https://godbolt.org/)的交互式界面，但专注于SysY语言。它允许您：

- 编写或加载SysY代码示例
- 选择目标架构（ARM或RISC-V）
- 选择输出格式（汇编或LLVM IR）
- 设置优化级别（-O0、-O1、-O2）
- 查看生成的编译结果
- 在线编译您自己的SysY代码

## 功能

- **用户友好界面**：清晰、响应式的设计，适用于桌面和移动设备
- **语法高亮**：代码高亮显示，提高可读性
- **预加载示例**：多个示例程序，展示语言特性
- **多目标架构**：支持ARM和RISC-V输出
- **优化级别**：查看不同优化级别如何影响代码生成
- **GitHub Actions编译**：利用GitHub Actions作为无服务器编译后端
- **实时编译**：通过GitHub Actions在线编译您自己的SysY代码
- **比较视图**：源代码和编译输出的并排显示

## 使用方法

### 预设示例
1. 从下拉菜单中选择一个示例
2. 选择目标架构、输出格式和优化级别
3. 点击"编译"按钮
4. 查看右侧面板中的编译结果

### 编译自己的代码
1. 在左侧编辑器中编写或粘贴SysY代码
2. 取消选中"使用预编译示例"复选框
3. 选择目标架构、输出格式和优化级别
4. 点击"编译"按钮
5. 按照提示在GitHub Actions中完成编译
6. 查看编译结果

## 编译技术

本应用有两种编译模式：

1. **预编译示例**：示例程序的编译结果已预先计算并嵌入到应用中，提供即时结果
2. **GitHub Actions实时编译**：
   - 利用GitHub Actions作为"无服务器"编译后端
   - 当编译按钮被点击时，会打开GitHub Actions工作流页面
   - 用户需要有GitHub账号才能触发编译
   - 编译结果存储为GitHub Gist并在工作流完成后可用

## 关于SysY编译器

SysY-Compiler是一个强大的编译器，专为SysY编程语言设计，SysY是C语言的一个子集，用于教育目的。该编译器可以将SysY源代码翻译成LLVM IR、ARM汇编或RISC-V汇编。

完整编译器请访问[SysY-Compiler GitHub仓库](https://github.com/ETOwang/SysY-Compiler)。

## 技术实现

- **前端**：HTML, CSS, JavaScript, CodeMirror
- **后端**：GitHub Actions, Java
- **部署**：GitHub Pages (前端), GitHub Actions (编译服务)

## 部署

本网站使用GitHub Pages部署，位于[https://ETOwang.github.io/SysY-Explorer/](https://ETOwang.github.io/SysY-Explorer/)。

编译服务在[https://github.com/ETOwang/SysY-Compiler-Service](https://github.com/ETOwang/SysY-Compiler-Service)上托管。

## 许可证

本项目基于Apache License 2.0许可 - 详见[LICENSE](https://github.com/ETOwang/SysY-Compiler/blob/main/LICENSE)文件。 