/* 信息查询页面组件 - 与菜单页面布局一致，7个图片按钮 */
const SearchPage = {
  props: {
    selectedIndex: { type: Number, default: 0 }
  },
  setup(props) {
    /* 7个图片按钮：图片路径 + 文字说明 */
    const searchItems = Vue.ref([
      { img: 'icon/search/lsjl.png', label: '历史记录' },
      { img: 'icon/search/qjxx.png', label: '器件信息' },   
      { img: 'icon/search/zjxx.png', label: '组态信息' },
      { img: 'icon/search/xtgk.png', label: '系统概况' },
      { img: 'icon/search/zxp.png', label: '总线盘' },
      { img: 'icon/search/dyzt.png', label: '电源状态' },
      { img: 'icon/search/dxp.png', label: '多线盘' }
      
    ])

    /* 右侧按钮列表 */
    const btns = ['打印', '手/自动', '上一条', '菜单', '退出']

    /* 第1个(打印)和第3个(上一条)隐藏但保留占位 */
    const getBtnStyle = (index) => {
      const hidden = (index === 0 || index === 2) ? 'visibility: hidden;' : ''
      return hidden + 'color: #FF69B4;'
    }

    /* 判断当前索引是否选中 */
    const isSelected = (index) => index === props.selectedIndex

    return { searchItems, btns, getBtnStyle, isSelected }
  },
  template: `
    <div class="w-full h-full flex flex-col bg-[#0158e1]">
      <!-- 顶部白色栏：显示"信息查询" -->
      <div class="h-[50px] bg-white flex items-center px-[20px] shrink-0">
        <span class="text-[22px] font-bold text-black">信息查询</span>
      </div>

      <!-- 中间内容区域：分左右 -->
      <div class="flex-1 flex overflow-hidden">
        <!-- 左侧：7个图片按钮，2排4列 -->
        <div class="flex-1 grid grid-cols-4 grid-rows-2 gap-[10px] p-[10px]">
          <div
            v-for="(item, index) in searchItems"
            :key="index"
            class="flex flex-col items-center justify-center cursor-pointer p-[5px]"
          >
            <img :src="item.img" class="w-[130px] h-[130px] object-contain p-[4px] border-4 rounded-md" :class="isSelected(index) ? 'border-white' : 'border-transparent'" />
            <span class="text-[21px] mt-[6px] text-white">{{ item.label }}</span>
          </div>
        </div>

        <!-- 右侧按钮区域：5个深蓝色矩形，桃红色字体，上下边距窄，中间均分 -->
        <div class="flex flex-col justify-between px-[10px] py-[4px] shrink-0 h-full">
          <div
            v-for="(btn, index) in btns"
            :key="index"
            class="w-[100px] h-[40px] rounded-md bg-blue-900 flex items-center justify-center cursor-default text-[16px] font-bold"
            :style="getBtnStyle(index)"
          >{{ btn }}</div>
        </div>
      </div>

      <!-- 底部占位栏：仅占位不显示内容 -->
      <div class="h-[40px] shrink-0"></div>
    </div>
  `
}
