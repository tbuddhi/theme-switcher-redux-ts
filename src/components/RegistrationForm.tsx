import React, { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Divider, IconButton, InputAdornment, Stack, styled, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/system'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import axios from 'axios';

import { themeOrange } from '../theme/theme';
import { toast } from 'react-toastify';

// Define types
type RegisterInput = TypeOf<typeof registerSchema>;

// Define types and register schema using Zod object
const registerSchema = object({
  name: string()
    .nonempty('Name is required')
    .max(32, 'Name must be less than 100 characters'),
  email: string().nonempty('Email is required').email('Email is invalid'),
  password: string()
    .nonempty('Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters')
})

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme()

  // Custom styles for the registration form input fields
  const LoginInputField = styled(TextField)({
    marginBottom: '1rem',
    width: '100%',
    color: theme.palette.custom.inputText,
    "& .MuiInputBase-root": {
      backgroundColor: theme.palette.custom.inputBg,
      "& > fieldset": {
        borderColor: 'transparent',
      }
    }
  })

  // Custom styles for the submit button
  const SubmitButton = styled(Button)({
    backgroundColor: themeOrange,
    color: '#fff',
    width: '100%',
    height: 40,
    "&:hover": { backgroundColor: '#ff2f2f' }
  })

  // Destructuring useForm(react-hook-form) with Zod resolver
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  // Handle user form submission to the mock API
  const onSubmitHandler: SubmitHandler<RegisterInput> = (userInfo) => {
    let mockApiUrl = "https://63b6557d58084a7af3af55c8.mockapi.io/api/users"

    axios.post(mockApiUrl, userInfo)
      .then(res => {
        console.log(res.data)
      }).catch(err => console.log(err))

    toast.success('User added successfully');
  };

  // Handle password field visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, pt: 2 }} >
        Sign in to Travelguru
      </Typography>

      <Stack
        direction={'row'}
        alignItems={'center'}
        spacing={1}
        pb={1}
      >
        <Typography variant="subtitle2" sx={{ color: '#898989' }} >
          Don't have an account?
        </Typography>
        <Button variant="text" sx={{ color: '#f76d73' }} >
          Sign up
        </Button>
      </Stack>

      <Divider />

      {/* Validated login form  */}
      <Box
        component='form'
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit(onSubmitHandler)}
        py={3}
      >
        <LoginInputField
          label='Full name'
          size='small'
          required
          type='text'
          error={!!errors['name']}
          helperText={errors['name'] ? errors['name'].message : ''}
          {...register('name')}
        />
        <LoginInputField
          label='Email'
          size='small'
          required
          type='email'
          error={!!errors['email']}
          helperText={errors['email'] ? errors['email'].message : ''}
          {...register('email')}
        />
        <LoginInputField
          label='Password'
          size='small'
          required
          type={showPassword ? 'text' : 'password'}
          error={!!errors['password']}
          helperText={errors['password'] ? errors['password'].message : ''}
          {...register('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <SubmitButton type='submit' variant="contained" disableElevation>Continue</SubmitButton>
      </Box>
    </Box>
  )
}

export default RegistrationForm