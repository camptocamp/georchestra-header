export function initMatomo(): void {
  const _mtm = ((window as any)._mtm = (window as any)._mtm || [])
  _mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' })

  const d = document
  const g = d.createElement('script')
  const s = d.getElementsByTagName('script')[0]
  g.async = true
  g.src = 'https://piwik.grandest.fr/piwik/js/container_X2XeHlk4.js'
  s.parentNode!.insertBefore(g, s)
}
