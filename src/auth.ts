const AUTH_API_URL = '/whoami'
const CONSOLE_PLATFORM_API_URL = '/console/private/platform/infos'

interface WhoAmIResponse {
  GeorchestraUser: {
    roles: string[]
    username: string
    firstName: string
    lastName: string
    ldapWarn: boolean
    isExternalAuth: boolean
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
  isExternalAuth: boolean
  roles: string[]
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
          isExternalAuth: false,
          roles: ['ROLE_ANONYMOUS'],
        }
      }
      return {
        username: user.username,
        firstname: user.firstName,
        lastname: user.lastName,
        warned: user.ldapWarn,
        remainingDays: user.ldapRemainingDays,
        isExternalAuth: user.isExternalAuth,
        anonymous: user.roles.indexOf('ROLE_ANONYMOUS') > -1,
        roles: user.roles,
      }
    })
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
