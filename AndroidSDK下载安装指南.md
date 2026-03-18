# Android SDK 下载与安装指南

---

## 什么是 Android SDK？

Android SDK（Software Development Kit）是开发 Android 应用所需的核心工具包。React Native 需要 Android SDK 来编译和打包 APK。

---

## 方法一：独立安装 Command Line Tools（推荐给无 Android Studio 用户）

### 步骤 1：下载 Command Line Tools

1. 访问：https://developer.android.com/studio#command-tools
2. 找到「Command line tools only」部分
3. 下载 Windows 版本（约 100 MB）
4. 文件名类似：`commandlinetools-win-11076714_latest.zip`

### 步骤 2：解压文件

将下载的压缩包解压到某个目录，例如：
```
C:\android-sdk
```

### 步骤 3：设置目录结构

将解压后的 `cmdline-tools` 文件夹重命名为 `latest`，然后移动到：
```
C:\android-sdk\cmdline-tools\latest
```

最终目录结构应该是：
```
C:\android-sdk\
  └── cmdline-tools\
      └── latest\
          ├── bin\
          ├── lib\
          └── ...
```

### 步骤 4：配置环境变量

#### 设置 ANDROID_HOME

1. 按 `Win + X`，选择「系统」
2. 点击「高级系统设置」
3. 点击「环境变量」
4. 在「系统变量」中点击「新建」：
   - **变量名**：`ANDROID_HOME`
   - **变量值**：`C:\android-sdk`
5. 点击「确定」

#### 添加到 Path

1. 在「系统变量」中找到 `Path`，点击「编辑」
2. 点击「新建」，添加：
   - `%ANDROID_HOME%\cmdline-tools\latest\bin`
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\build-tools\33.0.0`
3. 点击「确定」保存

### 步骤 5：验证安装

打开**新的**命令行窗口，输入：

```bash
sdkmanager --version
```

如果显示版本号，说明配置成功！

### 步骤 6：安装 SDK 组件

在命令行中执行：

```bash
# 接受许可协议
sdkmanager --licenses

# 安装必要组件
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

---

## 方法二：通过 Android Studio 安装（最简单）

如果您打算安装 Android Studio，SDK 会自动安装。

### 步骤 1：下载 Android Studio

1. 访问：https://developer.android.com/studio
2. 下载 Windows 版本（约 1.2 GB）
3. 安装时勾选「Android Virtual Device」（可选）

### 步骤 2：首次启动安装 SDK

1. 启动 Android Studio
2. 选择「Standard」安装类型
3. 自动下载并安装 Android SDK
4. 默认安装位置：
   ```
   C:\Users\你的用户名\AppData\Local\Android\Sdk
   ```

### 步骤 3：配置环境变量（可选但推荐）

虽然 Android Studio 不需要，但为了命令行使用，建议配置：

1. 打开环境变量设置（同方法一）
2. 设置 ANDROID_HOME：
   ```
   C:\Users\你的用户名\AppData\Local\Android\Sdk
   ```
3. 添加到 Path：
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\build-tools\33.0.0
   ```

---

## 验证安装

打开新的命令行窗口，检查：

```bash
# 检查 adb 工具
adb version

# 检查 SDK 路径
echo %ANDROID_HOME%
```

---

## 常见问题

### Q: sdkmanager 命令找不到？
- 确认已设置环境变量
- **重启命令行窗口**（必须！）
- 检查 Path 是否包含 `%ANDROID_HOME%\cmdline-tools\latest\bin`

### Q: sdkmanager 提示找不到 Java？
- 需要先安装 JDK 11 或更高版本
- 设置 JAVA_HOME 环境变量

### Q: 下载速度太慢？
使用国内镜像，在 `C:\Users\你的用户名\.gradle` 创建 `gradle.properties` 文件：

```properties
systemProp.https.proxyHost=mirrors.cloud.tencent.com
systemProp.https.proxyPort=80
```

或者直接修改环境变量：
```bash
set GRADLE_OPTS="-Dhttp.proxyHost=mirrors.cloud.tencent.com -Dhttp.proxyPort=80"
```

### Q: 需要多大空间？
- Command Line Tools：约 200 MB
- Android Studio：约 4-5 GB
- 完整 SDK：约 5-10 GB

### Q: 可以删除不需要的版本吗？
```bash
# 列出已安装组件
sdkmanager --list_installed

# 卸载不需要的版本
sdkmanager --uninstall "platforms;android-32"
```

---

## 推荐安装顺序

1. ✅ Java JDK 11+
2. ✅ Android SDK
3. ✅ Node.js
4. ✅ 安装项目依赖：`npm install`
5. ✅ 生成 APK

---

## 快速命令参考

```bash
# 接受许可
sdkmanager --licenses

# 安装组件
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# 列出可用包
sdkmanager --list

# 列出已安装包
sdkmanager --list_installed

# 卸载包
sdkmanager --uninstall "platforms;android-32"
```

---

## 安装完成后的下一步

安装完 Android SDK 后，可以：

### 选项 A：用 Gradle 生成 APK（不需要 Android Studio）

```bash
cd c:/Users/admin/WorkBuddy/20260318104350/android
gradlew.bat assembleDebug
```

### 选项 B：用 Android Studio 打开项目

1. File → Open
2. 选择 `android` 文件夹
3. Build → Build APK

---

有任何问题随时问我！
