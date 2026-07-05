/* 器件信息页面组件 - 左侧显示分区/回路/地址和16个竖条矩形 */
const DevicePage = {
  props: {
    activeField: { type: Number, default: 0 },
    zoneValue: { type: String, default: '01' },
    loopValue: { type: String, default: '01' },
    addrValue: { type: String, default: '001' },
    bars: { type: Array, default: () => [] }
  },
  setup(props) {
    /* 右侧按钮列表：前两个隐藏保留占位，3-5为上一分区/下一分区/退出 */
    const btns = ['', '', '上一分区', '下一分区', '退出']

    /* 第1、2个隐藏但保留占位 */
    const getBtnStyle = (index) => {
      const hidden = (index === 0 || index === 1) ? 'visibility: hidden;' : ''
      return hidden + 'color: #FF69B4;'
    }

    /* 判断字段是否激活（可编辑） */
    const isActive = (index) => index === props.activeField

    /* 计算柱状图填充高度百分比（数值/100） */
    const getFillPercent = (value) => {
      const num = parseInt(value)
      return num > 0 ? num : 0
    }

    return { btns, getBtnStyle, isActive, getFillPercent }
  },
  template: `
    <div class="w-full h-full flex flex-col">
      <!-- 顶部蓝色栏：与警情页面一致 -->
      <div class="h-[50px] bg-blue-700 flex items-center px-[10px] shrink-0"></div>

      <!-- 中间内容区域：分左右 -->
      <div class="flex-1 flex overflow-hidden">
        <!-- 左侧：上方三个竖向排列的文本框 + 下方16个竖条矩形 -->
        <div class="flex-1 flex flex-col p-[30px] overflow-hidden">
          <!-- 三个标签+文本框：竖向排列，在上方 -->
          <div class="flex flex-col gap-[10px] mb-[15px] shrink-0">
            <!-- 分区：默认可编辑，后面有提示文字 -->
            <div class="flex items-center gap-[6px]">
              <span class="text-[20px] text-black w-[110px]">分区：</span>
              <input
                type="text"
                readonly
                :value="zoneValue"
                class="w-[60px] h-[28px] border-2 px-[4px] text-[16px]"
                :class="isActive(0) ? 'border-blue-600 bg-white' : 'border-gray-400 bg-gray-200 text-gray-500'"
              />
              <span class="text-[19px] text-gray-600 ml-[10px]">开启分区：01&nbsp;03&nbsp;05</span>
            </div>
            <!-- 回路：置灰状态 -->
            <div class="flex items-center gap-[6px]">
              <span class="text-[20px] text-black w-[110px]">回路：</span>
              <input
                type="text"
                readonly
                :value="loopValue"
                class="w-[60px] h-[28px] border-2 px-[4px] text-[16px]"
                :class="isActive(1) ? 'border-blue-600 bg-white' : 'border-gray-400 bg-gray-200 text-gray-500'"
              />
            </div>
            <!-- 地址编号：置灰状态 -->
            <div class="flex items-center gap-[6px]">
              <span class="text-[20px] text-black w-[110px]">地址编号：</span>
              <input
                type="text"
                readonly
                :value="addrValue"
                class="w-[60px] h-[28px] border-2 px-[4px] text-[16px]"
                :class="isActive(2) ? 'border-blue-600 bg-white' : 'border-gray-400 bg-gray-200 text-gray-500'"
              />
            </div>
          </div>

          <!-- 16个竖条矩形：在下方，有数值的显示柱状图 -->
          <div class="flex gap-[16px] flex-1 items-start pt-[30px] overflow-x-auto">
            <div v-for="(bar, index) in bars" :key="index" class="flex flex-col items-center">
              <div class="text-[12px] text-gray-600 mb-[2px]">{{ bar.value }}</div>
              <div class="w-[30px] h-[150px] border-2 border-black relative overflow-hidden">
                <!-- 有数值时：灰色背景 + 浅绿色柱状图 -->
                <template v-if="getFillPercent(bar.value) > 0">
                  <div class="absolute inset-0 bg-gray-400"></div>
                  <div
                    class="absolute bottom-0 left-0 right-0 bg-[#2ffa2f]"
                    :style="{ height: getFillPercent(bar.value) + '%' }"
                  ></div>
                </template>
              </div>
              <div class="text-[16px] text-black mt-[2px]">{{ bar.label }}</div>
            </div>
          </div>
        </div>

        <!-- 右侧按钮区域：与警情页面样式一致 -->
        <div class="flex flex-col justify-between px-[10px] py-[4px] shrink-0 h-full">
          <div
            v-for="(btn, index) in btns"
            :key="index"
            class="w-[100px] h-[40px] rounded-md bg-blue-900 flex items-center justify-center cursor-default text-[16px] font-bold"
            :style="getBtnStyle(index)"
          >{{ btn }}</div>
        </div>
      </div>

      <!-- 底部蓝色栏：与警情页面一致 -->
      <div class="h-[40px] bg-blue-700 shrink-0"></div>
    </div>
  `
}
