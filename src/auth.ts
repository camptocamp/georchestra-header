const AUTH_API_URL = '/whoami'
const CONSOLE_PLATFORM_API_URL = '/console/private/platform/infos'

type KNOWN_ROLES =
  | 'ROLE_SUPERUSER'
  | 'ROLE_ORGADMIN'
  | 'ROLE_MAPSTORE_ADMIN'
  | 'ROLE_USER'
  | 'ROLE_ADMINISTRATOR'
  | 'ROLE_EXTRACTORAPP'
  | 'ROLE_GN_REVIEWER'
  | 'ROLE_GN_EDITOR'
  | 'ROLE_GN_ADMIN'
  | 'ROLE_EMAILPROXY'
  | 'ROLE_ANONYMOUS'
  | 'ROLE_IMPORT'

interface WhoAmIResponse {
  GeorchestraUser: {
    roles: KNOWN_ROLES[]
    username: string
    firstName: string
    lastName: string
    ldapWarn: boolean
    ldapRemainingDays: string
  }
}

export interface User {
  username: string
  firstname?: string
  lastname?: string
  anonymous: boolean
  warned: boolean
  remainingDays: string
  adminRoles: AdminRoles | null
}

export interface AdminRoles {
  superUser: boolean
  admin: boolean
  console: boolean
  catalog: boolean
  catalogAdmin: boolean
  viewer: boolean
  import: boolean
}

export async function getUserDetails(): Promise<User> {
  return fetch(AUTH_API_URL)
    .then(response => response.json())
    .then((json: WhoAmIResponse) => {
      const user = json.GeorchestraUser
      if (!user) {
        return {
          username: 'anonymousUser',
          warned: false,
          remainingDays: '0',
          anonymous: true,
          adminRoles: null,
        }
      }
      const roles = user.roles
      return {
        username: user.username,
        firstname: user.firstName,
        lastname: user.lastName,
        warned: user.ldapWarn,
        remainingDays: user.ldapRemainingDays,
        anonymous: roles.indexOf('ROLE_ANONYMOUS') > -1,
        adminRoles: getAdminRoles(roles),
      }
    })
}

export function getAdminRoles(roles: KNOWN_ROLES[]): AdminRoles | null {
  const superUser = roles.indexOf('ROLE_SUPERUSER') > -1
  const console = superUser || roles.indexOf('ROLE_ORGADMIN') > -1
  const catalogAdmin = superUser || roles.indexOf('ROLE_GN_ADMIN') > -1
  const catalog =
    !catalogAdmin &&
    (roles.indexOf('ROLE_GN_EDITOR') > -1 ||
      roles.indexOf('ROLE_GN_REVIEWER') > -1)
  const viewer = superUser || roles.indexOf('ROLE_MAPSTORE_ADMIN') > -1
  const admin = superUser || console || catalog || viewer || catalogAdmin
  if (!admin && roles.indexOf('ROLE_IMPORT') === -1) return null
  return {
    superUser,
    admin,
    console,
    catalog,
    catalogAdmin,
    viewer,
    import: superUser || roles.indexOf('ROLE_IMPORT') > -1,
  }
}

export interface PlatformInfos {
  analyticsEnabled: boolean
  extractorappEnabled: boolean
  saslEnabled: boolean
}

export async function getPlatformInfos(): Promise<PlatformInfos> {
  return fetch(CONSOLE_PLATFORM_API_URL)
    .then(response => response.json())
    .then((json: PlatformInfos) => {
      return {
        analyticsEnabled: json.analyticsEnabled,
        extractorappEnabled: json.extractorappEnabled,
        saslEnabled: json.saslEnabled,
      }
    })
}
