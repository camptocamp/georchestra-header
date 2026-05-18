import { defineCustomElement } from 'vue'
import Header from './header.ce.vue'
import { initMatomo } from './matomo'

const nonce = document.currentScript?.nonce
const HeaderCE = defineCustomElement(Header, { nonce })
customElements.define('geor-header', HeaderCE)

initMatomo()