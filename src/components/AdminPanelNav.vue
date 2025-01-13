<script setup lang="ts">
import { RoutesInfo } from '@/helpers/enums'
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-start">
    <RouterLink
      active-class="text-blue-500"
      class="w-full rounded p-2 transition-colors hover:bg-blue-50"
      :to="{ name: RoutesInfo.adminPanel.addDelProducts.name }"
      >Add & Delete Products</RouterLink
    >
    <RouterLink
      active-class="text-blue-500"
      class="w-full rounded p-2 transition-colors hover:bg-blue-50"
      :to="{ name: RoutesInfo.adminPanel.editProducts.name }"
      >Edit Products</RouterLink
    >
  </div>
</template>
