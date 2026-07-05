/* 屏幕组件 - 左侧黑色边框内的蓝色显示区域，包含屏幕按钮 */
/* 通过 page prop 控制显示内容：'alarm' 显示警情页面，'menu' 显示菜单页面 */
const Screen = {
  components: { ScreenBtn, AlarmPage, MenuPage, SearchPage },
  props: {
    page: { type: String, default: '' },
    menuSelectedIndex: { type: Number, default: 0 },
    searchSelectedIndex: { type: Number, default: 0 }
  },
  emits: ['navigate'],
  setup(props, { emit }) {
    /* 屏幕按钮点击处理：第5个按钮(索引4)切换警情/菜单页面 */
    const handleScreenBtnClick = (index) => {
      if (index === 4) {
        emit('navigate', props.page === 'alarm' ? 'menu' : 'alarm')
      }
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
      </div>
      <ScreenBtn @click="handleScreenBtnClick" />
    </div>
  `
}
