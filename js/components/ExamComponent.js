/* 考题组件 - 顶部居中按钮，点击后弹出非模态考试面板 */
const ExamComponent = {
  props: {
    /* 传入各分区的设备总数，用于计算正确答案 */
    zoneData: { type: Object, default: () => ({}) }
  },
  emits: ['return-alarm'],
  setup(props, { emit }) {
    const isExamStart = Vue.ref(false)
    const showPanel = Vue.ref(false)
    const userInput = Vue.ref('')
    const examZone = Vue.ref('03')
    const remainingTime = Vue.ref(120000)
    const examResult = Vue.ref('')
    const examFinished = Vue.ref(false)
    const usedTime = Vue.ref(0)
    let timer = null

    /* 开始考试 */
    const startExam = () => {
      /* 回到警情页面 */
      emit('return-alarm')
      /* 随机选择03或05 */
      examZone.value = Math.random() > 0.5 ? '03' : '05'
      isExamStart.value = true
      showPanel.value = true
      userInput.value = ''
      examResult.value = ''
      examFinished.value = false
      remainingTime.value = 120000
      /* 开始倒计时（每10毫秒更新一次） */
      if (timer) clearInterval(timer)
      timer = setInterval(() => {
        remainingTime.value -= 10
        if (remainingTime.value <= 0) {
          clearInterval(timer)
          timer = null
          remainingTime.value = 0
          examFinished.value = true
          examResult.value = 'timeout'
        }
      }, 10)
    }

    /* 计算正确答案：01分区总数 + 随机分区总数 */
    const correctAnswer = Vue.computed(() => {
      const zone01 = props.zoneData['01'] || { total: 0, details: [] }
      const zoneX = props.zoneData[examZone.value] || { total: 0, details: [] }
      return zone01.total + zoneX.total
    })

    /* 计算过程明细 */
    const answerDetail = Vue.computed(() => {
      const zone01 = props.zoneData['01'] || { total: 0, details: [] }
      const zoneX = props.zoneData[examZone.value] || { total: 0, details: [] }
      const z1Detail = zone01.details.join(' + ')
      const zXDetail = zoneX.details.join(' + ')
      return `01分区：${z1Detail} = ${zone01.total}，${examZone.value}分区：${zXDetail} = ${zoneX.total}，总计：${zone01.total} + ${zoneX.total} = ${correctAnswer.value}`
    })

    /* 提交答案 */
    const submitAnswer = () => {
      if (examFinished.value) return
      if (timer) {
        clearInterval(timer)
        timer = null
      }
      usedTime.value = 120000 - remainingTime.value
      examFinished.value = true
      const userNum = parseInt(userInput.value)
      if (userNum === correctAnswer.value) {
        examResult.value = 'correct'
      } else {
        examResult.value = 'wrong'
      }
    }

    /* 关闭面板 */
    const closePanel = () => {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
      showPanel.value = false
      isExamStart.value = false
      examFinished.value = false
      examResult.value = ''
      userInput.value = ''
    }

    /* 格式化用时 */
    const formatTime = (ms) => {
      const totalSec = Math.floor(ms / 1000)
      const m = Math.floor(totalSec / 60)
      const s = totalSec % 60
      if (m === 0) return `${s}秒`
      return `${m}分${s}秒`
    }

    /* 格式化倒计时 分:秒.毫秒 */
    const formatCountdown = (ms) => {
      const totalSec = Math.floor(ms / 1000)
      const m = Math.floor(totalSec / 60).toString().padStart(2, '0')
      const s = (totalSec % 60).toString().padStart(2, '0')
      const milli = Math.floor((ms % 1000) / 10).toString().padStart(2, '0')
      return `${m}:${s}.${milli}`
    }

    return {
      isExamStart, showPanel, userInput, examZone, remainingTime,
      examResult, examFinished, usedTime, correctAnswer, answerDetail,
      startExam, submitAnswer, closePanel, formatTime, formatCountdown
    }
  },
  template: `
    <div class="fixed top-[10px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-[10px]">
      <!-- 考试按钮 / 倒计时 -->
      <div v-if="!isExamStart">
        <button
          @click="startExam"
          class="px-[40px] py-[16px] bg-blue-600 text-white rounded-lg font-bold text-[22px] cursor-pointer hover:bg-blue-700 shadow-lg"
        >查询分区总数</button>
      </div>
      <div v-else>
        <!-- 倒计时显示：纯红色大字 -->
        <div class="text-[36px] font-bold text-red-600 tabular-nums tracking-wider drop-shadow-lg">
          {{ formatCountdown(remainingTime) }}
        </div>
      </div>

      <!-- 考试面板（非模态，不遮挡页面操作） -->
      <div
        v-if="showPanel"
        class="bg-white rounded-xl p-[25px] w-[420px] shadow-2xl border-2 border-gray-200"
      >
        <!-- 考试中 -->
        <template v-if="!examFinished">
          <div class="text-[20px] font-bold text-black mb-[15px] text-center">考试题目</div>
          <div class="text-[18px] text-gray-700 mb-[15px] text-center leading-[1.8]">
            查询01分区和{{ examZone }}分区的设备总数
          </div>
          <div class="flex items-center gap-[10px] mb-[15px]">
            <span class="text-[16px] text-black">请输入答案：</span>
            <input
              v-model="userInput"
              type="number"
              class="flex-1 border-2 border-gray-300 rounded-lg px-[10px] py-[8px] text-[18px] focus:outline-none focus:border-blue-500"
              placeholder="请输入数字"
            />
          </div>
          <div class="flex gap-[10px] justify-end">
            <button
              @click="submitAnswer"
              :disabled="userInput === ''"
              class="px-[20px] py-[8px] bg-blue-600 text-white rounded-lg font-bold text-[16px] cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >提交</button>
            <button
              @click="closePanel"
              class="px-[20px] py-[8px] bg-gray-400 text-white rounded-lg font-bold text-[16px] cursor-pointer hover:bg-gray-500"
            >取消</button>
          </div>
        </template>

        <!-- 答对了 -->
        <template v-else-if="examResult === 'correct'">
          <div class="text-center">
            <div class="text-[28px] font-bold text-green-600 mb-[15px]">恭喜你答对了！</div>
            <div class="text-[18px] text-gray-700 mb-[10px]">用时：{{ formatTime(usedTime) }}</div>
            <div class="text-[16px] text-gray-500 mb-[8px]">正确答案：{{ correctAnswer }}</div>
            <div class="text-[14px] text-gray-400 mb-[20px] leading-[1.8]">{{ answerDetail }}</div>
            <button
              @click="closePanel"
              class="px-[30px] py-[8px] bg-green-600 text-white rounded-lg font-bold text-[16px] cursor-pointer hover:bg-green-700"
            >确定</button>
          </div>
        </template>

        <!-- 答错了 -->
        <template v-else-if="examResult === 'wrong'">
          <div class="text-center">
            <div class="text-[28px] font-bold text-red-600 mb-[15px]">回答错误，考试结束</div>
            <div class="text-[18px] text-gray-700 mb-[10px]">正确答案：{{ correctAnswer }}</div>
            <div class="text-[16px] text-gray-500 mb-[8px]">你的答案：{{ userInput }}</div>
            <div class="text-[14px] text-gray-400 mb-[20px] leading-[1.8]">{{ answerDetail }}</div>
            <button
              @click="closePanel"
              class="px-[30px] py-[8px] bg-red-600 text-white rounded-lg font-bold text-[16px] cursor-pointer hover:bg-red-700"
            >确定</button>
          </div>
        </template>

        <!-- 超时 -->
        <template v-else-if="examResult === 'timeout'">
          <div class="text-center">
            <div class="text-[28px] font-bold text-red-600 mb-[15px]">你已超时，考试结束</div>
            <div class="text-[18px] text-gray-700 mb-[10px]">正确答案：{{ correctAnswer }}</div>
            <div class="text-[14px] text-gray-400 mb-[20px] leading-[1.8]">{{ answerDetail }}</div>
            <button
              @click="closePanel"
              class="px-[30px] py-[8px] bg-red-600 text-white rounded-lg font-bold text-[16px] cursor-pointer hover:bg-red-700"
            >确定</button>
          </div>
        </template>
      </div>
    </div>
  `
}
