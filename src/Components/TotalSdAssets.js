import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
  Autocomplete,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { getReport } from "../Service/ReportApi";

const COLORS = ["#4DB6AC", "#FF7043", "#9575CD", "#64B5F6"];
const partners = [
  "amazonprimevideo", "bbcplayer", "beinsportsconnect", "cmgo",
  "hbomax", "iqiyi", "mangotv", "simplysouth", "spotvnow",
  "tvbanywhereplus", "vidio", "viu", "wetv", "youku", "zee5"
];

const ChartWrapper = ({ title, children, height = 360 }) => (
  <Box sx={{ mb: 4, backgroundColor: "#1d1d1d", p: 3, borderRadius: 2 }}>
    <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
      {title}
    </Typography>
    <ResponsiveContainer width="100%" height={height}>
      {children}
    </ResponsiveContainer>
  </Box>
);

const TotalVodAssets = () => {
  const [selectedPartner, setSelectedPartner] = useState(partners[0]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    setLoading(true);
    getReport({ partner: selectedPartner, days: 5 })
      .then((res) => {
        const totals = { success: 0, failure: 0, notModified: 0, total: 0 };
        const dailyData = [];
        const contentTypeTotals = {};

        res.rows.forEach((row) => {
          Object.entries(row.dayCounts).forEach(([date, day]) => {
            let daily = dailyData.find((d) => d.date === date);
            if (!daily) {
              daily = { date, success: 0, failure: 0, notModified: 0, total: 0 };
              dailyData.push(daily);
            }

            daily.success += day.success || 0;
            daily.failure += day.failure || 0;
            daily.notModified += day.notModified || 0;
            daily.total += (day.success || 0) + (day.failure || 0);

            totals.success += day.success || 0;
            totals.failure += day.failure || 0;
            totals.notModified += day.notModified || 0;
            totals.total += (day.success || 0) + (day.failure || 0);
          });

          contentTypeTotals[row.contentType] =
            (contentTypeTotals[row.contentType] || 0) +
            Object.values(row.dayCounts).reduce(
              (sum, day) => sum + day.success,
              0
            );
        });

        dailyData.sort((a, b) => new Date(a.date) - new Date(b.date));
        setDashboardData({ totals, dailyData, contentTypeTotals });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard:", err);
        setLoading(false);
      });
  }, [selectedPartner]);

  const handlePartnerChange = (event, value) => {
    if (value) setSelectedPartner(value);
  };

  const pieData = dashboardData
    ? [
        { name: "Success", value: dashboardData.totals.success },
        { name: "Failure", value: dashboardData.totals.failure },
        { name: "Not Modified", value: dashboardData.totals.notModified },
      ]
    : [];

  const barData = dashboardData
    ? Object.entries(dashboardData.contentTypeTotals).map(([key, value]) => ({
        name:
          key.toLowerCase() === "tvseries"
            ? "TV Series"
            : key.toLowerCase() === "tvseason"
            ? "TV Season"
            : key.toLowerCase() === "tvepisode"
            ? "TV Episode"
            : "Movie",
        value,
      }))
    : [];

  return (
    <Box 
      sx={{ 
        // minHeight: "100vh",
        p: 4,
        padding: 3,
        mt: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "#fff" }}>
        Syndication Dashboard
      </Typography>

      <Autocomplete
        disablePortal
        options={partners}
        sx={{ width: 300, mb: 4 }}
        value={selectedPartner}
        onChange={handlePartnerChange}
        renderInput={(params) => (
          <TextField {...params} label="Select Partner" variant="outlined" sx={{
            "& .MuiInputBase-root": { color: "#fff", backgroundColor: "#333" },
            "& .MuiInputLabel-root": { color: "#ccc" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
          }} />
        )}
      />

      <Grid container spacing={3}>
        {loading
          ? [...Array(3)].map((_, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Skeleton variant="rectangular" height={100} />
              </Grid>
            ))
          : [
              { title: "Total Success", value: dashboardData.totals.success },
              { title: "Total Failures", value: dashboardData.totals.failure },
              { title: "Total Assets", value: dashboardData.totals.total },
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ backgroundColor: "#333", border: "1px solid #444" }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "#ccc" }}>
                      {item.title}
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold" }}>
                      {item.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      {!loading && dashboardData ? (
        <Grid container spacing={4} sx={{ mt: 4 }}>
  <Grid item xs={12} md={9}>
    <ChartWrapper title="Syndication Result Distribution">
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(1)}%)`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}`, name]} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </ChartWrapper>
  </Grid>



          <Grid item xs={12} md={6}>
            <ChartWrapper title="Daily Total Content Updates">
              <BarChart data={dashboardData.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="total" fill="#9575CD" />
              </BarChart>
            </ChartWrapper>
          </Grid>

          <Grid item xs={12} md={6}>
            <ChartWrapper title="Success Rate by Content Type">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="value" fill="#64B5F6" />
              </BarChart>
            </ChartWrapper>
          </Grid>

          <Grid item xs={12} md={6}>
            <ChartWrapper title="Daily Success/Failure Trend">
              <LineChart data={dashboardData.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="success" stroke="#4DB6AC" />
                <Line type="monotone" dataKey="failure" stroke="#FF7043" />
                <Line type="monotone" dataKey="notModified" stroke="#9575CD" />
              </LineChart>
            </ChartWrapper>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Skeleton variant="rectangular" height={360} />
        </Box>
      )}
    </Box>
  );
};

export default TotalVodAssets;
