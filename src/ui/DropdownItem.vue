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
        v-if="
          props.item.itemSelectedTitle && getItemSelectedTitle(props.item.items)
        "
        class="lg:mr-2 md:mr-1 first-letter:capitalize"
        >{{ getItemSelectedTitle(props.item.items) }}</span
      >
      <span v-else class="lg:mr-2 md:mr-1 first-letter:capitalize">{{
        props.item.i18n ? t(props.item.i18n) : props.item.label
      }}</span>
      <ChevronDownIcon class="w-4 h-4" stroke-width="4"></ChevronDownIcon>
    </button>
    <div class="absolute hidden group-hover:block">
      <ul class="border rounded dropdown z-[1002] bg-white mt-3">
        <template
          v-for="(subitem, subindex) in props.item.items"
          :key="subindex"
        >
          <li
            v-if="checkCondition(subitem)"
            @click="state.activeAppUrl = (subitem as Link).activeAppUrl"
            :class="{
                        active: (subitem as Link).activeAppUrl == state.activeAppUrl,
                        disabled: (subitem as Link).disabled
                      }"
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
