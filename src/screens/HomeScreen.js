import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HistoryIcon from '@mui/icons-material/History';

function HomeScreen() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const savedCount = localStorage.getItem('smokeCount');
    if (savedCount) {
      setCount(parseInt(savedCount));
    }
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem('smokeCount', newCount);
    
    // Save timestamp
    const timestamps = JSON.parse(localStorage.getItem('smokeTimestamps') || '[]');
    timestamps.push(new Date().toISOString());
    localStorage.setItem('smokeTimestamps', JSON.stringify(timestamps));
  };

  const handleDecrement = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      localStorage.setItem('smokeCount', newCount);

      // Remove last timestamp
      const timestamps = JSON.parse(localStorage.getItem('smokeTimestamps') || '[]');
      if (timestamps.length > 0) {
        timestamps.pop(); // Remove last element
        localStorage.setItem('smokeTimestamps', JSON.stringify(timestamps));
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
          position: 'relative',
          borderRadius: 0,
        }}
      >
        <Typography 
          variant={isMobile ? "h5" : "h4"}
          component="div" 
          sx={{ 
            position: 'absolute',
            top: { xs: 10, sm: 20 },
            left: { xs: 10, sm: 20 },
            fontWeight: 'bold',
          }}
        >
          SmokeHabit
        </Typography>

        <IconButton
          color="primary"
          onClick={() => navigate('/history')}
          sx={{
            position: 'absolute',
            top: { xs: 10, sm: 20 },
            right: { xs: 10, sm: 20 },
            '& .MuiSvgIcon-root': {
              fontSize: { xs: '2rem', sm: '3rem' },
            },
          }}
        >
          <HistoryIcon />
        </IconButton>

        <Typography 
          variant="h1" 
          component="div" 
          sx={{ 
            fontSize: { xs: '8rem', sm: '12rem' },
            fontWeight: 'bold',
            mb: { xs: 4, sm: 8 },
            textAlign: 'center',
          }}
        >
          {count}
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 6 }, 
            width: '100%',
            maxWidth: 800,
            px: { xs: 2, sm: 4 },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleIncrement}
            startIcon={<AddIcon sx={{ fontSize: { xs: '2rem', sm: '3rem' } }} />}
            sx={{
              flex: 1,
              py: { xs: 3, sm: 4 },
              fontSize: { xs: '1.5rem', sm: '2rem' },
              '& .MuiButton-startIcon': {
                marginRight: { xs: 2, sm: 3 },
              },
            }}
          >
            Artır
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDecrement}
            startIcon={<RemoveIcon sx={{ fontSize: { xs: '2rem', sm: '3rem' } }} />}
            disabled={count === 0}
            sx={{
              flex: 1,
              py: { xs: 3, sm: 4 },
              fontSize: { xs: '1.5rem', sm: '2rem' },
              '& .MuiButton-startIcon': {
                marginRight: { xs: 2, sm: 3 },
              },
            }}
          >
            Azalt
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default HomeScreen; 