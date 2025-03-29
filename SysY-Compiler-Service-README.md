# SysY Compiler Service

基于 GitHub Actions 的 SysY 编译器服务，提供在线编译功能。

## 概述

本服务利用 GitHub Actions 作为"无服务器"后端，为 SysY Compiler Explorer 提供实时编译能力。当用户提交 SysY 代码时，会触发一个 GitHub Action 来执行编译，并将结果保存为 GitHub Gist。

## 使用方法

### 方法 1：手动触发编译

1. 访问本仓库的 Actions 页面
2. 点击 "SysY Compiler Service" 工作流
3. 点击 "Run workflow" 按钮
4. 在表单中填写：
   - SysY 源代码
   - 目标架构 (ARM 或 RISC-V)
   - 输出格式 (汇编或 LLVM IR)
   - 优化级别 (O0, O1, O2)
   - 请求 ID (任意唯一字符串)
5. 点击 "Run workflow" 开始编译
6. 编译完成后，结果将作为 GitHub Gist 提供

### 方法 2：通过 API 触发 (需授权)

可以通过 GitHub API 触发编译：

```
POST https://api.github.com/repos/ETOwang/SysY-Compiler-Service/dispatches
```

请求体:
```json
{
  "event_type": "compile-request",
  "client_payload": {
    "code": "int main() { return 0; }",
    "targetArch": "arm",
    "outputFormat": "assembly",
    "optimization": "O0",
    "requestId": "unique-request-id"
  }
}
```

注意：API 触发需要 GitHub 个人访问令牌。

## 关于 SysY 编译器

SysY 是一种用于教学的类 C 语言，本服务使用 [ETOwang/SysY-Compiler](https://github.com/ETOwang/SysY-Compiler) 进行编译。

## 编译选项

- **目标架构**：ARM (默认) 或 RISC-V
- **输出格式**：汇编代码或 LLVM IR
- **优化级别**：O0 (无优化), O1, O2

## 技术实现

- GitHub Actions 作为执行环境
- Java 运行时执行编译器
- GitHub Gist 存储编译结果

## 使用限制

- GitHub Actions 每小时有运行次数限制
- 编译超时限制为 10 分钟
- 结果保存在公开的 GitHub Gist (任何人都可以访问) 