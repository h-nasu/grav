import NuxtConfig from '~/nuxt.config.js'
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
PouchDB.plugin(PouchDBFind)

export default ({ app }, inject) => {
  const pdb = new PouchDB(NuxtConfig.maindb)
  inject('pdb', pdb)
}