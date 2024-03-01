<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { getUserDetails, getPlatformInfos } from './auth'
import type { User, PlatformInfos } from './auth'
import UserIcon from './ui/UserIcon.vue'
import GeorchestraLogo from './ui/GeorchestraLogo.vue'
import CatalogIcon from '@/ui/CatalogIcon.vue'
import MapIcon from '@/ui/MapIcon.vue'
import ChartPieIcon from '@/ui/ChartPieIcon.vue'
import UsersIcon from '@/ui/UsersIcon.vue'
import ChevronDownIcon from '@/ui/ChevronDownIcon.vue'
import { LANG_2_TO_3_MAPPER, t } from '@/i18n'

const props = defineProps<{
  hideLogin?: string
  lang?: string
  activeApp?: string
  logoUrl?: string
  //legacy option : using old iframe option
  legacyHeader?: string
  legacyUrl?: string
  style?: string
  stylesheet?: string
}>()

const state = reactive({
  user: null as null | User,
  mobileMenuOpen: false,
  lang3: props.lang,
  platformInfos: null as null | PlatformInfos,
})

const isAnonymous = computed(() => !state.user || state.user.anonymous)
const isAdmin = computed(() => state.user?.adminRoles?.admin)
const isWarned = computed(() => state.user?.warned)
const remainingDays = computed(() => state.user?.remainingDays)
const adminRoles = computed(() => state.user?.adminRoles)

const loginUrl = computed(() => {
  const current = new URL(window.location.href)
  current.searchParams.set('login', '')
  return current.toString()
})
const logoutUrl = computed(() => '/logout')

function toggleMenu(): void {
  state.mobileMenuOpen = !state.mobileMenuOpen
}

