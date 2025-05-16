<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'

const route = useRoute()
const id = route.params.id
</script>

<template>
  <header>
    <img alt="logo" class="logo" src="@/assets/logo.png" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="Librarybooks reader page" />
       <nav>
        <RouterLink v-if="$route.params.id == undefined" to="/">Login</RouterLink>
        <RouterLink v-if="$route.params.id != undefined" :to="`/${$route.params.id}`">Wellcome</RouterLink>
        <RouterLink v-if="$route.params.id != undefined" :to="`/${$route.params.id}/sach`">Sách</RouterLink>
        <RouterLink v-if="$route.params.id != undefined" :to="`/${$route.params.id}/themuonsach`">Theo dõi mượn sách</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 14px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  font-weight: bold;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  text-decoration: none;
  color: inherit;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 4);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
