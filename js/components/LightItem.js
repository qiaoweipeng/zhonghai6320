/* 指示灯组件 - 显示火警、故障等状态指示灯 */
const LightItem = {
  props: ['name', 'color'],
  template: `
    <div class="flex flex-col items-center justify-center" :style="{ visibility: name ? 'visible' : 'hidden' }">
      <div class="text-[16px] text-center">{{ name }}</div>
      <div
        class="w-[40px] h-[20px] border border-black mb-1"
        :class="{
          'bg-red-600': color === 'red',
          'bg-yellow-400': color === 'yellow',
          'bg-green-500': color === 'green',
          'bg-gray-400': color === 'gray'
        }"
        :style="{
          boxShadow: color === 'red'
            ? 'inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.4), 0 1px 3px rgba(255,0,0,0.5)'
            : color === 'yellow'
            ? 'inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.4), 0 1px 3px rgba(255,204,0,0.5)'
            : color === 'green'
            ? 'inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.4), 0 1px 3px rgba(0,255,0,0.5)'
            : 'inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -1px 1px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)'
        }"
      ></div>
    </div>
  `
}
