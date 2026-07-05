/* 菜单页面组件 - 覆盖屏幕蓝色区域，分上中下三部分，中间分左右 */
const MenuPage = {
  props: {
    selectedIndex: { type: Number, default: 0 }
  },
  setup(props) {
    /* 8个图片按钮：图片路径 + 文字说明（占位文字） */
    const menuItems = Vue.ref([
      { img: 'icon/menu/xxcx.png', label: '信息查询' },
      { img: 'icon/menu/sbcz.png', label: '设备操作' },
      { img: 'icon/menu/xtgl.png', label: '系统管理' },
      { img: 'icon/menu/qjpb.png', label: '器件屏蔽' },
      { img: 'icon/menu/fw.png', label: '服务' },
      { img: 'icon/menu/bcsz.png', label: '编程设置' },
      { img: 'icon/menu/tsgj.png', label: '调试工具' },
      { img: 'icon/menu/szd.png', label: '手/自动' },






    ])

    /* 右侧按钮列表：第4个改为警情，第5个改为退出 */
    const btns = ['打印', '手/自动', '上一条', '警情', '退出']

    /* 第1个(打印)和第3个(上一条)隐藏但保留占位 */
    const getBtnStyle = (index) => {
      const hidden = (index === 0 || index === 2) ? 'visibility: hidden;' : ''
      return hidden + 'color: #FF69B4;'
    }

    /* 判断当前索引是否选中 */
    const isSelected = (index) => index === props.selectedIndex

    return { menuItems, btns, getBtnStyle, isSelected }
  },
  template: `
    <div class="w-full h-full flex flex-col bg-[#0158e1]">
      <!-- 顶部白色栏：显示"菜单" -->
      <div class="h-[50px] bg-white flex items-center px-[20px] shrink-0">
        <span class="text-[22px] font-bold text-black">菜单</span>
      </div>

      <!-- 中间内容区域：分左右 -->
      <div class="flex-1 flex overflow-hidden">
        <!-- 左侧：8个图片按钮，2排4列 -->
        <div class="flex-1 grid grid-cols-4 grid-rows-2 gap-[10px] p-[10px]">
          <div
            v-for="(item, index) in menuItems"
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
