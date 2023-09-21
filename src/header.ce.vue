<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { getUserDetails } from './auth'
import type { User } from './auth'
import UserIcon from './ui/UserIcon.vue'
import LoginIcon from './ui/LoginIcon.vue'
import LogoutIcon from './ui/LogoutIcon.vue'
import CatalogIcon from './ui/CatalogIcon.vue'
import MapIcon from './ui/MapIcon.vue'
import ConsoleIcon from './ui/ConsoleIcon.vue'
import AnalyticsIcon from './ui/AnalyticsIcon.vue'

const props = defineProps<{
  lang?: string
  activeApp?: string
}>()

const state = reactive({
  user: null as null | User,
})

const isAnonymous = computed(() => !state.user || state.user.anonymous)
const isAdmin = computed(() => state.user?.adminRoles?.admin)
const adminRoles = computed(() => state.user?.adminRoles)

const loginUrl = computed(() => {
  const current = new URL(window.location.href)
  current.searchParams.set('login', '')
  return current.toString()
})
const logoutUrl = computed(() => '/logout')

onMounted(() => {
  getUserDetails().then(user => {
    state.user = user
  })
})
</script>
<template>
  <header class="host">
    <div class="flex justify-between">
      <a href="/" class="flex justify-center items-center pl-48 py-4">
        <img
          src="https://www.toutsurmoneau.fr/var/ezwebin_site/storage/original/image/d59d58b15762109fe162badb65494510.svg"
          alt="suez logo"
          class="w-48"
        />
      </a>
      <div class="flex pr-8 items-center">
        <div
          v-if="isAdmin"
          class="pr-8 flex justify-end gap-5 text-sm font-sans"
        >
          <a
            href="/geonetwork/srv/fre/admin.console"
            class="btn catalog py-1"
            v-if="adminRoles?.catalog"
            ><CatalogIcon class="icon mr-4"></CatalogIcon>catalog</a
          >
          <a href="/mapstore/#/admin" v-if="adminRoles?.viewer" class="btn py-1"
            ><MapIcon class="icon mr-4"></MapIcon>mapstore</a
          >
          <a
            href="/console/manager/"
            v-if="adminRoles?.console"
            class="btn console py-1"
            ><ConsoleIcon class="icon mr-4"></ConsoleIcon>console</a
          >
          <a href="/analytics/" class="btn console py-1"
            ><AnalyticsIcon class="icon mr-4"></AnalyticsIcon>analytics</a
          >
        </div>

        <div v-if="!isAnonymous" class="flex gap-4">
          <a class="btn" :href="logoutUrl" title="logout"
            ><LogoutIcon class="icon"></LogoutIcon
          ></a>
          <a
            class="btn align-middle"
            href="/console/account/userdetails"
            title="compte"
          >
            <UserIcon class="icon"></UserIcon>
          </a>
        </div>
        <a v-else class="btn" :href="loginUrl" title="login"
          ><LoginIcon class="icon"></LoginIcon
        ></a>
      </div>
    </div>

    <div class="">
      <nav
        class="pl-48 flex justify-start items-center font-semibold text-white bg-primary"
      >
        <a class="nav-item pl-0" href="/datahub/">Consulter le catalogue</a>
        <a class="nav-item" href="/mapstore/">Visualiser</a>
        <a class="nav-item" href="/mapstore/#/home">Créer une carte</a>
        <a class="nav-item" href="/geoserver/">Web Services</a>
        <a v-if="!isAnonymous" class="nav-item" href="/import/">Import</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.host {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-feature-settings: normal;
}

@layer components {
  .nav-item {
    @apply h-16 px-8 hover:bg-primary/70 hover:text-slate-300 transition-colors leading-[4];
  }
  .btn {
    @apply px-4 py-2 text-primary border rounded-3xl hover:bg-primary/30 transition-colors;
  }
  .icon {
    @apply font-bold text-3xl inline-block;
  }
}
</style>
