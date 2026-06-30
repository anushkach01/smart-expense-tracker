import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, TrendingUp } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import {
  loginUser,
  clearError,
  selectAuth,
} from '../features/auth/authSlice';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(selectAuth);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: 'anushkac@gmail.com',
      password: 'password123',
      rememberMe: false,
    },
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2.5,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }} color="text.primary">
            Smart Expense
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Welcome back! Please sign in.
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 2 }}
                placeholder="Enter your email"
              />
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ mb: 2 }}
                placeholder="Enter your password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />

          {/* Remember Me + Forgot Password */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      size="small"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">Remember me</Typography>
                  }
                />
              )}
            />
            <Typography
              variant="body2"
              color="primary.main"
              sx={{ cursor: 'pointer', fontWeight: 500 }}
            >
              Forgot password?
            </Typography>
          </Box>

          {/* Login Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5, fontSize: '0.95rem' }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </Button>

          {/* Sign Up */}
          <Box sx={{ textAlign: 'center', mt: 2.5 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Typography
                component="span"
                variant="body2"
                color="primary.main"
                sx={{ cursor: 'pointer', fontWeight: 600 }}
              >
                Sign up
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default LoginPage;