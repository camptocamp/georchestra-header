<script setup lang="ts">
import { computed } from 'vue'
import { checkCondition, replaceUrlsVariables, state } from '@/shared'
import type { Dropdown, Link, Separator } from '@/config-interfaces'
import DropdownItem from '@/ui/DropdownItem.vue'
import LinkItem from '@/ui/LinkItem.vue'
import ChevronDownIcon from '@/ui/icons/ChevronDownIcon.vue'
import { t } from '@/i18n'

type MenuItem = Link | Separator | Dropdown

const props = defineProps<{
  items: MenuItem[][]
}>()

// keep only one list for mobile mode
const flattenedItems = computed<MenuItem[]>(() => {
  return ([] as MenuItem[]).concat(...props.items)
})

const asLink = (item: MenuItem) => item as Link
const asDropdown = (item: MenuItem) => item as Dropdown

function toggleDropdown(index: number) {
  state.activeDropdown = state.activeDropdown === index ? null : index
}
</script>
<template>
  <div
    v-for="(group, gIndex) in props.items"
    :key="`group-${gIndex}`"
    class="hidden lg:flex items-center gap-1"
  >
    <template v-for="(item, index) in (group as MenuItem[])" :key="index">
      <template v-if="checkCondition(item)">
        <LinkItem v-if="!item.type" :item="asLink(item)" />

        <template v-else-if="item.type === 'separator'">
          <span class="text-gray-400 mx-1">|</span>
        </template>

        <DropdownItem
          v-else-if="item.type === 'dropdown'"
          :item="asDropdown(item)"
        />
      </template>
    </template>
  </div>

  <div class="lg:hidden w-full flex flex-col">
    <template
      v-for="(item, index) in (flattenedItems as MenuItem[])"
      :key="`mob-${index}`"
    >
      <template v-if="checkCondition(item)">
        <a
          v-if="!item.type"
          :href="replaceUrlsVariables(asLink(item).url)"
          class="nav-item-mobile"
          :class="{
            active: asLink(item) === state.activeAppLink,
            disabled: asLink(item).disabled,
          }"
          @click="state.activeAppLink = asLink(item)"
        >
          {{ asLink(item).i18n ? t(asLink(item).i18n!) : asLink(item).label }}
        </a>

        <div v-else-if="item.type === 'dropdown'" class="w-full">
          <button
            @click="toggleDropdown(index)"
            class="nav-item-mobile flex justify-between items-center w-full text-center"
          >
            <span class="flex-1 text-center">{{
              asDropdown(item).i18n
                ? t(asDropdown(item).i18n!)
                : asDropdown(item).label
            }}</span>
            <ChevronDownIcon
              :class="{ 'rotate-180': state.activeDropdown === index }"
              class="w-4 transition-transform"
            />
          </button>

          <div
            v-show="state.activeDropdown === index"
            class="bg-gray-50 text-center"
          >
            <a
              v-for="sub in asDropdown(item).items"
              :key="sub.label"
              :href="replaceUrlsVariables(sub.url)"
              class="block py-3 px-10 text-sm border-b last:border-0 text-center"
              :class="{
                active: sub === state.activeAppLink,
                disabled: sub.disabled,
              }"
              @click="state.activeAppLink = sub"
            >
              {{ sub.i18n ? t(sub.i18n) : sub.label }}
            </a>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
