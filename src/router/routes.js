
const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'positions', component: () => import('src/pages/PositionsPage.vue'), meta: { title: "Positions" } },
      // equipments
      // { path: 'equipments/u22/but', component: () => import('pages/Equipments/U22ButPage.vue'), meta: { title: "Equipments У-22 (БУТ)" } },
      // { path: 'equipments/u22/bt', component: () => import('pages/Equipments/U22BtPage.vue'), meta: { title: "Equipments У-22 (БТ)" } },
      // { path: 'equipments/u23', component: () => import('pages/Equipments/U23Page.vue'), meta: { title: "Equipments У-23" } },
      // { path: 'equipments/u24/bu', component: () => import('pages/Equipments/U24BuPage.vue'), meta: { title: "Equipments У-24 (БУ)" } },
      // { path: 'equipments/u24/bp', component: () => import('pages/Equipments/U24BpPage.vue'), meta: { title: "Equipments У-24 (БП)" } },
      { path: 'equipments/msp', component: () => import('pages/Equipments/MspPage.vue'), meta: { title: "Equipments МСП" } },
      // { path: 'equipments/pbr2', component: () => import('pages/Equipments/Pbr2Page.vue'), meta: { title: "Equipments ПБР-2" } },
      // { path: 'equipments/pbr3', component: () => import('pages/Equipments/Pbr3Page.vue'), meta: { title: "Equipments ПБР-3" } },
      // { path: 'equipments/im_meo', component: () => import('pages/Equipments/ImMeoPage.vue'), meta: { title: "Equipments МЭО" } },
      // { path: 'equipments/im_motor', component: () => import('pages/Equipments/ImMotorPage.vue'), meta: { title: "Equipments Эл. Мотор" } },
      // repairs
      { path: 'measuring_devices', component: () => import('src/pages/MeasuringDevicesPage.vue'), meta: { title: "Measuring Devices" } },
      { path: 'workers', component: () => import('src/pages/WorkersPage.vue'), meta: { title: "Workers" } },
      { path: 'reports', component: () => import('src/pages/ReportsPage.vue'), meta: { title: "Reports" } },
      { path: 'handbook', component: () => import('src/pages/HandbookPage.vue'), meta: { title: "Handbook" } },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFoundPage.vue')
  }
]

export default routes
