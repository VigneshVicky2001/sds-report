import React, { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, MenuItem, 
  FormControl, Select, InputLabel, Box, TablePagination, Tooltip, Button
} from "@mui/material";
import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams, useSearchParams } from "react-router-dom";
import { getSummaryList } from "../Service/SummaryApi";
import CustomPagination from "./Common/CustomPagination";
import dayjs from "dayjs";

const partners = ['amazonprimevideo', 'bbcplayer', 'beinsportsconnect', 'cmgo', 'hbomax', 'iqiyi', 'mangotv', 'simplysouth', 'spotvnow', 'tvbanywhereplus', 'vidio', 'viu', 'wetv', 'youku', 'zee5'];

const PartnerContentDetails = () => {
  // const [searchParams] = useSearchParams();
  // const projectName = searchParams.get("projectName") || "";
  const [statusFilter, setStatusFilter] = useState("All");
  const [contentTypes, setContentTypes] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("All");
  const [projectName, setProjectName] = useState("amazonprimevideo"); //default
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    const payload = {
      status: statusFilter ? [statusFilter] : [],
      contentTypes: contentTypes ? [contentTypes] : [],
      searchText,
      searchField,
      pageNumber: page + 1,
      pageSize: rowsPerPage,
    };

    try {
      console.log(projectName);
      const response = await getSummaryList({ payload, projectName });
      setData(response.data || []);
      setTotalCount(response.total_elements || 0);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    // setPage(0);
    fetchData();
  }, [page, rowsPerPage, statusFilter, contentTypes, projectName]);

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          // height: "100vh",
          overflow: "hidden",
          padding: 3,
          mt: 2,
          // backgroundColor: "#212121",
          // paddingBottom: "30px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#2b2b2b",
            padding: 3,
            borderRadius: 2,
            mb: 3,
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              alignItems: "center",
              mb: 2,
            }}
          >
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel sx={{ color: "#fff" }}>Partner</InputLabel>
              <Select
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                sx={{
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #555",
                  ".MuiSvgIcon-root": { color: "#fff" },
                }}
              >
                {partners.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel sx={{ color: "#fff" }}>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #555",
                  ".MuiSvgIcon-root": { color: "#fff" },
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Success">Success</MenuItem>
                <MenuItem value="Failure">Failure</MenuItem>
                <MenuItem value="NotModified">Not Modified</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel sx={{ color: "#fff" }}>Content Type</InputLabel>
              <Select
                value={contentTypes}
                onChange={(e) => setContentTypes(e.target.value)}
                sx={{
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #555",
                  ".MuiSvgIcon-root": { color: "#fff" },
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="movie">Movie</MenuItem>
                <MenuItem value="tvseries">TV Series</MenuItem>
                <MenuItem value="tvseason">TV Season</MenuItem>
                <MenuItem value="tvepisode">TV Episode</MenuItem>
                <MenuItem value="event">Live Event</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" alignItems="center" gap={3} flexWrap="wrap" flexDirection="row">
            <FormControl  sx={{ minWidth: 180 }} size="small">
              <InputLabel sx={{ color: '#fff' }}>Search Field</InputLabel>
              <Select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                sx={{
                  backgroundColor: "#333",
                  color: "#fff",
                  maxWidth: "200px",
                  border: "1px solid #555",
                  ".MuiSvgIcon-root": { color: "#fff" },
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="contentId">Content ID</MenuItem>
                <MenuItem value="contentTitle">Content Title</MenuItem>
              </Select>
            </FormControl>

            <input
              type="text"
              disabled={!searchField}
              value={searchText}
              placeholder={searchField ? `Search by ${searchField}` : "Select a search field"}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(0);
                  fetchData();
                }
              }}
              style={{
                height: "23px",
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "#444",
                color: "white",
                border: "1px solid #777",
                minWidth: "300px",
                fontSize: "14px",
              }}
            />

            <Button
              onClick={() => {
                setSearchField("");
                setSearchText("");
                setPage(0);
                fetchData();
              }}
              variant="outlined"
              size="small"
              sx={{
                color: "#fff",
                borderColor: "#777",
                minWidth: "60px",
                height: "40px",
                borderRadius: "6px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#000",
                  borderColor: "#fff",
                },
              }}
            >
              Clear
            </Button>

          </Box>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#333",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
            maxHeight: "calc(100vh - 360px)",
            overflow: "auto"
          }}
        >
          <Table
            stickyHeader
            sx={{
              tableLayout: "fixed",
              borderCollapse: "separate",
              borderSpacing: "0",
              width: "100%",
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#424242" }}>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none", position: "sticky", top: 0, zIndex: 5, backgroundColor: "#424242" }}><strong>Content Type</strong></TableCell>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none", position: "sticky", top: 0, zIndex: 5, backgroundColor: "#424242" }}><strong>Title</strong></TableCell>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none", position: "sticky", top: 0, zIndex: 5, backgroundColor: "#424242" }}><strong>ID</strong></TableCell>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none", position: "sticky", top: 0, zIndex: 5, backgroundColor: "#424242" }}><strong>Ingestion Status</strong></TableCell>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none", position: "sticky", top: 0, zIndex: 5, backgroundColor: "#424242" }}><strong>Failure Reason</strong></TableCell>
              </TableRow>
            </TableHead>
              <TableBody>
                {data.map((item, index) => (
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
                    <TableCell sx={{ color: "#e6e7e7", border: "none" }}>{item.cty}</TableCell>
                    <TableCell sx={{ color: "#e6e7e7", border: "none" }}>{item.prt_cnt_title?.[0]?.n || "---"}</TableCell>
                    <TableCell sx={{ color: "#e6e7e7", border: "none" }}>
                      {item.prt_cnt_id}
                    </TableCell>
                    <TableCell sx={{ color: "#e6e7e7", border: "none" }}>{item.ing_st}</TableCell>
                    <TableCell sx={{ color: "#e6e7e7", border: "none" }}>
                      {Array.isArray(item.reason) && item.reason.length > 0 ? (
                        <Tooltip title={item.reason.join(', ')} arrow placement="top">
                          <span>{item.reason.join(', ')}</span>
                        </Tooltip>
                      ) : (
                        "---"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 10,
            backgroundColor: "#333",
          }}
        >
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
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default PartnerContentDetails;