/* 音频工具 - 共享 AudioContext，兼容移动端浏览器自动播放策略 */
/* 移动端（尤其 iOS Safari）比电脑更严格：
   1. AudioContext 必须在用户手势中创建/恢复
   2. resume() 是异步的，需要播放静音 buffer 才能真正解锁
   3. 首次触摸页面时就应解锁，不用等到按下按钮 */
let sharedAudioContext = null
let isUnlocked = false

/* 获取共享的 AudioContext（多次点击复用同一个，避免浏览器限制实例数量） */
const getAudioContext = () => {
  if (!sharedAudioContext) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    sharedAudioContext = new AC()
  }
  return sharedAudioContext
}

/* 解锁音频上下文 - 移动端必须在用户手势中播放声音来解锁 */
const unlockAudio = () => {
  if (isUnlocked) return
  const audioContext = getAudioContext()
  if (!audioContext) return

  /* 播放一个静音 buffer 来解锁 iOS 音频（光 resume 不够） */
  const buffer = audioContext.createBuffer(1, 1, 22050)
  const source = audioContext.createBufferSource()
  source.buffer = buffer
  source.connect(audioContext.destination)
  source.start(0)

  /* 同时恢复挂起的上下文 */
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

  isUnlocked = true
}

/* 尽早解锁：监听页面首次触摸/点击，在用户首次交互时就解锁音频 */
const setupEarlyUnlock = () => {
  const unlock = () => {
    unlockAudio()
    document.removeEventListener('touchstart', unlock)
    document.removeEventListener('touchend', unlock)
    document.removeEventListener('click', unlock)
  }
  document.addEventListener('touchstart', unlock, { once: false, passive: true })
  document.addEventListener('touchend', unlock, { once: false, passive: true })
  document.addEventListener('click', unlock, { once: false })
}
setupEarlyUnlock()

/* 播放蜂鸣音：默认1400Hz正弦波，持续0.1秒 */
const playBeep = (frequency = 1400, duration = 0.1) => {
  const audioContext = getAudioContext()
  if (!audioContext) return

  /* 首次播放时解锁（必须在用户手势中调用） */
  if (!isUnlocked) {
    unlockAudio()
  }

  /* 恢复挂起的上下文 */
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

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
