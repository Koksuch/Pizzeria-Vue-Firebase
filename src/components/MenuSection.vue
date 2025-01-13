<script setup lang="ts">
import { toUpperCaseFirstLetter } from '@/helpers/helperFunctions'
import MenuItem from './MenuItem.vue'
import type { MenuItemType } from '@/helpers/types'
import MenuItemDialog from './MenuItemDialog.vue'

defineProps<{
  menuSectionName: string
  menuItems: MenuItemType[]
}>()
</script>

<template>
  <h2 class="mb-5 ml-1 text-left text-2xl font-bold">
    {{ toUpperCaseFirstLetter(menuSectionName) }}
  </h2>
  <div class="grid grid-cols-2 gap-5" :class="menuSectionName !== 'sosy' ? 'cursor-pointer' : ''">
    <v-dialog
      v-for="item in menuItems"
      :key="item.id"
      width="500px"
      :disabled="menuSectionName === 'sosy'"
    >
      <template v-slot:activator="{ props: activatorProps }">
        <MenuItem
          v-bind="activatorProps"
          :id="item.id"
          :name="`${menuSectionName === 'pizza' ? 'Pizza' : menuSectionName === 'sosy' ? 'Sos' : ''} ${toUpperCaseFirstLetter(item.name)}`"
          :ingredients="item?.ingredients"
          :price="item.price"
          :currency="item.currency"
        />
      </template>
      <template v-slot:default="{ isActive }">
        <MenuItemDialog
          :menuItem="item"
          :menuSectionName="menuSectionName"
          @update:setIsActive="isActive.value = false"
        />
      </template>
    </v-dialog>
  </div>
</template>
