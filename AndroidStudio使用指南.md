# Android Studio 使用指南

## 步骤 1：打开项目

### 方法一：使用「Open」打开

1. 启动 Android Studio
2. 在欢迎界面，点击 **Open**
3. 导航到项目目录：`c:/Users/admin/WorkBuddy/20260318104350`
4. 选中 **android** 文件夹（重要！选中 android 文件夹，不是项目根目录）
5. 点击 **OK**
6. 等待 Gradle 同步完成（第一次可能需要几分钟）

### 方法二：打开已有项目

1. 文件 → Open
2. 选择 `c:/Users/admin/WorkBuddy/20260318104350/android` 文件夹

---

## 步骤 2：等待项目同步

打开项目后，Android Studio 会自动：
- 下载依赖
- 构建 Gradle
- 同步项目

**请等待底部进度条完成**，显示 "Gradle sync finished" 为止。

> 💡 提示：如果是第一次，可能需要 5-10 分钟，请耐心等待。

---

## 步骤 3：配置运行设备

### 选项 A：使用真机

1. 用 USB 线连接 Android 手机
2. 手机开启「USB 调试」（开发者选项）
3. 手机上弹出「允许 USB 调试」提示，点击「允许」
4. Android Studio 顶部工具栏，设备选择下拉框会显示你的设备

### 选项 B：使用模拟器

1. 点击 Android Studio 顶部的设备选择下拉框
2. 选择「Device Manager」
3. 点击「Create Device」
4. 选择设备型号（如 Pixel 5）
5. 选择系统镜像（推荐 API 30 或更高）
6. 点击「Finish」创建
7. 点击模拟器的「运行」按钮启动

---

## 步骤 4：生成 Debug APK（测试版）

### 方法一：菜单生成

1. 菜单栏 → **Build**
2. 选择 **Build Bundle(s) / APK(s)**
3. 选择 **Build APK(s)**

等待构建完成，会弹出提示：
```
APK(s) generated successfully for the module 'app'.
```

点击 **locate** 可以找到 APK 文件：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 方法二：直接运行到设备

1. 确保选择了正确的设备（真机或模拟器）
2. 点击工具栏的绿色 ▶️ **Run** 按钮
3. 或者按快捷键：**Shift + F10**
4. APK 会自动安装到设备并启动

---

## 步骤 5：生成 Release APK（正式版）

### 步骤 5.1：创建签名密钥

在命令行（CMD 或 PowerShell）中执行：

```bash
# 进入项目目录
cd c:/Users/admin/WorkBuddy/20260318104350/android/app

# 生成签名密钥
keytool -genkey -v -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
```

按提示输入：
- **Keystore password**：输入密码（记住它）
- **Re-enter**：再次输入密码
- **What is your first and last name**：输入你的名字
- **What is the name of your organization**：回车
- **What is the name of your City**：回车
- **What is the name of your State**：回车
- **What is the two-letter country code**：CN
- **Re-enter**：回车

### 步骤 5.2：配置签名

在 Android Studio 中打开：
`android/app/build.gradle`

在 `android { ... }` 块内添加：

```gradle
signingConfigs {
    release {
        storeFile file('release.keystore')
        storePassword '你的密钥库密码'
        keyAlias 'release'
        keyPassword '你的密钥密码'
    }
}
```

### 步骤 5.3：构建 Release APK

1. 菜单栏 → **Build**
2. 选择 **Generate Signed Bundle / APK...**
3. 选择 **APK**，点击 **Next**
4. 勾选 **release**，点击 **Next**
5. 填写密钥信息：
   - Keystore path：选择刚才生成的 `release.keystore`
   - Keystore password：输入密码
   - Key alias：release
   - Key password：输入密码
6. 勾选 **Remember passwords**（可选）
7. 点击 **Next**
8. 选择 **release**，点击 **Finish**

等待构建完成，APK 位于：
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## APK 安装到手机

### 方法一：Android Studio 直接安装

1. 点击工具栏的 ▶️ Run 按钮
2. APK 自动安装并启动

### 方法二：手动安装

1. 找到 APK 文件：
   - Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Release: `android/app/build/outputs/apk/release/app-release.apk`

2. 传输到手机（USB/微信/网盘）
3. 在手机上点击安装

---

## 常用快捷键

| 操作 | 快捷键 |
|------|--------|
| 运行 | Shift + F10 |
| 停止 | Ctrl + F2 |
| 重新构建 | Ctrl + F9 |
| Clean Project | Build → Clean Project |
| Rebuild Project | Build → Rebuild Project |

---

## 常见问题

### Q: Gradle 同步失败？
1. 关闭 Android Studio
2. 删除 `android/.gradle` 文件夹
3. 重新打开项目

### Q: 找不到 Build APK 选项？
- 确保选中的是 `android` 文件夹，不是项目根目录
- 等待 Gradle 同步完成

### Q: 构建时提示找不到依赖？
- Build → Clean Project
- Build → Rebuild Project

### Q: APK 安装失败？
- Debug APK 可以直接安装
- Release APK 需要卸载旧版本后才能安装（签名不同）

### Q: 如何卸载 APP？
- 真机：长按图标 → 卸载
- 模拟器：Settings → Apps → 找到应用 → Uninstall

---

## 快速参考

### 生成 Debug APK
```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```

### 生成 Release APK
```
Build → Generate Signed Bundle / APK...
```

### 运行到设备
```
点击 ▶️ Run 按钮或 Shift + F10
```

### APK 位置
- Debug: `android/app/build/outputs/apk/debug/`
- Release: `android/app/build/outputs/apk/release/`
