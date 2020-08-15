import mongoose from 'mongoose';
import { merge } from 'lodash';
import WikipediaPage from './models/WikipediaPage';

const WikipediaPagesLib = {};

WikipediaPagesLib.findById = (_id) => {
  return WikipediaPage.findOne({
    _id,
  });
};

WikipediaPagesLib.findByPageName = (pageName) => {
  return WikipediaPage.findOne({
    pageName,
  });
};

WikipediaPagesLib.createNew = (wikipediaPageData) => {
  const wikipediaPage = new WikipediaPage();
  wikipediaPage._id = new mongoose.Types.ObjectId;
  merge(wikipediaPage, wikipediaPageData);
  return wikipediaPage.save();
};

WikipediaPagesLib.updateOne = (_id, updateData) => {
  if (!updateData.updatedAt) {
    updateData.updatedAt = new Date();
  }

  return WikipediaPage.updateOne({
    _id,
  }, {
    $set: updateData,
  });
};

export default WikipediaPagesLib;
