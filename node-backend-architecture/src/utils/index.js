const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectIdMongodb = id => {
  return new Types.ObjectId(id)
};

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = object => {
  Object.keys(object).forEach(key => {
    if (object[key] === undefined
      || object[key] === null) delete object[key]
  })

  return object
}

const updateNestedObjectParser = obj => {
  const final = {}
  Object.keys(obj).forEach(i => {
    if (typeof obj[i] === 'object' && !Array.isArray(obj[i])) {
      const response = updateNestedObjectParser(obj[i])
      Object.keys(obj[i]).forEach(j => {
        final[`${i}.${j}`] = response[j]
      })
    } else {
      final[i] = obj[i]
    }
  })

  return final;
}

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb
}