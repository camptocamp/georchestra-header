<script setup lang="ts">
import type { Link } from '@/config-interfaces'
import { t } from '@/i18n'
import { state } from '@/shared'

const props = defineProps<{
  item: Link
}>()
</script>
<template>
  <a
    :href="props.item.url"
    class="nav-item"
    @click="state.activeAppLink = props.item"
    :class="[
      props.item.customClass,
      {
        active: props.item == state.activeAppLink,
        disabled: props.item.disabled,
      },
    ]"
  >
    <div class="flex items-center">
      <!-- Icon from URL (highest priority) -->
      <img
        v-if="props.item.iconUrl"
        :src="props.item.iconUrl"
        alt=""
        class="item-icon"
        style="width: 0.9rem; height: 0.9rem"
      />
      <!-- Icon from CSS class (fallback if no iconUrl) -->
      <i
        v-else-if="props.item.icon"
        :class="props.item.icon"
        class="item-icon"
        style="font-size: 0.9rem"
      ></i>
      <span class="ml-1 first-letter:capitalize">
        {{ props.item.i18n ? t(props.item.i18n) : props.item.label }}
      </span>
    </div>
  </a>
</template>
