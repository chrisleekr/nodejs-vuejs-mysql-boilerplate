const _ = require('lodash');
const settingModel = require('../../../models/settingModel');

module.exports = {
  meta_key: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'Meta key must be provided.',
      negated: true
    },
    isLength: {
      errorMessage: 'Meta key should be less than 255 chars long.',
      options: { max: 255 }
    }
  },
  meta_name: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'Meta name must be provided.',
      negated: true
    },
    isLength: {
      errorMessage: 'Meta name should be less than 255 chars long.',
      options: { max: 255 }
    }
  },
  meta_type: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'Meta type must be provided.',
      negated: true
    },
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
            if (_.isNull(metaAttribute) === false) {
              throw new Error(`Meta attribute does not require for meta type '${req.body.meta_type}'.`);
            }
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
    isEmpty: {
      errorMessage: 'Is public must be provided.',
      negated: true
    },
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
