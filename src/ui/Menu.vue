<script setup lang="ts">
import { checkCondition, replaceUrlsVariables, state } from '@/shared'
import type { Dropdown, Link, Separator } from '@/config-interfaces'
import DropdownItem from '@/ui/DropdownItem.vue'
import LinkItem from '@/ui/LinkItem.vue'
import ChevronDownIcon from '@/ui/icons/ChevronDownIcon.vue'
import { t } from '@/i18n'

function toggleDropdown(index: number) {
  state.activeDropdown = state.activeDropdown === index ? null : index
}
</script>
<template>
  <template v-for="(item, index) in state.menu" :key="index">
    <template v-if="checkCondition(item)">
      <!--   DESKTOP   -->
      <div class="lg:flex hidden">
        <LinkItem :item="(item as Link)" v-if="!item.type" />
        <template v-else-if="(item as Separator).type === 'separator'">
          <span class="text-gray-400">|</span>
        </template>
        <DropdownItem
          :item="(item as Dropdown)"
          v-else-if="item.type === 'dropdown'"
        />
      </div>

      <!--   MOBILE   -->
      <div class="lg:hidden">
        <template v-if="!item.type">
          <a
            :href="(item as Link).url"
            class="nav-item-mobile"
            @click="state.activeAppLink = item as Link"
            :class="{
                  active: (item as Link).activeAppUrl == state.activeAppLink?.activeAppUrl,
                  disabled: (item as Link).disabled
                }"
          >
            <div class="flex items-center">
              <span class="ml-1 first-letter:capitalize">
                {{
                  (item as Link).i18n
                    ? t((item as Link).i18n)
                    : (item as Link).label
                }}
              </span>
            </div>
          </a>
        </template>
        <template v-else-if="item.type === 'dropdown'">
          <div class="group inline-block relative w-full">
            <button
              class="nav-item-mobile after:hover:scale-x-0 flex items-center"
              @click="toggleDropdown(index)"
            >
              <span class="lg:mr-2 md:mr-1 first-letter:capitalize">{{
                (item as Dropdown).i18n
                  ? t((item as Dropdown).i18n)
                  : (item as Dropdown).label
              }}</span>
              <ChevronDownIcon
                class="w-4 h-4"
                stroke-width="4"
              ></ChevronDownIcon>
            </button>
            <ul
              class="absolute border rounded w-full dropdown z-[1002] bg-white"
              v-show="state.activeDropdown === index"
            >
              <template
                v-for="(subitem, subindex) in (item as Dropdown).items"
                :key="subindex"
              >
                <li
                  v-if="checkCondition(subitem)"
                  @click="state.activeAppLink = subitem as Link"
                  :class="{
                        active: (subitem as Link).activeAppUrl == state.activeAppLink?.activeAppUrl,
                        disabled: (subitem as Link).disabled
                      }"
                >
                  <a
                    :href="replaceUrlsVariables(subitem.url)"
                    class="capitalize !flex justify-center items-center"
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
        </template>
      </div>
    </template>
  </template>
</template>
