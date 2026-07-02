<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getUserDetails } from './auth'
import { getI18n, t } from '@/i18n'
import { state, replaceUrlsVariables } from '@/shared'
import { allNodes } from '@/utils'
import Menu from '@/ui/Menu.vue'
import AccountItem from '@/ui/AccountItem.vue'
import Logo from '@/ui/Logo.vue'
import BurgerIcon from '@/ui/icons/BurgerIcon.vue'

const props = defineProps<{
  activeApp?: string
  configFile?: string
  stylesheet?: string
  height?: number
  legacyHeader?: string
  legacyUrl?: string
  logoUrl?: string
  customNonce?: string
}>()
interface RssItem {
  link: string
  title: string
  date: string
}

const rssItems = ref<RssItem[]>([])
const currentRssIndex = ref(0)
let rssInterval: ReturnType<typeof setInterval> | null = null

function formatRssDate(dateStr: string): string {
  const d = new Date(dateStr)
  const month = ('0' + (d.getMonth() + 1)).slice(-2)
  const day = ('0' + d.getDate()).slice(-2)
  return `${day}/${month}/${d.getFullYear()}`
}

async function fetchRssNews(): Promise<void> {
  const RSS_URL = `https://${window.location.hostname}/accueil/rss.xml`
  try {
    const text = await fetch(RSS_URL).then(r => r.text())
    const data = new DOMParser().parseFromString(text, 'text/xml')
    const news: RssItem[] = []
    data.querySelectorAll('item').forEach(el => {
      const title = el.querySelector('title')?.textContent ?? ''
      if (title !== 'Accueil') {
        news.push({
          title,
          date: formatRssDate(el.querySelector('pubDate')?.textContent ?? ''),
          link: el.querySelector('link')?.textContent ?? '',
        })
      }
    })
    rssItems.value = news
    if (news.length > 1) {
      rssInterval = setInterval(() => {
        currentRssIndex.value =
          (currentRssIndex.value + 1) % rssItems.value.length
      }, 5000)
    }
  } catch {
    // RSS unavailable — news bar stays hidden
  }
}

function nextRssItem(): void {
  currentRssIndex.value = (currentRssIndex.value + 1) % rssItems.value.length
}

const navigation = computed(() => state.navigation)
const isAnonymous = computed(() => !state.user || state.user.anonymous)
const isWarned = computed(() => state.user?.warned)
const remainingDays = computed(() => state.user?.remainingDays)
const loginUrl = computed(() => {
  const href = new URL(replaceUrlsVariables(state.config.login.url))
  for (const param of state.config.login.params || []) {
    const key = Object.keys(param)[0]
    href.searchParams.set(key, replaceUrlsVariables(param[key]))
  }
  return href.toString()
})
const logoutUrl = computed(() =>
  replaceUrlsVariables(
    state.user?.isExternalAuth && state.config.logoutExternalUrl
      ? state.config.logoutExternalUrl
      : state.config.logoutUrl
  )
)

function determineActiveApp(): void {
  const navigationSource =
    (state.navigation?.menus?.length ?? 0) > 0 ? state.navigation : state.menu
  const allLinks = allNodes(navigationSource, 'activeAppUrl')
  const computedUrl = window.location.href.substring(
    window.location.origin.length,
    window.location.href.length
  )
  let matched: boolean
  for (const link of allLinks) {
    matched = false
    const activeAppUrlSplitted = link.activeAppUrl!.split(':')
    const base =
      activeAppUrlSplitted.length > 1 ? activeAppUrlSplitted[0] : 'start'
    const url = replaceUrlsVariables(
      activeAppUrlSplitted.length > 1
        ? activeAppUrlSplitted[1]
        : activeAppUrlSplitted[0]
    )
    switch (base) {
      case 'end':
        matched = computedUrl.endsWith(url)
        break
      case 'includes':
        matched = computedUrl.includes(url)
        break
      case 'exact':
        matched = computedUrl === url
        break
      default:
        matched = computedUrl.startsWith(url)
        break
    }
    state.matchedRouteScore =
      matched && link.activeAppUrl!.length > state.matchedRouteScore
        ? link.activeAppUrl!.length
        : state.matchedRouteScore
    if (matched && state.matchedRouteScore === link?.activeAppUrl!.length) {
      state.activeAppLink = link
    }
  }
}

function setI18nAndActiveApp(i18n?: any) {
  state.lang3 = getI18n(
    i18n || {},
    state.config.lang || navigator.language.substring(0, 2) || 'en'
  )
  state.config.logoutExternalUrl ??= state.config.logoutUrl
  determineActiveApp()
  state.loaded = true
}

onUnmounted(() => {
  if (rssInterval !== null) clearInterval(rssInterval)
})

onMounted(() => {
  if (props.legacyHeader !== 'true') {
    getUserDetails().then(user => {
      state.user = user
      if (!user.anonymous) fetchRssNews()
      state.config.stylesheet ??= props.stylesheet
      if (props.configFile)
        fetch(props.configFile)
          .then(res => res.json())
          .then(json => {
            state.config = Object.assign({}, state.config, json.config)
            const incomingNavigation = json.navigation
            if (incomingNavigation?.menus?.length) {
              state.navigation = Object.assign(
                {},
                state.navigation,
                incomingNavigation
              )
            } else if (json.menu) {
              state.navigation = Object.assign({}, state.navigation, {
                menus: [json.menu],
              })
            } else if (incomingNavigation) {
              state.navigation = Object.assign(
                {},
                state.navigation,
                incomingNavigation
              )
            }
            if (json.menu) {
              state.menu = json.menu
            }
            setI18nAndActiveApp(json.i18n)
          })
      else setI18nAndActiveApp()
    })
  }
})
</script>