onMounted(() => {
  state.lang3 =
    LANG_2_TO_3_MAPPER[props.lang || navigator.language.substring(0, 2)] ||
    'eng'
  getUserDetails().then(user => {
    state.user = user
    if (user?.adminRoles?.admin) {
      getPlatformInfos().then(
        platformInfos => (state.platformInfos = platformInfos)
      )
    }
  })
})
</script>
<template>
  <div v-if="props.legacyHeader === 'true'">
    <iframe
      class="w-full"
      v-bind:src="`${props.legacyUrl}${
        props.activeApp ? `?active=${props.activeApp}` : ''
      }`"
      v-bind:style="props.style"
    ></iframe>
  </div>
  <header v-else class="host h-[130px] text-base" v-bind:style="props.style">
    <link rel="stylesheet" :href="props.stylesheet" v-if="props.stylesheet" />
    <component :is="'style'" v-if="!props.stylesheet">
      header { --georchestra-header-primary: #85127e;
      --georchestra-header-secondary: #1b1f3b;
      --georchestra-header-primary-light: #85127e1a;
      --georchestra-header-secondary-light: #1b1f3b1a;
      --georchestra-header-primary-dark: #AB0107; }
    </component>

    <div class="h-[40px] bg-primary flex pl-8 justify-center">
      <span class="self-center text-white text-lg font-bold uppercase">{{
        t('pre.header.title')
      }}</span>
    </div>
    <div
      class="justify-between text-slate-600 sm:flex hidden bg-white h-[90px]"
    >
      <div class="flex">
        <a
          href="/"
          class="flex justify-center items-center px-8 rounded-r-lg py-2 bg-primary-light"
        >
          <img
            v-if="props.logoUrl"
            :src="props.logoUrl"
            alt="geOrchestra logo"
            class="w-32"
          />
          <GeorchestraLogo
            v-else
            class="w-full h-12 my-auto block"
          ></GeorchestraLogo>
        </a>
        <nav class="flex justify-center items-center font-semibold">
          <a
            class="nav-item"
            :class="{ active: props.activeApp === 'datahub' }"
            href="/catalogue/search"
            >{{ t('catalogue') }}</a
          >
          <a
            class="nav-item"
            :class="{ active: props.activeApp === 'mapstore' }"
            href="/mapstore/"
            >{{ t('viewer') }}</a
          >
          <a
            class="nav-item"
            :class="{ active: props.activeApp === 'mapstore-home' }"
            href="/mapstore/#/home"
            >{{ t('maps') }}</a
          >
          <a
            v-if="!isAnonymous"
            class="nav-item"
            :class="{ active: props.activeApp === 'geocontrib' }"
            href="/geocontrib/"
            >{{ t('contributions') }}</a
          >
          <a
            v-if="adminRoles?.import"
            class="nav-item"
            href="/import/"
            :class="{ active: props.activeApp === 'import' }"
            >{{ t('datafeeder') }}</a
          >
          <span class="text-gray-400" v-if="isAdmin">|</span>
          <div class="admin group inline-block relative" v-if="isAdmin">
            <button
              class="nav-item after:scale-x-0 after:hover:scale-x-0 flex items-center"
            >
              <span class="mr-2 first-letter:capitalize">{{ t('admin') }}</span>
              <ChevronDownIcon
                class="w-4 h-4"
                stroke-width="4"
              ></ChevronDownIcon>
            </button>
            <ul
              class="absolute hidden group-hover:block border rounded w-full admin-dropdown z-[1002] bg-white"
            >
              <li :class="{ active: props.activeApp === 'geonetwork' }">
                <a
                  class="catalog"
                  v-if="adminRoles?.catalog || adminRoles?.catalogAdmin"
                  :href="
                    adminRoles?.catalogAdmin
                      ? `/geonetwork/srv/${state.lang3}/admin.console`
                      : `/geonetwork/srv/${state.lang3}/catalog.edit#/board`
                  "
                >
                  <CatalogIcon class="icon-dropdown"></CatalogIcon>
                  {{ t('catalogue') }}</a
                >
              </li>
              <li :class="{ active: props.activeApp === 'msadmin' }">
                <a href="/mapstore/#/admin" v-if="adminRoles?.viewer" class="">
                  <MapIcon class="icon-dropdown"></MapIcon>
                  {{ t('viewer') }}</a
                >
              </li>
              <li :class="{ active: props.activeApp === 'console' }">
                <a
                  href="/console/manager/home"
                  v-if="adminRoles?.console"
                  class="console"
                >
                  <UsersIcon class="icon-dropdown"></UsersIcon>
                  {{ t('users') }}</a
                >
              </li>
              <li
                :class="{ active: props.activeApp === 'analytics' }"
                v-if="state.platformInfos?.analyticsEnabled"
              >
                <a href="/analytics/" class="analytics">
                  <ChartPieIcon class="icon-dropdown"></ChartPieIcon>
                  analytics</a
                >
              </li>
              <li :class="{ active: props.activeApp === 'geoserver' }">
                <a href="/geoserver/web/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="icon-dropdown"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64"
                    />
                  </svg>
                  {{ t('services') }}
                </a>
              </li>
            </ul>
          </div>
          <span class="text-gray-400 text-xs" v-if="isWarned">
            <a href="/console/account/changePassword">
              {{ t('remaining_days_msg_part1') }} {{ remainingDays }}
              {{ t('remaining_days_msg_part2') }}
              {{ t('remaining_days_msg_part3') }}</a
            ></span
          >
        </nav>
      </div>
      <div></div>
      <div class="flex justify-center items-center mx-6">
        <div v-if="!isAnonymous" class="flex gap-4 items-baseline">
          <a
            class="link-btn"
            href="/console/account/userdetails"
            :title="`${state.user?.firstname} ${state.user?.lastname}`"
          >
            <UserIcon class="font-bold text-3xl inline-block"></UserIcon>
            <span class="text-xs max-w-[120px] truncate">{{
              `${state.user?.firstname} ${state.user?.lastname}`
            }}</span></a
          >
          <a class="link-btn" :href="logoutUrl"
            ><span class="first-letter:capitalize">{{ t('logout') }}</span></a
          >
        </div>
        <a
          v-if="props.hideLogin !== 'true' && isAnonymous"
          class="btn"
          :href="loginUrl"
          >{{ t('login') }}</a
        >
      </div>
    </div>
    <div class="flex-col sm:hidden w-full h-full">
      <div
        class="h-full inline-flex items-center justify-start align-middle px-6 py-8 shrink-0 w-full bg-primary/10"
      >
        <div class="grow flex justify-start items-center py-3">
          <span class="inline-flex items-center rounded-full">
            <button type="button" @click="toggleMenu">
              <svg
                v-if="state.mobileMenuOpen"
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path
                  d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path
                  d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
                />
              </svg>
            </button>
            <a href="/">
              <img
                v-if="props.logoUrl"
                :src="props.logoUrl"
                alt="geOrchestra logo"
                class="w-24 ml-4"
              />
              <GeorchestraLogo
                v-else
                class="w-full h-12 ml-4"
              ></GeorchestraLogo>
            </a>
          </span>
        </div>
        <div class="flex justify-center items-center">
          <div v-if="!isAnonymous" class="flex gap-4 items-baseline">
            <a class="link-btn" href="/console/account/userdetails">
              <UserIcon class="font-bold text-3xl inline-block mr-4"></UserIcon>
              <span>{{
                `${state.user?.firstname} ${state.user?.lastname}`
              }}</span></a
            >
            <a class="link-btn" :href="logoutUrl">logout</a>
          </div>
          <a v-else class="btn" :href="loginUrl">login</a>
        </div>
      </div>

      <div
        class="absolute z-[1000] bg-white w-full duration-300 transition-opacity ease-in-out"
      >
        <nav class="flex flex-col font-semibold" v-if="state.mobileMenuOpen">
          <a class="nav-item-mobile" href="/datahub/">{{ t('catalogue') }}</a>
          <a class="nav-item-mobile" href="/mapstore/">{{ t('viewer') }}</a>
          <a class="nav-item-mobile" href="/mapstore/#/home">{{ t('maps') }}</a>
          <a class="nav-item-mobile" href="/geoserver/">{{ t('services') }}</a>
          <a v-if="!isAnonymous" class="nav-item-mobile" href="/import/">{{
            t('datafeeder')
          }}</a>
        </nav>
      </div>
    </div>
  </header>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.host {
  -webkit-text-size-adjust: 100%;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-feature-settings: normal;
}

