# Biome 命令完整指南

## 📋 命令速查表

| 命令 | 完整命令 | 检查内容 | 修改文件 | 使用场景 |
|------|---------|---------|---------|---------|
| `npm run lint` | `biome lint .` | 代码质量 | ❌ 否 | 查看 lint 问题 |
| `npm run lint:fix` | `biome lint --write .` | 代码质量 | ✅ 是 | 自动修复 lint 问题 |
| `npm run format:check` | `biome format .` | 代码格式 | ❌ 否 | 查看格式问题 |
| `npm run format` | `biome format --write .` | 代码格式 | ✅ 是 | 自动格式化代码 |
| `npm run check` | `biome check .` | 质量+格式 | ❌ 否 | 全面检查 |
| `npm run check:fix` | `biome check --write .` | 质量+格式 | ✅ 是 | **一键修复** ⭐ |

---

## 🔍 详细说明

### 1. Lint 命令（代码质量检查）

#### `npm run lint`
**检查但不修改**

```bash
# 检测的问题示例：
✗ 使用了 any 类型
✗ 变量未使用
✗ import 未使用
✗ 使用了 var 而不是 const
```

#### `npm run lint:fix`
**自动修复可修复的问题**

```typescript
// 修复前
import { Draft, freeze, produce } from 'immer';
let x = 1;

// 修复后
import { type Draft, freeze, produce } from 'immer';
const x = 1;
```

---

### 2. Format 命令（代码格式化）

#### `npm run format:check`
**检查格式但不修改**

```bash
# 检测的格式问题：
- 双引号应该是单引号
- 缺少分号
- 空格不正确
- 缩进不正确
```

#### `npm run format`
**自动格式化代码**

```typescript
// 格式化前
import {foo,bar} from"module"
const x={a:1,b:2}

// 格式化后
import { foo, bar } from 'module';
const x = { a: 1, b: 2 };
```

---

### 3. Check 命令（综合检查）

#### `npm run check`
**同时检查质量和格式**

等同于：
```bash
npm run lint && npm run format:check
```

使用场景：
- ✅ Git commit 前检查
- ✅ CI/CD 流水线
- ✅ Pull Request 检查

#### `npm run check:fix` ⭐
**一键修复所有问题**

等同于：
```bash
npm run lint:fix && npm run format
```

使用场景：
- ✅ 最常用的命令！
- ✅ 开发过程中快速修复
- ✅ 代码保存时自动运行

---

## 📊 实际演示效果

### 修复前的代码：
```typescript
import {useState,useEffect} from "react"
import { Draft } from 'immer'

var myVar = 123
let unusedVariable = 'never used'

function   badFormatting(  x:any  ,y:number){
const result={a:1,b:2,c:3}
    return result
}

const  foo  =  ( )  =>  {
  console.log('test')
}
```

### 运行 `npm run check:fix` 后：
```typescript
import { Draft } from 'immer';
import { useEffect, useState } from 'react';

var myVar = 123;
const unusedVariable = 'never used';

function badFormatting(x: any, y: number) {
  const result = { a: 1, b: 2, c: 3 };
  return result;
}

const foo = () => {
  console.log('test');
};
```

### 自动修复的内容：
- ✅ 添加了分号
- ✅ 统一使用单引号
- ✅ 修正了空格和缩进
- ✅ 导入语句排序和格式化
- ✅ 将 `let` 改为 `const`（如果不会重新赋值）

### 仍需手动修复的问题：
- ⚠️ 使用了 `any` 类型（需要指定具体类型）
- ⚠️ 未使用的变量（需要删除或使用）
- ⚠️ 未使用的导入（需要删除）

---

## 🎯 推荐工作流

### 开发过程中：
```bash
# 每次保存文件后运行
npm run check:fix
```

### 提交代码前：
```bash
# 确保没有错误
npm run check

# 如果有错误，先修复
npm run check:fix
```

### CI/CD 流水线：
```bash
# 只检查，不修改（如果有问题，构建失败）
npm run check
```

---

## 💡 常见问题

### Q: 为什么有些问题没有自动修复？
A: Biome 只自动修复"安全"的问题。例如：
- ✅ 可以安全修复：格式、空格、引号
- ❌ 不能自动修复：删除未使用的变量（可能是有意保留）

### Q: 如何强制修复不安全的问题？
A: 使用 `--unsafe` 标志：
```bash
biome check --write --unsafe .
```

### Q: 哪个命令最常用？
A: **`npm run check:fix`** - 一键修复所有可修复的问题！

---

## 🚀 VS Code 集成

推荐安装 Biome 插件，可以：
- 保存时自动运行 `check:fix`
- 实时显示错误和警告
- 快捷键快速修复问题

配置文件 `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```
