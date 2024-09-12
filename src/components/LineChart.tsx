import React, { useState, useEffect } from "react";

// UI/UX Components
import { MenuItem, Select, Checkbox, ListItemText, IconButton, Typography, Paper, Box, FormControl, InputLabel, CircularProgress, ToggleButtonGroup, ToggleButton, Button } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';


// Sisense Compose SDK Packages and Data Model File
import { LineChart, useExecuteQuery, DateRangeFilterTile } from "@sisense/sdk-ui";
import { measureFactory, Filter, filterFactory } from "@sisense/sdk-data";
import * as DM from "../sample-ecommerce";

const measureOptions = [
  { value: DM.Commerce.Revenue, label: 'Revenue', displayLabel: 'Total Revenue' },
  { value: DM.Commerce.Cost, label: 'Cost', displayLabel: 'Total Cost' },
  { value: DM.Commerce.Quantity, label: 'Quantity', displayLabel: 'Total Quantity' }
];

// Filter options
const filterOptions = [
  { label: 'Age Range', dimension: DM.Commerce.AgeRange },
  { label: 'Condition', dimension: DM.Commerce.Condition },
  { label: 'Gender', dimension: DM.Commerce.Gender }
];

const formatNumber = (value: number) => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toString();
};

const SeriesChartWithFilters = () => {
  const [mainMetric, setMainMetric] = useState<string>('Revenue'); 
  const [additionalMetrics, setAdditionalMetrics] = useState<string[]>([]);
  const [timeDimension, setTimeDimension] = useState<string>('Days'); 
  const [filters, setFilters] = useState<{ label: string, value: string | null }[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<string[]>([]);
  const [showFieldDropdown, setShowFieldDropdown] = useState<boolean>(false);

  // Sisense Date range filter state
  const [dateRangeFilter, setDateRangeFilter] = useState<Filter>(
    filterFactory.dateRange(DM.Commerce.Date.Months)
  );

  // Sisense Query for fetching filter values when a new filter is selected
  const filterDimension = selectedFilter ? filterOptions.find(f => f.label === selectedFilter)?.dimension : null;

  // Sisense Query for fetching the filters based on the selected dimension
  const { data: filterData, isLoading: isFilterLoading } = useExecuteQuery({
    dataSource: DM.DataSource,
    dimensions: filterDimension ? [filterDimension] : [],
    measures: []
  });

  // Sisense Query for fetching the KPIs 
  const { data: kpiData } = useExecuteQuery({
    dataSource: DM.DataSource,
    dimensions: [],
    measures: [
      measureFactory.sum(DM.Commerce.Revenue, 'Total Revenue'),
      measureFactory.sum(DM.Commerce.Quantity, 'Total Quantity'),
      measureFactory.sum(DM.Commerce.Cost, 'Total Cost')
    ],
    filters: [dateRangeFilter]
  });

  useEffect(() => {
    if (filterData && selectedFilter) {
      const values = filterData.rows.map((row: any) => row[0].text);
      setFilterValues(values);
    }
  }, [filterData, selectedFilter]);

  const handleAddFilter = () => {
    if (selectedFilter && !filters.some(filter => filter.label === selectedFilter)) {
      setFilters([...filters, { label: selectedFilter, value: null }]);
      setSelectedFilter(null);
    }
    setShowFieldDropdown(false);
  };

  // Fetch available filter values for a specific filter
  const handleFilterValueChange = (filterLabel: string, value: string) => {
    setFilters(filters.map(f => (f.label === filterLabel ? { ...f, value } : f)));
  };

  // Dynamically apply filters based on user selection
  const activeFilters: Filter[] = filters.map(f => {
    const filterDimension = filterOptions.find(opt => opt.label === f.label)?.dimension;
    return f.value && filterDimension ? filterFactory.equals(filterDimension, f.value) : null;
  }).filter(Boolean) as Filter[];

  return (
    <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
      <Typography variant="h6" gutterBottom>
        Historical Performance with Filters
      </Typography>

      <Box display="flex" justifyContent="flex-end" gap={4} marginBottom={3}>
        {kpiData && (
          <>
            <Box textAlign="center">
              <Typography variant="h5">{formatNumber(kpiData.rows[0][0].data)}</Typography>
              <Typography variant="body1">Revenue</Typography>
              <Box display="flex" alignItems="center" justifyContent="center" color="green">
                <ArrowUpwardIcon fontSize="small" />
                <Typography variant="body2">0.1%</Typography>
              </Box>
            </Box>
            <Box textAlign="center">
              <Typography variant="h5">{formatNumber(kpiData.rows[0][1].data)}</Typography>
              <Typography variant="body1">Sales Items</Typography>
              <Box display="flex" alignItems="center" justifyContent="center" color="green">
                <ArrowUpwardIcon fontSize="small" />
                <Typography variant="body2">0.1%</Typography>
              </Box>
            </Box>
            <Box textAlign="center">
              <Typography variant="h5">{formatNumber(kpiData.rows[0][2].data)}</Typography>
              <Typography variant="body1">Cost</Typography>
              <Box display="flex" alignItems="center" justifyContent="center" color="green">
                <ArrowUpwardIcon fontSize="small" />
                <Typography variant="body2">0.1%</Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>

      <Box display="flex" gap={2} marginBottom={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Main Metric</InputLabel>
          <Select
            value={mainMetric}
            onChange={(event) => setMainMetric(event.target.value)}
            label="Main Metric"
          >
            {measureOptions.map(option => (
              <MenuItem key={option.label} value={option.label}>
                {option.displayLabel}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Additional Metrics</InputLabel>
          <Select
            multiple
            value={additionalMetrics}
            onChange={(event) => setAdditionalMetrics(event.target.value as string[])}
            renderValue={(selected) => (selected as string[]).join(', ')}
            label="Additional Metrics"
          >
            {measureOptions.map(option => (
              <MenuItem key={option.label} value={option.label}>
                <Checkbox checked={additionalMetrics.indexOf(option.label) > -1} />
                <ListItemText primary={option.displayLabel} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton onClick={() => setShowFieldDropdown(!showFieldDropdown)}>
          <FilterListIcon />
        </IconButton>
      </Box>

      <Box display="flex" justifyContent="flex-end" marginBottom={2}>
        <DateRangeFilterTile
          title="Date Range"
          dataSource={DM.DataSource}
          attribute={DM.Commerce.Date.Months}
          filter={dateRangeFilter}
          onChange={(newFilter: Partial<Filter>) => {
            setDateRangeFilter(newFilter as Filter);
          }} 
        />
      </Box>

      <Box marginBottom={2}>
        <ToggleButtonGroup
          value={timeDimension}
          exclusive
          onChange={(event, newValue) => setTimeDimension(newValue)}
          aria-label="Time Dimension"
        >
          <ToggleButton value="Days">1d</ToggleButton>
          <ToggleButton value="Weeks">1w</ToggleButton>
          <ToggleButton value="Months">1m</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {showFieldDropdown && (
        <Box display="flex" gap={2} marginBottom={2}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Add Filter</InputLabel>
            <Select
              value={selectedFilter || ""}
              onChange={(event) => setSelectedFilter(event.target.value)}
              label="Add Filter"
            >
              {filterOptions.map((option) => (
                <MenuItem key={option.label} value={option.label}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAddFilter}>
            + Add Filter
          </Button>
        </Box>
      )}

      {filters.map((filter, index) => (
        <FormControl key={index} sx={{ minWidth: 200, marginBottom: 2 }}>
          <InputLabel>{filter.label}</InputLabel>
          {isFilterLoading ? (
            <CircularProgress />
          ) : (
            <Select
              value={filter.value || ""}
              onChange={(event) => handleFilterValueChange(filter.label, event.target.value)}
              label={filter.label}
            >
              {filterValues.map(value => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      ))}

      <LineChart
        dataSet={DM.DataSource}
        dataOptions={{
          category: [timeDimension === 'Days' ? DM.Commerce.Date.Days : timeDimension === 'Weeks' ? DM.Commerce.Date.Weeks : DM.Commerce.Date.Months],
          value: [measureFactory.sum(DM.Commerce.Revenue, mainMetric), ...additionalMetrics.map(metric => measureFactory.sum(DM.Commerce[metric], metric))],
          breakBy: [],
        }}
        filters={[...activeFilters, dateRangeFilter]}
        styleOptions={{
          lineWidth: { width: 'bold' },
        }}
      />
    </Paper>
  );
};

export default SeriesChartWithFilters;
