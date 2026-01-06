<script setup lang="ts">
const props = defineProps<{
  geocontribPermissions?: any
  isAnonymous: boolean
}>()

function locationEndsWith(end: string): boolean {
  return window.location.href.endsWith(end)
}

function geocontribProjectPathname(): string {
  return `/geocontrib/projet/${props.geocontribPermissions?.project}`
}
</script>

<template>
  <ul
    class="flex items-center py-3 gap-3 geocontrib"
    v-if="!props.isAnonymous && props.geocontribPermissions?.project"
  >
    <li
      v-if="props.geocontribPermissions?.project"
      :class="{
        active: locationEndsWith(geocontribProjectPathname()),
      }"
    >
      <a :href="geocontribProjectPathname()">Accueil</a>
    </li>
    <li
      v-if="props.geocontribPermissions?.project"
      :class="{ active: locationEndsWith('/signalement/lister') }"
    >
      <a :href="geocontribProjectPathname() + '/signalement/lister'"
        >Liste & Carte</a
      >
    </li>
    <li
      :class="{
        active: locationEndsWith('/administration-carte'),
      }"
    >
      <a
        v-if="
          props.geocontribPermissions?.project &&
          props.geocontribPermissions?.admin
        "
        :href="geocontribProjectPathname() + '/administration-carte'"
        >Fonds cartographiques</a
      >
    </li>
    <li :class="{ active: locationEndsWith('/membres') }">
      <a
        v-if="
          props.geocontribPermissions?.project &&
          props.geocontribPermissions?.admin
        "
        :href="geocontribProjectPathname() + '/membres'"
      >
        Membres</a
      >
    </li>
  </ul>
</template>
