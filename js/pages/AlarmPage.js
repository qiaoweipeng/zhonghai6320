/* 警情页面组件 - 覆盖屏幕蓝色区域，分上中下三部分，中间分左右 */
const AlarmPage = {
  setup() {
    /* 表格数据：类型 + 时间 */
    const alarmList = Vue.ref([
      { type: '火警', time: '14:23:05' },
      { type: '联动', time: '14:22:58' },
      { type: '器件故障', time: '14:20:12' },
      { type: '其他故障', time: '14:15:30' },
      { type: '屏蔽', time: '14:10:00' }
    ])

    /* 右侧按钮列表 */
    const btns = ['打印', '手/自动', '上一条', '下一条', '菜单']

    return { alarmList, btns }
  },
  template: `
    <div class="w-full h-full flex flex-col">
      <!-- 顶部蓝色栏 -->
      <div class="h-[50px] bg-blue-700 flex items-center px-[10px] shrink-0"></div>

      <!-- 中间内容区域：分左右 -->
      <div class="flex-1 flex overflow-hidden">
        <!-- 左侧表格：无表头，两列（类型+时间） -->
        <div class="flex-1 overflow-auto">
          <table class="w-full text-[18px] text-left border-collapse">
            <tbody>
              <tr v-for="(item, index) in alarmList" :key="index" class="border-b border-gray-300 h-[58px]">
                <td class="w-[140px] px-[10px]">{{ item.type }}</td>
                <td class="px-[10px]">{{ item.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 右侧按钮区域：5个深蓝色矩形，桃红色字体，上下边距窄，中间均分 -->
        <div class="flex flex-col justify-between px-[10px] py-[4px] shrink-0 h-full">
          <div
            v-for="(btn, index) in btns"
            :key="index"
            class="w-[100px] h-[40px] rounded-md bg-blue-900 flex items-center justify-center cursor-default text-[16px] font-bold"
            style="color: #FF69B4;"
          >{{ btn }}</div>
        </div>
      </div>

      <!-- 底部蓝色栏 -->
      <div class="h-[40px] bg-blue-700 shrink-0"></div>
    </div>
  `
}
