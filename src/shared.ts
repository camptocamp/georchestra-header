import type { Config, Dropdown, Link, Separator } from '@/config-interfaces'
import { t } from '@/i18n'
import type { User } from '@/auth'
import { reactive } from 'vue'
import { defaultMenu, defaultConfig } from '@/default-config.json'

export const state = reactive({
  user: null as null | User,
  mobileMenuOpen: false,
  menu: defaultMenu as (Link | Separator | Dropdown)[],
  config: defaultConfig as Config,
  lang3: 'eng',
  loaded: false,
  matchedRouteScore: 0,
  activeAppLink: null as null | Link,
  activeDropdown: null as null | number,
  geocontribPermissions: null as null | any,
})

export function checkCondition(item: Link | Separator | Dropdown): boolean {
  const rolesAllowed = item.hasRole
  const hideMobile = item.hideMobile
  const isMobile = window.innerWidth < 768
  if (hideMobile && isMobile) return false
  if (!state.user) return false
  if (!rolesAllowed) return true
  const isBlocked = item.blockedRole
    ?.split(',')
    .some(c => state.user?.roles?.indexOf(c) !== -1)
  if (isBlocked) return false
  return rolesAllowed
    .split(',')
    .some(rolePattern =>
      rolePattern.endsWith('*')
        ? state.user?.roles?.some(userRole =>
            userRole.startsWith(rolePattern.slice(0, -1))
          )
        : state.user?.roles?.includes(rolePattern)
    )
}

export function getItemSelectedTitle(items: Array<Link> | undefined): string {
  const selectedItem = items?.find(
    item => item.activeAppUrl === state.activeAppLink?.activeAppUrl
  )
  return selectedItem ? t(selectedItem.i18n || selectedItem.label) : ''
}

export function replaceUrlsVariables(url: string = ''): string {
  return url
    .replace(/:lang3/, state.lang3)
    .replace(/:origin/, encodeURI(window.location.origin))
    .replace(/:currentUrl/, encodeURI(window.location.href))
}
