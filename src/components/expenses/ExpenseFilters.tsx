import React, { useCallback } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
} from '@mui/material';
import { Search, FilterList, Clear } from '@mui/icons-material';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  setSearchQuery,
  setFilterCategory,
  clearFilters,
  selectSearchQuery,
  selectFilterCategory,
} from '../../features/expenses/expenseSlice';
import { CATEGORIES } from '../../utils/categoryConfig';
import useDebounce from '../../hooks/useDebounce';
import { useEffect } from 'react';

const ExpenseFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const filterCategory = useAppSelector(selectFilterCategory);

  const [localSearch, setLocalSearch] = React.useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 400);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setFilterCategory(e.target.value));
    },
    [dispatch]
  );

  const handleClearFilters = useCallback(() => {
    setLocalSearch('');
    dispatch(clearFilters());
  }, [dispatch]);

  const hasActiveFilters =
    localSearch !== '' || filterCategory !== 'All';

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'center',
        mb: 2,
      }}
    >
      {/* Search */}
      <TextField
        placeholder="Search expenses..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        size="small"
        sx={{ flex: 1, minWidth: 200 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Category Filter */}
      <TextField
        select
        value={filterCategory}
        onChange={handleCategoryChange}
        size="small"
        sx={{ minWidth: 160 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <FilterList sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
      >
        <MenuItem value="All">All Categories</MenuItem>
        {CATEGORIES.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<Clear />}
          onClick={handleClearFilters}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Clear
        </Button>
      )}
    </Box>
  );
};

export default ExpenseFilters;