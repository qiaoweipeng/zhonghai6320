/* 首页组件 - 整合屏幕、指示灯、小按钮和红色装饰线条 */
const HomePage = {
  components: { Screen, LightItem, SmallBtn },
  props: ['lights', 'isAutoMode'],
  emits: ['toggle-auto'],
  setup(props, { emit }) {
    const isSilenceOn = Vue.ref(true)
    const currentPage = Vue.ref('alarm')

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

    /* 点击消音按钮切换状态 */
    const handleBtnClick = (label) => {
      if (label === '消音') isSilenceOn.value = !isSilenceOn.value
    }

    return { currentLights, smallBtns, handleBtnClick, currentPage }
  },
  template: `
    <div
      class="w-[1750px] h-[720px] flex relative border-gray-500 bg-[#b6b6b6] rounded-[25px] p-[30px]"
      style="box-shadow: 0 4px 16px rgba(0,0,0,0.3);"
    >
      <Screen :page="currentPage" />
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
    </div>
  `
}
