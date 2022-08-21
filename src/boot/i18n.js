import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

// export default boot(({ app }) => {
//   const i18n = createI18n({
//     legacy: false,
//     locale: 'en-US',
//     globalInjection: true,
//     messages
//   })

//   // Set i18n instance on app
//   app.use(i18n)
// })

// export { i18n }

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  globalInjection: true,
  messages
})

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n)
})

export { i18n }

// Example use from js:
// import { i18n } from "boot/i18n";
// console.log(i18n.global.t('Field_required'))