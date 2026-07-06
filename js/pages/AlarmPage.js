/* 警情页面组件 - 覆盖屏幕蓝色区域，分上中下三部分，中间分左右 */
const AlarmPage = {
  props: {
    selectedIndex: { type: Number, default: 0 }
  },
  setup() {
    /* 表格数据：类型+序号、时间、器件信息 */
    const alarmList = Vue.ref([
      { type: '火警', cur: 1, total: 1, time: '2026年7月6日 17:45', device: '02-01-013 手动报警按钮' },
      { type: '联动', cur: 1, total: 2, time: '2026年7月6日 17:30', device: '02-03-005 输出模块' },
      { type: '器件故障', cur: 1, total: 1, time: '2026年7月6日 16:20', device: '03-01-008 感烟探测器' },
      { type: '其他故障', cur: 1, total: 1, time: '2026年7月6日 15:10', device: '05-02-003 总线隔离器' },
      { type: '屏蔽', cur: 1, total: 1, time: '2026年7月6日 14:05', device: '01-01-001 手动报警按钮' }
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
        <!-- 左侧表格 -->
        <div class="flex-1 overflow-auto">
          <table class="w-full text-[21px] text-left border-collapse">
            <tbody>
              <tr
                v-for="(item, index) in alarmList"
                :key="index"
                class="border-b border-gray-500 h-[70px]"
                :style="index === selectedIndex ? 'background-color: #f8edea;' : ''"
              >
                <td class="w-[140px] px-[10px] align-middle border-r border-gray-300 text-center">
                  <div class="font-bold">{{ item.type }}</div>
                  <div class="text-[17px] text-gray-600">{{ item.cur }}/{{ item.total }}</div>
                </td>
                <td class="px-[10px] align-middle">
                  <div>{{ item.time }}</div>
                  <div>{{ item.device }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 右侧按钮区域 -->
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
