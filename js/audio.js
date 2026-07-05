/* 音频工具 - 共享 AudioContext，兼容移动端浏览器自动播放策略 */
/* 移动端（iOS Safari / Android Chrome）比电脑严格得多：
   1. AudioContext 必须在用户手势中创建
   2. resume() 是异步的，调用后不会立即生效
   3. 首次触摸时上下文还在挂起，振荡器虽然调度了但发不出声
   解决：首次触摸只解锁（静音buffer+resume），等上下文运行后再播放 */
let sharedAudioContext = null
let isUnlocked = false

/* 获取共享的 AudioContext */
const getAudioContext = () => {
  if (!sharedAudioContext) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    sharedAudioContext = new AC()
  }
  return sharedAudioContext
}

/* 解锁音频上下文 - 播放静音buffer + resume，必须在用户手势中调用 */
const unlockAudio = () => {
  if (isUnlocked) return
  const audioContext = getAudioContext()
  if (!audioContext) return

  /* 播放静音 buffer 解锁 iOS 音频 */
  const buffer = audioContext.createBuffer(1, 1, 22050)
  const source = audioContext.createBufferSource()
  source.buffer = buffer
  source.connect(audioContext.destination)
  source.start(0)

  /* 恢复挂起的上下文（异步，本次不会立即生效） */
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

  isUnlocked = true
}

/* 尽早解锁：在捕获阶段监听首次触摸/点击，确保在按钮处理器之前解锁 */
const setupEarlyUnlock = () => {
  const unlock = () => {
    unlockAudio()
    document.removeEventListener('touchstart', unlock, true)
    document.removeEventListener('touchend', unlock, true)
    document.removeEventListener('click', unlock, true)
  }
  /* capture: true → 捕获阶段触发，先于按钮的 touchstart 处理器 */
  document.addEventListener('touchstart', unlock, { passive: true, capture: true })
  document.addEventListener('touchend', unlock, { passive: true, capture: true })
  document.addEventListener('click', unlock, { capture: true })
}
setupEarlyUnlock()

/* 播放蜂鸣音：默认1400Hz正弦波，持续0.1秒 */
const playBeep = (frequency = 1400, duration = 0.1) => {
  const audioContext = getAudioContext()
  if (!audioContext) return

  /* 首次播放：只解锁，不播放声音（上下文还没运行，播放也听不到） */
  if (!isUnlocked) {
    unlockAudio()
    return
  }

  /* 如果上下文仍挂起，尝试恢复，本次跳过（下次就能正常播放） */
  if (audioContext.state === 'suspended') {
    audioContext.resume()
    return
  }

  /* 上下文未运行则不播放 */
  if (audioContext.state !== 'running') return

  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  oscillator.frequency.value = frequency
  oscillator.type = 'sine'
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}
