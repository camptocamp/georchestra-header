<script setup lang="ts">
import type { Dropdown, Link } from '@/config-interfaces'
import { t } from '@/i18n'
import ChevronDownIcon from '@/ui/icons/ChevronDownIcon.vue'
import {
  checkCondition,
  getItemSelectedTitle,
  state,
  replaceUrlsVariables,
} from '@/shared'

const props = defineProps<{
  item: Dropdown
}>()
</script>
<template>
  <div class="group inline-block relative">
    <button class="nav-item after:hover:scale-x-0 flex items-center">
      <span
        v-if="getItemSelectedTitle(props.item.items)"
        class="lg:mr-2 md:mr-1 first-letter:capitalize"
        >{{ getItemSelectedTitle(props.item.items) }}</span
      >
      <span v-else class="lg:mr-2 md:mr-1 first-letter:capitalize">{{
        props.item.i18n ? t(props.item.i18n) : props.item.label
      }}</span>
      <ChevronDownIcon
        class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
        stroke-width="4"
      ></ChevronDownIcon>
    </button>
    <div
      class="absolute flex flex-col min-w-full w-max z-[1002] opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
    >
      <ul class="border rounded dropdown bg-white mt-3">
        <template
          v-for="(subitem, subindex) in props.item.items"
          :key="subindex"
        >
          <li
            v-if="checkCondition(subitem)"
            @click="state.activeAppLink = subitem as Link"
            :class="{
                        active: (subitem as Link).activeAppUrl == state.activeAppLink?.activeAppUrl,
                        disabled: (subitem as Link).disabled
                      }"
            class="px-4 transition-colors duration-100 hover:bg-gray-50"
          >
            <a
              :href="replaceUrlsVariables(subitem.url)"
              class="capitalize !flex justify-start items-start"
            >
              <i
                v-if="subitem.icon"
                :class="subitem.icon"
                class="pr-1 block pb-[2px] subitem-icon"
                style="font-size: 1rem"
              ></i>
              <span class="block">{{
                subitem.i18n ? t(subitem.i18n) : subitem.label
              }}</span>
            </a>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
