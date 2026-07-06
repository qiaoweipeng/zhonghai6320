/* 指示灯组件 - 显示火警、故障等状态指示灯 */
const LightItem = {
  props: ['name', 'color'],
  computed: {
    lightStyle() {
      const colors = {
        red: '#dc2626',
        yellow: '#facc15',
        green: '#22c55e',
        gray: '#9ca3af'
      }
      const shadows = {
        red: 'inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.4), 0 1px 3px rgba(255,0,0,0.5)',
        yellow: 'inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.4), 0 1px 3px rgba(255,204,0,0.5)',
        green: 'inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.4), 0 1px 3px rgba(0,255,0,0.5)',
        gray: 'inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -1px 1px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)'
      }
      return {
        backgroundColor: colors[this.color] || colors.gray,
        boxShadow: shadows[this.color] || shadows.gray
      }
    }
  },
  template: `
    <div class="flex flex-col items-center justify-center" :style="{ visibility: name ? 'visible' : 'hidden' }">
      <div class="text-[16px] text-center">{{ name }}</div>
      <div
        class="w-[40px] h-[20px] border border-black mb-1"
        :style="lightStyle"
      ></div>
    </div>
  `
}
