// src/components/BidArchive.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Toolbar,
  Typography,
  CircularProgress,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import "../../css/BidArchive.css"; // Ensure this CSS file exists for additional styling if needed

const BidArchive = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [archiveData, setArchiveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('BidsId');

  // Fetch archived bids from the server
  useEffect(() => {
    const fetchArchivedBids = async () => {
      try {
        const response = await axios.get('http://localhost:3001/bids/archived-bids');
        setArchiveData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching archived bids:', err);
        setError('Failed to fetch archived bids.');
        setLoading(false);
      }
    };

    fetchArchivedBids();
  }, []);

  // Handle sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sort function
  const sortedArchive = archiveData.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter the archive data based on the search term
const filteredArchive = sortedArchive.filter((bid) => {
  const bidsId = bid.BidsId ? bid.BidsId.toLowerCase() : '';
  const ad = bid.AD ? bid.AD.toLowerCase() : '';
  const bidSize = bid.BidSize ? bid.BidSize.toString() : '';

  return bidsId.includes(searchTerm.toLowerCase()) ||
         ad.includes(searchTerm.toLowerCase()) ||
         bidSize.includes(searchTerm);
});


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="bid-archive-container">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <Typography variant="h5">Bid Archive</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Bid No., AD, etc."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
          sx={{ width: '300px' }}
        />
      </Toolbar>

      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
        <Table aria-label="bid archive table">
          <TableHead>
            <TableRow>
              <TableCell>Sl. No</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'BidsId'}
                  direction={orderBy === 'BidsId' ? order : 'asc'}
                  onClick={() => handleRequestSort('BidsId')}
                >
                  Bid No.
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'StartDate'}
                  direction={orderBy === 'StartDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('StartDate')}
                >
                  Start Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'EndDate'}
                  direction={orderBy === 'EndDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('EndDate')}
                >
                  End Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'ParticipantsCount'}
                  direction={orderBy === 'ParticipantsCount' ? order : 'asc'}
                  onClick={() => handleRequestSort('ParticipantsCount')}
                >
                  No. of Participants
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'MonthDuration'}
                  direction={orderBy === 'MonthDuration' ? order : 'asc'}
                  onClick={() => handleRequestSort('MonthDuration')}
                >
                  Duration (Months)
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'BidSize'}
                  direction={orderBy === 'BidSize' ? order : 'asc'}
                  onClick={() => handleRequestSort('BidSize')}
                >
                  Bid Size
                </TableSortLabel>
              </TableCell>
              <TableCell>AD</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArchive.length > 0 ? (
              filteredArchive.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((bid, index) => (
                <TableRow key={bid._id} hover>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{bid.BidsId || bid._id}</TableCell>
                  <TableCell>{formatDate(bid.StartDate)}</TableCell>
                  <TableCell>{formatDate(bid.EndDate)}</TableCell>
                  <TableCell>{bid.ParticipantsCount}</TableCell>
                  <TableCell>{bid.MonthDuration}</TableCell>
                  <TableCell>{bid.BidSize}</TableCell>
                  <TableCell>{bid.AD}</TableCell>
                  <TableCell>
                    <Link to={`/bids/${bid._id}/archive-summary`} style={{ textDecoration: 'none' }}>
                      <IconButton color="primary" aria-label="view bid summary">
                        <VisibilityIcon />
                      </IconButton>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No bids found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredArchive.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ marginTop: '10px' }}
      />
    </div>
  );
};

export default BidArchive;
