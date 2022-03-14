/* eslint-disable no-underscore-dangle */
import axiosInstance from './api';
import configService from './configService';

const setupInterceptors = store => {
  axiosInstance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('backend-auth-key') || '';
      if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = token;
      }
      return config;
    },
    error => Promise.reject(error)
  );
  axiosInstance.interceptors.response.use(
    res => res,
    async err => {
      const originalConfig = err.config;
      if (originalConfig.url !== `${configService.get('apiUrl')}/staff/login` && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const response = await axiosInstance.post(`${configService.get('apiUrl')}/refresh-token`, {
              refreshToken: localStorage.getItem('backend-refresh-auth-key') || ''
            });
            const { data } = response.data;

            store.commit('auth/loginSuccess', { authKey: data.auth_key, refreshAuthKey: data.refresh_auth_key });

            return axiosInstance(originalConfig);
          } catch (error) {
            return Promise.reject(error);
          }
        }
      }
      return Promise.reject(err);
    }
  );
};
export default setupInterceptors;
