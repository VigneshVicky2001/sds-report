import baseApi from "./baseApi";

export const getSummaryList = ({ payload, projectName }) => {
  return baseApi.post(`/paginatedSummary/filter?projectName=${projectName}`, payload)
  .then(response => response.data)
  .catch(error => {
    console.error(error);
    throw error;
  });
};

export const downloadExcel = async ({ projectName }) => {
  try {
    const response = await baseApi.get(`/paginatedSummary/excel?projectName=${projectName}`, {
      responseType: 'blob',
    });

    // ✅ Extract filename from Content-Disposition header
    let filename = `${projectName}_summary.xlsx`; // fallback
    const contentDisposition = response.headers['content-disposition'];

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match?.[1]) {
        filename = match[1];
      }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Excel download failed:', error);
  }
};

export const getPartners = () => {
  return baseApi.get(`projects/getAll`)
  .then(response => response.data)
  .catch(error => {
    console.error(error);
    throw error;
  });
};