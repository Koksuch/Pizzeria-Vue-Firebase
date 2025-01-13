<script setup lang="ts">
import { ingredientsRef } from '@/firebase'
import { toUpperCaseFirstLetter } from '@/helpers/helperFunctions'
import type { CartItemType, IngredientsType } from '@/helpers/types'
import { useCartStore } from '@/store/cartStore'
import { mdiClose } from '@mdi/js'
import { documentId, getDocs, orderBy, query, where } from 'firebase/firestore'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  cartItem: CartItemType
}>()

const cartStore = useCartStore()

const itemIngredients = ref<IngredientsType[]>([])

onMounted(async () => {
  try {
    const ingredientsQuery = query(
      ingredientsRef,
      where(documentId(), 'in', props.cartItem.menuItem.ingredients),
      orderBy('name'),
    )

    const itemIngredientsSnapshot = await getDocs(ingredientsQuery)

    itemIngredients.value = itemIngredientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IngredientsType[]
  } catch (error) {
    console.error(error)
  }
})
</script>
<template>
  <div class="rounded-lg shadow-xl">
    <div class="flex items-center justify-between p-4">
      <div>
        <div class="flex gap-2">
          <h2 class="text-lg font-bold">
            {{ toUpperCaseFirstLetter(props.cartItem.menuItem.name) }}
          </h2>
          <p class="text-lg">
            {{ props.cartItem.menuItem.price }}
            {{
              props.cartItem.menuItem.currency === 'pln' ? 'zł' : props.cartItem.menuItem.currency
            }}
          </p>
        </div>
        <p v-if="itemIngredients" class="text-left text-sm text-gray-400">
          {{ itemIngredients.map((ingredient) => ingredient.name).join(' / ') }}
        </p>
        <div>
          <div
            v-if="props.cartItem.aditionalIngredients.length > 0"
            class="text-left text-sm text-gray-400"
          >
            <p class="font-bold">Dodatkowe składniki:</p>
            <p v-for="ingredient in props.cartItem.aditionalIngredients" :key="ingredient.id">
              {{ ingredient.name }} (x{{ ingredient.quantity }}) - {{ ingredient.price }}
              {{ ingredient.currency === 'pln' ? 'zł' : ingredient.currency }}
            </p>
          </div>
          <div v-if="props.cartItem.sauces.length > 0" class="text-left text-sm text-gray-400">
            <p class="font-bold">Sos/y:</p>
            <p v-for="sauce in props.cartItem.sauces" :key="sauce.id">
              {{ sauce.name }} (x{{ sauce.quantity }}) - {{ sauce.price }}
              {{ sauce.currency === 'pln' ? 'zł' : sauce.currency }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="rounded-full bg-red-500 p-2 text-white"
          @click="cartStore.removeFromCart(props.cartItem.id)"
        >
          <v-icon>{{ mdiClose }}</v-icon>
        </button>
      </div>
    </div>
  </div>
</template>
