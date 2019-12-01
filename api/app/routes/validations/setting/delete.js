const _ = require('lodash');
const settingModel = require('../../../models/settingModel');

module.exports = {
  id: {
    in: ['params'],
    isNumeric: {
      errorMessage: 'ID must be number',
      options: { no_symbols: true }
    },
    custom: {
      options: async settingId => {
        // Retrieve the setting
        const setting = await settingModel.getOne({
          searchOptions: { id: settingId }
        });

        // If requested setting does not exist, then return error
        if (_.isEmpty(setting)) {
          throw new Error('Setting does not exist in the database.');
        }
        return true;
      }
    }
  }
};
