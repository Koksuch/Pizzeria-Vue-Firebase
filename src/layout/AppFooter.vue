<script setup lang="ts">
import { RoutesInfo } from '@/helpers/enums'
</script>

<template>
  <footer class="flex justify-center gap-1 border-t-[1px] border-gray-400 p-2">
    <p>Pizzeria MammaPizza coded by Marcel Wrzciono&copy; 2024</p>
    <p>|</p>
    <RouterLink :to="RoutesInfo.adminPanel.path">Admin Panel</RouterLink>
  </footer>
</template>
