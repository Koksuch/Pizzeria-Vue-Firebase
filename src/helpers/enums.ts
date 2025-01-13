export const RoutesInfo = {
  home: {
    name: 'Home',
    path: '/',
  },
  menu: {
    name: 'Menu',
    path: '/menu',
  },
  contact: {
    name: 'Contact',
    path: '/contact',
  },
  login: {
    name: 'Login',
    path: '/login',
  },
  register: {
    name: 'Register',
    path: '/register',
  },
  cart: {
    name: 'Cart',
    path: '/cart',
  },
  adminPanel: {
    name: 'AdminPanel',
    path: '/adminpanel',
    addDelProducts: {
      name: 'AddDelProducts',
      path: 'adddelproducts',
    },
    editProducts: {
      name: 'EditProducts',
      path: 'editproducts',
    },
  },
  notFound: {
    name: 'PageNotFound',
    path: '/:pathMatch(.*)*',
  },
} as const

export const CollectionNames = {
  pizzas: 'Pizzas',
  paninos: 'Panino',
  calzones: 'Calzone',
  sauces: 'Sauces',
  ingredients: 'Ingredients',
} as const
