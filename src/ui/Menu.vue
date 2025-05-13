<script setup lang="ts">
import { checkCondition } from '@/shared'
import type { Dropdown, Link, Separator } from '@/config-interfaces'
import DropdownItem from '@/ui/DropdownItem.vue'
import LinkItem from '@/ui/LinkItem.vue'

const props = defineProps<{
  menu: (Link | Separator | Dropdown)[]
}>()
</script>
<template>
  <template v-for="(item, index) in props.menu" :key="index">
    <template v-if="checkCondition(item)">
      <LinkItem :item="(item as Link)" v-if="!item.type" />
      <template v-else-if="(item as Separator).type === 'separator'">
        <span class="text-gray-400">|</span>
      </template>
      <DropdownItem
        :item="(item as Dropdown)"
        v-else-if="item.type === 'dropdown'"
      />
    </template>
  </template>
</template>
