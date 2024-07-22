import React, { useEffect, useState } from 'react';
import { AppBar, CssBaseline, Toolbar, Typography, Button, Box, styled, Container, IconButton, Menu, MenuItem, Tooltip, Avatar } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import MenuIcon from '@mui/icons-material/Menu';
import { getCurrentUserName } from '../../services/AuthenticationService';
import { Logout } from '../../services/Authconfig';
import { blue } from '@mui/material/colors';
import { arrayBufferToBase64, getProfilePhoto } from '../../services/ProfileService';

const ActionButton = styled(Button)(({ theme }) => ({
  margin: '5px'
}));

const SystemLogo = styled(ExploreIcon)(({ theme }) => ({
  marginRight: '5px'
}));

const pages = [
  { name: 'Trips', path: '/trips' },
  { name: 'Friends', path: '/friends' }
];

const settings = ['Profile', 'Logout'];

const Header = ({ isUserLoggedIn, navigate }) => {

  const [loggedIn, setLoggedIn] = useState(isUserLoggedIn);
  const [userData, setUserData] = useState(null);
  const [userInitials, setUserInitials] = useState('');
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    setLoggedIn(isUserLoggedIn);
    if (isUserLoggedIn && !userData) {
      fetchData();
    } else if (!isUserLoggedIn) {
      setUserData(null);
      setUserInitials('')
    }
    if (isUserLoggedIn) {
      setAnchorElNav(null);
    }
  }, [isUserLoggedIn, navigate, userData]);

  useEffect(() => {
    if (isUserLoggedIn) {
      if (userData && userData.id) {
        fetchUserProfilePicture(userData.id);
      }
    }
  }, [userData]);

  const fetchData = async () => {
    if (isUserLoggedIn) {
      const data = await getCurrentUserName();
      if (data) {
        setUserData(data);
        setUserInitials(getUserInitials(data.firstName, data.lastName));
      }
    }
  };

  const fetchUserProfilePicture = async (id) => {
    if (isUserLoggedIn) {
      const response = await getProfilePhoto(id);
      if (response && response.data) {
        const base64Flag = 'data:image/png;base64,';
        const base64Image = arrayBufferToBase64(response.data);
        setProfilePicture(base64Flag + base64Image);
      }
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (path) => {
    if (path === '/logout') {
      handleLogout();
    } else if (path === '/profile/me') {
      navigate('/profile/me');
    } else {
      navigate(path);
    }
    handleCloseNavMenu();
  };

  const handleLogout = async () => {
    await Logout();
    setLoggedIn(false);
    setAnchorElUser(null);
    setProfilePicture(null);
    navigate('/')
  }

  const getUserInitials = (firstName, lastName) => {
    if (!firstName || !lastName) {
      return '';
    }
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    return firstInitial + lastInitial;
  };

  return (
    <>
      {loggedIn && userData ? (
        <>
          <CssBaseline />
          <AppBar position="static">
            <Container maxWidth={false} sx={{ width: '100%' }}>
              <Toolbar disableGutters>
                <SystemLogo sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  SoezTrip
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: 'block', md: 'none' },
                    }}
                  >
                    {pages.map((page) => (
                      <MenuItem key={page.name} onClick={() => handleMenuClick(page.path)}>
                        <Typography textAlign="center">{page.name}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
                <SystemLogo sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                <Typography
                  variant="h5"
                  noWrap
                  component="div"
                  sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  SoezTrip
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  {pages.map((page) => (
                    <Button
                      key={page.name}
                      onClick={() => handleMenuClick(page.path)}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      {page.name}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      {profilePicture ? (
                        <Avatar src={profilePicture} alt="Profile Picture" />
                      ) : (
                        <Avatar alt="User Avatar" sx={{ bgcolor: blue[500] }}>{userInitials}</Avatar>
                      )}
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={() => handleMenuClick(setting === 'Logout' ? '/logout' : '/profile/me')}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
        </>
      ) : (
        <>
          <CssBaseline />
          <AppBar position="sticky">
            <Toolbar>
              <SystemLogo />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                SoezTrip
              </Typography>
              <ActionButton variant='contained' onClick={() => navigate('/login')}>
                Login
              </ActionButton>
              <ActionButton variant='contained' onClick={() => navigate('/register')}>
                Register
              </ActionButton>
            </Toolbar>
          </AppBar>
        </>
      )}
    </>
  )
}

export default Header;