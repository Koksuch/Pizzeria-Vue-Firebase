<script setup lang="ts">
import { auth } from '@/firebase'
import { RoutesInfo } from '@/helpers/enums'
import router from '@/router'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const storage = getStorage()
const isLoggedIn = ref(false)
const logoUrl = ref('')

onAuthStateChanged(auth, (user) => {
  isLoggedIn.value = !!user
})

const logout = async () => {
  await signOut(auth)
  router.push(RoutesInfo.home.path)
}

const getUrl = async () => {
  const logoRef = storageRef(storage, 'public/pizzaSlice.png')
  const url = await getDownloadURL(logoRef)
  logoUrl.value = url
}

onMounted(() => {
  getUrl()
})
</script>

<template>
  <nav class="flex w-full flex-wrap items-center justify-around text-3xl text-gray-900">
    <RouterLink
      active-class="text-blue-500"
      class="flex items-center rounded transition-colors hover:text-blue-700 focus-visible:text-blue-700"
      :to="RoutesInfo.home.path"
    >
      <img class="w-14" :src="logoUrl" alt="" />
      <span class="p-2">MammaPizza</span>
    </RouterLink>
    <div class="flex flex-wrap justify-center gap-3">
      <RouterLink
        active-class="text-blue-500"
        class="rounded p-2 transition-colors hover:text-blue-700 focus-visible:text-blue-700"
        :to="RoutesInfo.menu.path"
        >Menu</RouterLink
      >
      <!-- <RouterLink
        active-class="text-blue-500"
        class="rounded p-2 transition-colors hover:text-blue-700 focus-visible:text-blue-700"
        :to="RoutesInfo.contact.path"
        >Kontakt</RouterLink
      > -->
      <RouterLink
        v-if="!isLoggedIn"
        active-class="text-blue-500"
        class="rounded p-2 transition-colors hover:text-blue-700 focus-visible:text-blue-700"
        :to="RoutesInfo.login.path"
        >Zaloguj</RouterLink
      >
      <RouterLink
        v-if="!isLoggedIn"
        active-class="text-blue-500"
        class="rounded p-2 transition-colors hover:text-blue-700 focus-visible:text-blue-700"
        :to="RoutesInfo.register.path"
        >Rejestracja</RouterLink
      >
      <RouterLink
        v-if="isLoggedIn"
        active-class="text-blue-500"
        class="rounded p-2 transition-colors hover:text-blue-700 focus-visible:text-blue-700"
        :to="RoutesInfo.cart.path"
        >Koszyk</RouterLink
      >
      <button
        v-if="isLoggedIn"
        @click="logout"
        class="rounded bg-blue-500 p-3 text-white transition-colors hover:bg-blue-400 focus-visible:bg-blue-400"
      >
        Wyloguj
      </button>
    </div>
  </nav>
</template>
