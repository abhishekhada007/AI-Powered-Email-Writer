import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CssBaseline,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MemoryIcon from '@mui/icons-material/Memory';

function DocumentTitle({ title }) {
  React.useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00bcd4' },
    secondary: { main: '#673ab7' },
    background: { default: '#0a0f1a', paper: 'rgba(15, 23, 42, 0.75)' },
    text: { primary: '#e0e6f1' },
  },
  typography: { fontFamily: 'Montserrat, sans-serif' },
});

const GlassCard = styled(motion.div)(({ theme }) => ({
  background: 'rgba(15, 23, 42, 0.72)',
  boxShadow: '0 8px 48px rgba(0, 188, 212, 0.5)',
  borderRadius: 22,
  backdropFilter: 'blur(20px)',
  border: '1.8px solid rgba(0, 188, 212, 0.3)',
  padding: '3rem',
  maxWidth: 620,
  margin: 'auto',
  [theme.breakpoints.down('sm')]: {
    padding: '2rem 1.5rem',
    margin: '1.5rem',
  },
}));

const AnimatedBackground = styled('div')({
  position: 'fixed',
  inset: 0,
  overflow: 'hidden',
  zIndex: -1,
  background: 'radial-gradient(circle at 20% 30%, #004c6d, #001014 90%)',
});

const FloatingOrb = styled(motion.div)({
  position: 'absolute',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 188, 212, 0.15)',
  filter: 'blur(30px)',
  opacity: 0.7,
});

const TechGrid = styled('svg')({
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  opacity: 0.07,
});

