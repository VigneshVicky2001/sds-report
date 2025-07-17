import React, { useState } from "react";
import {
  Typography,
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { GlobalStyles } from '@mui/material';
import { useNavigate } from "react-router-dom";

const COLORS = ["#4DB6AC", "#FF7043", "#9575CD", "#64B5F6"];

const projectRawData = [
  {
    project: "amazonprimevideo",
    total_failure: 2798,
    total_success: 247,
    total_not_modified: 17847,
    total: 20892,
  },
  {
    project: "viu",
    total_failure: 1023,
    total_success: 548,
    total_not_modified: 12500,
    total: 14071,
  },
];

const contentTypeRawData = [
  {
    project: "amazonprimevideo",
    totals: {
      movie: 1936,
      tvepisode: 16431,
      tvseason: 1521,
      tvseries: 904,
    },
  },
  {
    project: "viu",
    totals: {
      movie: 1402,
      tvepisode: 9800,
      tvseason: 2200,
      tvseries: 669,
    },
  },
];

// Custom active shape to make hover enlarge effect
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill,
  } = props;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 15}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
};

const TotalVodAssets = () => {
  const navigate = useNavigate();
  const [animateCharts, setAnimateCharts] = useState(true);
  const [selectedProject, setSelectedProject] = useState(projectRawData[0].project);
  const [status, setStatus] = useState(false);
  const [hoveredIndex1, setHoveredIndex1] = useState(null);
  const [hoveredIndex2, setHoveredIndex2] = useState(null);

  const handleProjectChange = (event) => {
    const newProject = event.target.value;
    setAnimateCharts(false);
    setSelectedProject(newProject);
    requestAnimationFrame(() => setAnimateCharts(true));
  };

  const selectedData = projectRawData.find(
    (proj) => proj.project === selectedProject
  );
  const contentTypeData = contentTypeRawData.find(
    (item) => item.project === selectedProject
  );

  const pieData1 = [
    { name: "Success", value: selectedData.total_success },
    { name: "Failure", value: selectedData.total_failure },
    { name: "Not Modified", value: selectedData.total_not_modified },
    {
      name: "Remaining",
      value:
        selectedData.total -
        (selectedData.total_success +
          selectedData.total_failure +
          selectedData.total_not_modified),
    },
  ];

  const pieData2 = [
  { name: "Movie", value: contentTypeData.totals.movie },
  { name: "TV Series", value: contentTypeData.totals.tvseries },
  { name: "TV Season", value: contentTypeData.totals.tvseason },
  { name: "TV Episode", value: contentTypeData.totals.tvepisode },
];


  return (
    <>
      <GlobalStyles
        styles={{
          'g[tabindex]:focus': {
            outline: 'none',
            stroke: 'none',         // Kill any default stroke
            filter: 'none',         // Sometimes used for glow
          },
          'g[tabindex]:focus path': {
            outline: 'none',
            stroke: 'none',
            filter: 'none',
          },
        }}
      />
    <Box
      sx={{
        backgroundColor: "#212121",
        minHeight: "100vh",
        padding: "40px",
        color: "#e0e0e0",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        Syndication
      </Typography>

      <FormControl sx={{ mb: 5, minWidth: 300 }}>
        <InputLabel sx={{ color: "#e0e0e0" }}>Select partner</InputLabel>
        <Select
          value={selectedProject}
          label="Select Project"
          onChange={handleProjectChange}
          sx={{
            backgroundColor: "#424242",
            color: "#e0e0e0",
            "& .MuiSvgIcon-root": { color: "#e0e0e0" },
          }}
        >
          {projectRawData.map((proj) => (
            <MenuItem key={proj.project} value={proj.project}>
              {proj.project}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
            Content Status
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData1}
                cx="50%"
                cy="50%"
                outerRadius={150}
                dataKey="value"
                labelLine={false}
                onClick={(_, index) => {
                  const clicked = pieData1[index];
                  const label = clicked.name;
                  let status = null;

                  if (label === "Success") status = "success";
                  else if (label === "Failure") status = "failure";
                  else if (label === "Not Modified") status = "notModified";

                  if (status) {
                    navigate(`/partner-details/${selectedProject}/${status}`);
                  }
                }}
                isAnimationActive={animateCharts}
                activeIndex={hoveredIndex1}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setHoveredIndex1(index)}
                onMouseLeave={() => setHoveredIndex1(null)}
                label={({ name, value }) => (value > 0 ? `${name}: ${value}` : "")}
              >
                {pieData1.map((entry, index) => (
                  <Cell
                    key={`cell-status-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    tabIndex={-1} // 👈 disables focus on each slice
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <Typography variant="subtitle1" sx={{ mt: 2, textAlign: "center" }}>
            Total: {selectedData.total}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ mb: 2, textAlign: "center"}}>
            Overall Summary
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData2}
                cx="50%"
                cy="50%"
                outerRadius={150}
                dataKey="value"
                labelLine={false}
                animationDuration={200}
                isAnimationActive={animateCharts}
                activeIndex={hoveredIndex2}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setHoveredIndex2(index)}
                onMouseLeave={() => setHoveredIndex2(null)}
                label={({ name, value }) =>
                  value > 0 ? `${name}: ${value}` : ""
                }
              >
                {pieData2.map((entry, index) => (
                  <Cell
                    key={`cell-status-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    tabIndex={-1}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <Typography variant="subtitle1" sx={{ mt: 2, textAlign: "center" }}>
            Total: {pieData2.reduce((sum, item) => sum + item.value, 0)}
          </Typography>
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default TotalVodAssets;
