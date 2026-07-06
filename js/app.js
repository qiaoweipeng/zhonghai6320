const preloadImages = () => {
  const icons = {
    menu: ['bcsz', 'fw', 'qjpb', 'sbcz', 'szd', 'tsgj', 'xtgl', 'xxcx'],
    search: ['dxp', 'dyzt', 'lsjl', 'qjxx', 'xtgk', 'zjxx', 'zxp']
  }
  Object.entries(icons).forEach(([folder, names]) => {
    names.forEach(name => {
      const img = new Image()
      img.src = `icon/${folder}/${name}.png`
    })
  })
}
preloadImages()

const app = Vue.createApp({
  components: { HomePage },
  template: `
    <div>
      <HomePage />
    </div>
  `
})

app.use(Pinia.createPinia())

app.mount('#app')

setTimeout(() => {
  lightStore().randomizeLights()
}, 100)