function AppLogo() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 80,
        height: 80,
        margin: 'auto',
        filter: 'drop-shadow(0 0 6px #00bcd4aa)',
      }}
    >
      <MailOutlineIcon
        sx={{
          fontSize: 70,
          color: '#00bcd4',
        }}
      />
      <MemoryIcon
        sx={{
          position: 'absolute',
          top: 18,
          left: 18,
          fontSize: 35,
          color: '#673ab7bb',
          opacity: 0.8,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 0 4px #673ab7cc)',
        }}
      />
    </Box>
  );
}

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCopy, setShowCopy] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setGeneratedReply('');
    try {
      const response = await axios.post(`${API_URL}/generate`, {
        emailContent,
        tone,
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch {
      setError('Failed to generate email reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setShowCopy(true);
  };

  const orbs = [
    { size: 140, top: '25%', left: '15%', animationDelay: '0s' },
    { size: 100, top: '60%', left: '45%', animationDelay: '6s' },
    { size: 180, top: '40%', left: '75%', animationDelay: '3s' },
    { size: 110, top: '10%', left: '85%', animationDelay: '9s' },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DocumentTitle title="AI Email Reply Generator" />

      <AnimatedBackground>
        {orbs.map(({ size, top, left, animationDelay }, i) => (
          <FloatingOrb
            key={i}
            style={{ width: size, height: size, top, left }}
            animate={{ y: [0, 25, 0], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: parseFloat(animationDelay) }}
          />
        ))}
        <TechGrid viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {[...Array(20)].map((_, i) => (
            <line
              key={i}
              x1={`${i * 5}`}
              y1="0"
              x2={`${i * 5}`}
              y2="100"
              stroke="#00bcd4"
              strokeWidth="0.06"
              strokeOpacity="0.07"
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <line
              key={i + 20}
              x1="0"
              y1={`${i * 5}`}
              x2="100"
              y2={`${i * 5}`}
              stroke="#00bcd4"
              strokeWidth="0.06"
              strokeOpacity="0.07"
            />
          ))}
        </TechGrid>
      </AnimatedBackground>

      <GlassCard
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 210, damping: 18 }}
      >
        <motion.div
          initial={{ scale: 0.3, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.1, stiffness: 170 }}
          style={{ textAlign: 'center', marginBottom: '1rem' }}
        >
          <AppLogo />
        </motion.div>

        <Typography
          component={motion.h1}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15, type: 'tween' }}
          variant="h3"
          sx={{
            fontWeight: 900,
            letterSpacing: 2,
            mb: 5,
            textAlign: 'center',
            background: `linear-gradient(90deg, ${darkTheme.palette.secondary.main}, ${darkTheme.palette.primary.main}, #00e5ff 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          AI Email Reply Generator
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={6}
          variant="filled"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{
            mb: 3,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            borderRadius: 2,
            '& .MuiFilledInput-root': { color: '#e0e6f1' },
            '& label': { color: '#93a8c3' },
            '& label.Mui-focused': { color: darkTheme.palette.primary.main },
          }}
        />

        <FormControl fullWidth variant="filled" sx={{ mb: 3 }}>
          <InputLabel sx={{ color: '#93a8c3' }}>Tone (Optional)</InputLabel>
          <Select
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
            sx={{
              color: '#e0e6f1',
              '& .MuiSelect-icon': { color: '#b0bec5' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: darkTheme.palette.primary.main },
            }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSubmit}
            disabled={!emailContent.trim() || loading}
            sx={{
              py: 1.5,
              fontWeight: 700,
              fontSize: 18,
              mb: 1,
              mt: 1,
              background: `linear-gradient(90deg, ${darkTheme.palette.secondary.main} 40%, ${darkTheme.palette.primary.main} 90%)`,
              color: '#fff',
              boxShadow: '0 4px 20px 0 rgba(0, 188, 212, 0.4)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: `linear-gradient(90deg, ${darkTheme.palette.primary.main} 50%, ${darkTheme.palette.secondary.main} 90%)`,
                boxShadow: `0 8px 28px 0 ${darkTheme.palette.primary.main}aa`,
                transform: 'translateY(-2px) scale(1.05)',
              },
              '&:disabled': {
                opacity: 0.6,
                cursor: 'not-allowed',
              },
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Generate Reply'}
          </Button>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <Alert severity="error" sx={{ mt: 3, backgroundColor: '#3b0000', color: '#ff6b6b', fontWeight: 600 }}>
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {generatedReply && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{ marginTop: 30, textAlign: 'left' }}
            >
              <Typography
                variant="h6"
                sx={{ color: darkTheme.palette.primary.main, fontWeight: 700, mb: 1, userSelect: 'none' }}
              >
                Generated Reply:
              </Typography>
              <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="filled"
                  value={generatedReply}
                  inputProps={{ readOnly: true }}
                  sx={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: 2,
                    fontFamily: "'Fira Mono', monospace",
                    fontSize: 15,
                    '& .MuiFilledInput-root': { color: '#e0e6f1' },
                  }}
                />
              </motion.div>
              <Button
                variant="outlined"
                size="large"
                onClick={handleCopy}
                sx={{
                  mt: 2,
                  borderColor: darkTheme.palette.secondary.main,
                  color: darkTheme.palette.secondary.main,
                  fontWeight: 600,
                  ':hover': {
                    borderColor: darkTheme.palette.primary.main,
                    color: darkTheme.palette.primary.main,
                    backgroundColor: `${darkTheme.palette.primary.main}22`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Copy to Clipboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={showCopy}
          autoHideDuration={1500}
          onClose={() => setShowCopy(false)}
        >
          <Alert
            onClose={() => setShowCopy(false)}
            severity="success"
            sx={{
              background: `linear-gradient(90deg, ${darkTheme.palette.secondary.main}, ${darkTheme.palette.primary.main})`,
              color: '#fff',
              fontWeight: 600,
              boxShadow: `0 0 15px ${darkTheme.palette.primary.main}`,
            }}
          >
            Reply copied to clipboard!
          </Alert>
        </Snackbar>
      </GlassCard>

      <Box sx={{ textAlign: 'center', mt: 2, mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(224, 230, 241, 0.6)', fontWeight: 400 }}>
          Developed by Abhishek Hada
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
