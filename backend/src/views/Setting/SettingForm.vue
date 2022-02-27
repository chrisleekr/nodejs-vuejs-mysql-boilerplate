<template>
  <div class="page-class page-setting-form">
    <h1 class="page-title">{{ title }}</h1>
    <div>
      <div v-if="loading || !formLoaded">
        <span class="spinner"></span>
      </div>
      <div v-if="!loading && formLoaded">
        <b-form @submit.stop.prevent="onSubmit">
          <b-form-group id="group-meta-key" label-for="input-meta-key">
            <template v-slot:label>
              Key
              <span class="text-danger">*</span>
            </template>
            <b-form-input
              id="input-meta-key"
              v-model="form.metaKey"
              type="text"
              placeholder="Enter key"
              :state="$v.form.metaKey.$dirty ? !$v.form.metaKey.$error : null"
            ></b-form-input>

            <b-form-text id="input-meta-key-help"
              >Key is the identifier of the setting. It requires to be only string, no space or special characters
              except _ (underscore). Maximum length 100 characters.</b-form-text
            >

            <b-form-invalid-feedback id="input-meta-key-invalid"
              >Please enter a valid key. i.e. local_timezone</b-form-invalid-feedback
            >
          </b-form-group>
          <b-form-group id="group-meta-name" label-for="input-meta-name">
            <template v-slot:label>
              Name
              <span class="text-danger">*</span>
            </template>
            <b-form-input
              id="input-meta-name"
              v-model="form.metaName"
              type="text"
              placeholder="Enter name"
              :state="$v.form.metaName.$dirty ? !$v.form.metaName.$error : null"
            ></b-form-input>

            <b-form-text id="input-meta-name-help"
              >Name is the name of the setting. Maximum length 200 characters..</b-form-text
            >

            <b-form-invalid-feedback id="input-meta-name-invalid">Please enter a valid name.</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group id="group-meta-type" label-for="input-meta-type">
            <template v-slot:label>
              Type
              <span class="text-danger">*</span>
            </template>

            <b-form-select
              id="input-meta-type"
              v-model="form.metaType"
              :options="metaTypes"
              :state="$v.form.metaType.$dirty ? !$v.form.metaType.$error : null"
            ></b-form-select>

            <b-form-text id="input-meta-type-help"
              >Type is the type of the setting. Select - the meta attribute needs to be configured as JSON format to
              provide selection of setting value. Number - the meta value will be validated as numeric format. Text -
              the meta value will be accepted any value.</b-form-text
            >

            <b-form-invalid-feedback id="input-meta-type-invalid">Please select a valid type.</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group id="group-meta-desc" label-for="input-meta-desc">
            <template v-slot:label>Description</template>
            <b-form-textarea
              id="input-meta-desc"
              v-model="form.metaDesc"
              placeholder="Enter description"
              rows="3"
              max-rows="6"
              :state="$v.form.metaDesc.$dirty ? !$v.form.metaDesc.$error : null"
            ></b-form-textarea>

            <b-form-text id="input-meta-desc-help"
              >Description is to describe what the setting is about. Maximum length 1000 characters.</b-form-text
            >

            <b-form-invalid-feedback id="input-meta-desc-invalid"
              >Please enter a valid description.</b-form-invalid-feedback
            >
          </b-form-group>

          <b-form-group id="group-meta-attribute" label-for="input-meta-attribute" v-if="form.metaType === 'select'">
            <template v-slot:label>Attributes</template>

            <b-form-textarea
              id="input-meta-attribute"
              v-model="form.metaAttribute"
              placeholder="Enter select attribute"
              rows="3"
              max-rows="6"
              :state="$v.form.metaAttribute.$dirty ? !$v.form.metaAttribute.$error : null"
            ></b-form-textarea>

            <b-form-text id="input-meta-attribute-help"
              >Attribute is JSON format that list up selection values for 'Select' type. Recommend to use
              http://www.jsoneditoronline.org/ for modifying JSON. Sample JSON: {"list":[{"value":"SAMPLE
              VALUE1","text":"SAMPLE LABEL 1"},{"value":"SAMPLE VALUE2","text":"SAMPLE LABEL 2"}]}</b-form-text
            >

            <b-form-invalid-feedback id="input-meta-attribute-invalid"
              >Please enter a valid key.</b-form-invalid-feedback
            >
          </b-form-group>

          <b-form-group id="group-meta-value" label-for="input-meta-value">
            <template v-slot:label>
              Value
              <span class="text-danger">*</span>
            </template>

            <b-form-select
              v-if="form.metaType === 'select'"
              id="input-meta-value"
              v-model="form.metaValue"
              :options="metaSelectValues"
              :state="$v.form.metaValue.$dirty ? !$v.form.metaValue.$error : null"
            ></b-form-select>

            <b-form-input
              v-if="form.metaType === 'number' || form.metaType === 'text'"
              id="input-meta-value"
              v-model="form.metaValue"
              type="text"
              placeholder="Enter value"
              :state="$v.form.metaValue.$dirty ? !$v.form.metaValue.$error : null"
            ></b-form-input>

            <b-form-text id="input-meta-value-help"></b-form-text>

            <b-form-invalid-feedback id="input-meta-value-invalid"
              >Please enter a valid attribute.</b-form-invalid-feedback
            >
          </b-form-group>

          <b-form-group id="group-is-public" label-for="input-is-public">
            <template v-slot:label>
              Is public?
              <span class="text-danger">*</span>
            </template>

            <b-form-select
              id="input-is-public"
              v-model="form.isPublic"
              :options="isPublicTypes"
              :state="$v.form.isPublic.$dirty ? !$v.form.isPublic.$error : null"
            ></b-form-select>

            <b-form-text id="input-is-public-help"
              >Is Public field is a configuration whether the setting is public or not public.</b-form-text
            >

            <b-form-invalid-feedback id="input-is-public-invalid"
              >Please select a public setting.</b-form-invalid-feedback
            >
          </b-form-group>

          <template v-if="errorMessages">
            <b-row class="mb-2">
              <b-col class="text-danger message-col">{{ errorMessages }}</b-col>
            </b-row>
          </template>

          <b-row>
            <b-col>
              <b-button type="submit" size="sm" variant="success" :disabled="loading">
                <span class="spinner spinner-white" v-if="loading"></span>
                <font-awesome-icon :icon="['fas', 'save']" class="mr-1" />Save
              </b-button>
            </b-col>
            <b-col class="text-right">
              <b-button size="sm" variant="warning" :to="{ path: `/setting` }">
                <font-awesome-icon :icon="['fas', 'long-arrow-alt-left']" class="mr-1" />Back to list
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators';
import { mapState, mapActions, mapGetters } from 'vuex';
import _ from 'lodash';
import Setting from '@/model/setting';

