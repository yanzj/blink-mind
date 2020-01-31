import { BaseCanvasModelModifierArg } from '@blink-mind/core';
import { swap } from '@blink-mind/renderer-react';
import { List } from 'immutable';
import {
  ExtDataImages,
  ImageRecord,
  TopicImageRecord
} from './ext-data-images';
import { EXT_DATA_KEY_IMAGES } from './utils';

export function addImage({
  model,
  topicKey,
  image
}: BaseCanvasModelModifierArg & {
  image: ImageRecord;
}) {
  let extData = model.getExtDataItem(EXT_DATA_KEY_IMAGES, ExtDataImages);
  const topicImage = new TopicImageRecord({
    key: image.key,
    width: image.width,
    height: image.height
  });
  extData = extData
    .update('images', images => images.set(image.key, image))
    .update('topics', topics => {
      if (!topics.has(topicKey)) {
        return topics.set(topicKey, List([topicImage]));
      } else {
        const imgData = topics.get(topicKey).find(v => v.key === image.key);

        if (imgData != null) return topics;
        return topics.update(topicKey, list => list.push(topicImage));
      }
    });
  model = model.setIn(['extData', EXT_DATA_KEY_IMAGES], extData);
  return model;
}

export function deleteTopicImage({ model, topicKey, imageKey }) {
  let extData = model.getExtDataItem(EXT_DATA_KEY_IMAGES, ExtDataImages);
  extData = extData.updateIn(['topics', topicKey], list =>
    list.delete(list.findIndex(v => v.key === imageKey))
  );
  if (getUsedImageKeyTopicCount(extData, imageKey) === 0) {
    extData = extData.update('images', images => images.delete(imageKey));
  }
  model = model.setIn(['extData', EXT_DATA_KEY_IMAGES], extData);
  return model;
}

export function addTopicImage({ model, topicKey, imageKey }) {
  let extData = model.getExtDataItem(EXT_DATA_KEY_IMAGES, ExtDataImages);
  const image = extData.images.get(imageKey);
  if (image == null) {
    throw new Error(`imageKey ${imageKey} not exist`);
  }
  let topicData = extData.topics.get(topicKey) || List();
  if (topicData.find(v => v.key === imageKey) == null) {
    topicData = topicData.push(
      new TopicImageRecord({
        key: imageKey,
        width: image.width,
        height: image.height
      })
    );
    extData = extData.update('topics', topics =>
      topics.set(topicKey, topicData)
    );
    model = model.setIn(['extData', EXT_DATA_KEY_IMAGES], extData);
  }
  return model;
}

export function setTopicImage({ model, topicKey, imageKey, imageData }) {
  let extData = model.getExtDataItem(EXT_DATA_KEY_IMAGES, ExtDataImages);
  let topicData = extData.topics.get(topicKey);
  if (topicData == null) {
    throw new Error(`topicKey ${topicKey} does not has imageData`);
  }
  if (topicData.find(v => v.key === imageKey) == null) {
    throw new Error(
      `topicKey ${topicKey} does not has imageData of key ${imageKey}`
    );
  }
  const index = topicData.findIndex(v => v.key === imageKey);
  topicData = topicData.update(index, topicImage =>
    topicImage.merge(imageData)
  );
  extData = extData.update('topics', topics => topics.set(topicKey, topicData));
  model = model.setIn(['extData', EXT_DATA_KEY_IMAGES], extData);
  return model;
}

export function moveTopicImage({ model, topicKey, imageKey, moveDir }) {
  let extData = model.getExtDataItem(EXT_DATA_KEY_IMAGES, ExtDataImages);
  let topicData = extData.topics.get(topicKey);
  const index = topicData.findIndex(v => v.key === imageKey);
  if (moveDir === 'up') {
    topicData = swap(topicData, index, index - 1);
  } else {
    topicData = swap(topicData, index, index + 1);
  }
  extData = extData.update('topics', topics => topics.set(topicKey, topicData));
  model = model.setIn(['extData', EXT_DATA_KEY_IMAGES], extData);
  return model;
}

export function getUsedImageKeyTopicCount(
  extData: ExtDataImages,
  imageKey: KeyType
) {
  let count = 0;
  extData.topics.forEach(v => {
    if (v.find(v => v.key === imageKey)) count++;
  });
  return count;
}
