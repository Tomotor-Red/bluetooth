# GitHub Actions 自动构建 APK 指南

---

## 什么是 GitHub Actions？

GitHub Actions 是 GitHub 提供的 CI/CD 服务，可以自动构建、测试和部署代码。

使用 GitHub Actions 构建的优势：
- 🚀 云端构建，不需要本地配置复杂环境
- ⚡ 自动触发，推送代码即构建
- 💾 构建产物自动保存 30 天
- 🆓 完全免费（公开项目）

---

## 使用步骤

### 步骤 1：推送到 GitHub

1. 在 GitHub 上创建新仓库（如果还没有）
2. 初始化 Git 仓库：

```bash
cd c:/Users/admin/WorkBuddy/20260318104350
git init
git add .
git commit -m "初始提交"
```

3. 关联远程仓库并推送：

```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 步骤 2：自动触发构建

推送代码后，GitHub Actions 会自动开始构建！

查看构建状态：
1. 访问你的 GitHub 仓库
2. 点击顶部的 **Actions** 标签
3. 选择最新的工作流
4. 实时查看构建进度

### 步骤 3：下载 APK

构建完成后（约 5-10 分钟）：

1. 在 Actions 页面，找到完成的工作流
2. 向下滚动到 **Artifacts** 区域
3. 点击下载：
   - **app-debug** - Debug 版本 APK
   - **app-release** - Release 版本 APK（未签名）

---

## 手动触发构建

### 方法一：通过 GitHub 网页界面

1. 访问仓库 → **Actions** 标签
2. 选择左侧的 **Build Android APK**
3. 点击右上角的 **Run workflow**
4. 选择分支（main）
5. 点击 **Run workflow** 按钮

### 方法二：通过 Git 命令

```bash
# 推送代码会自动触发
git push origin main

# 创建空提交触发构建（不修改代码）
git commit --allow-empty -m "触发构建"
git push
```

---

## 配置说明

### 自动触发条件

以下情况会自动触发构建：
- 推送到 `main` 或 `master` 分支
- 修改了以下文件：
  - `App.js`
  - `android/**`
  - `package.json`
  - `package-lock.json`
  - `.github/workflows/build.yml`

### 手动触发

任何分支都可以通过「Run workflow」按钮手动触发。

---

## 构建产物说明

### Debug APK
- 文件名：`app-debug.apk`
- 用途：测试、调试
- 签名：使用 debug 密钥
- 安装：可直接安装（可覆盖旧版本）

### Release APK
- 文件名：`app-release.apk`
- 用途：发布、正式使用
- 签名：未签名（需要重新签名才能发布）
- 安装：需要先卸载旧版本（签名不同）

---

## 构建 Release 签名 APK

### 步骤 1：准备签名密钥

本地生成密钥：
```bash
keytool -genkey -v -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
```

### 步骤 2：配置 GitHub Secrets

1. 访问仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 添加以下密钥：

| Name | 说明 |
|------|------|
| `KEYSTORE_FILE` | base64 编码的 keystore 文件内容 |
| `KEYSTORE_PASSWORD` | 密钥库密码 |
| `KEY_ALIAS` | 密钥别名（如：release） |
| `KEY_PASSWORD` | 密钥密码 |

**生成 KEYSTORE_FILE base64**（Windows PowerShell）：
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore"))
```

### 步骤 3：修改 workflow 配置

更新 `.github/workflows/build.yml`，添加签名步骤：

```yaml
- name: 解密签名文件
  env:
    KEYSTORE_FILE: ${{ secrets.KEYSTORE_FILE }}
  run: |
    echo "$KEYSTORE_FILE" | base64 -d > android/app/release.keystore

- name: 构建 Release APK（已签名）
  env:
    KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
    KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
    KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
  run: |
    cd android
    ./gradlew assembleRelease
```

---

## 常见问题

### Q: 构建失败怎么办？
1. 查看失败日志（Actions 页面）
2. 常见原因：
   - 代码语法错误
   - 依赖冲突
   - Gradle 版本问题

### Q: 构建需要多久？
- Debug APK：约 3-5 分钟
- Release APK：约 5-8 分钟

### Q: APK 保存多久？
- 默认 30 天
- 可在 workflow 中修改 `retention-days`

### Q: 可以构建多个版本吗？
修改 workflow 添加：
```yaml
- name: 构建 API 30 版本
  run: |
    cd android
    ./gradlew assembleDebug -PcompileSdkVersion=30
```

### Q: 如何取消构建？
- Actions 页面 → 点击运行中的工作流 → 右上角「Cancel workflow」

---

## 优化建议

### 1. 使用缓存加速构建

已在 workflow 中配置缓存（Gradle 和 npm），首次构建后速度会大幅提升。

### 2. 并行构建

修改 workflow 支持多个架构：
```yaml
jobs:
  build:
    strategy:
      matrix:
        include:
          - abi: arm64-v8a
          - abi: armeabi-v7a
```

### 3. 通知构建结果

在 workflow 最后添加：
```yaml
- name: 发送通知
  if: failure()
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: '构建失败',
        body: '请查看 Actions 日志'
      })
```

---

## 快速参考

### 查看构建状态
```
仓库 → Actions → Build Android APK
```

### 下载 APK
```
Actions → 工作流 → Artifacts → 下载
```

### 手动触发
```
Actions → Build Android APK → Run workflow
```

### 查看日志
```
Actions → 工作流 → 点击构建步骤
```

---

## 推荐工作流

1. ✅ 本地开发修改代码
2. ✅ 推送到 GitHub
3. ✅ 等待 GitHub Actions 自动构建
4. ✅ 下载 APK 到手机测试
5. ✅ 如有问题，修复后再次推送

开始使用吧！有任何问题随时问我。