@layer components {
  .nav-item-mobile {
    @apply text-xl block text-center py-3 w-full border-b border-b-slate-300 first-letter:capitalize;
  }

  .nav-item {
    @apply relative text-lg w-fit block after:hover:scale-x-[82%] px-2 mx-2 hover:text-black first-letter:capitalize;
  }

  .nav-item:after {
    @apply block content-[''] absolute h-[3px] bg-primary w-full scale-x-[10%]  transition duration-300 origin-left;
  }

  .nav-item.active {
    @apply after:scale-x-[82%] after:bg-primary after:bg-none text-gray-900;
  }

  .btn {
    @apply px-4 py-2 mx-2 text-slate-100 bg-primary rounded hover:bg-primary-dark transition-colors first-letter:capitalize;
  }

  .link-btn {
    @apply text-primary hover:hover:text-primary-dark hover:underline underline-offset-8 decoration-2 hover:decoration-primary-dark flex flex-col items-center;
  }

  .admin-dropdown > li {
    @apply block text-center hover:bg-primary-light text-gray-700 hover:text-black capitalize;
  }

  .admin-dropdown > li > a {
    @apply block w-full h-full py-3;
  }

  .admin-dropdown > li.active {
    @apply bg-primary-light;
  }

  .icon-dropdown {
    @apply w-4 h-4 inline-block align-text-top;
  }

  * {
    -webkit-tap-highlight-color: transparent;
  }
}
</style>
