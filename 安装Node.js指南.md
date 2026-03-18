# 安装 Node.js 指南

## 什么是 Node.js？

Node.js 是 JavaScript 运行环境，npm 是它的包管理器。React Native 项目需要 Node.js 来运行。

---

## 快速安装步骤

### 方案一：官网安装（推荐）

1. **下载 Node.js**
   - 访问：https://nodejs.org/
   - 下载 LTS 版本（长期支持版），例如：Node.js 20.x LTS

2. **运行安装程序**
   - 双击下载的 `.msi` 文件
   - 一路点击「Next」即可完成安装

3. **验证安装**
   打开新的命令行窗口（CMD 或 PowerShell），输入：
   ```bash
   node -v
   npm -v
   ```
   如果显示版本号，说明安装成功！

### 方案二：使用 winget（Windows 10/11）

如果您使用 Windows 10 或 11，可以直接用命令安装：

```bash
winget install OpenJS.NodeJS.LTS
```

### 方案三：使用 chocolatey

如果您已安装 chocolatey：

```bash
choco install nodejs-lts
```

---

## 安装后配置

### 1. 配置 npm 国内镜像（加速下载）

```bash
npm config set registry https://registry.npmmirror.com
```

### 2. 安装项目依赖

回到项目目录：

```bash
cd c:/Users/admin/WorkBuddy/20260318104350
npm install
```

这会下载所有需要的依赖包，需要几分钟时间。

---

## 接下来做什么？

安装完 Node.js 后，您可以选择：

### 选项 A：直接生成 APK（不需要 Android Studio）

如果已安装 Java，可以直接用 Gradle 构建：

```bash
cd android
gradlew.bat assembleDebug
```

生成的 APK 在：`android/app/build/outputs/apk/debug/app-debug.apk`

### 选项 B：先安装 Java（如果没有）

如果提示找不到 Java，需要先安装 JDK：

1. 下载：https://adoptium.net/
2. 安装 Java 11 或更高版本
3. 设置 JAVA_HOME 环境变量

---

## 常见问题

### Q: 安装后还是提示找不到 npm？
- 关闭所有命令行窗口，重新打开新的窗口
- 重启电脑

### Q: npm install 很慢？
- 已配置国内镜像会快很多
- 如果还是慢，可以使用 cnpm：
  ```bash
  npm install -g cnpm --registry=https://registry.npmmirror.com
  cnpm install
  ```

### Q: 需要多大空间？
- Node.js 安装包约 30MB
- 完整安装后约 200-300MB
- 项目依赖约 500MB

---

## 推荐安装顺序

1. ✅ Node.js（包含 npm）
2. ✅ Java JDK（11+）
3. ✅ Android SDK（如果没有 Android Studio）
4. ✅ npm install（安装项目依赖）
5. ✅ 生成 APK

完成安装后告诉我，我继续指导下一步！
