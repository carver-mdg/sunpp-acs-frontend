
const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'positions', component: () => import('pages/Positions.vue'), meta: { title: "Positions" } },
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
      // { path: 'repairs/u22', component: () => import('pages/Repairs/U22Page.vue'), meta: { title: "Repairs У-22" } },
      // { path: 'repairs/u23', component: () => import('pages/Repairs/U23Page.vue'), meta: { title: "Repairs У-23" } },
      // { path: 'repairs/u24/bu', component: () => import('pages/Repairs/U24Page.vue'), meta: { title: "Repairs У-24" } },
      { path: 'repairs/msp', component: () => import('pages/Repairs/MspPage.vue'), meta: { title: "Repairs МСП" } },
      // { path: 'repairs/pbr2', component: () => import('pages/Repairs/Pbr2Page.vue'), meta: { title: "Repairs ПБР-2" } },
      // { path: 'repairs/pbr3', component: () => import('pages/Repairs/Pbr3Page.vue'), meta: { title: "Repairs ПБР-3" } },
      // { path: 'repairs/im_meo', component: () => import('pages/Repairs/ImMeoPage.vue'), meta: { title: "Repairs МЭО" } },
      // { path: 'repairs/im_motor', component: () => import('pages/Repairs/ImMotorPage.vue'), meta: { title: "Repairs Эл. Мотор" } },
      { path: 'measuring_devices', component: () => import('pages/MeasuringDevices.vue'), meta: { title: "Measuring Devices" } },
      { path: 'workers', component: () => import('pages/Workers.vue'), meta: { title: "Workers" } },
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
