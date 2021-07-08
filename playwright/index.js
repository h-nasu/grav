const fs = require('fs');
const PouchDB = require('pouchdb');
const { chromium } = require('playwright');


function writeToFile(path, data) {
  fs.writeFile(__dirname + path, JSON.stringify(data, null, 4), (err) => {
    if (err) {
      console.error(err);
      return;
    };
    console.log("File has been created");
  });
}

let pageData = [];

(async () => {
/*
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
    devtools: true
  });
*/
  const browser = await chromium.launch();
  const db = new PouchDB('http://admin:admin@localhost:5984/gravias')
  var info = await db.info()
  console.log(info)

  const page = await browser.newPage();
  await page.goto('http://www.shame.tokyo/shame/');
  await page.click('.more-link');

  const elLastPage = await page.waitForSelector('.pagenavi a:last-child');
  const pageNum = await elLastPage.innerText();

  for (let p = parseInt(pageNum); p > 0; p-- ) {
    console.log('Current Page: '+p);
    // Go to last post list
    try {
      await page.goto('http://www.shame.tokyo/shame/page/'+p);

      // Get each post detail
      const posts = await page.$$('.box .post .post-title a');
      const regex = /[0-9]+$/g;
      for (let i in posts) {
        const post = posts[i];
        const href = await post.getAttribute('href');
        const text = await post.innerText();
        pageData.push({
          _id: href.match(regex)[0],
          title: text
        });
      }
    } catch (e) {
      console.log('Error Page: '+p)
      console.log(e)
    }

  }


  // Get Post Images
  for (let i in pageData) {
    let pd = pageData[i];
    let imageUrls = [];

    console.log('Current Archive: '+pd._id);

    // Blacklist
    if (
      pd._id == "4657"
      || pd._id ==  "8130"
      || pd._id ==  "10209"
      || pd._id ==  "10664"
    ) {
      console.log('Black List');
      continue;
    }

    try {
      let res = await db.get(pd._id);
      if (res._id) {
        console.log('Already Have');
        continue;
      }
    } catch (e) {
      console.log(e)
    }

    try {
      await page.goto('http://www.shame.tokyo/shame/archives/'+pd._id);
      await page.waitForSelector('.content');

      while (true) {

        //const elImages = await page.$$('.content p img');
        const elImages = await page.$$('.content img');
        for (let i2 in elImages) {
          const elImage = elImages[i2];
          const imageUrl = await elImage.getAttribute('src');
          imageUrls.push(imageUrl)
        }

        let next = await page.$('.content a:text("次")');
        if (!next) {
          break;
        }

        await next.click();
        await page.waitForSelector('.content');
      }

      pd.imageUrls = imageUrls
      await db.put(pd);

    } catch (e) {
      console.log('Error Archive: '+pd._id);
      console.log(e);
    }

  }

  //console.log(pageData)
  //writeToFile('/data/gravia.json', pageData)

/*
  await page.evaluate((elTest) => {
    console.log(elTest);
    test = elTest;
  }, posts);
*/

  console.log('Finish');
  await browser.close();

})();