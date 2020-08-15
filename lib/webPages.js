import mongoose from 'mongoose';
import { merge } from 'lodash';
import WebPage from './models/WebPage';

const WebPagesLib = {};

WebPagesLib.findByConds = (conds) => {
  return WebPage.find(conds);
};

WebPagesLib.findById = (_id) => {
  return WebPage.findOne({
    _id,
  });
};

WebPagesLib.findByIds = (ids) => {
  return WebPage.find({
    _id: {
      $in: ids,
    },
  });
};

WebPagesLib.findMatchingURLs = (urlPattern) => {
  return WebPage.find({
    url: new RegExp(urlPattern, 'i'),
  });
};

WebPagesLib.findByUrl = (url) => {
  return WebPage.findOne({
    url,
  });
};

WebPagesLib.createNew = (webPageData) => {
  const webPage = new WebPage();
  webPage._id = new mongoose.Types.ObjectId;
  merge(webPage, webPageData);
  return webPage.save();
};

WebPagesLib.createFromSearchResults = async (searchResults) => {
  const webPageIds = [];

  for (const result of searchResults) {
    if (!result.url) {
      continue;
    }

    let webPage = await WebPagesLib.findByUrl(result.url);
    if (!webPage) {
      webPage = await WebPagesLib.createNew({
        url: result.url,
        title: result.title,
        description: result.description,
      });
    } else {
      // Webpage record already exists
      // TODO Decide if update data is required
    }

    webPageIds.push(webPage._id);
  }

  return webPageIds;
};

WebPagesLib.mergeIds = (oldIds, newIds) => {
  if (!oldIds.length) {
    return newIds;
  }

  const oldIdsStr = oldIds.map(t => t.toString());
  const newIdsStr = oldIds.map(t => t.toString());

  const finalIds = newIds;
  oldIds.forEach((oldId, idx) => {
    if (newIdsStr.indexOf(oldIdsStr[idx]) === -1) {
      finalIds.push(oldId);
    }
  });

  return finalIds;
};


WebPagesLib.updateOne = (_id, updateData) => {
  if (!updateData.updatedAt) {
    updateData.updatedAt = new Date();
  }

  return WebPage.updateOne({
    _id,
  }, {
    $set: updateData,
  });
};

export default WebPagesLib;