export default {
  name: 'SettingForm',
  components: {},
  data() {
    return {
      formType: '',
      settingId: null,
      formLoaded: false,
      form: {
        metaKey: null,
        metaName: null,
        metaType: null,
        metaDesc: null,
        metaAttribute: null,
        metaValue: null,
        isPublic: 1
      },
      metaTypes: _.reduce(
        Setting.metaTypes,
        (result, value, key) => {
          result.push({ value, text: _.capitalize(key) });
          return result;
        },
        []
      ),
      isPublicTypes: _.reduce(
        Setting.isPublicTypes,
        (result, value, key) => {
          result.push({ value, text: _.capitalize(key) });
          return result;
        },
        []
      ),
      metaSelectValues: []
    };
  },
  validations() {
    const formValidation = {
      metaKey: {
        required,
        maxLength: maxLength(100),
        validateMetaKey: metaKey => {
          if (metaKey === null) {
            return false;
          }
          return metaKey.match(/^[0-9a-zA-Z_]+$/) !== null;
        }
      },
      metaName: {
        required,
        maxLength: maxLength(200)
      },
      metaType: {
        required
      },
      metaDesc: {
        maxLength: maxLength(1000)
      },
      metaAttribute: {
        validateMetaAttribute: metaAttributeRaw => {
          if (this.form.metaType !== Setting.metaTypes.select) {
            return true;
          }

          let metaAttribute = {};
          try {
            metaAttribute = JSON.parse(_.trim(metaAttributeRaw));
          } catch (e) {
            return false;
          }

          if (metaAttribute.list === undefined) {
            return false;
          }

          return true;
        }
      },
      metaValue: {
        validateMetaValue: value => {
          if (value === null) {
            return false;
          }
          if (this.form.metaType === Setting.metaTypes.number && value.match(/^[0-9]+$/) === null) {
            return false;
          }
          if (
            this.form.metaType === Setting.metaTypes.select &&
            _.find(this.metaSelectValues, o => o.value === value) === undefined
          ) {
            return false;
          }

          return true;
        }
      },
      isPublic: {
        validateIsPublic: value => {
          if (value === null) {
            return false;
          }
          return _.some(Setting.isPublicTypes, isPublic => value === isPublic);
        }
      }
    };

    return { form: formValidation };
  },
  async mounted() {
    if (this.$route.name === 'setting-new') {
      this.formType = 'new';
      this.settingId = null;
      this.form.metaType = Setting.metaTypes.select;
      this.form.isPublic = 1;
      this.formLoaded = true;

      this.$v.$touch(); // Set initial validation
      this.$v.$reset(); // Reset $dirty
    } else {
      this.formType = 'update';
      this.settingId = parseInt(this.$route.params.id, 10);
      await this.getOne({
        settingId: this.settingId,
        router: this.$router
      });
    }
  },
  computed: {
    title() {
      return this.formType === 'new' ? 'Add new setting' : 'Update setting';
    },
    ...mapGetters('alert', ['errorMessages']),
    ...mapState('setting', ['loading', 'setting'])
  },
  methods: {
    ...mapActions('setting', ['getOne', 'postOne', 'patchOne']),
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return false;
      }

      const setting = {
        meta_key: this.form.metaKey,
        meta_name: this.form.metaName,
        meta_type: this.form.metaType,
        meta_desc: this.form.metaDesc,
        meta_attribute: this.form.metaAttribute,
        meta_value: this.form.metaType === Setting.metaTypes.number ? +this.form.metaValue : this.form.metaValue,
        is_public: this.form.isPublic
      };

      if (this.formType === 'new') {
        this.onAdd({ setting });
      } else {
        this.onEdit({ setting });
      }
      return false;
    },
    onAdd({ setting }) {
      this.postOne({
        setting,
        router: this.$router,
        redirectUrl: '/setting'
      });
    },
    onEdit({ setting }) {
      this.patchOne({
        settingId: this.settingId,
        setting,
        router: this.$router,
        redirectUrl: '/setting'
      });
    }
  },
  watch: {
    setting(_newValue, _oldValue) {
      if (!this.setting.id) {
        return;
      }

      // Loaded setting, assign to form
      this.form.metaKey = this.setting.metaKey;
      this.form.metaName = this.setting.metaName;
      this.form.metaType = this.setting.metaType;
      this.form.metaDesc = this.setting.metaDesc;
      this.form.metaAttribute = this.setting.metaAttribute;
      this.form.metaValue = this.setting.metaValue;
      this.form.isPUblic = this.setting.isPUblic;

      this.formLoaded = true;

      this.$v.$touch(); // Set initial validation
      this.$v.$reset(); // Reset $dirty
    },
    // eslint-disable-next-line func-names
    'form.metaAttribute': function (_newValue, _oldValue) {
      this.form.metaAttribute = _.trim(this.form.metaAttribute);

      let metaAttribute = {};
      try {
        metaAttribute = JSON.parse(this.form.metaAttribute);
      } catch (e) {
        // If failed to parse json, then no action required
        return true;
      }

      if (metaAttribute.list === undefined || _.isEmpty(metaAttribute.list)) {
        return true;
      }

      this.metaSelectValues = metaAttribute.list;

      return true;
    }
  }
};
</script>
