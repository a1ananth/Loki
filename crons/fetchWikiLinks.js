import co from 'co';
import wiki from 'wikijs';
import Logger from '../logger';
import WebPagesLib from '../lib/webPages';
import WikipediaPagesLib from '../lib/wikiPages';

let running = false;

async function processLinks(webPages) {
  for (let webPage of webPages) {
    const url = webPage.url;

    let pageName = url.replace('http://en.wikipedia.org/wiki/', '');
    pageName = pageName.replace('https://en.wikipedia.org/wiki/', '');
    pageName = decodeURIComponent(pageName);

    Logger.debug('Fetching page from wikipedia: ' + pageName);

    let page;
    try {
      page = await wiki().page(pageName);
    } catch (err) {
      Logger.error('Failed to retrieve wiki page: ' + pageName, err);

      await WebPagesLib.updateOne(webPage._id, {
        lastCrawledDt: new Date(),
        isCrawlSuccess: false,
      });

      continue;
    }

    try {
      const categories = await page.categories();
      const content = await page.content();
      const rawContent = await page.rawContent();
      const coordinates = await page.coordinates();
      const fullInfo = await page.fullInfo();
      const images = await page.images();
      const mainImage = await page.mainImage();
      const summary = await page.summary();
      const pageUrl = await page.url();

      //Logger.debug('Fetched wiki page');
      //Logger.debug('------------------------------');
      //Logger.debug(categories);
      //Logger.debug('------------------------------');
      //Logger.debug(coordinates);
      //Logger.debug('------------------------------');
      //Logger.debug(fullInfo);
      //Logger.debug('------------------------------');
      //Logger.debug(images);
      //Logger.debug('------------------------------');
      //Logger.debug(mainImage);
      //Logger.debug('------------------------------');
      //Logger.debug(summary);
      //Logger.debug('------------------------------');
      //Logger.debug(pageUrl);
      //Logger.debug('------------------------------');
      //Logger.debug(content);
      //Logger.debug('------------------------------');
      //Logger.debug('------------------------------');

      let wikiPage = await WikipediaPagesLib.findByPageName(pageName);
      if (!wikiPage) {
        wikiPage = await WikipediaPagesLib.createNew({
          url: pageUrl,
          pageName,
          summary,
          categories,
          coordinates,
          fullInfo,
          images,
          mainImage,
          content,
          rawContent,
        });
      } else {
        await WikipediaPagesLib.updateOne(wikiPage._id, {
          url: pageUrl,
          summary,
          categories,
          coordinates,
          fullInfo,
          images,
          mainImage,
          content,
          rawContent,
        });
      }

      await WebPagesLib.updateOne(webPage._id, {
        lastCrawledDt: new Date(),
        isCrawlSuccess: true,
      });
    } catch (err) {
      Logger.error('Failed to retrieve wiki page info: ' + pageName, err);

      await WebPagesLib.updateOne(webPage._id, {
        lastCrawledDt: new Date(),
        isCrawlSuccess: false,
      });
    } finally {
      Logger.debug('Fetching page from wikipedia: ' + pageName + ' complete');
    }
  }
}

export default function fetchWikiLinks() {
  if (running) {
    return;
  }

  running = true;
  co(function*() {
    let webPages = yield WebPagesLib.findByConds({
      url: new RegExp('en.wikipedia.org', 'i'),
      $or: [{
        lastCrawledDt: {
          $exists: 0,
        },
      }, {
        lastCrawledDt: null,
      }],
    });

    if (webPages.length) {
      Logger.debug('Found ' + webPages.length + ' web pages to process');
      //webPages = [webPages[0]];
      //Logger.debug('Limiting web pages to first');
      yield processLinks(webPages);
    }

    running = false;
  }).catch((err) => {
    Logger.error('Failed to fetch wiki links', err);
    running = false;
  })
}
