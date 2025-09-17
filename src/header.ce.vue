<script setup lang="ts">
import { computed, onMounted } from 'vue'
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
const activeAppUrl = computed(() => state.activeAppLink?.activeAppUrl)
const chatbotEndpoint = computed(() => state.activeAppLink?.chatbotEndpoint)

function determineActiveApp(): void {
  const allLinks = allNodes(state.menu, 'activeAppUrl')
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

function allNodes(obj: any, key: string, array?: Link[]): Link[] {
  array = array || []
  if ('object' === typeof obj) {
    for (let k in obj) {
      if (k === key) {
        array.push(obj)
      } else {
        allNodes(obj[k], key, array)
      }
    }
  }
  return array
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

function loadChatPanelScript() {
  const scriptId = 'chatpanel-script'
  if (
    !document.getElementById(scriptId) &&
    state.config.chatpanelModuleUrl &&
    chatbotEndpoint.value
  ) {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = state.config.chatpanelModuleUrl
    script.id = scriptId
    if (props.customNonce) script.setAttribute('nonce', props.customNonce)
    document.head.appendChild(script)
  }
}

onMounted(() => {
  if (props.legacyHeader !== 'true') {
    getUserDetails().then(user => {
      state.user = user
      state.config.stylesheet ??= props.stylesheet
      if (props.configFile)
        fetch(props.configFile)
          .then(res => res.json())
          .then(json => {
            state.config = Object.assign({}, state.config, json.config)
            if (json.menu) {
              state.menu = json.menu
            }
            setI18nAndActiveApp(json.i18n)
            loadChatPanelScript()
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
      class="justify-between text-slate-600 lg:flex hidden h-full bg-white lg:text-sm"
    >
      <div class="flex header-left">
        <Logo :logoUrl="props.logoUrl || state.config.logoUrl" />
        <nav class="flex justify-center items-center font-semibold header-nav">
          <Menu />

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
    <div class="flex-col lg:hidden w-full h-full">
      <div
        class="h-full inline-flex items-center justify-start align-middle px-4 py-6 shrink-0 w-full bg-primary/10"
      >
        <div class="grow flex justify-start items-center py-3">
          <span class="inline-flex items-center rounded-full">
            <BurgerIcon class="mr-3" />
            <Logo :logoUrl="props.logoUrl || state.config.logoUrl" />
          </span>
        </div>
        <AccountItem
          :is-anonymous="isAnonymous"
          :login-url="loginUrl"
          :logout-url="logoutUrl"
        />
      </div>

      <div
        class="absolute z-[1000] bg-white w-full duration-300 transition-opacity ease-in-out"
      >
        <nav class="flex flex-col font-semibold" v-if="state.mobileMenuOpen">
          <Menu />
        </nav>
      </div>
    </div>
    <chat-bubble
      v-if="chatbotEndpoint"
      :endpoint="chatbotEndpoint"
      :stylesheet="state.config.stylesheet"
      :custom-nonce="props.customNonce"
    ></chat-bubble>
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
    @apply block content-[''] absolute h-[3px] bg-primary w-full scale-x-0  transition duration-300 origin-left;
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
