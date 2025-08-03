import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ContentLoaderOverlay from './Common/CustomLoader';
import { format } from 'date-fns'

const partners = ['amazonprimevideo', 'bbcplayer', 'beinsportsconnect', 'cmgo', 'hbomax', 'iqiyi', 'mangotv', 'simplysouth', 'spotvnow', 'tvbanywhereplus', 'vidio', 'viu', 'wetv', 'youku', 'zee5'];
const dayOptions = [1, 2, 3, 4, 5];

const RecentTrend = () => {
  const { partner: routePartner } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState(routePartner || 'hbomax');
  const [days, setDays] = useState(parseInt(searchParams.get('days') || '5'));
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    getReport({ partner, days })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading report:', err);
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

  const downloadCSV = () => {
    const url = `http://localhost:9090/report/generate-pdf-report?projectName=${partner}&days=${days}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report_${partner}_${days}days.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // const rows = data?.rows.flatMap(row =>
    //   Object.entries(row.dayCounts).map(([date, values]) => ({
    //     Date: date,
    //     ContentType: row.contentType,
    //     Success: values.success,
    //     Failure: values.failure,
    //     NotModified: values.notModified,
    //     Total: values.total,
    //   }))
    // );

    // const csv =
    //   'Date,ContentType,Success,Failure,NotModified,Total\n' +
    //   rows.map(r => Object.values(r).join(',')).join('\n');

    // const blob = new Blob([csv], { type: 'text/csv' });
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = `recent_trends_${partner}_${days}days.csv`;
    // link.click();
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
              // fontSize: '16px',
              padding: '7px 0',
            },
            '& thead th': {
              backgroundColor: '#2a2a2a',
              // textAlign: 'center',
              fontWeight: 'bold',
              // fontSize: '17px'
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
            {dates.map((date) => (
              <TableRow
                key={date}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '& td, & th': { borderBottom: '1px solid #444' },
                  '&:last-child td': { borderBottom: 'none' },
                  borderBottom: '1px solid #444',
                }}
              >
                <TableCell sx={{ textAlign: 'left', fontSize: '17px' }}>{date}</TableCell>
                <TableCell sx={{ textAlign: 'right', fontSize: '17px' }}>{dayCounts[date].success}</TableCell>
                <TableCell sx={{ textAlign: 'right', fontSize: '17px' }}>{dayCounts[date].failure}</TableCell>
                <TableCell sx={{ textAlign: 'right', fontSize: '17px' }}>{dayCounts[date].notModified}</TableCell>
                <TableCell sx={{ textAlign: 'right', fontSize: '17px' }}>{dayCounts[date].total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Box>
      </Paper>
    );
  };

  const renderSkeletonTable = () => {
  return (
    <Paper
      sx={{
        mb: 4,
        background: '#2a2a2a',
        color: '#fff',
        borderRadius: 2,
        boxShadow: 3,
        p: 2
      }}
    >
      <Skeleton
        variant="text"
        animation="pulse"
        width={200}
        height={30}
        sx={{ bgcolor: '#3a3a3a', mb: 2 }}
      />
      <Table
        sx={{
          '& th, & td': {
            borderBottom: 'none',
          },
        }}
      >
        <TableHead>
          <TableRow>
            {[...Array(5)].map((_, i) => (
              <TableCell key={i}>
                <Skeleton
                  animation="pulse"
                  variant="text"
                  width={100}
                  height={20}
                  sx={{ bgcolor: '#3a3a3a' }}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(3)].map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {[...Array(5)].map((_, colIdx) => (
                <TableCell key={colIdx}>
                  <Skeleton
                    animation="pulse"
                    variant="text"
                    width={80}
                    height={20}
                    sx={{ bgcolor: '#3a3a3a' }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};


  return (
    <Box
      sx={{
        color: '#fff',
        padding: 3,
        // mt: 7,
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <Typography gutterBottom sx={{ fontSize: '30px', fontWeight: 'bold' }}>
        Recent Trends
      </Typography>

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
          <button
            onClick={downloadCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#e26838',
              color: '#fff',
              padding: '6px 14px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: '0px 2px 6px rgba(0,0,0,0.5)',
              transition: 'background-color 0.2s ease',
            }}
          >
            <DownloadIcon sx={{ fontSize: 20, mr: 1 }} />
            Download
          </button>
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
    </Box>
  );
};

export default RecentTrend;
