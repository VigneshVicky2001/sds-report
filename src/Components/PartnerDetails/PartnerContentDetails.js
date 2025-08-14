import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, MenuItem, 
  FormControl, Select, InputLabel, Box, TablePagination, Button
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLocation } from "react-router-dom";
import { getSummaryList, downloadExcel } from "../../Service/SummaryApi";
import ContentLoaderOverlay from '../Common/CustomLoader';
import { BootstrapTooltip } from "../Common/BlackToolTip";

const partners = ['amazonprimevideo', 'bbcplayer', 'beinsportsconnect', 'cmgo', 'hbomax', 'iqiyi', 'mangotv', 'simplysouth', 'spotvnow', 'tvbanywhereplus', 'vidio', 'viu', 'wetv', 'youku', 'zee5'];

const PartnerContentDetails = () => {
  // const [searchParams] = useSearchParams();
  const location = useLocation();
  const state = location.state || {};
  // const projectName = searchParams.get("projectName") || "";
  const initialProjectName = state.projectName;
  const initialStatus = state.status || "All";
  const initialContentType = state.contentType || "All";
  const initialDate = state.date;
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [contentTypes, setContentTypes] = useState(initialContentType);
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [projectName, setProjectName] = useState(initialProjectName);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [fetchedFromDateTime, setFetchedFromDateTime] = useState("");
  const [page, setPage] = useState(1);
  // const itemsPerPage = 10;
  const [invalidSearchAttempt, setInvalidSearchAttempt] = useState(false);
  const didMount = useRef(false);
  const initialized = useRef(false);
  const [isFirstRender, setIsFirstRender] = useState(false);
  const [apiHit, setApiHit] = useState(false);
  const [isFileNotFound, setIsFileNotFound] = useState(true);
  const [isContentNotFound, setIsContentNotFound] = useState(true);

  const rows = new Array(53).fill(0).map((_, i) => ({
    title: `Item ${i + 1}`,
    status: "Active",
  }));

  const fetchData = async () => {
    setApiHit(true);
    const payload = {
      status: statusFilter ? [statusFilter] : [],
      contentTypes: contentTypes ? [contentTypes] : [],
      searchText,
      searchField,
      pageNumber: page + 1,
      pageSize: rowsPerPage,
    };

    setLoading(true);
    try {
      console.log(projectName);
      const response = await getSummaryList({ payload, projectName });
      setFetchedFromDateTime(response.fetchedFromDateTime);
      setIsFileNotFound(response.noFileFound);
      setIsContentNotFound(response.noContentFoundForFilter);
      setData(response.data || []);
      setTotalCount(response.total_elements || 0);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
  }, [location.pathname]);

  useEffect(() => {
    if (page === 0 && projectName) {
      fetchData();
    }
  }, [page, rowsPerPage, statusFilter, contentTypes, projectName]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = useCallback((e) => {
    setPage(0);
    setStatusFilter(e.target.value);
  }, []);

  const handleContentTypeChange = useCallback((e) => {
    setPage(0);
    setContentTypes(e.target.value);
  }, []);

  const handleProjectNameChange = useCallback((e) => {
    setSearchField("all");
    setSearchText("");
    setStatusFilter("All");
    setContentTypes("All");
    setRowsPerPage(10);
    setPage(0);
    setProjectName(e.target.value);
  }, []);

  const handleSearchFieldChange = useCallback((e) => {
    if(e.target.value === "all"){
      setSearchText("");
      fetchData();
    }
    setPage(0);
    setSearchField(e.target.value);
  }, []);

  const handleDownloadCSV = async() => {
    setLoading(true);
    try{
      await downloadExcel({ projectName });
    } catch (error) {
      console.error("Failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              // backgroundColor: 'rgba(18, 18, 18, 0.75)',
              // borderRadius: '12px',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ContentLoaderOverlay />
          </Box>
        )}
      <Box
        sx={{
          // height: "100vh",
          position: 'relative',
          overflow: "hidden",
          padding: 3,
          mt: 0,
          // backgroundColor: "#212121",
          // paddingBottom: "30px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#2b2b2b",
            paddingTop: 3,
            paddingLeft: 3,
            paddingRight: 3,
            paddingBottom: 1,
            borderRadius: 2,
            mb: 1.5,
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              alignItems: "center",
              // mb: 2,
            }}
          >
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel sx={{ color: "#fff" }}>Select a Partner</InputLabel>
              <Select
                value={projectName}
                onChange={handleProjectNameChange}
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
                onChange={handleStatusChange}
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
                onChange={handleContentTypeChange}
                sx={{
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #555",
                  ".MuiSvgIcon-root": { color: "#fff" },
                }}
              >
                <MenuItem value="All">All</MenuItem>
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
                onChange={handleSearchFieldChange}
                sx={{
                  backgroundColor: "#333",
                  color: "#fff",
                  maxWidth: "200px",
                  border: "1px solid #555",
                  ".MuiSvgIcon-root": { color: "#fff" },
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="contentId">Content ID</MenuItem>
                <MenuItem value="contentTitle">Content Title</MenuItem>
              </Select>
            </FormControl>

            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <input
                type="text"
                value={searchText}
                placeholder={searchField ? `Search by ${searchField}` : "Select a search field"}
                readOnly={searchField === "all"}
                onFocus={() => {
                  if (searchField === "all") {
                    setInvalidSearchAttempt(true);
                    setTimeout(() => setInvalidSearchAttempt(false), 2000);
                  }
                }}
                onChange={(e) => {
                  if (searchField !== "all") {
                    // setSearchField("all");
                    setSearchText(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (searchField === "all") {
                      setInvalidSearchAttempt(true);
                      setTimeout(() => setInvalidSearchAttempt(false), 1000);
                    } else {
                      setPage(0);
                      fetchData();
                    }
                  }
                }}
                style={{
                  marginTop: "25px",
                  height: "23px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: "#444",
                  color: "white",
                  border: `1px solid ${invalidSearchAttempt ? "red" : "#777"}`,
                  minWidth: "300px",
                  fontSize: "14px",
                  outline: "none",
                  animation: invalidSearchAttempt ? "shake 0.3s" : "none",
                  cursor: "text",
                  opacity: 1,
                }}
              />
              <Typography
                sx={{
                  color: "red",
                  fontSize: "12px",
                  minHeight: "18px",
                  mt: 1,
                  visibility: invalidSearchAttempt ? "visible" : "hidden",
                }}
              >
                Please select a valid search field
              </Typography>
            </Box>

            <Button
              onClick={() => {
                setSearchField("all");
                setSearchText("");
                setStatusFilter("All");
                setContentTypes("All");
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

            <Button
              onClick={() => {
                // setSearchField("all");
                // setSearchText("");
                // setStatusFilter("All");
                // setContentTypes("All");
                // setPage(0);
                // fetchData();
                handleDownloadCSV();

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
              Download
            </Button>
            <Typography
              size= "small"
              sx={{
                // fontWeight: "bold",
                color: "#ccc",
                marginLeft: "200px",
                // fontWeight: "bold",
                // marginRight: "100px",
                // backgroundColor: "#1e1e1e",
                padding: "6px 12px",
                borderRadius: "4px",
                // boxShadow: "0 0 6px rgba(0,0,0,0.3)",
              }}
            >
              Fetched from date: {fetchedFromDateTime ? `${fetchedFromDateTime}` : ""}
            </Typography>

          </Box>
        </Box>
        
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#333",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
            maxHeight: "calc(100vh - 279px)",
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
                {!apiHit ? (
                  <TableRow
                    sx={{
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell colSpan={5} align="center" sx={{ color: "#bbb", py: 5, paddingBottom: "-20px" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          textAlign: 'center',
                          // mt: 5,
                          color: '#aaa'
                        }}
                      >
                        Please select a partner.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (data.length === 0 && !loading) ? (
                  <>
                  {isFileNotFound ? (
                    <TableRow
                      sx={{
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell colSpan={5} align="center" sx={{ color: "#bbb", py: 5, paddingBottom: "-20px" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            textAlign: 'center',
                            // mt: 5,
                            color: '#aaa'
                          }}
                        >
                          No data available for the selected partner.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow
                      sx={{
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell colSpan={5} align="center" sx={{ color: "#bbb", py: 5, paddingBottom: "-20px" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            textAlign: 'center',
                            // mt: 5,
                            color: '#aaa'
                          }}
                        >
                          No data available for the selected partner.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                  }
                  </>
                ) : (
                data.map((item, index) => (
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
                        <BootstrapTooltip
                          title={
                            <React.Fragment>
                              <Typography sx={{ fontSize: 16 }}>
                                <ul style={{ margin: 0, paddingLeft: 16 }}>
                                  {item.reason.map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                  ))}
                                </ul>
                              </Typography>
                            </React.Fragment>
                          }
                          placement="top"
                        >
                          <span style={{ cursor: "pointer" }}>
                            {item.reason.join(', ')}
                          </span>
                        </BootstrapTooltip>
                      ) : (
                        "---"
                      )}
                    </TableCell>
                  </TableRow>
                ))
                )
                }
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
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              color: "#e6e7e7",
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                color: "#e6e7e7",
              },
              ".MuiSelect-icon": {
                color: "#e6e7e7",
              },
            }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default PartnerContentDetails;