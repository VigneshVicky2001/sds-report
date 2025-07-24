import baseApi from "./baseApi";

export const getSummaryList = ({ payload, projectName }) => {
  return baseApi.post(`/paginatedSummary/filter?projectName=${projectName}`, payload)
  .then(response => response.data)
  .catch(error => {
    console.error(error);
    throw error;
  });
};