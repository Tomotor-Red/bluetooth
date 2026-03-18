# 蓝牙控制器 Android APP

这是一个基于 React Native 开发的 Android 蓝牙控制应用，可以通过蓝牙发送 W/A/S/D/Q/F 六个字符指令。

## 功能特性

- 🔍 扫描附近 BLE 蓝牙设备
- 🔌 连接/断开蓝牙设备
- 🎮 六个控制按钮（W/A/S/D/Q/F）发送字符
- 📝 发送记录实时显示

## 安装步骤

### 1. 环境要求

- Node.js 16+
- Java JDK 11
- Android SDK (API 33)
- Android Studio

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Android

确保 Android SDK 已安装，并且设置了环境变量：
- `ANDROID_HOME`
- `JAVA_HOME`

### 4. 运行应用

**方法一：使用 Android Studio**
1. 用 Android Studio 打开 `android` 文件夹
2. 连接 Android 设备或启动模拟器
3. 点击 Run 按钮

**方法二：使用命令行**
```bash
# 连接 Android 设备后运行
npm run android
```

## 使用说明

1. 启动应用后，授予蓝牙和位置权限
2. 点击「扫描设备」查找附近蓝牙设备
3. 从列表中点击要连接的设备
4. 连接成功后，点击控制按钮发送字符：
   - W（蓝色）
   - A（绿色）
   - S（橙色）
   - D（红色）
   - Q（紫色）
   - F（青色）
5. 底部会显示发送记录

## 权限说明

应用需要以下权限：
- `BLUETOOTH_SCAN` - 扫描蓝牙设备
- `BLUETOOTH_CONNECT` - 连接蓝牙设备
- `ACCESS_FINE_LOCATION` - Android 12以下扫描蓝牙需要位置权限

## 技术栈

- React Native 0.72.6
- react-native-ble-plx - 蓝牙 BLE 库
- Android API 23+

## 注意事项

1. 蓝牙功能需要在真实设备上测试，模拟器不支持
2. 目标设备必须支持 BLE（蓝牙低功耗）
3. 确保 Android 设备的蓝牙已开启
