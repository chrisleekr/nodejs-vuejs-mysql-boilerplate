import _ from 'lodash';
import settingService from '@/services/settingService';
import Setting from '../../model/setting';

const state = {
  baseUrl: '/setting',
  settings: [],
  pagination: {},
  setting: null,
  loading: false
};

const actions = {
  list({ dispatch, commit }, { query = {}, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    commit('setSettings', { settings: [], pagination: {} });

    settingService
      .list({ query })
      .then(response => {
        commit('setSettings', { settings: response.data.rows, pagination: response.data.pagination });
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  getOne({ dispatch, commit }, { settingId, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    commit('setSetting', { setting: {} });

    settingService
      .getOne({ settingId })
      .then(response => {
        commit('setSetting', { setting: response.data });
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  postOne({ dispatch, commit }, { setting, router, redirectUrl = '' }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    settingService
      .postOne({ setting })
      .then(_response => {
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            position: 'bottom-end',
            title: '',
            text: 'New setting has been added.'
          },
          { root: true }
        );

        if (redirectUrl !== '') {
          router.push(redirectUrl);
        }
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  patchOne({ dispatch, commit }, { settingId, setting, router, redirectUrl = '' }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    settingService
      .patchOne({ settingId, newSetting: setting })
      .then(_response => {
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            position: 'bottom-end',
            title: '',
            text: 'Setting has been updated.'
          },
          { root: true }
        );

        if (redirectUrl !== '') {
          router.push(redirectUrl);
        }
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  deleteOne({ dispatch, commit }, { settingId, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    settingService
      .deleteOne({ settingId })
      .then(_response => {
        dispatch('list', {});
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            position: 'bottom-end',
            title: '',
            text: 'Setting has been deleted.'
          },
          { root: true }
        );
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  }
};

const getters = {};

const mutations = {
  startRequest(state) {
    state.loading = true;
  },
  requestFailed(state) {
    state.loading = false;
  },
  setSettings(state, { settings, pagination }) {
    let rowNum = pagination.first_row_no;
    state.settings = _.map(settings, setting => {
      const newSetting = new Setting({
        rowNum,
        id: setting.id,
        metaKey: setting.meta_key,
        metaName: setting.meta_name,
        metaType: setting.meta_type,
        metaDesc: setting.meta_desc,
        metaAttribute: setting.meta_attribute,
        metaValue: setting.meta_value,
        isPublic: setting.is_public
      });

      rowNum -= 1;
      return newSetting;
    });
    state.pagination = pagination;

    state.loading = false;
  },
  setSetting(state, { setting }) {
    state.setting = new Setting({
      id: setting.id,
      metaKey: setting.meta_key,
      metaName: setting.meta_name,
      metaType: setting.meta_type,
      metaDesc: setting.meta_desc,
      metaAttribute: setting.meta_attribute,
      metaValue: setting.meta_value,
      isPublic: setting.is_public
    });

    state.loading = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
