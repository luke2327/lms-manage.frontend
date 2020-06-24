import api from './common';

export default {
  getTaskList: async (params) => {
    return await api.send('api/lms/getTaskList', params, 'post');
  },
  saveTaskList: async (params) => {
    return await api.send('api/lms/saveTaskList', params, 'post');
  }
};