import mongoose from 'mongoose';
import { merge } from 'lodash';
import AppConfig from './models/AppConfig';

const AppConfigLib = {};

let appConfig = null;

AppConfigLib.getConfiguration = async () => {
  if (appConfig !== null) {
    return appConfig;
  }

  let appConfig2 = await AppConfig.findOne({});
  if (!appConfig2) {
    appConfig2 = await AppConfigLib.createNew();
  }

  appConfig = appConfig2;
  return AppConfig.findOne({});
};

AppConfigLib.createNew = (configData) => {
  const appConfig = new AppConfig();
  appConfig._id = new mongoose.Types.ObjectId;
  merge(appConfig, configData);
  return appConfig.save();
};

AppConfigLib.update = async (updateData) => {
  if (!updateData.updatedAt) {
    updateData.updatedAt = new Date();
  }

  await AppConfig.updateOne({}, {
    $set: updateData,
  });

  appConfig = await AppConfig.findOne({});
  return appConfig;
};

export default AppConfigLib;
