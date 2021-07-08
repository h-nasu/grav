<template>
  <v-app>


    <v-main>
      <v-container>
        <Nuxt />

        <v-btn
          v-if="$nuxt.$route.name != 'index'"
          fab
          fixed
          bottom
          right
          @click="back">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

      </v-container>
    </v-main>

    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      fixed: false,
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
  }
}
</script>
