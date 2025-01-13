import { db, getCurrentUser } from '@/firebase'
import type { CartItemType } from '@/helpers/types'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cart = ref([] as CartItemType[])
  const cartTotal = ref(0)

  const getCart = computed(() => cart.value)
  const getCartTotal = computed(() => cartTotal.value)

  const setCart = (newCart: CartItemType[]) => {
    cart.value = newCart
    setCartTotal()
  }

  const addToCart = (newCart: CartItemType) => {
    cart.value.push({ ...newCart })
    setCartTotal()
  }

  const removeFromCart = async (id: string) => {
    try {
      const user = await getCurrentUser()
      if (!user) return
      const userCartRef = doc(db, 'UsersCart', user.uid)
      const userDoc = await getDoc(userCartRef)

      if (userDoc.exists()) {
        const cart = userDoc.data().cart || []
        const updatedCart = cart.filter((item: CartItemType) => item.id !== id)
        await updateDoc(userCartRef, { cart: updatedCart })
      }
    } catch (error) {
      console.error(error)
    }

    cart.value = cart.value.filter((item) => item.id !== id)
    setCartTotal()
  }

  const clearCart = () => {
    cart.value = []
    setCartTotal()
  }

  const setCartTotal = () => {
    cartTotal.value = cart.value.reduce((acc, item) => acc + item.finalItemPrice, 0)
  }

  return { cart, getCart, cartTotal, getCartTotal, addToCart, removeFromCart, clearCart, setCart }
})
