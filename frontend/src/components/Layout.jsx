import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Badge,
  Container
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  BarChart as AnalyticsIcon,
  Store as StoreIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  backgroundColor: 'white',
  color: theme.palette.text.primary,
  boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.05)',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Ockerfarbe für ein bodenständigeres Design
const ockerColor = '#D7B963';

const DrawerStyled = styled(Drawer)(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: open ? drawerWidth : 65,
    boxSizing: 'border-box',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.05)',
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '100px',
      background: `linear-gradient(to top, ${ockerColor}20, transparent)`,
      pointerEvents: 'none',
      zIndex: 0,
    },
  },
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Planung', icon: <AnalyticsIcon />, path: '/plan' },
  { text: 'Bestellungen', icon: <OrdersIcon />, path: '/orders' },
  { text: 'Ladentheke', icon: <StoreIcon />, path: '/display' },
];

const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBarStyled position="fixed" open={open}>
        <Toolbar sx={{ pr: '24px' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ fontWeight: 600 }}
            >
              Mehl & Methode
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                fontStyle: 'italic', 
                mt: -0.5 
              }}
            >
              {location.pathname.includes('/plan') ? 
                "Planung, die aufgeht – jeden Morgen." : 
                "Verkaufen, was gebraucht wird. Backen, was gegessen wird."}
            </Typography>
          </Box>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Avatar 
            sx={{ ml: 2, bgcolor: 'primary.main' }} 
            alt="User Profile"
            src="/avatar.png"
          />
        </Toolbar>
      </AppBarStyled>
      <DrawerStyled variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
            position: 'relative',
            zIndex: 1,
          }}
        >
          <IconButton onClick={toggleDrawer}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav" sx={{ height: '100%', py: 2, position: 'relative', zIndex: 1 }}>
          {menuItems.map((item) => {
            // Bestimme, ob der aktuelle Pfad mit dem Menüpunkt übereinstimmt
            const isSelected = 
              location.pathname === item.path || 
              (item.path === '/dashboard' && location.pathname === '/') ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
            return (
              <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isSelected}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: '0 25px 25px 0',
                    mr: 2,
                    ml: 0.5,
                    '&.Mui-selected': {
                      background: `linear-gradient(90deg, ${ockerColor} 0%, ${ockerColor}90 70%, ${ockerColor}40 100%)`,
                      color: 'white',
                      '&:hover': {
                        background: `linear-gradient(90deg, ${ockerColor} 0%, ${ockerColor} 70%, ${ockerColor}90 100%)`,
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: isSelected ? 'white' : 'inherit',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      opacity: open ? 1 : 0,
                      visibility: open ? 'visible' : 'hidden',
                      transition: 'opacity 0.2s ease, visibility 0.2s ease',
                      '& .MuiTypography-root': {
                        fontWeight: isSelected ? 600 : 400,
                      }
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DrawerStyled>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
