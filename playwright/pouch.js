
const PouchDB = require('pouchdb');


/*
var db = new PouchDB('http://localhost:5984/kittens');

db.info().then(function (info) {
  console.log(info);
})
*/

async function start() {
  try {
    var db = new PouchDB('http://admin:admin@localhost:5984/kittens')

    var info = await db.info()
    console.log(info)

    //const delMittens = await db.get('mittens');
    //const del = await db.remove(delMittens);

    //console.log(del);


    try {
      let t = await db.get('mittens')
      console.log(e)
    } catch (e) {
      console.log('errrrrrr')
      console.log(e)
    }


    var doc = {
      "_id": "mittens",
      "name": "Mittens",
      "occupation": "kitten",
      "age": 3,
      "hobbies": [
        "playing with balls of yarn",
        "chasing laser pointers",
        "lookin' hella cute"
      ]
    };
    const resp = await db.put(doc);

    console.log(resp);

    const mittens = await db.get('mittens');

    console.log(mittens);


  } catch(e) {
    console.log(e)
  }
}

start()
