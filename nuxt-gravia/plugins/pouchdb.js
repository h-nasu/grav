import NuxtConfig from '~/nuxt.config.js'
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
PouchDB.plugin(PouchDBFind)

import PouchDBLoad from 'pouchdb-load'
PouchDB.plugin(PouchDBLoad)

export default ({ app }, inject) => {
  const pdb = new PouchDB(NuxtConfig.maindb)
  inject('pdb', pdb)

  const fdb = new PouchDB(NuxtConfig.favoritedb)
  inject('fdb', fdb)
}