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
          throw new Error('User does not exist in the database.');
        }
        return true;
      }
    }
  },
  meta_key: {
    in: ['body'],
    isLength: {
      errorMessage: 'Meta key should be less than 255 chars long.',
      options: { max: 255 }
    }
  },
  meta_name: {
    in: ['body'],
    isLength: {
      errorMessage: 'Meta name should be less than 255 chars long.',
      options: { max: 255 }
    }
  },
  meta_type: {
    in: ['body'],
    custom: {
      options: async metaType => {
        if (_.includes(settingModel.settingMetaType, metaType) === false) {
          throw new Error('Meta type must be valid.');
        }
        return true;
      }
    }
  },
  meta_desc: {
    in: ['body']
  },
  meta_attribute: {
    in: ['body'],
    custom: {
      options: async (metaAttribute, { req }) => {
        switch (req.body.meta_type) {
          case 'select':
            try {
              JSON.parse(metaAttribute);
            } catch (e) {
              throw new Error('Meta attribute must be valid JSON.');
            }
            break;
          case 'number':
          case 'text':
            break;
          default:
            throw new Error('Meta attribute cannot be processed.');
        }
        return true;
      }
    }
  },
  meta_value: {
    in: ['body'],
    custom: {
      options: async (metaValue, { req }) => {
        switch (req.body.meta_type) {
          case 'select':
            break;
          case 'number':
            if (_.isNumber(metaValue) === false) {
              throw new Error('Meta value must be a number');
            }
            break;
          case 'text':
            break;
          default:
            throw new Error('Meta attribute cannot be processed.');
        }
        return true;
      }
    }
  },
  is_public: {
    in: ['body'],
    custom: {
      options: async isPublic => {
        if (isPublic !== 1 && isPublic !== 0) {
          throw new Error('Is public must be valid.');
        }
        return true;
      }
    }
  }
};
