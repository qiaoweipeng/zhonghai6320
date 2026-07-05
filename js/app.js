/* 主应用 - 创建Vue实例并挂载，管理全局状态 */

/* 图片预加载 - 首次打开即缓存所有图标，避免页面切换时延迟 */
const preloadImages = () => {
  const icons = {
    menu: ['bcsz', 'fw', 'qjpb', 'sbcz', 'szd', 'tsgj', 'xtgl', 'xxcx'],
    search: ['dxp', 'dyzt', 'lsjl', 'qjxx', 'xtgk', 'zjxx', 'zxp']
  }
  Object.entries(icons).forEach(([folder, names]) => {
    names.forEach(name => {
      const img = new Image()
      img.src = `icon/${folder}/${name}.png`
    })
  })
}
preloadImages()

const app = Vue.createApp({
  components: { HomePage },
  setup() {
    const isAutoMode = Vue.ref(true)
    const lights = Vue.ref([
      { name: '火警', color: 'red' },
      { name: '启动', color: 'red' },
      { name: '故障', color: 'yellow' },
      { name: '监管', color: 'yellow' },
      { name: '屏蔽', color: 'yellow' },
      { name: '主电', color: 'green' },
      { name: '反馈', color: 'red' },
      { name: '自动', color: 'red' },
      { name: '消音', color: 'red' },
      { name: '', color: '' },
      { name: '备电', color: 'gray' },
      { name: '自检', color: 'gray' },
      { name: '系统故障', color: 'gray' },
      { name: '', color: '' },
      { name: '', color: '' }
    ])
    const toggleAutoMode = () => { isAutoMode.value = !isAutoMode.value }
    return { isAutoMode, lights, toggleAutoMode }
  },
  template: `
    <div>
      <HomePage :lights="lights" :is-auto-mode="isAutoMode" @toggle-auto="toggleAutoMode" />
    </div>
  `
})

app.mount('#app')
