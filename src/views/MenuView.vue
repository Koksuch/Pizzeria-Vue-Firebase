<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { calzonesRef, paninosRef, pizzasRef, saucesRef } from '@/firebase'
import { getDocs, orderBy, query } from 'firebase/firestore'
import MenuSection from '@/components/MenuSection.vue'
import type { MenuItemType } from '@/helpers/types'

const pizzas = ref<MenuItemType[]>([])
const paninos = ref<MenuItemType[]>([])
const calzones = ref<MenuItemType[]>([])
const sauces = ref<MenuItemType[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const pizzaOrderByPriceQuery = query(pizzasRef, orderBy('price'))
    const paninosOrderByPriceQuery = query(paninosRef, orderBy('price'))
    const calzonesOrderByPriceQuery = query(calzonesRef, orderBy('price'))
    const saucesOrderByPriceQuery = query(saucesRef, orderBy('price'))

    const pizzasSnapshot = await getDocs(pizzaOrderByPriceQuery)
    const paninosSnapshot = await getDocs(paninosOrderByPriceQuery)
    const calzonesSnapshot = await getDocs(calzonesOrderByPriceQuery)
    const saucesSnapshot = await getDocs(saucesOrderByPriceQuery)

    pizzas.value = pizzasSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItemType[]
    paninos.value = paninosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItemType[]
    calzones.value = calzonesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItemType[]
    sauces.value = saucesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItemType[]
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading">
    <v-progress-circular :size="100" width="15" color="primary" indeterminate></v-progress-circular>
  </div>
  <div v-else class="space-y-5">
    <MenuSection menuSectionName="pizza" :menuItems="pizzas" />
    <MenuSection menuSectionName="calzone" :menuItems="calzones" />
    <MenuSection menuSectionName="panino" :menuItems="paninos" />
    <MenuSection menuSectionName="sosy" :menuItems="sauces" />
  </div>
</template>
