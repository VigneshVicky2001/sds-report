// src/components/CustomPagination.jsx
import React from "react";
import { Box, IconButton, Typography, Select, MenuItem } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const CustomPagination = ({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => {
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
        padding: "4px 16px",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.5)",
        zIndex: 1000,
      }}
    >
      {/* Rows per page selector */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2">Rows per page:</Typography>
        <Select
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
          sx={{
            backgroundColor: "#424242",
            color: "#fff",
            borderRadius: "4px",
            ".MuiSvgIcon-root": { color: "#fff" },
            "& .MuiSelect-select": { padding: "4px 24px 4px 8px" },
          }}
        >
          {[5, 10, 25].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Pagination controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          sx={{ color: "#fff" }}
        >
          <ArrowBackIos fontSize="small" />
        </IconButton>

        <Typography variant="body2">
          Page {page + 1} of {totalPages}
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
