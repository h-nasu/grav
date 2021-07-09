<template>
  <div>
    <v-card>
      <v-card-title>
        Gravia <v-btn class="ml-3" to="favorite">favorite</v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-btn color="info" @click="doSearch">search</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :server-items-length="total"
        :search="search"
        :options.sync="options"
        :loading="loading"
      >
        <template
          v-slot:body="{ items }"
        >
          <tbody>
            <tr
              v-for="item in items"
              :key="item.name"
            >
            <td>
              <n-link :to="`/detail/${item._id}`">
                {{ item._id }}
              </n-link>
            </td>
              <td>
                {{ item.title }}
              </td>
              <td>
                <n-link :to="`/detail/${item._id}`">
                  <v-img
                    v-if="item.imageUrls.length > 0"
                    :lazy-src="item.imageUrls[0]"
                    :src="item.imageUrls[0]"
                    max-width="100"
                  ></v-img>
                </n-link>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>

      <v-btn @click="importdb">import db</v-btn>
    </v-card>
  </div>
</template>

<script>

export default {
  data () {
    return {
      search: '',
      loading: true,
      options: {},
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: '_id',
        },
        { text: 'Title', value: 'title' },
        { text: 'Image', value: 'imageUrls', sortable: false, },
      ],
      items: [],
      total: 0,
      currentPage: 1,

    }
  },
  async mounted () {

    const info = await this.$pdb.info()
    console.log(info)
    this.total = info.doc_count
    await this.$pdb.createIndex({
      index: {fields: ['title']}
    })

    const info2 = await this.$fdb.info()
    console.log(info2)

    if (this.$store.state.items.searchParams.options) {
      this.options = this.$store.state.items.searchParams.options
      this.search = this.$store.state.items.searchParams.search
    } else {
      this.getDataFromApi()
    }

  },
  watch: {
    options: {
      handler () {
        this.getDataFromApi()
      },
      deep: true,
    },
  },
  methods: {
    getDataFromApi () {
      this.loading = true
      this.apiCall().then(data => {
        this.items = data.items
        this.loading = false

        this.updateSearchParams(this.options)
      })
    },
    /**
     * In a real application this would be a call to fetch() or axios.get()
     */
    apiCall () {
      return new Promise(async (resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options

        let queryParams = {_id: {$gte: null}}
        let sort = ['_id']

        if (sortBy[0]) {
          queryParams[sortBy[0]] = {$gte: null}
          let sb = {}
          sb[sortBy[0]] = sortDesc[0] ? 'desc' : 'asc'
          sort = [sb]

        }
        if (this.search) {
          //queryParams['title'] = {$regex: `${ RegExp(this.search) }`}
          queryParams['title'] = {$regex: `(?i)${this.search}`}
        }
        let res = await this.$pdb.find({
          selector: queryParams,
          sort: sort,
          limit: itemsPerPage,
          skip: itemsPerPage * (page - 1)
        })

        if (res.docs) {
          this.currentPage = page
          resolve({
            items: res.docs
          })
        } else {
          reject()
        }

      })
    },

    doSearch () {
      this.getDataFromApi()
    },

    updateSearchParams (value) {
      this.$store.commit('items/updateSearchParams', {
        options: value,
        search: this.search
      })
    },

    importdb () {
      const self = this
      this.$pdb.load('/data/dump.txt').then(function () {
        location.reload()
      }).catch(function (err) {
        // HTTP error or something like that
        alert('import error')
        console.log(err)
      });
    }


  }

}
</script>