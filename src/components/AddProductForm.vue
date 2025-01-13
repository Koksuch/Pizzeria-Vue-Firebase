<script setup lang="ts">
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase'
import { ref, computed, watch } from 'vue'
import type { CollectionNamesType, IngredientsType, MenuItemType } from '@/helpers/types'
import { CollectionNames } from '@/helpers/enums'
import ProductsSelect from './ProductsSelect.vue'
import { rules } from '@/helpers/validationRules'

const props = defineProps<{
  collectionName: CollectionNamesType
}>()

const emit = defineEmits(['product-added'])

const newProductName = ref('')
const newProductPrice = ref<number | null>()
const newProductCurrency = ref('PLN')
const newProductIngredients = ref<string[]>([])
const ingredinets = ref<IngredientsType[]>([])
const form = ref(false)
const isBtnLoading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const canAddIngredients = computed(() => {
  return (
    props.collectionName !== CollectionNames.sauces &&
    props.collectionName !== CollectionNames.ingredients
  )
})

const resetForm = () => {
  newProductName.value = ' '
  newProductPrice.value = null
  newProductCurrency.value = 'PLN'
  newProductIngredients.value = []
  ingredinets.value = []
}

const addProduct = async () => {
  try {
    errorMsg.value = ''
    let newProductData: Partial<MenuItemType | IngredientsType>

    if (props.collectionName == CollectionNames.ingredients) {
      newProductData = {
        name: newProductName.value.trim().toLowerCase(),
        price: Number(newProductPrice.value ?? 0),
        currency: newProductCurrency.value.toLowerCase(),
      } as Partial<IngredientsType>
    } else if (props.collectionName == CollectionNames.sauces) {
      newProductData = {
        name: newProductName.value.trim().toLowerCase(),
        price: Number(newProductPrice.value ?? 0),
        currency: newProductCurrency.value.toLowerCase(),
      } as Partial<MenuItemType>
    } else {
      newProductData = {
        name: newProductName.value.trim().toLowerCase(),
        price: Number(newProductPrice.value ?? 0),
        currency: newProductCurrency.value.toLowerCase(),
        ingredients: newProductIngredients.value,
      } as Partial<MenuItemType>
    }

    await addDoc(collection(db, props.collectionName), newProductData)

    successMsg.value = 'Product added successfully'
    emit('product-added')
    resetForm()
  } catch (error) {
    console.error(error)
    errorMsg.value = 'Something went wrong. Try again later.'
    successMsg.value = ''
  }
}

watch(
  () => ingredinets.value,
  (newVal) => {
    newProductIngredients.value = newVal.map((item) => item.id)
  },
)
</script>

<template>
  <div>
    <v-form class="space-y-4" v-model="form" @submit.prevent="addProduct">
      <v-text-field
        v-model="newProductName"
        label="Product Name"
        :rules="[rules.required]"
        variant="solo-filled"
      />
      <template v-if="props.collectionName">
        <v-text-field
          v-model="newProductPrice"
          label="Price"
          type="number"
          :rules="[rules.required, rules.isNaN, (val) => rules.minValue(val, 0)]"
          variant="solo-filled"
        />
        <v-text-field
          v-model="newProductCurrency"
          label="Currency"
          :rules="[rules.required]"
          variant="solo-filled"
        />
        <div v-if="canAddIngredients">
          <ProductsSelect
            label="Select Ingredients"
            :collectionName="CollectionNames.ingredients"
            v-model="ingredinets"
          />
        </div>
      </template>
      <p class="font-bold text-red-500" v-if="errorMsg">{{ errorMsg }}</p>
      <p class="font-bold text-green-500" v-if="successMsg">{{ successMsg }}</p>
      <v-btn
        :disabled="!form"
        color="blue"
        size="large"
        type="submit"
        variant="elevated"
        block
        :loading="isBtnLoading"
      >
        Add Product
      </v-btn>
    </v-form>
  </div>
</template>
