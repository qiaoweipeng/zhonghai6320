const lightStore = Pinia.defineStore('lights', {
  state: () => ({
    lights: [
      { name: '火警', color: 'red' },
      { name: '启动', color: 'red' },
      { name: '故障', color: 'yellow' },
      { name: '监管', color: 'yellow' },
      { name: '屏蔽', color: 'yellow' },
      { name: '主电', color: 'green' },
      { name: '反馈', color: 'gray' },
      { name: '自动', color: 'red' },
      { name: '消音', color: 'red' },
      { name: '', color: '' },
      { name: '备电', color: 'gray' },
      { name: '自检', color: 'gray' },
      { name: '系统故障', color: 'gray' },
      { name: '', color: '' },
      { name: '', color: '' }
    ],
    isAutoMode: true,
    isSilenceOn: true
  }),
  getters: {
    currentLights: (state) => {
      return state.lights.map(light => {
        if (light.name === '自动') return { ...light, color: state.isAutoMode ? 'red' : 'gray' }
        if (light.name === '消音') return { ...light, color: state.isSilenceOn ? 'red' : 'gray' }
        return light
      })
    }
  },
  actions: {
    toggleAutoMode() {
      this.isAutoMode = !this.isAutoMode
    },
    toggleSilence() {
      this.isSilenceOn = !this.isSilenceOn
    },
    setLightColor(name, color) {
      const light = this.lights.find(l => l.name === name)
      if (light) {
        light.color = color
      }
    },
    randomizeLights() {
      const randomLights = ['火警', '启动', '故障', '监管', '屏蔽']
      this.isAutoMode = Math.random() > 0.5
      this.isSilenceOn = Math.random() > 0.5
      const autoSilenceOn = (this.isAutoMode ? 1 : 0) + (this.isSilenceOn ? 1 : 0)
      const minRequired = Math.max(0, 5 - autoSilenceOn)
      const onCount = Math.floor(Math.random() * (randomLights.length - minRequired + 1)) + minRequired
      const onIndices = new Set()
      while (onIndices.size < onCount) {
        onIndices.add(Math.floor(Math.random() * randomLights.length))
      }
      randomLights.forEach((name, index) => {
        const light = this.lights.find(l => l.name === name)
        if (light) {
          const colorMap = { '火警': 'red', '启动': 'red', '故障': 'yellow', '监管': 'yellow', '屏蔽': 'yellow' }
          light.color = onIndices.has(index) ? colorMap[name] : 'gray'
        }
      })
      const mainPowerOn = Math.random() > 0.5
      const mainLight = this.lights.find(l => l.name === '主电')
      const backupLight = this.lights.find(l => l.name === '备电')
      if (mainLight) mainLight.color = mainPowerOn ? 'green' : 'gray'
      if (backupLight) backupLight.color = mainPowerOn ? 'gray' : 'green'
      const feedbackLight = this.lights.find(l => l.name === '反馈')
      if (feedbackLight) feedbackLight.color = 'gray'
      const selfTestLight = this.lights.find(l => l.name === '自检')
      if (selfTestLight) selfTestLight.color = 'gray'
      const sysFaultLight = this.lights.find(l => l.name === '系统故障')
      if (sysFaultLight) sysFaultLight.color = 'gray'
    }
  }
})