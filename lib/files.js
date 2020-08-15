import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { merge } from 'lodash';
import File from './models/File';
import cfg from "../cfg";
import Logger from '../logger';
import { sha1File } from './helpers';

const FilesLib = {};

FilesLib.findById = (_id) => {
  return File.findOne({
    _id,
  });
};

FilesLib.findByLink = async (link) => {
  return await File.findOne({
    link,
  });
};

FilesLib.findBySha1File = async (sha1File) => {
  return await File.findOne({
    sha1File,
  });
};

FilesLib.createNew = (fileObjectData) => {
  const fileObject = new File();
  fileObject._id = new mongoose.Types.ObjectId;
  merge(fileObject, fileObjectData);
  return fileObject.save();
};

FilesLib.updateOne = (fileObjectId, fileObjectData) => {
  fileObjectData.updatedAt = new Date();
  return File.updateOne({
    _id: fileObjectId,
  }, {
    $set: fileObjectData,
  });
};

FilesLib.updateMany = (conds, fileObjectData) => {
  fileObjectData.updatedAt = new Date();
  return File.updateMany(conds, {
    $set: fileObjectData,
  });
};

FilesLib.moveFile = async (tmpFilePath, targetFileName) => {
  return new Promise((resolve, reject) => {
    const targetFilePath = `${cfg.uploads.path}${targetFileName}`;

    fs.rename(tmpFilePath, targetFilePath, (err) => {
      if (err) {
        return reject(err);
      }

      const storageDetails = {
        storage: 'local',
        localFilePath: targetFilePath,
      };

      return resolve(storageDetails);
    });
  });
};

FilesLib.createFromFile = async (file) => {
  let fileType;

  let fileExtension = path.extname(file.originalname);
  let mimeType = file.mimetype;

  if (cfg.uploads.allowed_image_types.indexOf(mimeType) !== -1) {
    fileType = 'photo';

    if (file.size > cfg.uploads.max_sizes.photo) {
      throw new Error('Image file size above limit');
    }
  } else if (cfg.uploads.allowed_video_types.indexOf(mimeType) !== -1) {
    fileType = 'video';

    if (file.size > cfg.uploads.max_sizes.video) {
      throw new Error('Video file size above limit');
    }
  } else if (cfg.uploads.allowed_audio_types.indexOf(mimeType) !== -1) {
    fileType = 'audio';

    if (file.size > cfg.uploads.max_sizes.audio) {
      throw new Error('Audio file size above limit');
    }
  } else if (cfg.uploads.allowed_document_types.indexOf(fileExtension) !== -1) {
    fileType = 'document';

    if (file.size > cfg.uploads.max_sizes.document) {
      throw new Error('Document file size above limit');
    }
  } else {
    Logger.error('Uploaded file type is invalid, mime type was: ' + mimeType + ' & extension was: ' + fileExtension);
    throw new Error('Uploaded file type is invalid');
  }

  const filePath = file.path;

  const fileHash = await sha1File(filePath);
  let fileObject = await FilesLib.findBySha1File(fileHash);
  const targetFileName = fileHash + fileExtension;

  if (fileObject) {
    Logger.warn('This file was already uploaded before');

    // It could have expired maybe, somebody could be reuploading so upload
    if (!fileObject.storageDetails) {
      fileObject.storageDetails = await FilesLib.moveFile(filePath, targetFileName);
      await fileObject.save();
    }
  } else {
    const storageDetails = await FilesLib.moveFile(filePath, targetFileName);

    const fileObjectData = {
      originalFileName: file.originalname,
      sha1File: fileHash,
      fileSize: file.size,
      mimeType,
      fileType,
      storageDetails,
    };

    fileObject = await FilesLib.createNew(fileObjectData);

    // Do in background
    FilesLib.createThumbnailImages(fileObject);
    // Do in background
    // TODO Set metadata like video duration, image sizes etc
  }

  return fileObject;
};

FilesLib.createThumbnailImages = (fileObject) => {
  // TODO Image magick and creation of thumbnails
};

export default FilesLib;
