import React, { useState } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, MenuItem, 
  FormControl, Select, InputLabel, Box, TablePagination 
} from "@mui/material";
import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams, useSearchParams } from "react-router-dom";
import CustomPagination from "./Common/CustomPagination";
import dayjs from "dayjs";

const PartnerContentDetails = () => {
  const { partnerName, status } = useParams();
  const [searcParams] = useSearchParams();
  const initialStatus = searcParams.get("status") || "all";
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const data = [
    { id: 1, name: "ABC", contentType: "movie", status: "failure", failureReason: "lorem ipsum" },
    { id: 2, name: "DEF", contentType: "movie", status: "failure", failureReason: "lorem ipsum" },
    { id: 3, name: "GHI", contentType: "movie", status: "failure", failureReason: "lorem ipsum" },
    { id: 4, name: "JKL", contentType: "movie", status: "failure", failureReason: "lorem ipsum" },
    { id: 5, name: "MNO", contentType: "movie", status: "failure", failureReason: "lorem ipsum" },
    { id: 6, name: "PQR", contentType: "movie", status: "failure", failureReason: "lorem ipsum" },
  ];

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          padding: 3,
          // backgroundColor: "#212121",
          minHeight: "calc(100vh - 90px)",
          paddingBottom: "30px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            marginBottom: 3,
            flexWrap: "wrap",
          }}
        >
          <FormControl sx={{ minWidth: 180 }} size="small" variant="outlined">
            <InputLabel
              shrink
              sx={{
                color: "#fff",
                "&.Mui-focused": {
                  color: "#fff",
                },
              }}
            >
              Partner
            </InputLabel>
            <Select
              value={partnerName}
              displayEmpty
              sx={{
                backgroundColor: "#333",
                color: "#fff",
                border: "1px solid #555",
                ".MuiSvgIcon-root": { color: "#fff" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#555",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#888",
                },
              }}
              inputProps={{ 'aria-label': 'Partner' }}
            >
              <MenuItem value="amazonprimevideo">Amazon Prime Video</MenuItem>
              <MenuItem value="viu">Viu</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }} size="small" variant="outlined">
            <InputLabel
              shrink
              sx={{
                color: "#fff",
                "&.Mui-focused": {
                  color: "#fff",
                },
              }}
            >
              Status
            </InputLabel>
            <Select
              value={status}
              displayEmpty
              sx={{
                backgroundColor: "#333",
                color: "#fff",
                border: "1px solid #555",
                ".MuiSvgIcon-root": { color: "#fff" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#555",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#888",
                },
              }}
              inputProps={{ 'aria-label': 'Status' }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="success">Success</MenuItem>
              <MenuItem value="failure">Failure</MenuItem>
              <MenuItem value="notModified">Not Modified</MenuItem>
            </Select>
          </FormControl>
        </Box>


        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#333",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Table
            sx={{
              borderCollapse: "separate",
              borderSpacing: "0",
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#424242" }}>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none" }}><strong>Title</strong></TableCell>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none" }}><strong>ID</strong></TableCell>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none" }}><strong>Status</strong></TableCell>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none" }}><strong>Content Type</strong></TableCell>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none" }}><strong>failure Reason</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow
                  key={item.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    backgroundColor: index % 2 === 0 ? "#2c2c2c" : "#383838",
                    transition: "background-color 0.3s",
                    // borderBottom: "0px",
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell sx={{ color: "#e6e7e7", border: "none" }}>{item.name}</TableCell>
                  <TableCell sx={{ color: "#e6e7e7", border: "none" }}>{item.id}</TableCell>
                  <TableCell sx={{ color: "#e6e7e7", border: "none" }}>
                    {item.status}
                  </TableCell>
                  <TableCell sx={{ color: "#e6e7e7", border: "none" }}>{item.contentType}</TableCell>
                  <TableCell sx={{ color: "#e6e7e7", border: "none" }}>{item.failureReason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          sx={{
            color: "#fff",
            backgroundColor: "#333",
            ".MuiTablePagination-toolbar": {
              padding: "0 8px",
              minHeight: "36px",
            },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-input, .MuiTablePagination-displayedRows": {
              color: "#fff",
            },
            ".MuiTablePagination-select, .MuiTablePagination-actions": {
              margin: 0,
            },
            ".MuiSvgIcon-root": {
              color: "#fff",
            },
            ".MuiTablePagination-select": {
              backgroundColor: "#424242",
              borderRadius: "4px",
              // padding: "2px 8px",
            },
            ".MuiTablePagination-actions button": {
              padding: "4px",
            },
          }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default PartnerContentDetails;