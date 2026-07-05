/* 小按钮组件 - 圆柱体效果，带按下反馈和1200Hz音效 */
const SmallBtn = {
  props: ['label'],
  emits: ['click'],
  setup(props, { emit }) {
    const isPressed = Vue.ref(false)

    /* 播放1200Hz蜂鸣音 */
    const playBeep = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = 1200
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }

    const handleMouseDown = () => { isPressed.value = true; playBeep() }
    const handleMouseUp = () => { isPressed.value = false; emit('click', props.label) }
    const handleMouseLeave = () => { isPressed.value = false }

    /* 箭头标签显示蓝色，其他显示灰色 */
    const getLabelClass = () => {
      return ['◀','▲','▶','▼'].includes(props.label) ? 'text-blue-600' : 'text-gray-700'
    }

    /* 按下时位移2px、颜色变暗、阴影反转 */
    const getButtonStyle = () => {
      const pressed = isPressed.value
      return {
        transform: pressed ? 'translateY(2px)' : 'none',
        background: pressed
          ? 'linear-gradient(to bottom, #707070, #505050)'
          : 'linear-gradient(to bottom, #8a8a8a, #6a6a6a)',
        boxShadow: pressed
          ? 'inset 0 3px 5px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.3)'
          : 'inset 0 3px 5px rgba(255,255,255,0.9), inset 0 -2px 3px rgba(0,0,0,0.3), 0 3px 6px rgba(0,0,0,0.4)'
      }
    }

    return { isPressed, handleMouseDown, handleMouseUp, handleMouseLeave, getLabelClass, getButtonStyle }
  },
  template: `
    <div class="flex flex-col items-center">
      <div class="text-[16px] font-bold mb-[4px]" :class="getLabelClass()">{{ label }}</div>
      <div
        class="w-[40px] h-[40px] rounded-full border-2 border-gray-500 flex items-center justify-center cursor-pointer transition-all duration-75"
        :style="getButtonStyle()"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
        @touchstart.prevent="handleMouseDown"
        @touchend="handleMouseUp"
      ></div>
    </div>
  `
}
