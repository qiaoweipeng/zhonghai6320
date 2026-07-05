/* 屏幕按钮组件 - 屏幕右侧5个垂直排列的蓝色圆角按钮 */
const ScreenBtn = {
  emits: ['click'],
  setup(props, { emit }) {
    const pressedStates = Vue.ref([false, false, false, false, false])

    const handleMouseDown = (index) => { pressedStates.value[index] = true; playBeep() }
    const handleMouseUp = (index) => { pressedStates.value[index] = false; emit('click', index) }
    const handleMouseLeave = (index) => { pressedStates.value[index] = false }

    const getButtonStyle = (index) => {
      const isPressed = pressedStates.value[index]
      return {
        transform: isPressed ? 'translateY(2px)' : 'none',
        background: isPressed
          ? 'linear-gradient(to bottom, #707070, #505050)'
          : 'linear-gradient(to bottom, #8a8a8a, #6a6a6a)',
        boxShadow: isPressed
          ? 'inset 0 3px 5px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.3)'
          : 'inset 0 3px 5px rgba(255,255,255,0.9), inset 0 -2px 3px rgba(0,0,0,0.3), 0 3px 6px rgba(0,0,0,0.4)'
      }
    }

    return { pressedStates, handleMouseDown, handleMouseUp, handleMouseLeave, getButtonStyle }
  },
  template: `
    <div class="absolute right-[26px] top-1/2 -translate-y-1/2 flex flex-col gap-[48px] z-10">
      <div
        v-for="(isPressed, index) in pressedStates"
        :key="index"
        class="w-[90px] h-[47px] rounded-[30px] bg-blue-400 border-2 border-white flex items-center justify-center cursor-pointer"
        style="box-shadow: 0 2px 6px rgba(0,0,0,0.3);"
      >
        <div
          class="w-[44px] h-[44px] rounded-full border-2 border-gray-500 flex items-center justify-center cursor-pointer transition-all duration-75"
          :style="getButtonStyle(index)"
          @mousedown="handleMouseDown(index)"
          @mouseup="handleMouseUp(index)"
          @mouseleave="handleMouseLeave(index)"
          @touchstart.prevent="handleMouseDown(index)"
          @touchend="handleMouseUp(index)"
        ></div>
      </div>
    </div>
  `
}
