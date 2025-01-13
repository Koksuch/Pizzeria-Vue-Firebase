<script setup lang="ts">
import CartItem from '@/components/CartItem.vue'
import { db, getCurrentUser } from '@/firebase'
import { useCartStore } from '@/store/cartStore'
import { deleteDoc, doc } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'

const cartStore = useCartStore()

const $toast = useToast()

const finalizeOrder = async () => {
  try {
    const user = await getCurrentUser()
    if (!user) return

    await deleteDoc(doc(db, 'UsersCart', user.uid))
  } catch (error) {
    console.error(error)
    $toast.open({
      message: 'Wystąpił błąd podczas składania zamówienia',
      type: 'error',
    })
  }
  cartStore.clearCart()
  $toast.open({
    message: 'Zamówienie złożone',
    type: 'success',
  })
}
</script>

<template>
  <div class="m-auto w-3/4 text-center">
    <h1 class="text-left text-2xl font-bold">Koszyk</h1>
    <div v-if="cartStore.getCart.length > 0" class="flex flex-col gap-5 rounded-md p-6 shadow-lg">
      <CartItem
        v-for="cartItem in cartStore.getCart"
        :key="cartItem.menuItem.id"
        :cartItem="cartItem"
      />
      <div class="flex w-full justify-between p-4">
        <p class="text-left text-lg font-bold">Suma: {{ cartStore.getCartTotal }} zł</p>
        <button class="rounded-md bg-blue-500 p-2 text-white" @click="finalizeOrder">
          Dokonaj zamówienia
        </button>
      </div>
    </div>
    <div v-else class="rounded-md p-4 shadow-xl">
      <p>Twój koszyk jest pusty</p>
    </div>
  </div>
</template>
