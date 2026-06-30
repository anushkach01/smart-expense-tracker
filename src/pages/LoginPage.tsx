import React, { useEffect, useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {
  Visibility,
  VisibilityOff,
  TrendingUp,
} from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';

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

interface ForgotPasswordData {
  email: string;
}

const SuccessAlert = React.forwardRef<HTMLDivElement, AlertProps>(
  function SuccessAlert(props, ref) {
    return (
      <MuiAlert
        ref={ref}
        elevation={6}
        variant="filled"
        {...props}
      />
    );
  }
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error, token } = useAppSelector(selectAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  const {
    control: forgotControl,
    handleSubmit: handleForgotSubmit,
    reset,
    formState: { errors: forgotErrors },
  } = useForm<ForgotPasswordData>({
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true });
    }
  };

  const onForgotPassword = async (
    data: ForgotPasswordData
  ) => {
    console.log('Password reset request:', data);

    await new Promise((resolve) =>
      setTimeout(resolve, 1200)
    );

    setForgotOpen(false);
    reset();
    setSnackbarOpen(true);
  };

  return (    <>
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
            boxShadow: 4,
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
                width: 56,
                height: 56,
                borderRadius: 3,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <TrendingUp
                sx={{
                  color: 'white',
                  fontSize: 30,
                }}
              />
            </Box>

            <Typography variant="h5" fontWeight={700}>
              Smart Expense Tracker
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Sign in to manage your expenses.
            </Typography>
          </Box>

          {error && (
            <MuiAlert severity="error" sx={{ mb: 2 }}>
              {error}
            </MuiAlert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value:
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  placeholder="Enter your email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  placeholder="Enter your password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ mb: 2 }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() =>
                              setShowPassword((prev) => !prev)
                            }
                          >
                            {showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
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
                      />
                    }
                    label="Remember me"
                  />
                )}
              />

              <Typography
                variant="body2"
                color="primary.main"
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => setForgotOpen(true)}
              >
                Forgot Password?
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.4,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {loading ? 'Signing In...' : 'Login'}
            </Button>
          </Box>
        </Card>
      </Box>      <Dialog
        open={forgotOpen}
        onClose={() => {
          setForgotOpen(false);
          reset();
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Reset Password</DialogTitle>

        <Box
          component="form"
          onSubmit={handleForgotSubmit(onForgotPassword)}
        >
          <DialogContent>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Enter your registered email address. If an account exists
              with this email, you'll receive password reset
              instructions.
            </Typography>

            <Controller
              name="email"
              control={forgotControl}
              rules={{
                required: 'Email is required',
                pattern: {
                  value:
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  autoFocus
                  label="Email Address"
                  placeholder="Enter your email"
                  error={!!forgotErrors.email}
                  helperText={forgotErrors.email?.message}
                />
              )}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => {
                setForgotOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              type="submit"
            >
              Send Request
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <SuccessAlert
          severity="success"
          onClose={() => setSnackbarOpen(false)}
        >
          If an account exists with this email address, you'll receive
          password reset instructions.
        </SuccessAlert>
      </Snackbar>
    </>
  );
};

export default LoginPage;