<template>
  <div>
    Favorite
    <br>

    <v-row>
      <v-col
      v-for="(image, index) in favorites"
      :key="index"
      class="d-flex child-flex"
      xs="12"
      sm="6"
      lg="4"
      >
        <v-img
        :lazy-src="image"
        :src="image"
        >

          <div class="image_overlay">
            <v-icon
              large
              color="white"
              @click="del(image)"
            >
              mdi-delete
            </v-icon>
          </div>

        </v-img>

      </v-col>
    </v-row>

  </div>
</template>

<script>
export default {
  data () {
    return {
      favorites: []
    }
  },
  async mounted () {
    this.getAll()
  },
  methods: {
    async getAll () {
      let res = await this.$fdb.allDocs()
      if (res.rows) {
        this.favorites = res.rows.map(r => r.id)
      }
    },
    async del (imageUrl) {
      const res = confirm("削除？ "+imageUrl)
      if (res) {
        try {
          let doc = await this.$fdb.get(imageUrl)
          await this.$fdb.remove(doc)
          this.getAll()
        } catch(e) {}

      }
    }
  }

}

</script>

<style>

.image_overlay {
  position: absolute;
  right: 0;
  bottom: 0;
}

</style>
