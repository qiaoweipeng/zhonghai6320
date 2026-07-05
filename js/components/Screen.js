/* 屏幕组件 - 左侧黑色边框内的蓝色显示区域，包含屏幕按钮 */
/* 通过 page prop 控制显示内容：'alarm' 显示警情页面，其他为空白 */
const Screen = {
  components: { ScreenBtn, AlarmPage },
  props: {
    page: { type: String, default: '' }
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
      </div>
      <ScreenBtn />
    </div>
  `
}
