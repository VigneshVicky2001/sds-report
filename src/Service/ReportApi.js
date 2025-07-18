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

// export const downloadReport = ( projectName, days) => {
//   return baseApi.get(`/report/generate-pdf-report`, {
//     params: { projectName ,days },
//   })
//   .then(response => response.data)
//   .catch(error => {
//     console.error(error);
//     throw error;
//   });
// };
