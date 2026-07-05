/* 屏幕组件 - 左侧黑色边框内的蓝色显示区域，包含屏幕按钮 */
/* 通过 page prop 控制显示内容：'alarm' 显示警情页面，'menu' 显示菜单页面 */
const Screen = {
  components: { ScreenBtn, AlarmPage, MenuPage, SearchPage, DevicePage },
  props: {
    page: { type: String, default: '' },
    menuSelectedIndex: { type: Number, default: 0 },
    searchSelectedIndex: { type: Number, default: 0 },
    deviceActiveField: { type: Number, default: 0 },
    zoneValue: { type: String, default: '01' },
    loopValue: { type: String, default: '01' },
    addrValue: { type: String, default: '001' },
    deviceBars: { type: Array, default: () => [] }
  },
  emits: ['navigate', 'screen-btn-click'],
  setup(props, { emit }) {
    /* 屏幕按钮点击处理：将事件传递给父组件处理 */
    const handleScreenBtnClick = (index) => {
      emit('screen-btn-click', index)
    }

    return { handleScreenBtnClick }
  },
  template: `
    <div
      class="w-[65%] h-full bg-black rounded-[20px] relative pl-[55px] pt-[80px] pb-[80px] pr-[140px]"
      style="box-shadow: inset 0 3px 8px rgba(255,255,255,0.2), 0 2px 5px rgba(0,0,0,0.4);"
    >
      <div
        class="w-full h-full bg-[#c8e8ff] text-[19px] text-black overflow-hidden relative"
        style="box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);"
      >
        <AlarmPage v-if="page === 'alarm'" />
        <MenuPage v-else-if="page === 'menu'" :selected-index="menuSelectedIndex" />
        <SearchPage v-else-if="page === 'search'" :selected-index="searchSelectedIndex" />
        <DevicePage v-else-if="page === 'device'" :active-field="deviceActiveField" :zone-value="zoneValue" :loop-value="loopValue" :addr-value="addrValue" :bars="deviceBars" />
      </div>
      <ScreenBtn @click="handleScreenBtnClick" />
    </div>
  `
}
