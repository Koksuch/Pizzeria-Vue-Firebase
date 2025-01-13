<script setup lang="ts">
import AppHeader from './layout/AppHeader.vue'
import AppContent from './layout/AppContent.vue'
import AppFooter from './layout/AppFooter.vue'
import { onMounted, ref } from 'vue'
import { db, getCurrentUser } from './firebase'
import { useCartStore } from './store/cartStore'
import { doc, getDoc } from 'firebase/firestore'

const isLoading = ref(true)

const cartStore = useCartStore()

onMounted(() => {
  getCurrentUser()
    .then(async (user) => {
      console.log('user', user)
      isLoading.value = false

      if (!user) return
      const userCartRef = doc(db, 'UsersCart', user.uid)
      const userDoc = await getDoc(userCartRef)
      cartStore.setCart(userDoc.data()?.cart || [])
    })
    .catch((error) => {
      console.error(error)
    })
})
</script>

<template>
  <div class="flex h-screen items-center justify-center" v-if="isLoading">
    <v-progress-circular :size="100" width="15" color="primary" indeterminate></v-progress-circular>
  </div>
  <div v-else class="">
    <AppHeader />
    <AppContent />
    <AppFooter />
  </div>
</template>
