const AUTH_API_URL = '/whoami'
const GEOCONTRIB_API_URL = '/geocontrib/api'

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
  isExternalAuth?: boolean
  roles: string[]
}

export async function getUserDetails(): Promise<User> {
  try {
    const response = await fetch(AUTH_API_URL)

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }

    const json: WhoAmIResponse = await response.json()
    const user = json.GeorchestraUser

    if (!user) {
      throw new Error('Missing GeorchestraUser')
    }

    return {
      username: user.username,
      firstname: user.firstName,
      lastname: user.lastName,
      warned: user.ldapWarn,
      remainingDays: user.ldapRemainingDays,
      anonymous: user.roles.includes('ROLE_ANONYMOUS'),
      roles: user.roles,
      isExternalAuth: user.isExternalAuth,
    }
  } catch (error) {
    console.warn('[getUserDetails] Fail get user, fallback anonymous :', error)

    return {
      username: 'anonymousUser',
      warned: false,
      remainingDays: '0',
      anonymous: true,
      roles: ['ROLE_ANONYMOUS'],
      isExternalAuth: false,
    }
  }
}
export async function getGeocontribPermissions(): Promise<any> {
  const user_info_req = fetch(`${GEOCONTRIB_API_URL}/user_info`).then(
    response => response.json()
  )
  const user_level_project_req = fetch(
    `${GEOCONTRIB_API_URL}/user-level-projects`
  ).then(response => response.json())

  return Promise.all([user_info_req, user_level_project_req]).then(
    (res: any) => {
      const user_info = res[0]
      const user_level_project = res[1]
      const isProjectPage =
        window.location.pathname.indexOf('/geocontrib/projet/') > -1
      const project = isProjectPage
        ? window.location.pathname.match(/\/geocontrib\/projet\/([^/]*)/)?.[1]
        : null
      return {
        project: project,
        admin:
          user_info.user.is_administrator ||
          user_info.user.is_superuser ||
          (project && user_level_project[project] === 'Administrateur projet'),
      }
    }
  )
}
