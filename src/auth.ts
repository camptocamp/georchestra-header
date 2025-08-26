const AUTH_API_URL = '/whoami'
const CONSOLE_PLATFORM_API_URL = '/console/private/platform/infos'
const GEOCONTRIB_API_URL = '/geocontrib/api'


interface WhoAmIResponse {
  GeorchestraUser: {
    roles: string[]
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
  superset: boolean
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

export function getAdminRoles(roles: string[]): AdminRoles | null {
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
    superset: roles.some(userRole => userRole.startsWith('ROLE_SUPERSET_')),
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

export async function getGeocontribPermissions(): Promise<any> {

  const user_info_req = fetch(`${GEOCONTRIB_API_URL}/user_info`).then(response => response.json());
  const user_level_project_req = fetch(`${GEOCONTRIB_API_URL}/user-level-projects`).then(response => response.json());

  return Promise.all([user_info_req, user_level_project_req])
    .then((res: any) => {
      const user_info = res[0]
      const user_level_project = res[1]
      const isProjectPage = window.location.pathname.indexOf('/geocontrib/projet/') > -1
      const project = isProjectPage ? window.location.pathname.match(/\/geocontrib\/projet\/([^/]*)/)?.[1] : null
      return {
        project: project,
        admin: user_info.user.is_administrator || user_info.user.is_superuser || (project && user_level_project[project] === 'Administrateur projet')
      }
    })
}

