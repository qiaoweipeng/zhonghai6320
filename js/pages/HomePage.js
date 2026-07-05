/* 首页组件 - 整合屏幕、指示灯、小按钮和红色装饰线条 */
const HomePage = {
  components: { Screen, LightItem, SmallBtn, ExamComponent },
  props: ['lights', 'isAutoMode'],
  emits: ['toggle-auto'],
  setup(props, { emit }) {
    const isSilenceOn = Vue.ref(true)
    const currentPage = Vue.ref('alarm')
    const menuSelectedIndex = Vue.ref(0)
    const searchSelectedIndex = Vue.ref(0)

    /* 器件信息页面状态：0=分区, 1=回路, 2=地址编号 */
    const deviceActiveField = Vue.ref(0)
    const zoneValue = Vue.ref('01')
    const loopValue = Vue.ref('01')
    const addrValue = Vue.ref('001')
    /* 上次输入数字的时间戳，5秒内追加，超过5秒清空重新输入 */
    let lastInputTime = 0

    /* 生成随机整数 */
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

    /* 16个竖条矩形数据 */
    const deviceBars = Vue.ref([])

    /* 缓存各分区的竖条数据，页面内切换分区不重新生成（响应式，确保computed能追踪） */
    const deviceBarsCache = Vue.ref({})

    /* 为指定分区生成16个竖条矩形数据 */
    const generateBarsForZone = (zone) => {
      return Array.from({ length: 16 }, (_, i) => {
        const num = (i + 1).toString().padStart(2, '0')
        let value = '000'
        if (zone === '01') {
          if (i === 0) value = randomInt(56, 59).toString().padStart(3, '0')
          else if (i === 1) value = randomInt(16, 19).toString().padStart(3, '0')
        } else if (zone === '03' || zone === '05') {
          if (i === 0) value = randomInt(16, 19).toString().padStart(3, '0')
        }
        return { value, label: num }
      })
    }

    /* 进入器件信息页面时：预生成所有分区的随机数并缓存 */
    const initDeviceBarsCache = () => {
      deviceBarsCache.value = {
        '01': generateBarsForZone('01'),
        '03': generateBarsForZone('03'),
        '05': generateBarsForZone('05')
      }
    }

    /* 初始化缓存 */
    initDeviceBarsCache()

    /* 根据当前分区值从缓存中取数据 */
    const updateDeviceBars = () => {
      const zone = zoneValue.value
      deviceBars.value = deviceBarsCache.value[zone] || generateBarsForZone(zone)
    }
    updateDeviceBars()

    /* 监听分区值变化，从缓存中读取（不重新生成） */
    Vue.watch(zoneValue, () => {
      updateDeviceBars()
    })

    /* 监听页面切换：进入器件信息页面时重新生成所有缓存 */
    Vue.watch(currentPage, (newPage) => {
      if (newPage === 'device') {
        initDeviceBarsCache()
        updateDeviceBars()
      }
    })

    /* 计算指示灯状态：自动和消音灯根据状态切换颜色 */
    const currentLights = Vue.computed(() => {
      return props.lights.map(light => {
        if (light.name === '自动') return { ...light, color: props.isAutoMode ? 'red' : 'gray' }
        if (light.name === '消音') return { ...light, color: isSilenceOn.value ? 'red' : 'gray' }
        return light
      })
    })

    /* 小按钮标签列表 */
    const smallBtns = ['复位', '声光', '1', '2ABC', '3DEF', '自检', '取消', '4GHI', '5JKL', '6MNO', '确认', '▲', '7PQRS', '8TUV', '9WXYZ', '◀', '▼', '▶', '0', '消音']

    /* 方向键移动菜单选中项：4列2行共8个 */
    const moveMenuSelection = (direction) => {
      if (currentPage.value !== 'menu') return
      const cols = 4
      const total = 8
      let idx = menuSelectedIndex.value
      if (direction === '▲' && idx >= cols) idx -= cols
      else if (direction === '▼' && idx < total - cols) idx += cols
      else if (direction === '◀' && idx % cols !== 0) idx -= 1
      else if (direction === '▶' && idx % cols !== cols - 1) idx += 1
      menuSelectedIndex.value = idx
    }

    /* 方向键移动信息查询选中项：4列2行共7个 */
    const moveSearchSelection = (direction) => {
      if (currentPage.value !== 'search') return
      const cols = 4
      const total = 7
      let idx = searchSelectedIndex.value
      if (direction === '▲' && idx >= cols) idx -= cols
      else if (direction === '▼' && idx < total - cols) idx += cols
      else if (direction === '◀' && idx % cols !== 0) idx -= 1
      else if (direction === '▶' && idx % cols !== cols - 1 && idx + 1 < total) idx += 1
      searchSelectedIndex.value = idx
    }

    /* 器件信息页面：箭头上下切换文本框（0=分区 → 1=回路 → 2=地址编号） */
    const moveDeviceField = (direction) => {
      if (currentPage.value !== 'device') return
      if (direction === '▼' && deviceActiveField.value < 2) {
        deviceActiveField.value++
        lastInputTime = 0
      } else if (direction === '▲' && deviceActiveField.value > 0) {
        deviceActiveField.value--
        lastInputTime = 0
      }
    }

    /* 确认按钮处理 */
    const handleConfirm = () => {
      if (currentPage.value === 'menu' && menuSelectedIndex.value === 0) {
        currentPage.value = 'search'
        searchSelectedIndex.value = 0
      } else if (currentPage.value === 'search' && searchSelectedIndex.value === 1) {
        currentPage.value = 'device'
      }
    }

    /* 从按钮标签提取数字（如 '2ABC' → 2，'0' → 0，'复位' → null） */
    const extractDigit = (label) => {
      const match = label.match(/^[0-9]/)
      return match ? parseInt(match[0]) : null
    }

    /* 数字键处理：1-8在菜单/查询页选中项，0-9在器件信息页输入数字 */
    const handleDigitKey = (digit) => {
      if (currentPage.value === 'menu') {
        if (digit === 0 || digit === 9) return
        const total = 8
        const idx = digit - 1
        if (idx >= 0 && idx < total) {
          menuSelectedIndex.value = idx
          handleConfirm()
        }
      } else if (currentPage.value === 'search') {
        if (digit === 0 || digit === 9) return
        const total = 7
        const idx = digit - 1
        if (idx >= 0 && idx < total) {
          searchSelectedIndex.value = idx
          if (idx === 1) {
            currentPage.value = 'device'
          }
        }
      } else if (currentPage.value === 'device') {
        /* 器件信息页面：5秒内追加数字，超过5秒清空重新输入 */
        const d = digit.toString()
        const now = Date.now()
        const maxLen = deviceActiveField.value === 2 ? 3 : 2
        let curValue = ''
        if (deviceActiveField.value === 0) curValue = zoneValue.value
        else if (deviceActiveField.value === 1) curValue = loopValue.value
        else curValue = addrValue.value
        /* 超过5秒或首次输入：清空后只显示当前数字 */
        if (now - lastInputTime > 5000) {
          curValue = d
        } else {
          /* 5秒内：追加数字，超过最大位数取末尾几位 */
          curValue = (curValue + d).slice(-maxLen)
        }
        lastInputTime = now
        if (deviceActiveField.value === 0) zoneValue.value = curValue
        else if (deviceActiveField.value === 1) loopValue.value = curValue
        else addrValue.value = curValue
      }
    }

    /* 点击消音按钮切换状态 */
    const handleBtnClick = (label) => {
      if (label === '消音') isSilenceOn.value = !isSilenceOn.value
      if (['▲', '▼', '◀', '▶'].includes(label)) {
        moveMenuSelection(label)
        moveSearchSelection(label)
        moveDeviceField(label)
      }
      if (label === '确认') handleConfirm()
      const digit = extractDigit(label)
      if (digit !== null) handleDigitKey(digit)
    }

    /* 页面跳转处理 */
    const handleNavigate = (page) => {
      currentPage.value = page
    }

    /* 屏幕右侧按钮点击处理：第5个(索引4)为退出/返回键 */
    const handleScreenBtnClick = (index) => {
      if (index === 4) {
        if (currentPage.value === 'device') {
          currentPage.value = 'search'
        } else if (currentPage.value === 'search') {
          currentPage.value = 'menu'
        } else if (currentPage.value === 'menu') {
          currentPage.value = 'alarm'
        } else if (currentPage.value === 'alarm') {
          currentPage.value = 'menu'
        }
      }
    }

    /* 计算各分区设备总数及明细，传给考题组件 */
    const examZoneData = Vue.computed(() => {
      const result = {}
      Object.keys(deviceBarsCache.value).forEach(zone => {
        const bars = deviceBarsCache.value[zone]
        /* 只统计非零的竖条 */
        const details = bars.filter(bar => parseInt(bar.value) > 0).map(bar => parseInt(bar.value))
        const total = details.reduce((sum, v) => sum + v, 0)
        result[zone] = { total, details }
      })
      return result
    })

    /* 考题组件触发：回到警情页面 */
    const handleReturnAlarm = () => {
      currentPage.value = 'alarm'
    }

    return { currentLights, smallBtns, handleBtnClick, handleNavigate, handleScreenBtnClick, currentPage, menuSelectedIndex, searchSelectedIndex, deviceActiveField, zoneValue, loopValue, addrValue, deviceBars, examZoneData, handleReturnAlarm }
  },
  template: `
    <div
      class="w-[1750px] h-[720px] flex relative border-gray-500 bg-[#b6b6b6] rounded-[25px] p-[30px]"
      style="box-shadow: 0 4px 16px rgba(0,0,0,0.3);"
    >
      <Screen :page="currentPage" :menu-selected-index="menuSelectedIndex" :search-selected-index="searchSelectedIndex" :device-active-field="deviceActiveField" :zone-value="zoneValue" :loop-value="loopValue" :addr-value="addrValue" :device-bars="deviceBars" @navigate="handleNavigate" @screen-btn-click="handleScreenBtnClick" />
      <div class="w-[35%] h-full flex flex-col justify-start">
        <div class="grid grid-cols-5 gap-[5px] mb-[75px]">
          <LightItem
            v-for="(light, index) in currentLights"
            :key="index"
            :name="light.name"
            :color="light.color"
          />
        </div>
        <div class="grid grid-cols-5 grid-rows-4 gap-[40px] pl-[35px]">
          <SmallBtn
            v-for="(btn, index) in smallBtns"
            :key="index"
            :label="btn"
            @click="handleBtnClick"
          />
        </div>
      </div>
      <!-- 红色装饰线条 - 中间细两边粗 -->
      <div class="absolute top-[30%] right-[35px] h-[20px]" style="width: 577px;">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" class="w-full h-full" style="filter: drop-shadow(0 2px 4px rgba(255,0,0,0.3));">
          <path d="M0,10 Q25,-8 50,10 T100,5" fill="none" stroke="#dc2626" stroke-width="8" />
        </svg>
      </div>
      <!-- 考题组件 -->
      <ExamComponent :zone-data="examZoneData" @return-alarm="handleReturnAlarm" />
    </div>
  `
}
