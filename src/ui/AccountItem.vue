<script setup lang="ts">
import { t } from '@/i18n'
import { state } from '@/shared'
import UserIcon from '@/ui/icons/UserIcon.vue'
import LoginIcon from '@/ui/icons/LoginIcon.vue'
import { capitalize } from 'vue'

const props = defineProps<{
  isAnonymous: boolean
  logoutUrl: string
  loginUrl: string
}>()
</script>
<template>
  <div class="flex justify-center items-center mx-2 xl:mx-6 header-right">
    <div class="group inline-block relative" v-if="!props.isAnonymous">
      <button
        :class="[
          'btn p-2 after:hover:scale-x-0 flex flex-col items-center',
          state.config.login?.customClass,
        ]"
      >
        <UserIcon
          class="font-bold inline-block"
          :class="{
            'text-2xl': !state.config.displayFullnameInAccountBtn,
            'text-xl': state.config.displayFullnameInAccountBtn,
          }"
        ></UserIcon>
        <template v-if="state.config.displayFullnameInAccountBtn">
          <span class="text-xs max-w-[100px] truncate">
            {{ state.user?.firstname }}
          </span>
          <span class="text-xs max-w-[100px] truncate">
            {{ state.user?.lastname }}
          </span>
        </template>
      </button>
      <div
        class="absolute right-0 flex flex-col w-max z-[1002] opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-100 pointer-events-none group-hover:pointer-events-auto"
      >
        <div class="border rounded bg-white mt-3">
          <div
            class="!flex flex-col px-4 py-2 text-gray-500 border-b border-gray-200"
          >
            <span class="truncate">
              {{ state.user?.username }}
            </span>
          </div>
          <ul class="dropdown font-semibold">
            <li class="px-4 transition-colors duration-100">
              <a
                class="first-letter:capitalize"
                href="/console/account/userdetails"
                >{{ t('account_details') }}
              </a>
            </li>
            <li class="px-4 transition-colors duration-100">
              <a class="first-letter:capitalize" :href="props.logoutUrl">{{
                t('logout')
              }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <a
      v-if="!state.config.hideLogin && props.isAnonymous"
      :class="['btn p-2', state.config.login?.customClass]"
      :href="loginUrl"
      :title="capitalize(t('login'))"
    >
      <span v-if="state.config.login?.showAccountBtnText">
        {{ t('login') }}
      </span>

      <LoginIcon v-else class="font-bold text-2xl inline-block" />
    </a>
  </div>
</template>
