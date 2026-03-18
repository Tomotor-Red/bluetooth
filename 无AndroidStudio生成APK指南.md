# 无 Android Studio 生成 APK 指南

## 方案一：使用命令行 Gradle（推荐）

### 前提条件

需要安装以下工具：

1. **Java JDK 11 或更高版本**
   - 下载：https://adoptium.net/
   - 安装后验证：`java -version`

2. **设置 JAVA_HOME 环境变量**
   - Windows:
     ```
     控制面板 → 系统 → 高级系统设置 → 环境变量
     新建系统变量：
       变量名：JAVA_HOME
       变量值：C:\Program Files\Eclipse Adoptium\jdk-11.x.x
     编辑 Path，添加：%JAVA_HOME%\bin
     ```

3. **Android SDK**
   - 下载 Command-line Tools: https://developer.android.com/studio#command-tools
   - 解压到任意目录，例如：`C:\android-sdk`

4. **设置 ANDROID_HOME 环境变量**
   - Windows:
     ```
     控制面板 → 系统 → 高级系统设置 → 环境变量
     新建系统变量：
       变量名：ANDROID_HOME
       变量值：C:\android-sdk
     编辑 Path，添加：%ANDROID_HOME%\platform-tools
     ```

5. **使用 SDK Manager 安装必要组件**

打开命令行，执行：
```bash
# 进入 sdkmanager 所在目录
cd C:\android-sdk\cmdline-tools\latest\bin

# 安装必要组件
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

### 生成 APK

1. **进入项目目录**
```bash
cd c:/Users/admin/WorkBuddy/20260318104350/android
```

2. **生成 Debug APK（快速测试）**

Windows:
```bash
gradlew.bat assembleDebug
```

生成的 APK 位于：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

3. **生成 Release APK（正式版）**

先创建签名密钥：

Windows CMD:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

修改 `android/app/build.gradle`，添加签名配置：
```gradle
signingConfigs {
    release {
        storeFile file('my-release-key.keystore')
        storePassword '你的密码'
        keyAlias 'my-key-alias'
        keyPassword '你的密码'
    }
}
```

然后执行：
```bash
gradlew.bat assembleRelease
```

生成的 APK 位于：
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 方案二：使用 Expo（最简单）

如果你不想处理复杂的 Android 配置，可以用 Expo：

### 步骤 1：安装 Expo CLI

```bash
npm install -g expo-cli
```

### 步骤 2：使用 EAS Build（在线打包）

1. **安装 EAS CLI**
```bash
npm install -g eas-cli
```

2. **登录 Expo**
```bash
eas login
```

3. **配置项目**
```bash
eas build:configure
```

4. **构建 APK**
```bash
eas build --platform android
```

等待几分钟后，Expo 会生成 APK 下载链接。

---

## 方案三：使用 GitHub Actions（自动化）

创建 `.github/workflows/build.yml`:

```yaml
name: Build APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 11
        uses: actions/setup-java@v3
        with:
          java-version: '11'
          distribution: 'temurin'
      - name: Setup Android SDK
        uses: android-actions/setup-android@v2
      - name: Grant execute permission for gradlew
        run: chmod +x android/gradlew
      - name: Build APK
        run: |
          cd android
          ./gradlew assembleRelease
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release
          path: android/app/build/outputs/apk/release/*.apk
```

推送到 GitHub 后，在 Actions 页面点击 "Run workflow" 即可自动构建。

---

## APK 安装到手机

### 方法一：直接复制安装

1. 将 APK 文件传到手机（数据线、微信、网盘等）
2. 在手机文件管理器中找到 APK
3. 点击安装
4. 如提示「未知来源」，在设置中允许安装

### 方法二：使用 ADB 安装

```bash
# 连接手机
adb devices

# 安装 APK
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 常见问题

### Q: gradlew.bat 不存在？
在 `android` 目录创建该文件（项目已包含）

### Q: 提示找不到 JAVA_HOME？
检查环境变量是否正确设置，重启命令行

### Q: 下载 Android SDK 太慢？
使用国内镜像：
```bash
# 设置代理
set GRADLE_OPTS="-Dhttp.proxyHost=mirrors.cloud.tencent.com -Dhttp.proxyPort=80"
```

### Q: 构建失败？
删除 `android/.gradle` 文件夹后重试

---

## 推荐方案

如果你：
- **有基本开发经验** → 方案一（Gradle）
- **想快速搞定** → 方案二（Expo EAS）
- **熟悉 GitHub** → 方案三（GitHub Actions）
