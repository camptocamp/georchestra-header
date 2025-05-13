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
    @click="state.activeAppUrl = props.item.activeAppUrl"
    :class="{
      active: props.item.activeAppUrl == state.activeAppUrl,
      disabled: props.item.disabled,
    }"
  >
    <div class="flex items-center">
      <i
        v-if="props.item.icon"
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
