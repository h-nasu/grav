export const state = () => ({
  searchParams: {},
  searchResults: []
})

export const mutations = {
  updateSearchParams (state, searchParams) {
    state.searchParams = searchParams
  },
  updateSearchResults (state, searchResults) {
    state.searchResults = searchResults
  },
}