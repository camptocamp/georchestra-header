interface MenuItem {
  type?: string
  //Role required to display the item, can end with a star to match prefixed roles (e.g. ROLE_SUPERSET_*)
  hasRole?: string
  //Role which hides the item
  blockedRole?: string
  //If the item is hidden in mobile mode
  hideMobile?: boolean
}

export interface Link extends MenuItem {
  label: string
  //URL to redirect to
  url: string
  //i18n key to display the label
  i18n?: string
  //to trigger the active tab (underline). By default, it triggers on start with e.g /console (start:/console) will trigger on /console** pages
  // Values can be 'start', 'exact', 'includes', 'end'
  activeAppUrl?: string
  //Icon to display next to the label
  icon?: string
  //If the link is clickable
  disabled?: boolean
}

export interface Dropdown extends MenuItem {
  label: string
  //i18n key to display the label
  i18n?: string
  //List of items to display in the dropdown
  items?: Array<Link>
}

export interface Separator extends MenuItem {}

export interface Config {
  //Logo url to display in the header
  logoUrl?: string
  //Title to the logo displayed in the header
  logoTitle?: string
  //Whether to hide the login button
  hideLogin?: boolean
  //Custom stylesheet to apply to the header
  stylesheet?: string
  //Link to icons url. Tested with https://cdn.jsdelivr.net/gh/iconoir-icons/iconoir@main/css/iconoir.css
  iconsUrl?: string
  //Force header's language
  lang?: string
  //Login URL to redirect to
  login: { url: string; params?: Array<{ [key: string]: string }> }
  //Logout URL to redirect to
  logoutUrl: string
  //Use it if you want a different logout URL for external authentication providers
  logoutExternalUrl?: string
  //CGU links
  cgus: {
    lang: {
      [code: string]: string
      default: string
    }
    excludedUrls: string[]
  }
}
