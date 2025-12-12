<script setup lang="ts">
import { t } from '@/i18n'
import ChevronDownIcon from '@/ui/ChevronDownIcon.vue'
import type { GeocontribDropdown } from '@/config-interfaces'

const props = defineProps<{
  geocontribPermissions?: any
  isAnonymous: boolean
  item: GeocontribDropdown
}>()

function locationEndsWith(end: string): boolean {
  return window.location.href.endsWith(end)
}

function geocontribProjectPathname(): string {
  return `/geocontrib/projet/${props.geocontribPermissions?.project}`
}
</script>

<template>
  <li class="admin group/projects inline-block relative" v-if="!isAnonymous">
    <button
      class="nav-item after:scale-x-0 after:hover:scale-x-0 flex items-center"
    >
      <span class="mr-2 first-letter:capitalize">{{
        item.i18n ? t(item.i18n) : item.label
      }}</span>
      <ChevronDownIcon class="w-4 h-4" stroke-width="4"></ChevronDownIcon>
    </button>
    <ul
      class="absolute hidden group-hover/projects:flex flex-col w-max border rounded dropdown z-[1002] bg-white"
    >
      <li :class="{ active: locationEndsWith('/geocontrib/') }">
        <a
          href="/geocontrib/"
          class="capitalize !flex justify-center items-center"
          >Tous les projets</a
        >
      </li>

      <li :class="{ active: locationEndsWith('/geocontrib/my_account') }">
        <a
          href="/geocontrib/my_account"
          class="capitalize !flex justify-center items-center"
          >Mon compte Geocontrib</a
        >
      </li>
      <li
        class="admin group/item inline-block relative"
        style="border: 1px solid #ddd"
        v-if="!props.isAnonymous && props.geocontribPermissions?.project"
      >
        <button class="w-full !flex items-center justify-between">
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
            v-if="props.geocontribPermissions?.project"
            :class="{
              active: locationEndsWith(geocontribProjectPathname()),
            }"
          >
            <a :href="geocontribProjectPathname()">Accueil</a>
          </li>
          <li
            v-if="props.geocontribPermissions?.project"
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
                props.geocontribPermissions?.project &&
                props.geocontribPermissions?.admin
              "
              :href="geocontribProjectPathname() + '/administration-carte'"
              >Fonds cartographiques</a
            >
          </li>
          <li :class="{ active: locationEndsWith('/membres') }">
            <a
              v-if="
                props.geocontribPermissions?.project &&
                props.geocontribPermissions?.admin
              "
              :href="geocontribProjectPathname() + '/membres'"
            >
              Membres</a
            >
          </li>
        </ul>
      </li>
    </ul>
  </li>
</template>

<style scoped></style>
