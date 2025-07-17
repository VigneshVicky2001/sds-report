import baseApi from "./baseApi";

export const getReport = ({ partner, days }) => {
  return baseApi.get(`/report/${partner}/daily-summary`, {
    params: { days },
  })
  .then(response => response.data)
  .catch(error => {
    console.error(error);
    throw error;
  });
};
