<script setup lang="ts">
import { db, getCurrentUser, ingredientsRef, saucesRef } from '@/firebase'
import { toUpperCaseFirstLetter } from '@/helpers/helperFunctions'
import type { CartItemType, IngredientsType, MenuItemType } from '@/helpers/types'
import {
  arrayUnion,
  doc,
  documentId,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { mdiPlus, mdiMinus, mdiClose } from '@mdi/js'
import { useCartStore } from '@/store/cartStore'
import { v7 } from 'uuid'

const props = defineProps<{
  menuItem: MenuItemType
  menuSectionName: string
}>()

const emit = defineEmits(['update:setIsActive'])

const cartStore = useCartStore()

const itemIngredients = ref<IngredientsType[]>([])
const allIngredients = ref<(IngredientsType & { quantity: number })[]>([])
const sauces = ref<(MenuItemType & { quantity: number })[]>([])
const errorMsg = ref('')

const selectedProduct = ref<CartItemType>({
  id: v7(),
  menuItem: { ...props.menuItem },
  quantity: 1,
  aditionalIngredients: [],
  sauces: [],
  finalItemPrice: props.menuItem.price,
})

const handleCloseClick = () => {
  emit('update:setIsActive')
}

const incrementSauceQuantity = (id: string) => {
  const sauce = sauces.value.find((s) => s.id === id)
  if (sauce) {
    sauce.quantity += 1
    updateFinalPrice()
  }
}

const decrementSauceQuantity = (id: string) => {
  const sauce = sauces.value.find((s) => s.id === id)
  if (sauce && sauce.quantity > 0) {
    sauce.quantity -= 1
    updateFinalPrice()
  }
}

const incrementIngredientQuantity = (id: string) => {
  const ingredient = allIngredients.value.find((i) => i.id === id)
  if (ingredient) {
    ingredient.quantity += 1
    updateFinalPrice()
  }
}

const decrementIngredientQuantity = (id: string) => {
  const ingredient = allIngredients.value.find((i) => i.id === id)
  if (ingredient && ingredient.quantity > 0) {
    ingredient.quantity -= 1
    updateFinalPrice()
  }
}

const updateFinalPrice = () => {
  const saucesPrice = sauces.value.reduce((total, sauce) => total + sauce.price * sauce.quantity, 0)
  const ingredientsPrice = allIngredients.value.reduce(
    (total, ingredient) => total + ingredient.price * ingredient.quantity,
    0,
  )
  selectedProduct.value.finalItemPrice =
    selectedProduct.value.menuItem.price + saucesPrice + ingredientsPrice
}

const addItemToCart = async () => {
  if (await !getCurrentUser()) {
    errorMsg.value = 'Musisz być zalogowany, aby dodać produkt do koszyka'
    return
  }

  const selectedIngredients = allIngredients.value.filter((ingredient) => ingredient.quantity > 0)
  const selectedSauces = sauces.value.filter((sauce) => sauce.quantity > 0)

  try {
    const user = await getCurrentUser()
    if (!user) return

    await setDoc(
      doc(db, 'UsersCart', user.uid),
      {
        cart: arrayUnion({
          ...selectedProduct.value,
          aditionalIngredients: selectedIngredients,
          sauces: selectedSauces,
        }),
      },
      { merge: true },
    )
  } catch (error) {
    console.log(error)
  }

  cartStore.addToCart({
    ...selectedProduct.value,
    aditionalIngredients: selectedIngredients,
    sauces: selectedSauces,
  })
  handleCloseClick()
}

onMounted(async () => {
  try {
    const ingredientsQuery = query(
      ingredientsRef,
      where(documentId(), 'in', props.menuItem.ingredients),
      orderBy('name'),
    )
    const saucesOrderByPriceQuery = query(saucesRef, orderBy('price'))

    const allIngredientsQuery = query(ingredientsRef, orderBy('name'))

    const itemIngredientsSnapshot = await getDocs(ingredientsQuery)
    const allIngredientsSnapshot = await getDocs(allIngredientsQuery)
    const saucesSnapshot = await getDocs(saucesOrderByPriceQuery)

    itemIngredients.value = itemIngredientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IngredientsType[]

    allIngredients.value = allIngredientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      quantity: 0,
    })) as (IngredientsType & { quantity: number })[]

    sauces.value = saucesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      quantity: 0,
    })) as (MenuItemType & { quantity: number })[]
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div class="relative m-auto overflow-auto rounded-md bg-white p-5 shadow-xl">
    <button class="absolute right-2 top-2 rounded-full p-1" @click="handleCloseClick">
      <v-icon>{{ mdiClose }}</v-icon>
    </button>
    <div class="mb-5 flex flex-col items-start">
      <p class="font-semibold tracking-wider">
        {{ menuSectionName === 'pizza' ? 'Pizza ' : ' '
        }}{{ toUpperCaseFirstLetter(menuItem.name) }}
      </p>
      <p v-if="itemIngredients" class="text-left text-sm text-gray-400">
        {{ itemIngredients.map((ingredient) => ingredient.name).join(' / ') }}
      </p>
    </div>

    <div class="mb-6 rounded-md px-2 pb-1 pt-2 shadow-xl">
      <h3 class="mb-4 border-b pb-2 text-lg font-bold">Sosy</h3>
      <div v-for="sauce in sauces" :key="sauce.id" class="mb-4 flex items-center justify-between">
        <span class="text-gray-700">Sos {{ sauce.name }} ({{ sauce.price }} zł)</span>
        <div class="flex items-center">
          <button
            icon
            class="rounded-full p-1 text-gray-700 shadow-md"
            @click="decrementSauceQuantity(sauce.id)"
            :disabled="sauce.quantity <= 0"
          >
            <v-icon>{{ mdiMinus }}</v-icon>
          </button>
          <span class="mx-2 w-8 text-center">{{ sauce.quantity }}</span>
          <button
            icon
            class="rounded-full p-1 text-gray-700 shadow-md"
            @click="incrementSauceQuantity(sauce.id)"
          >
            <v-icon> {{ mdiPlus }}</v-icon>
          </button>
        </div>
      </div>
    </div>

    <div class="mb-6 max-h-80 overflow-auto rounded-md px-2 pb-1 pt-2 shadow-xl">
      <h3 class="mb-4 border-b pb-2 text-lg font-bold">Dodatkowe składniki</h3>
      <div v-for="ingredient in allIngredients" :key="ingredient.id">
        <div v-if="ingredient.price > 0" class="mb-4 flex items-center justify-between">
          <span class="text-gray-700">{{ ingredient.name }} ({{ ingredient.price }} zł)</span>
          <div class="flex items-center">
            <button
              icon
              class="rounded-full p-1 text-gray-700 shadow-md"
              @click="decrementIngredientQuantity(ingredient.id)"
              :disabled="ingredient.quantity <= 0"
            >
              <v-icon>{{ mdiMinus }}</v-icon>
            </button>
            <span class="mx-2 w-8 text-center">{{ ingredient.quantity }}</span>
            <button
              class="rounded-full p-1 text-gray-700 shadow-md"
              @click="incrementIngredientQuantity(ingredient.id)"
            >
              <v-icon> {{ mdiPlus }}</v-icon>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <p>{{ errorMsg }}</p>
      <button class="w-full rounded-md bg-blue-500 p-2 text-white" @click="addItemToCart">
        Dodaj do koszyka
      </button>
    </div>

    <!-- Podsumowanie -->
    <div class="rounded-md px-2 py-1 pt-4 shadow-xl">
      <h3 class="mb-2 text-lg font-bold">Podsumowanie</h3>
      <p class="text-gray-700">
        <strong>Nazwa zamówienia:</strong> {{ selectedProduct.menuItem.name }}
      </p>
      <p class="text-gray-700">
        <strong>Cena końcowa:</strong> {{ selectedProduct.finalItemPrice.toFixed(2) }} zł
      </p>
    </div>
  </div>
</template>