<template>
  <div v-if="props.legacyHeader === 'true'">
    <iframe
      class="w-full"
      v-bind:src="`${props.legacyUrl}${
        props.activeApp ? `?active=${props.activeApp}` : ''
      }`"
      :style="`height:${props.height}px;width:100%;border:0;`"
    ></iframe>
  </div>
  <header
    v-else-if="state.loaded"
    class="host h-[80px] text-base"
    :class="{ 'has-custom-stylesheet': state.config.stylesheet }"
    :style="`height:${props.height}px`"
  >
    <link
      rel="stylesheet"
      :href="state.config.stylesheet"
      v-if="state.config.stylesheet"
      :nonce="props.customNonce"
    />
    <link
      rel="stylesheet"
      :href="state.config.iconsUrl"
      v-if="state.config.iconsUrl"
      :nonce="props.customNonce"
    />
    <div
      class="justify-between text-slate-600 lg:flex h-[60px] hidden bg-white lg:text-sm"
    >
      <div class="flex header-left flex-1 min-w-0">
        <Logo :logoUrl="props.logoUrl || state.config.logoUrl" />
        <nav
          :class="[
            'flex items-center font-semibold header-nav grow',
            navigation.class || 'justify-start',
          ]"
        >
          <Menu :items="navigation?.menus ?? []" />

          <span class="text-gray-400 text-xs" v-if="isWarned">
            <a href="/console/account/changePassword">
              {{ t('remaining_days_msg_part1') }} {{ remainingDays }}
              {{ t('remaining_days_msg_part2') }}
              {{ t('remaining_days_msg_part3') }}</a
            ></span
          >
        </nav>
      </div>
      <AccountItem
        :is-anonymous="isAnonymous"
        :login-url="loginUrl"
        :logout-url="logoutUrl"
      />
    </div>
    <div
      v-if="!isAnonymous && rssItems.length > 0"
      class="lg:flex hidden h-[20px] bg-black text-slate-100 text-xs px-2 items-center gap-1 justify-between"
    >
      <div>
        <b class="pr-3">Actualités:</b>
        <a
          :href="rssItems[currentRssIndex].link"
          target="_blank"
          rel="noopener"
          class="hover:underline"
        >
          {{ rssItems[currentRssIndex].date }} -
          {{ rssItems[currentRssIndex].title }}
        </a>
      </div>
      <div class="cursor-pointer" v-on:click="nextRssItem()">
        <svg
          width="15px"
          height="15px"
          color="currentColor"
          stroke-width="1.7"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 14C2.89543 14 2 13.1046 2 12C2 10.8954 2.89543 10 4 10C5.10457 10 6 10.8954 6 12C6 13.1046 5.10457 14 4 14Z"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M9 12H22M22 12L19 9M22 12L19 15"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </div>
    </div>
    <div class="flex-col lg:hidden w-full h-full">
      <div
        class="h-full flex items-center justify-between px-4 py-1 shrink-0 w-full bg-primary/10"
      >
        <div class="h-full flex">
          <BurgerIcon class="mr-3" />
          <Logo :logoUrl="props.logoUrl || state.config.logoUrl" />
        </div>
        <AccountItem
          :is-anonymous="isAnonymous"
          :login-url="loginUrl"
          :logout-url="logoutUrl"
        />
      </div>

      <div
        class="absolute z-[1000] bg-white w-full duration-100 transition-opacity ease-in-out"
      >
        <nav class="flex flex-col font-semibold" v-if="state.mobileMenuOpen">
          <Menu :items="navigation?.menus ?? []" />
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
  @layer colors {
    header:not(.has-custom-stylesheet) {
      --georchestra-header-primary: #85127e;
      --georchestra-header-primary-light: #85127e1a;
    }
  }
  .nav-item-mobile {
    @apply text-xl block text-center py-3 w-full border-b border-b-slate-300 first-letter:capitalize;
    display: flex;
    justify-content: center;
  }

  .nav-item {
    @apply relative w-fit block after:hover:scale-x-100 xl:mx-3 md:mx-2 hover:text-black first-letter:capitalize text-base;
  }

  .nav-item:after {
    @apply block content-[''] absolute h-[3px] bg-primary w-full scale-x-0  transition duration-100 origin-left;
  }

  .nav-item.active {
    @apply after:scale-x-100 after:bg-primary after:bg-none text-gray-900;
  }

  .btn {
    @apply px-4 py-2 mx-2 text-slate-100 bg-primary rounded hover:bg-slate-700 transition-colors first-letter:capitalize;
  }

  .link-btn {
    @apply text-primary hover:text-slate-700 hover:underline underline-offset-8 decoration-2 decoration-slate-700 flex flex-col items-center;
  }

  .dropdown > li {
    @apply block text-center hover:bg-primary-light text-gray-700 hover:text-black capitalize;
  }

  .dropdown > li > a {
    @apply block w-full h-full py-3;
  }

  .dropdown > li.active {
    @apply bg-primary-light;
  }

  .disabled {
    @apply cursor-pointer pointer-events-none;
  }

  * {
    -webkit-tap-highlight-color: transparent;
  }
}
</style>
