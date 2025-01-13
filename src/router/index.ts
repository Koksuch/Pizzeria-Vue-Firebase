import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { RoutesInfo as Routes } from '@/helpers/enums'
import MenuView from '@/views/MenuView.vue'
import ContactView from '@/views/ContactView.vue'
import { getCurrentUser, isAdmin } from '@/firebase'
import PageNotFound from '@/views/PageNotFound.vue'
import AdminPanel from '@/layout/AdminPanel.vue'
import EditProductsView from '@/views/EditProductsView.vue'
import AddDelProductsView from '@/views/AddDelProductsView.vue'
import RegisterView from '@/views/RegisterView.vue'
import CartView from '@/views/CartView.vue'

const routes = [
  {
    path: Routes.home.path,
    name: Routes.home.name,
    component: HomeView,
  },
  {
    path: Routes.menu.path,
    name: Routes.menu.name,
    component: MenuView,
  },
  // {
  //   path: Routes.contact.path,
  //   name: Routes.contact.name,
  //   component: ContactView,
  // },
  {
    path: Routes.login.path,
    name: Routes.login.name,
    component: LoginView,
  },
  {
    path: Routes.register.path,
    name: Routes.register.name,
    component: RegisterView,
  },
  {
    path: Routes.cart.path,
    name: Routes.cart.name,
    component: CartView,
  },
  {
    path: Routes.adminPanel.path,
    name: Routes.adminPanel.name,
    component: AdminPanel,
    meta: { isProtected: true },
    redirect: { name: Routes.adminPanel.addDelProducts.name },
    children: [
      {
        path: Routes.adminPanel.addDelProducts.path,
        name: Routes.adminPanel.addDelProducts.name,
        component: AddDelProductsView,
      },
      {
        path: Routes.adminPanel.editProducts.path,
        name: Routes.adminPanel.editProducts.name,
        component: EditProductsView,
      },
    ],
  },
  {
    path: Routes.notFound.path,
    name: Routes.notFound.name,
    component: PageNotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from) => {
  const requiredAuth = to.matched.some((record) => record.meta.isProtected)

  if (requiredAuth && !(await isAdmin())) {
    return {
      name: Routes.login.name,
    }
  }
  if (to.name === Routes.login.name && (await getCurrentUser())) {
    return {
      name: Routes.home.name,
    }
  }
  if (to.name === Routes.register.name && (await getCurrentUser())) {
    return {
      name: Routes.home.name,
    }
  }
  if (to.name === Routes.cart.name && !(await getCurrentUser())) {
    return {
      name: Routes.login.name,
    }
  }

  if (to.name === Routes.home.name) {
    return {
      name: Routes.menu.name,
    }
  }
})

export default router
