<script setup lang="ts">
import { state } from '@/shared'
import GeorchestraLogo from '@/ui/GeorchestraLogo.vue'

const props = defineProps<{
  logoUrl?: string
}>()
</script>

<template>
  <a
    href="/"
    class="flex justify-center items-center xl:px-3 md:px-2 py-2 h-full"
  >
    <img
      v-if="props.logoUrl || state.config.logoUrl"
      :src="props.logoUrl || state.config.logoUrl"
      alt="geOrchestra logo"
      class="max-w-24 xl:max-w-32 min-w-[15px] logo h-full"
      :class="{ 'lg:hidden xl:block sm:block': state.config.minimizedLogoUrl }"
    />
    <GeorchestraLogo v-else></GeorchestraLogo>
    <img
      v-if="state.config?.minimizedLogoUrl"
      :src="state.config?.minimizedLogoUrl"
      alt="geOrchestra logo"
      class="max-h-12 min-w-[15px] minimizedLogo"
      :class="{ 'xl:hidden lg:block hidden': state.config.minimizedLogoUrl }"
    />
  </a>
</template>

<style scoped></style>
