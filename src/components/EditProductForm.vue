<script setup lang="ts">
import { CollectionNames } from '@/helpers/enums'
import type { CollectionNamesType, IngredientsType, MenuItemType } from '@/helpers/types'
import { rules } from '@/helpers/validationRules'
import { computed, ref } from 'vue'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import ProductsSelect from './ProductsSelect.vue'

const props = defineProps<{
  collectionName: CollectionNamesType
  modelValue: MenuItemType
}>()

const emit = defineEmits(['update:modelValue'])

const editedProduct = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

const selectedProduct = ref<MenuItemType>({ ...props.modelValue })

const selectedIngredients = ref<IngredientsType[]>([])

const errorMsg = ref('')
const successMsg = ref('')
const form = ref(false)
const isBtnLoading = ref(false)

const updateMenuItem = async () => {
  if (selectedProduct.value) {
    if (
      !selectedProduct.value.name ||
      !selectedProduct.value.price ||
      !selectedProduct.value.currency ||
      !selectedIngredients.value.length
    ) {
      errorMsg.value = 'All fields are required'
      return
    }
    try {
      isBtnLoading.value = true
      await updateDoc(doc(db, props.collectionName, selectedProduct.value.id), {
        name: selectedProduct.value.name,
        price: selectedProduct.value.price,
        currency: selectedProduct.value.currency,
        ingredients: selectedIngredients.value.map((item) => item.id),
      })

      editedProduct.value.currency = selectedProduct.value.currency
      editedProduct.value.name = selectedProduct.value.name
      editedProduct.value.price = selectedProduct.value.price
      editedProduct.value.ingredients = selectedIngredients.value.map((item) => item.id)

      successMsg.value = 'Product updated successfully'
      errorMsg.value = ''
    } catch (error) {
      errorMsg.value = 'Something went wrong. Try again later.'
      successMsg.value = ''
      console.error(error)
    } finally {
      isBtnLoading.value = false
    }
  }
}

const onSubmit = () => {
  successMsg.value = ''
  errorMsg.value = ''
  updateMenuItem()
}
</script>

<template>
  <v-form class="flex flex-col gap-5" v-model="form" @submit.prevent="onSubmit">
    <v-text-field
      v-model="selectedProduct.name"
      label="Name"
      variant="solo-filled"
      :rules="[rules.required]"
      clearable
    />

    <v-text-field
      v-model="selectedProduct.price"
      label="Price"
      variant="solo-filled"
      :rules="[rules.required, rules.isNaN]"
      clearable
    />

    <v-text-field
      v-model="selectedProduct.currency"
      label="Currency"
      variant="solo-filled"
      :rules="[rules.required]"
      clearable
    />

    <div
      v-if="
        props.collectionName != CollectionNames.sauces &&
        props.collectionName != CollectionNames.ingredients
      "
    >
      <ProductsSelect
        v-model="selectedIngredients"
        label="Ingredients"
        :collectionName="CollectionNames.ingredients"
        :menuItem="selectedProduct"
      />
    </div>
    <p class="font-bold text-red-500" v-if="errorMsg">{{ errorMsg }}</p>
    <p class="font-bold text-green-500" v-if="successMsg">{{ successMsg }}</p>
    <v-btn
      color="blue"
      size="large"
      type="submit"
      variant="elevated"
      block
      :disabled="!form || selectedIngredients.length === 0"
      :loading="isBtnLoading"
    >
      Save
    </v-btn>
  </v-form>
</template>
