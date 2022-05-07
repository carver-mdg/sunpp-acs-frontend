
const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'positions', component: () => import('pages/Positions.vue'), meta: { title: "Positions" } },
      // { path: 'equipments/u22/but', component: () => import('pages/Equipments/U22ButPage.vue'), meta: { title: "У-22 (БУТ)" } },
      // { path: 'equipments/u22/bt', component: () => import('pages/Equipments/U22BtPage.vue'), meta: { title: "У-22 (БТ)" } },
      // { path: 'equipments/u23', component: () => import('pages/Equipments/U23Page.vue'), meta: { title: "У-23" } },
      // { path: 'equipments/u24/bu', component: () => import('pages/Equipments/U24BuPage.vue'), meta: { title: "У-24 (БУ)" } },
      // { path: 'equipments/u24/bp', component: () => import('pages/Equipments/U24BpPage.vue'), meta: { title: "У-24 (БП)" } },
      { path: 'equipments/msp', component: () => import('pages/Equipments/MspPage.vue'), meta: { title: "МСП" } },
      // { path: 'equipments/pbr2', component: () => import('pages/Equipments/Pbr2Page.vue'), meta: { title: "ПБР-2" } },
      // { path: 'equipments/pbr3', component: () => import('pages/Equipments/Pbr3Page.vue'), meta: { title: "ПБР-3" } },
      // { path: 'equipments/im_meo', component: () => import('pages/Equipments/ImMeoPage.vue'), meta: { title: "МЭО" } },
      // { path: 'equipments/im_motor', component: () => import('pages/Equipments/ImMotorPage.vue'), meta: { title: "Эл. Мотор" } },
      { path: 'measuring_devices', component: () => import('pages/MeasuringDevices.vue'), meta: { title: "Measuring Devices" } },
      { path: 'workers', component: () => import('pages/Workers.vue'), meta: { title: "Workers" } },
      { path: 'repairs', component: () => import('pages/Repairs.vue'), meta: { title: "Repairs" } },
      { path: 'reports', component: () => import('pages/Reports.vue'), meta: { title: "Reports" } },
      { path: 'handbook', component: () => import('pages/Handbook.vue'), meta: { title: "Handbook" } },
    ]
  },
  // {
  //   path: '/equipments',
  //   component: () => import('src/layouts/MainLayout.vue'),
  //   meta: { title: "Equipments" },
  //   children: [
  //     { path: '', component: () => import('pages/EquipmentList.vue') },
  //     { path: 'positions', component: () => import('pages/Positions.vue'), meta: { title: "Positions" } }
  //   ]
  // },

  // {
  //   path: 'positions',
  //   component: () => import('layouts/Positions.vue'),
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
