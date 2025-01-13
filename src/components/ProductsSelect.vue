<script setup lang="ts">
import { CollectionNames } from '@/helpers/enums'
import { getProducts } from '@/helpers/getDataFunctions'
import type { CollectionNamesType, IngredientsType, MenuItemType } from '@/helpers/types'
import { computed, onMounted, ref, watch } from 'vue'

type ModelValueType<C extends CollectionNamesType> = C extends typeof CollectionNames.ingredients
  ? IngredientsType[] | null
  : MenuItemType | null

type ArrayModelValueType<C extends CollectionNamesType> =
  C extends typeof CollectionNames.ingredients ? IngredientsType[] : MenuItemType[]

const props = defineProps<{
  label: string
  collectionName: CollectionNamesType
  modelValue: ModelValueType<any>
  menuItem?: MenuItemType
  oneIngredient?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const selectedProduct = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

const products = ref<ArrayModelValueType<typeof props.collectionName>>([])

watch(
  () => props.menuItem ?? ({} as MenuItemType),
  (newValue: MenuItemType) => {
    if (!newValue) return
    if (!newValue.ingredients) return
    selectedProduct.value = products.value.filter((product) =>
      newValue.ingredients?.includes(product.id),
    )
  },
)

onMounted(async () => {
  try {
    products.value = await getProducts(props.collectionName)

    if (props.collectionName === CollectionNames.ingredients) {
      selectedProduct.value = products.value.filter((product) =>
        props.menuItem?.ingredients?.includes(product.id),
      )
    }
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <v-select
    v-model="selectedProduct"
    :items="products"
    :label="label"
    clearable
    item-value="id"
    item-text="name"
    item-title="name"
    return-object
    variant="solo-filled"
    :multiple="oneIngredient != true && props.collectionName === CollectionNames.ingredients"
    :chips="oneIngredient != true && props.collectionName === CollectionNames.ingredients"
  />
</template>
