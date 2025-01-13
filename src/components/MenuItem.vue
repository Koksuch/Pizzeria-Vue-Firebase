<script setup lang="ts">
import { ingredientsRef } from '@/firebase'
import type { IngredientsType } from '@/helpers/types'
import { documentId, getDocs, orderBy, query, where } from 'firebase/firestore'
import { onMounted } from 'vue'
import { ref } from 'vue'

const props = defineProps<{
  id: string
  name: string
  price: number
  currency: string
  ingredients?: string[]
}>()

const itemIngredients = ref<IngredientsType[]>([])

onMounted(async () => {
  if (!props.ingredients) return
  try {
    const ingredientsQuery = query(
      ingredientsRef,
      where(documentId(), 'in', props.ingredients),
      orderBy('name'),
    )

    const querySnapshot = await getDocs(ingredientsQuery)

    const ingredients = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IngredientsType[]

    itemIngredients.value = ingredients
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div
    class="flex flex-col items-start justify-between rounded-lg border-[1px] border-gray-200 p-5 shadow-lg"
  >
    <div class="flex flex-col items-start">
      <p class="font-semibold tracking-wider">{{ name }}</p>
      <p v-if="itemIngredients" class="text-left text-sm text-gray-400">
        {{ itemIngredients.map((ingredient) => ingredient.name).join(' / ') }}
      </p>
    </div>
    <p class="mt-5 font-semibold">
      {{ price.toFixed(2) }} {{ currency == 'pln' ? 'zł' : currency }}
    </p>
  </div>
</template>
