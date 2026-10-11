// ESLint flat config（v9）：
// - 全站 JS/JSX：recommended 核心 + react recommended（JSX 中 <Comp/> 计为使用）+ 未用变量纪律
// - scripts/（Node 构建脚本）：console 允许、node 全局可用
// 来源: openspec/config.yaml 工作流 §1 门禁（engineer-grade lint 要求）
import js from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  { ignores: ['dist/**', 'node_modules/**', 'tmp/**', '.playwright-mcp/**', 'openspec/**', 'public/**', 'worker/dist/**'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.es2025 },
    },
    plugins: { react: reactPlugin, 'react-hooks': reactHooks },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // 项目无 Flow/PropTypes 惯例；组件 props 均来自本文件闭包或 JSON
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-constant-binary-expression': 'error',
      'prefer-const': 'warn',
    },
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: { ...globals.node, ...globals.es2025 },
    },
    rules: {
      'no-console': 'off',
    },
  },
]
