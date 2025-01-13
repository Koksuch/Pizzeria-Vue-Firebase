<script setup lang="ts">
import AdminProductList from '@/components/AdminProductList.vue'
import { CollectionNames } from '@/helpers/enums'
import type { CollectionNamesType, IngredientsType, MenuItemType } from '@/helpers/types'
import { getProducts } from '@/helpers/getDataFunctions'
import { ref, watch, onMounted } from 'vue'
import AddProductForm from '@/components/AddProductForm.vue'

const selectedProductCollection = ref<CollectionNamesType>(CollectionNames.pizzas)
const products = ref<MenuItemType[] | IngredientsType[]>([])
const loading = ref(false)

const fetchProducts = async () => {
  try {
    loading.value = true
    products.value = await getProducts(selectedProductCollection.value)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

watch(selectedProductCollection, fetchProducts)

onMounted(fetchProducts)
</script>

<template>
  <div class="w-full">
    <h3 class="mb-4 text-2xl font-bold">Add/Delete Products</h3>
    <v-radio-group
      class="text-black !opacity-100"
      color="blue"
      inline
      label="Choose what type of product to manage"
      v-model="selectedProductCollection"
      hide-details
    >
      <v-radio :label="CollectionNames.pizzas" :value="CollectionNames.pizzas" />
      <v-radio :label="CollectionNames.paninos" :value="CollectionNames.paninos" />
      <v-radio :label="CollectionNames.calzones" :value="CollectionNames.calzones" />
      <v-radio :label="CollectionNames.sauces" :value="CollectionNames.sauces" />
      <v-radio :label="CollectionNames.ingredients" :value="CollectionNames.ingredients" />
    </v-radio-group>

    <h3 class="my-4 font-bold">Add New Product</h3>
    <div class="grid grid-cols-3 gap-5">
      <div>
        <AdminProductList
          :products="products"
          :collectionName="selectedProductCollection"
          :loading="loading"
          @product-deleted="fetchProducts"
        />
      </div>
      <div class="col-span-2">
        <AddProductForm
          :collectionName="selectedProductCollection"
          @product-added="fetchProducts"
        />
      </div>
    </div>
  </div>
</template>
