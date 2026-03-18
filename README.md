# Bluetooth Test App v2

这是全新重构的蓝牙测试应用,采用极简代码结构,避免之前的编译问题。

## 项目特点

- ✅ 极简的 React Native 代码
- ✅ 优化的 Gradle 配置
- ✅ 自动化的 GitHub Actions 构建
- ✅ 支持蓝牙 LE 通信

## 构建状态

APK 通过 GitHub Actions 自动构建。

## 项目结构

```
bluetooth-v2/
├── App.js                 # 主应用文件(极简版本)
├── package.json           # 依赖配置
├── android/              # Android 构建配置
│   ├── app/             # 应用模块
│   ├── build.gradle     # 项目级构建配置
│   └── gradle.properties # Gradle 属性配置
└── .github/workflows/   # GitHub Actions 工作流
```

## 本地运行

```bash
# 安装依赖
npm install

# 启动 Metro 服务器
npm start

# 在 Android 设备上运行
npm run android
```

## 构建 APK

APK 会通过 GitHub Actions 自动构建。构建完成后可以从 Actions 页面下载。

## 技术栈

- React Native 0.72.6
- react-native-ble-plx 3.0.0
- Gradle 7.5.1
