import type { Config, Dropdown, Link, Separator } from '@/config-interfaces'
import { t } from '@/i18n'
import type { PlatformInfos, User } from '@/auth'
import { reactive } from 'vue'
import { defaultMenu, defaultConfig, rightMenu } from '@/default-config.json'

export const state = reactive({
  user: null as null | User,
  mobileMenuOpen: false,
  platformInfos: null as null | PlatformInfos,
  menu: defaultMenu as (Link | Separator | Dropdown)[],
  rightMenu: rightMenu as (Link | Separator | Dropdown)[],
  config: defaultConfig as Config,
  lang3: 'eng',
  loaded: false,
  matchedRouteScore: 0,
  activeAppUrl: '' as string | undefined,
  activeDropdown: null as null | number,
})

export function checkCondition(item: Link | Separator | Dropdown): boolean {
  if (!item) return false
  const hasRole = item.hasRole
  if (!state.user) return false
  if (!hasRole) return true
  const isBlocked = item.blockedRole
    ?.split(',')
    .some(c => state.user?.roles?.indexOf(c) !== -1)
  if (isBlocked) return false
  return hasRole.split(',').some(c => state.user?.roles?.indexOf(c) !== -1)
}

export function getItemSelectedTitle(items: Array<Link> | undefined): string {
  const selectedItem = items?.find(
    item => item.activeAppUrl === state.activeAppUrl
  )
  return selectedItem ? t(selectedItem.i18n || selectedItem.label) : ''
}

export function replaceUrlsVariables(url: string): string {
  return url.replace(/:lang3/, state.lang3)
}
