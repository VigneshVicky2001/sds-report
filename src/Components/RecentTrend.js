import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getReport, downloadReport } from '../Service/ReportApi';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Skeleton,
  Button
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ContentLoaderOverlay from './Common/CustomLoader';
import CircularProgress from '@mui/material/CircularProgress';

const partners = ['amazonprimevideo', 'bbcplayer', 'beinsportsconnect', 'cmgo', 'hbomax', 'iqiyi', 'mangotv', 'simplysouth', 'spotvnow', 'tvbanywhereplus', 'vidio', 'viu', 'wetv', 'youku', 'zee5'];
const dayOptions = [1, 2, 3, 4, 5];

const RecentTrend = () => {
  const { partner: routePartner } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState(routePartner || 'hbomax');
  const [days, setDays] = useState(parseInt(searchParams.get('days') || '3'));
  const [data, setData] = useState(null);
  const [isReportReady, setIsReportReady] = useState(false);
  const [isBottomVisible, setIsBottomVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const bottomRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsBottomVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setIsReportReady(false); // Reset before fetching

    getReport({ partner, days })
      .then((res) => {
        setData(res);
        setIsReportReady(true); // Enable download
      })
      .catch((err) => {
        console.error('Error loading report:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [partner, days]);

  const formatContentType = (type) => {
    switch (type.toLowerCase()) {
      case 'tvseries':
        return 'TV Series';
      case 'movie':
        return 'Movie';
      case 'tvseason':
        return 'TV season';
      case 'tvepisode':
        return 'TV Episode';
      default:
        return type;
    }
  };

  // Function to handle row click navigation
  const handleRowClick = (contentType, date, status) => {
    // Map content type to the format expected by PartnerContentDetails
    const contentTypeMap = {
      'tvseries': 'tvseries',
      'movie': 'movie', 
      'tvseason': 'tvseason',
      'tvepisode': 'tvepisode'
    };

    const mappedContentType = contentTypeMap[contentType.toLowerCase()] || contentType.toLowerCase();
    
    navigate(`/partner-details/${partner}/${status}`, {
      state: {
        projectName: partner,
        status,
        contentType: mappedContentType,
        date
      }
    });
  };

  const handleDownload = async () => {
    if (!isReportReady || downloading) return;
    setDownloading(true);

    try {
      const url = `http://localhost:9090/report/generate-pdf-report?projectName=${partner}&days=${days}`;
      console.log('Fetching:', url);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to download report: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `report_${partner}_${days}days.pdf`);

      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      
      console.log('Download triggered');
      
      setTimeout(() => {
        console.log('Resetting download state');
        setDownloading(false);
        URL.revokeObjectURL(blobUrl);
      }, 1000);

    } catch (error) {
      console.error('Download failed:', error);
      setDownloading(false);
      alert('Download failed. Please try again.');
    }
  };

  const handlePartnerChange = (e) => {
    const newPartner = e.target.value;
    setPartner(newPartner);
    navigate(`/report/${newPartner}/daily-summary?days=${days}`);
  };

  const handleDaysChange = (e) => {
    const newDays = parseInt(e.target.value);
    setDays(newDays);
    navigate(`/report/${partner}/daily-summary?days=${newDays}`);
  };

  const renderTable = (contentType, dayCounts) => {
    const dates = Object.keys(dayCounts);
    const lastRowIndex = dates.length - 1;
    
    return (
      <Paper
        key={contentType}
        sx={{
          mb: 7,
          background: '#333',
          color: '#fff',
          borderRadius: 2,
          boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        <Typography
          sx={{
            p: 1,
            pl: 2.5,
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '24px',
            textAlign: 'center',
            backgroundColor: '#1a1a1aff',
            borderBottom: '1px solid #444',
            letterSpacing: '1px',
          }}
        >
          {formatContentType(contentType)}
        </Typography>
        <Box sx={{ display: 'block', maxHeight: 400, overflowY: 'auto', overflowX: 'hidden' }}>
          <Table
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              '& th, & td': {
                borderBottom: '1px solid #444',
                color: '#fff',
                textAlign: 'center',
                padding: '7px 0',
              },
              '& thead th': {
                backgroundColor: '#2a2a2a',
                fontWeight: 'bold',
              },
              '& tbody tr:hover': {
                backgroundColor: '#383838',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'left', fontSize: '19px', width: '20%' }}>Date</TableCell>
                <TableCell sx={{ textAlign: 'right', fontSize: '19px', width: '20%' }}>Success</TableCell>
                <TableCell sx={{ textAlign: 'right', fontSize: '19px', width: '20%' }}>Failure</TableCell>
                <TableCell sx={{ textAlign: 'right', fontSize: '19px', width: '20%' }}>Not Modified</TableCell>
                <TableCell sx={{ textAlign: 'right', fontSize: '19px', width: '20%' }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                columnWidth: '120px',
              }}
            >
              {dates.map((date, index) => {
                const dayData = dayCounts[date];
                const isNoData = dayData.noData;
                return (
                <TableRow
                  key={date}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '& td, & th': { borderBottom: '1px solid #444' },
                    '&:last-child td': { borderBottom: 'none' },
                    borderBottom: '1px solid #444',
                    borderRadius: "0px",
                    ...(index === lastRowIndex && {
                      cursor: 'pointer',
                      position: 'relative',
                      '& td': {
                        position: 'relative',
                        transition: 'background-color 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#4a4a4a !important',
                        }
                      },
                      '&:after': {
                        // content: '"Click to view details"',
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '12px',
                        color: '#aaa',
                        fontStyle: 'italic',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover:after': {
                        opacity: 1,
                      }
                    })
                  }}
                >
                  {isNoData? (
                    <>
                    <TableCell
                        colSpan={1}
                        sx={{
                          textAlign: 'center',
                          fontSize: '17px',
                          color: '#aaa',
                          // fontStyle: 'italic',
                          // backgroundColor: '#2a2a2a',
                        }}
                      >
                        {date}
                      </TableCell>
                      <TableCell
                        colSpan={4}
                        sx={{
                          textAlign: 'center',
                          fontSize: '17px',
                          color: '#aaa',
                          fontStyle: 'italic',
                          // backgroundColor: '#2a2a2a',
                        }}
                      >
                        No data available
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell sx={{ textAlign: 'left', fontSize: '17px' }}>{date}</TableCell>
                      <TableCell 
                        sx={{ 
                          textAlign: 'right', 
                          fontSize: '17px',
                          ...(index === lastRowIndex && dayCounts[date].success > 0 && {
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.2)',
                              borderRadius: '4px'
                            }
                          })
                        }}
                        onClick={index === lastRowIndex && dayCounts[date].success > 0 ? 
                          (e) => {
                            e.stopPropagation();
                            handleRowClick(contentType, date, 'Success');
                          } : undefined
                        }
                      >
                        {dayCounts[date].success}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          textAlign: 'right', 
                          fontSize: '17px',
                          ...(index === lastRowIndex && dayCounts[date].failure > 0 && {
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(244, 67, 54, 0.2)',
                              borderRadius: '4px'
                            }
                          })
                        }}
                        onClick={index === lastRowIndex && dayCounts[date].failure > 0 ? 
                          (e) => {
                            e.stopPropagation();
                            handleRowClick(contentType, date, 'Failure');
                          } : undefined
                        }
                      >
                        {dayCounts[date].failure}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          textAlign: 'right', 
                          fontSize: '17px',
                          ...(index === lastRowIndex && dayCounts[date].notModified > 0 && {
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 193, 7, 0.2)',
                              borderRadius: '4px'
                            }
                          })
                        }}
                        onClick={index === lastRowIndex && dayCounts[date].notModified > 0 ? 
                          (e) => {
                            e.stopPropagation();
                            handleRowClick(contentType, date, 'NotModified');
                          } : undefined
                        }
                      >
                        {dayCounts[date].notModified}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          textAlign: 'right', 
                          fontSize: '17px',
                          ...(index === lastRowIndex && dayCounts[date].total > 0 && {
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 193, 7, 0.2)',
                              borderRadius: '4px'
                            }
                          })
                        }}
                        onClick={index === lastRowIndex && dayCounts[date].total > 0 ? 
                          (e) => {
                            e.stopPropagation();
                            handleRowClick(contentType, date, 'All');
                          } : undefined
                        }
                      >
                        {dayCounts[date].total}
                      </TableCell>
                    </>
                  )}
                </TableRow>
                );
                })}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    );
  };

  return (
    <Box
      sx={{
        color: '#fff',
        padding: 3,
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 10,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
          mb: 4,
          mt: 2,
          px: 3,
          py: 2,
          borderRadius: 2,
          backgroundColor: '#1f1f1f',
          boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
          flexWrap: 'wrap',
        }}
      >
        <Typography gutterBottom sx={{ fontSize: '25px', fontWeight: 'bold', mt: 1 }}>
          Recent Trends
        </Typography>
        <FormControl sx={{ minWidth: 180 }} size="small" variant="outlined">
          <InputLabel
            shrink
            sx={{
              color: '#fff',
              '&.Mui-focused': { color: '#fff' },
            }}
          >
            Partner
          </InputLabel>
          <Select
            value={partner}
            onChange={handlePartnerChange}
            label="Partner"
            sx={{
              backgroundColor: '#2a2a2a',
              color: '#fff',
              '.MuiSvgIcon-root': { color: '#fff' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#888',
              },
            }}
            inputProps={{ 'aria-label': 'Partner' }}
          >
            {partners.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }} size="small" variant="outlined">
          <InputLabel
            shrink
            sx={{
              color: '#fff',
              '&.Mui-focused': { color: '#fff' },
            }}
          >
            Days
          </InputLabel>
          <Select
            value={days}
            onChange={handleDaysChange}
            label="Days"
            sx={{
              backgroundColor: '#2a2a2a',
              color: '#fff',
              '.MuiSvgIcon-root': { color: '#fff' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#888',
              },
            }}
            inputProps={{ 'aria-label': 'Days' }}
          >
            {dayOptions.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ ml: 'auto' }}>
          <Button
            variant="contained"
            onClick={handleDownload}
            disabled={loading || downloading}
            startIcon={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 22,
                  height: 22,
                }}
              >
                {downloading ? (
                  <CircularProgress size={18} sx={{ color: '#fff' }} />
                ) : (
                  <DownloadIcon sx={{ fontSize: 20 }} />
                )}
              </Box>
            }
            sx={{
              minWidth: '160px',
              height: '44px',
              borderRadius: '30px',
              fontSize: '15px',
              fontWeight: 600,
              textTransform: 'none',
              backgroundColor: '#e26838',
              '&:hover': {
                backgroundColor: '#d15a2c',
              },
              '&:disabled': {
                backgroundColor: '#a0a0a0',
                color: '#fff',
                cursor: 'not-allowed',
              },
            }}
          >
            Download
          </Button>
        </Box>
      </Box>

      {loading ? (
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
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ContentLoaderOverlay />
        </Box>
      ) : data?.rows?.length > 0 ? (
        data.rows.map((row) => renderTable(row.contentType, row.dayCounts))
      ) : (
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            mt: 5,
            color: '#aaa'
          }}
        >
          No data available for the selected partner.
        </Typography>
      )}

      {!isBottomVisible && !loading && data?.rows?.length > 0 && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 1000,
          }}
        >
          <button
            onClick={() =>
              bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
            }
            style={{
              backgroundColor: '#e26838',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              padding: '14px 24px',
              fontSize: '18px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
              fontWeight: 600,
              letterSpacing: '0.5px',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            ↓
          </button>
        </Box>
      )}
      <div ref={bottomRef}></div>
    </Box>
  );
};

export default RecentTrend;