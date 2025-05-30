import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Paper,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import trLocale from 'date-fns/locale/tr';

function HistoryScreen() {
  const [timestamps, setTimestamps] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const savedTimestamps = JSON.parse(localStorage.getItem('smokeTimestamps') || '[]');
    setTimestamps(savedTimestamps);
  }, []);

  const handleDelete = (index) => {
    const newTimestamps = [...timestamps];
    const deletedTimestamp = newTimestamps[index];
    newTimestamps.splice(index, 1);
    setTimestamps(newTimestamps);
    localStorage.setItem('smokeTimestamps', JSON.stringify(newTimestamps));

    // Eğer silinen kayıt bugünün tarihine aitse count'u güncelle
    const deletedDate = new Date(deletedTimestamp);
    const today = new Date();
    if (
      deletedDate.getDate() === today.getDate() &&
      deletedDate.getMonth() === today.getMonth() &&
      deletedDate.getFullYear() === today.getFullYear()
    ) {
      const currentCount = parseInt(localStorage.getItem('smokeCount') || '0');
      if (currentCount > 0) {
        const newCount = currentCount - 1;
        localStorage.setItem('smokeCount', newCount);
      }
    }
  };

  const filterTimestamps = () => {
    const selectedDateStart = new Date(selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);
    
    const selectedDateEnd = new Date(selectedDate);
    selectedDateEnd.setHours(23, 59, 59, 999);

    switch (activeTab) {
      case 0: // Daily
        return timestamps.filter(timestamp => {
          const date = new Date(timestamp);
          return date >= selectedDateStart && date <= selectedDateEnd;
        });
      case 1: // Weekly
        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        
        return timestamps.filter(timestamp => {
          const date = new Date(timestamp);
          return date >= weekStart && date <= weekEnd;
        });
      case 2: // Monthly
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
        
        return timestamps.filter(timestamp => {
          const date = new Date(timestamp);
          return date >= monthStart && date <= monthEnd;
        });
      default:
        return timestamps;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSelectedDate = () => {
    switch (activeTab) {
      case 0:
        return selectedDate.toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 1:
        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - ${weekEnd.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      case 2:
        return selectedDate.toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
        });
      default:
        return '';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
          </IconButton>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ flexGrow: 1 }}
          >
            Geçmiş
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Paper sx={{ mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1, sm: 1.5 },
              },
            }}
          >
            <Tab label="Günlük" />
            <Tab label="Haftalık" />
            <Tab label="Aylık" />
          </Tabs>
        </Paper>

        <Box sx={{ mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
            <DatePicker
              label="Tarih Seçin"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    },
                  }}
                />
              )}
              views={activeTab === 0 ? ['day'] : activeTab === 1 ? ['day'] : ['month', 'year']}
            />
          </LocalizationProvider>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mt: 1, 
              textAlign: 'center',
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            {formatSelectedDate()}
          </Typography>
        </Box>

        <List>
          {filterTimestamps().map((timestamp, index) => (
            <ListItem 
              key={timestamp}
              sx={{
                py: { xs: 1, sm: 1.5 },
              }}
            >
              <ListItemText 
                primary={formatDate(timestamp)}
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                }}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(index)}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default HistoryScreen; 