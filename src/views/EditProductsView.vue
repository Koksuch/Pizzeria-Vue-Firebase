<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CollectionNamesType, IngredientsType, MenuItemType } from '@/helpers/types'
import { CollectionNames } from '@/helpers/enums'
import EditProductForm from '@/components/EditProductForm.vue'
import ProductsSelect from '@/components/ProductsSelect.vue'

const selectedPizza = ref<MenuItemType | null>(null)
const selectedPanino = ref<MenuItemType | null>(null)
const selectedCalzone = ref<MenuItemType | null>(null)
const selectedSauce = ref<MenuItemType | null>(null)
const selectedIngredient = ref<IngredientsType | null>(null)
const isLoading = ref(false)

const clearSelections = (except: CollectionNamesType) => {
  if (except !== CollectionNames.pizzas) selectedPizza.value = null
  if (except !== CollectionNames.paninos) selectedPanino.value = null
  if (except !== CollectionNames.calzones) selectedCalzone.value = null
  if (except !== CollectionNames.sauces) selectedSauce.value = null
  if (except !== CollectionNames.ingredients) selectedIngredient.value = null
}

watch(selectedPizza, (newValue) => {
  if (newValue) {
    clearSelections(CollectionNames.pizzas)
  }
})

watch(selectedPanino, (newValue) => {
  if (newValue) {
    clearSelections(CollectionNames.paninos)
  }
})

watch(selectedCalzone, (newValue) => {
  if (newValue) {
    clearSelections(CollectionNames.calzones)
  }
})

watch(selectedIngredient, (newValue) => {
  if (newValue) {
    clearSelections(CollectionNames.ingredients)
  }
})

watch(selectedSauce, (newValue) => {
  if (newValue) {
    clearSelections(CollectionNames.sauces)
  }
})
</script>

<template>
  <div class="w-full">
    <div v-if="isLoading">
      <v-progress-circular
        :size="50"
        width="15"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-else>
      <h3 class="text-2xl font-bold">Edit Products</h3>
      <div>
        <h4 class="pb-2">Select what you want to edit:</h4>
        <div class="grid grid-cols-2 gap-5">
          <ProductsSelect
            v-model="selectedPizza"
            label="Pizzas"
            :collectionName="CollectionNames.pizzas"
          />
          <ProductsSelect
            v-model="selectedPanino"
            label="Paninos"
            :collectionName="CollectionNames.paninos"
          />
          <ProductsSelect
            v-model="selectedCalzone"
            label="Calzones"
            :collectionName="CollectionNames.calzones"
          />
          <ProductsSelect
            v-model="selectedSauce"
            label="Sauces"
            :collectionName="CollectionNames.sauces"
          />
        </div>
      </div>
      <div
        v-if="
          selectedPizza || selectedCalzone || selectedPanino || selectedSauce || selectedIngredient
        "
      >
        <h4 class="pb-2">Edit selected product:</h4>

        <EditProductForm
          v-if="selectedPizza"
          v-model="selectedPizza"
          :collectionName="CollectionNames.pizzas"
        />
        <EditProductForm
          v-if="selectedPanino"
          v-model="selectedPanino"
          :collectionName="CollectionNames.paninos"
        />
        <EditProductForm
          v-if="selectedCalzone"
          v-model="selectedCalzone"
          :collectionName="CollectionNames.calzones"
        />
        <EditProductForm
          v-if="selectedSauce"
          v-model="selectedSauce"
          :collectionName="CollectionNames.sauces"
        />
      </div>
    </div>
  </div>
</template>
