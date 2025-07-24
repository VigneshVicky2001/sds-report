import React, { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, MenuItem, 
  FormControl, Select, InputLabel, Box, TablePagination
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
  const [statusFilter, setStatusFilter] = useState("");
  const [contentTypes, setContentTypes] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState();
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
      pageNumber: page,
      pageSize: rowsPerPage,
    };

    try {
      console.log(projectName);
      const response = await getSummaryList({ payload, projectName });
      setData(response.data || []);
      setTotalCount(response.total || 0);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
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
          padding: 3,
          // backgroundColor: "#212121",
          minHeight: "calc(100vh - 90px)",
          paddingBottom: "30px",
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
                <MenuItem value="">All</MenuItem>
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
                <MenuItem value="">All</MenuItem>
                <MenuItem value="movie">Movie</MenuItem>
                <MenuItem value="tvseries">TV Series</MenuItem>
                <MenuItem value="tvseason">TV Season</MenuItem>
                <MenuItem value="tvepisode">TV Episode</MenuItem>
                <MenuItem value="event">Live Event</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
            <FormControl>
              <Box display="flex" gap={2} color="#fff">
                <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="radio"
                    value="contentTitle"
                    checked={searchField === "contentTitle"}
                    onChange={(e) => setSearchField(e.target.value)}
                  />
                  Content Title
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="radio"
                    value="contentId"
                    checked={searchField === "contentId"}
                    onChange={(e) => setSearchField(e.target.value)}
                  />
                  Content ID
                </label>
              </Box>
            </FormControl>

            <input
              type="text"
              value={searchText}
              placeholder={`Search by ${searchField}`}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(0);
                  fetchData();
                }
              }}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "#444",
                color: "white",
                border: "1px solid #777",
                minWidth: "300px",
                fontSize: "14px",
              }}
            />
          </Box>
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
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none" }}><strong>Content Type</strong></TableCell>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none" }}><strong>Titel</strong></TableCell>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none" }}><strong>ID</strong></TableCell>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none" }}><strong>Ingestion Status</strong></TableCell>
                <TableCell sx={{ color: "#e6e7e7", borderBottom: "none" }}><strong>Failure Reason</strong></TableCell>
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
                  <TableCell sx={{ color: "#e6e7e7", border: "none" }}>{item.cty}</TableCell>
                  <TableCell sx={{ color: "#e6e7e7", border: "none" }}>{item.prt_cnt_title?.[0]?.n || "---"}</TableCell>
                  <TableCell sx={{ color: "#e6e7e7", border: "none" }}>
                    {item.prt_cnt_id}
                  </TableCell>
                  <TableCell sx={{ color: "#e6e7e7", border: "none" }}>{item.ing_st}</TableCell>
                  <TableCell sx={{ color: "#e6e7e7", border: "none" }}>{item.reason || "---"}</TableCell>
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
          count={totalCount}
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