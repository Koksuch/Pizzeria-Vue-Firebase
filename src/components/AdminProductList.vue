<script setup lang="ts">
import type { CollectionNamesType, IngredientsType, MenuItemType } from '@/helpers/types'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import { mdiClose } from '@mdi/js'
import { useToast } from 'vue-toast-notification'

const props = defineProps<{
  collectionName: CollectionNamesType
  products: MenuItemType[] | IngredientsType[]
  loading: boolean
}>()

const emit = defineEmits(['product-deleted'])
const $toast = useToast()

const deleteItem = async (id: string) => {
  try {
    await deleteDoc(doc(db, props.collectionName, id))
    emit('product-deleted')
    $toast.open({
      message: 'Product deleted successfully',
      type: 'success',
      duration: 5000,
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else class="space-y-4">
    <ul class="max-h-60 list-disc overflow-y-auto rounded-md border py-2 shadow-sm">
      <li
        v-for="product in products"
        :key="product.id"
        class="flex items-center justify-between border-b px-3 py-2 last:!border-b-0"
      >
        <span class="text-left font-medium text-gray-800">{{ product.name }}</span>
        <button class="text-red-600 hover:text-red-800" @click="deleteItem(product.id)">
          <v-icon :icon="mdiClose" />
        </button>
      </li>
    </ul>
  </div>
</template>
