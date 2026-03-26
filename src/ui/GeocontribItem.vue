<script setup lang="ts">
import { t } from '@/i18n'
import ChevronDownIcon from '@/ui/icons/ChevronDownIcon.vue'
import type { GeocontribDropdown, Link } from '@/config-interfaces'
import { checkCondition, replaceUrlsVariables, state } from '@/shared'

const props = defineProps<{
  item: GeocontribDropdown
}>()

function locationEndsWith(end: string): boolean {
  return window.location.href.endsWith(end)
}

function geocontribProjectPathname(): string {
  return `/geocontrib/projet/${state.geocontribPermissions?.project}`
}
</script>

<template>
  <div class="group inline-block relative" v-if="!state.user?.anonymous">
    <button class="nav-item after:hover:scale-x-0 flex items-center">
      <div
        :class="['flex items-center lg:mr-2 md:mr-1', props.item.customClass]"
      >
        <img
          v-if="props.item.iconUrl"
          :src="props.item.iconUrl"
          alt=""
          class="pr-1 block pb-[2px] subitem-icon"
          style="width: 1rem; height: 1rem"
        />
        <i
          v-else-if="props.item.icon"
          :class="props.item.icon"
          class="pr-1 block pb-[2px] subitem-icon"
          style="font-size: 1rem"
        ></i>
        <span class="first-letter:capitalize">{{
          props.item.i18n ? t(props.item.i18n) : props.item.label
        }}</span>
      </div>
      <ChevronDownIcon
        class="w-4 h-4 transition-transform duration-100 group-hover:rotate-180"
        stroke-width="4"
      ></ChevronDownIcon>
    </button>
    <div
      class="absolute flex flex-col min-w-full w-max z-[1002] opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-100 pointer-events-none group-hover:pointer-events-auto"
    >
      <ul class="border rounded dropdown bg-white mt-3">
        <template
          v-for="(subitem, subindex) in props.item.items"
          :key="subindex"
        >
          <li
            v-if="checkCondition(subitem)"
            @click="state.activeAppLink = subitem as Link"
            :class="[
              'px-4 transition-colors duration-100 hover:bg-gray-50',
              subitem.customClass,
              {
                active: subitem as Link == state.activeAppLink,
                disabled: (subitem as Link).disabled
              }]"
          >
            <a
              :href="replaceUrlsVariables(subitem.url)"
              class="capitalize !flex justify-start items-start"
            >
              <img
                v-if="subitem.iconUrl"
                :src="subitem.iconUrl"
                alt=""
                class="pr-1 block pb-[2px] subitem-icon"
                style="width: 1rem; height: 1rem"
              />
              <i
                v-else-if="subitem.icon"
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

        <li
          :class="{ active: locationEndsWith('/geocontrib/') }"
          class="px-4 transition-colors duration-100 hover:bg-gray-50"
        >
          <a
            href="/geocontrib/"
            class="capitalize !flex justify-start items-start"
            >Tous les projets</a
          >
        </li>

        <li
          :class="{ active: locationEndsWith('/geocontrib/my_account') }"
          class="px-4 transition-colors duration-100 hover:bg-gray-50"
        >
          <a
            href="/geocontrib/my_account"
            class="capitalize !flex justify-start items-start"
            >Mon compte Geocontrib</a
          >
        </li>
        <li
          class="admin group/item inline-block relative px-4"
          style="border: 1px solid #ddd"
          v-if="!state.user?.anonymous && state.geocontribPermissions?.project"
        >
          <button class="w-full !flex items-center justify-between py-3">
            <span class="mr-2 first-letter:capitalize">Projet</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="4"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
          <ul
            class="absolute hidden group-hover/item:block border rounded w-full dropdown z-[1002] bg-white left-full top-0"
          >
            <li
              v-if="state.geocontribPermissions?.project"
              :class="{
                active: locationEndsWith(geocontribProjectPathname()),
              }"
            >
              <a :href="geocontribProjectPathname()">Accueil</a>
            </li>
            <li
              v-if="state.geocontribPermissions?.project"
              :class="{ active: locationEndsWith('/signalement/lister') }"
            >
              <a :href="geocontribProjectPathname() + '/signalement/lister'"
                >Liste & Carte</a
              >
            </li>
            <li
              :class="{
                active: locationEndsWith('/administration-carte'),
              }"
            >
              <a
                v-if="
                  state.geocontribPermissions?.project &&
                  state.geocontribPermissions?.admin
                "
                :href="geocontribProjectPathname() + '/administration-carte'"
                >Fonds cartographiques</a
              >
            </li>
            <li :class="{ active: locationEndsWith('/membres') }">
              <a
                v-if="
                  state.geocontribPermissions?.project &&
                  state.geocontribPermissions?.admin
                "
                :href="geocontribProjectPathname() + '/membres'"
              >
                Membres</a
              >
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
