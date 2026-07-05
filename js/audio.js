/* 音频工具 - 共享 AudioContext，兼容浏览器自动播放策略 */
/* 浏览器要求用户交互后才能播放音频，本地直接 new AudioContext() 在云端/新设备会处于 suspended 状态无声 */
let sharedAudioContext = null

/* 获取共享的 AudioContext（多次点击复用同一个，避免浏览器限制实例数量） */
const getAudioContext = () => {
  if (!sharedAudioContext) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    sharedAudioContext = new AC()
  }
  /* 关键：如果是挂起状态（首次或浏览器策略导致），在用户交互中恢复 */
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume()
  }
  return sharedAudioContext
}

/* 播放蜂鸣音：默认1400Hz正弦波，持续0.1秒 */
const playBeep = (frequency = 1400, duration = 0.1) => {
  const audioContext = getAudioContext()
  if (!audioContext) return
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
