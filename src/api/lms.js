import api from "./common";

export default {
  generateTaskList: async (params) => {
    return await api.send("api/lms/generateTaskList", params, "post");
  },

  getTaskList: async (params) => {
    return await api.send("api/lms/getTaskList", params, "post");
  },

  getAllTaskList: async (params) => {
    return await api.send("api/lms/getAllTaskList", params, "post");
  },

  getResolvedTaskList: async (params) => {
    return await api.send("api/lms/getResolvedTaskList", params, "post");
  },

  saveTaskList: async (params) => {
    return await api.send("api/lms/saveTaskList", params, "post");
  },

  submitTask: async (params) => {
    return await api.send("api/lms/submitTask", params, "post");
  },

  writeTaskContent: async (params) => {
    return await api.send("api/lms/writeTaskContent", params, "post");
  },

  checkDuplicateTableName: async (params) => {
    return await api.send("api/lms/checkDuplicateTableName", params, "post");
  },
};