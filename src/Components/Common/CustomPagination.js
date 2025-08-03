import React from "react";
import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const CustomPagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#333",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 16px",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.5)",
        zIndex: 1000,
      }}
    >
      <Box display="flex" alignItems="center">
        <Typography variant="body2" sx={{ marginRight: 2 }}>
          Total items: {count}
        </Typography>

        <FormControl variant="standard" sx={{ minWidth: 80 }}>
          <InputLabel sx={{ color: "#ccc" }}>Rows</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
            sx={{
              backgroundColor: "#444",
              color: "#fff",
              border: "1px solid #555",
              fontSize: "14px",
            }}
          >
            {[10, 25, 50].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" alignItems="center">
        <IconButton
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          sx={{ color: "#fff" }}
        >
          <ArrowBackIos fontSize="small" />
        </IconButton>

        <Typography variant="body2" sx={{ margin: "0 8px" }}>
          Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
        </Typography>

        <IconButton
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          sx={{ color: "#fff" }}
        >
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CustomPagination;
