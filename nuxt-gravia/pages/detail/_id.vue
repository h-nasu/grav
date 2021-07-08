<template>
  <div>
    {{ item.title }}
    <br>

    <v-row>
      <v-col
      v-for="(image, index) in item.imageUrls"
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
              :color="getColor(image)"
              @click="addDel(image)"
            >
              mdi-star
            </v-icon>
          </div>

        </v-img>

      </v-col>
    </v-row>

  </div>
</template>

<script>
export default {
  async asyncData({params, $pdb}) {
    const item = await $pdb.get(params.id)
    return {
      id: params.id,
      item: item
    }
  },
  data () {
    return {
      inFavorites: []
    }
  },
  created () {
    this.checkImageFavorites()
  },
  methods: {
    async checkImageFavorites () {
      this.inFavorites = []
      for (let i in this.item.imageUrls) {
        const imageUrl = this.item.imageUrls[i]
        try {
          let res = await this.$fdb.get(imageUrl)
          this.inFavorites.push(imageUrl)
        } catch (e) {
          //
        }
      }
    },
    getColor (imageUrl) {
      return this.inFavorites.indexOf(imageUrl) > -1 ? 'blue lighten-1' : 'white'
    },
    async addDel (imageUrl) {
      let res = null
      try {
        res = await this.$fdb.get(imageUrl)
      } catch (e) {}

      if (!res) {
        var doc = {
          "_id": imageUrl,
          "name": imageUrl
        };
        await this.$fdb.put(doc)
      } else {
        await this.$fdb.remove(res)
      }

      this.checkImageFavorites()

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