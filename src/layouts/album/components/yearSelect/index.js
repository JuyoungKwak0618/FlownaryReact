import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material';

function YearSelect({ selectedYear, onChange }) {
  // 년도 목록 생성 (예: 2000년부터 현재 년도까지)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2021 }, (_, index) => 2022 + index).reverse();

  return (
    <>
      <FormControl sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
        <Typography mt={3} id="year-select-label">
        </Typography>
        <Select
          labelId="year-select-label"
          id="year-select"
          value={selectedYear}
          onChange={onChange}
          sx={{ width: "6rem", fontSize: 'large', py: 0.5, px: 2 }}
        >
          {years.map(year => (
            <MenuItem key={year} value={year} >
              {year > 2022 ? year : "Year"}
            </MenuItem>
          ))}
        </Select>

      </FormControl >
    </>
  );
}

YearSelect.propTypes = {
  selectedYear: PropTypes.number.isRequired, 
  onChange: PropTypes.func.isRequired,
};

export default YearSelect;
