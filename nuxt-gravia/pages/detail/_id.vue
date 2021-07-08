<template>
  <div>
    <v-btn @click="back">back</v-btn>
    {{ item.title }}
    <br>

    <div v-for="(image, index) in item.imageUrls" :key="index">
      <v-img
      :lazy-src="image"
      :src="image"
      ></v-img>
    </div>

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
  methods: {
    back () {
      this.$router.back()
    }
  }

}

</script>