import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getReport } from '../Service/ReportApi';
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

const partners = ['hbomax', 'amazonprimevideo', 'disneyplushotstar', 'viu'];
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
          mb: 4,
          background: '#333',
          color: '#fff',
          borderRadius: 2,
          boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        <Typography sx={{ p: 2, color: '#fff', fontWeight: 'bold', fontSize: '21px', ml: 8.5 }}>
          {contentType.toUpperCase()}
        </Typography>
        <Table
          sx={{
            tableLayout: 'fixed',
            width: '100%',
            '& th, & td': {
              borderBottom: '1px solid #444',
              padding: '10px',
              color: '#fff',
              textAlign: 'center',

            },
            '& thead th': {
              fontWeight: 'bold',
              
            },
            '& tbody tr:last-of-type td': {
              borderBottom: 'none',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#fff', width: '20%', textAlign: 'left', fontSize: '18px' }}>Date</TableCell>
              <TableCell sx={{ color: '#fff', width: '20%', textAlign: 'left', fontSize: '18px' }}>Success</TableCell>
              <TableCell sx={{ color: '#fff', width: '20%', textAlign: 'left', fontSize: '18px' }}>Failure</TableCell>
              <TableCell sx={{ color: '#fff', width: '20%', textAlign: 'left', fontSize: '18px' }}>Not Modified</TableCell>
              <TableCell sx={{
                paddingRight: 0,
                color: '#fff',
                width: '20%',
                textAlign: 'left',
                fontSize: '18px'
              }}
              >
                Total
              </TableCell>
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
                <TableCell style={{ color: '#fff', width: '20%', fontSize: '18px' }}>{date}</TableCell>
                <TableCell style={{ color: '#fff', width: '20%', fontSize: '18px' }}>{dayCounts[date].success}</TableCell>
                <TableCell style={{ color: '#fff', width: '20%', fontSize: '18px' }}>{dayCounts[date].failure}</TableCell>
                <TableCell style={{ color: '#fff', width: '20%', fontSize: '18px' }}>{dayCounts[date].notModified}</TableCell>
                <TableCell sx={{
                  paddingRight: 0,
                  // minWidth: '100px',
                  color: '#fff',
                  width: '20%',
                  fontSize: '18px'
                }}
                >
                  {dayCounts[date].total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
        padding: '16px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <Typography gutterBottom sx={{ fontSize: '24px', fontWeight: 'bold' }}>
        Recent Trends
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, mb: 4, mt: 3 }}>
        <FormControl sx={{ minWidth: 180 }} size="small" variant="outlined">
          <InputLabel 
            shrink
            sx={{ 
              color: '#fff',
              "&.Mui-focused": {
                color: "#fff",
              }, 
            }}
          >
            Partner
          </InputLabel>
          <Select
            value={partner}
            onChange={handlePartnerChange}
            label="Partner"
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
            {partners.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 100 }} size="small" variant="outlined">
          <InputLabel 
            shrink
            sx={{ 
              color: '#fff',
              "&.Mui-focused": {
                color: "#fff",
              }, 
            }}
          >
            Days
          </InputLabel>
          <Select
            value={days}
            onChange={handleDaysChange}
            label="Days"
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
            {dayOptions.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {!loading && data?.rows?.length > 0 ? (
        data.rows.map((row) => renderTable(row.contentType, row.dayCounts))
      ) : (
        <>
          {Array(2).fill().map((_, idx) => renderSkeletonTable())}
        </>
      )}
    </Box>
  );
};

export default RecentTrend;
