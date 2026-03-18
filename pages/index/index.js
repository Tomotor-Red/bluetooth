const app = getApp()

Page({
  data: {
    // 连接状态
    connected: false,
    scanning: false,
    deviceName: '',
    statusLog: '请点击"扫描设备"开始',
    connectingId: '',

    // 设备列表
    devices: [],

    // 发送记录
    sendLogs: [],
    lastLogId: '',
    logCounter: 0,

    // BLE 参数
    deviceId: '',
    serviceId: '',
    characteristicId: '',
  },

  onLoad() {
    // 监听蓝牙连接状态变化
    wx.onBLEConnectionStateChange((res) => {
      if (!res.connected) {
        this.setData({
          connected: false,
          deviceName: '',
          deviceId: '',
          serviceId: '',
          characteristicId: '',
          statusLog: '连接已断开',
        })
        app.globalData.connected = false
        wx.showToast({ title: '蓝牙连接已断开', icon: 'none' })
      }
    })
  },

  onUnload() {
    this._stopScanSilent()
    if (this.data.connected) {
      wx.closeBLEConnection({ deviceId: this.data.deviceId })
    }
    wx.closeBluetoothAdapter()
  },

  // ==================== 蓝牙初始化 ====================
  _initBluetooth(callback) {
    wx.openBluetoothAdapter({
      success: () => {
        this.setData({ statusLog: '蓝牙初始化成功' })
        callback && callback()
      },
      fail: (err) => {
        const msg = err.errCode === 10001 ? '请先开启手机蓝牙' : `蓝牙初始化失败：${err.errMsg}`
        this.setData({ statusLog: msg })
        wx.showModal({ title: '提示', content: msg, showCancel: false })
      }
    })
  },

  // ==================== 扫描设备 ====================
  startScan() {
    this._initBluetooth(() => {
      this.setData({ devices: [], scanning: true, statusLog: '正在扫描附近蓝牙设备...' })

      wx.onBluetoothDeviceFound((res) => {
        res.devices.forEach((device) => {
          if (!device.name && !device.localName) return
          const name = device.name || device.localName || '未知设备'
          const list = this.data.devices
          const idx = list.findIndex(d => d.deviceId === device.deviceId)
          if (idx === -1) {
            list.push({ deviceId: device.deviceId, name, RSSI: device.RSSI })
          } else {
            list[idx].RSSI = device.RSSI
          }
          this.setData({ devices: list })
        })
      })

      wx.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: false,
        success: () => {
          this.setData({ statusLog: '扫描中，发现设备将显示在下方...' })
          // 10秒后自动停止
          this._scanTimer = setTimeout(() => {
            this.stopScan()
          }, 10000)
        },
        fail: (err) => {
          this.setData({ scanning: false, statusLog: `扫描失败：${err.errMsg}` })
        }
      })
    })
  },

  stopScan() {
    this._stopScanSilent()
    this.setData({ scanning: false, statusLog: `扫描完成，共发现 ${this.data.devices.length} 个设备` })
  },

  _stopScanSilent() {
    if (this._scanTimer) {
      clearTimeout(this._scanTimer)
      this._scanTimer = null
    }
    wx.stopBluetoothDevicesDiscovery({ fail: () => {} })
    wx.offBluetoothDeviceFound()
  },

  // ==================== 连接设备 ====================
  connectDevice(e) {
    if (this.data.connected) return
    const { id: deviceId, name: deviceName } = e.currentTarget.dataset
    this._stopScanSilent()
    this.setData({ scanning: false, connectingId: deviceId, statusLog: `正在连接：${deviceName}` })

    wx.createBLEConnection({
      deviceId,
      success: () => {
        this.setData({
          connected: true,
          deviceId,
          deviceName,
          connectingId: '',
          statusLog: `已连接：${deviceName}，正在获取服务...`,
          devices: [],
        })
        app.globalData.connected = true
        app.globalData.deviceId = deviceId
        this._getServices(deviceId)
      },
      fail: (err) => {
        this.setData({ connectingId: '', statusLog: `连接失败：${err.errMsg}` })
        wx.showToast({ title: '连接失败', icon: 'error' })
      }
    })
  },

  // ==================== 获取服务 ====================
  _getServices(deviceId) {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        // 找第一个可用服务（跳过标准属性服务 0x1800/0x1801）
        const services = res.services.filter(s => {
          const uuid = s.uuid.toUpperCase()
          return !uuid.startsWith('00001800') && !uuid.startsWith('00001801')
        })
        if (!services.length) {
          this.setData({ statusLog: '未找到可用服务，请检查设备' })
          return
        }
        const serviceId = services[0].uuid
        app.globalData.serviceId = serviceId
        this.setData({ serviceId, statusLog: '已获取服务，正在获取特征值...' })
        this._getCharacteristics(deviceId, serviceId)
      },
      fail: (err) => {
        this.setData({ statusLog: `获取服务失败：${err.errMsg}` })
      }
    })
  },

  // ==================== 获取特征值 ====================
  _getCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        // 找可写特征值
        const writable = res.characteristics.find(c => c.properties.write || c.properties.writeNoResponse)
        if (!writable) {
          this.setData({ statusLog: '未找到可写特征值，发送可能失败' })
          return
        }
        const characteristicId = writable.uuid
        app.globalData.characteristicId = characteristicId
        this.setData({
          characteristicId,
          statusLog: `✅ 准备就绪，可以发送指令`,
        })
      },
      fail: (err) => {
        this.setData({ statusLog: `获取特征值失败：${err.errMsg}` })
      }
    })
  },

  // ==================== 断开连接 ====================
  disconnect() {
    if (!this.data.connected) return
    wx.closeBLEConnection({
      deviceId: this.data.deviceId,
      success: () => {
        this.setData({
          connected: false,
          deviceName: '',
          deviceId: '',
          serviceId: '',
          characteristicId: '',
          statusLog: '已主动断开连接',
        })
        app.globalData.connected = false
        wx.showToast({ title: '已断开', icon: 'success' })
      },
      fail: (err) => {
        this.setData({ statusLog: `断开失败：${err.errMsg}` })
      }
    })
  },

  // ==================== 按键按下 ====================
  onBtnPress(e) {
    const char = e.currentTarget.dataset.char
    this._sendChar(char)
  },

  onBtnRelease() {
    // 预留：如需长按持续发送可在此处理
  },

  // ==================== 发送字符 ====================
  _sendChar(char) {
    const { deviceId, serviceId, characteristicId } = this.data
    if (!deviceId || !serviceId || !characteristicId) {
      wx.showToast({ title: '请先完成蓝牙连接', icon: 'none' })
      return
    }

    // 字符串转 ArrayBuffer
    const buffer = this._str2ab(char)

    wx.writeBLECharacteristicValue({
      deviceId,
      serviceId,
      characteristicId,
      value: buffer,
      success: () => {
        this._addLog(char)
      },
      fail: (err) => {
        wx.showToast({ title: `发送失败: ${err.errMsg}`, icon: 'none', duration: 1500 })
      }
    })
  },

  // ==================== 发送记录 ====================
  _addLog(char) {
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    const id = this.data.logCounter + 1
    const logs = this.data.sendLogs
    logs.unshift({ id, char: char.toUpperCase(), time })
    if (logs.length > 50) logs.length = 50
    this.setData({
      sendLogs: logs,
      logCounter: id,
      lastLogId: `log-${id}`,
    })
  },

  // ==================== 工具方法 ====================
  _str2ab(str) {
    const buf = new ArrayBuffer(str.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i < str.length; i++) {
      view[i] = str.charCodeAt(i)
    }
    return buf
  },
})
