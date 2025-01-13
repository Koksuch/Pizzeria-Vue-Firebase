<script setup lang="ts">
import AdminPanelNav from '@/components/AdminPanelNav.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex w-full gap-5">
    <div class="w-1/4 rounded-md p-4 shadow-xl">
      <AdminPanelNav />
    </div>
    <div class="w-3/4 rounded-md p-4 shadow-xl">
      <RouterView />
    </div>
  </div>
</template>
