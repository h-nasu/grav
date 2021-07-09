
var fs = require('fs');

var PouchDB = require('pouchdb');
var replicationStream = require('pouchdb-replication-stream');

PouchDB.plugin(replicationStream.plugin);
PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);


const db = new PouchDB('http://admin:admin@localhost:5984/gravias')

var ws = fs.createWriteStream('data/dump.txt');

db.dump(ws).then(function (res) {
  // res should be {ok: true}
  console.log(res)
});