import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import {
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import FeedbackIcon from "@mui/icons-material/Feedback";
import Groups2Icon from "@mui/icons-material/Groups2";
import { useNavigate } from "react-router-dom";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const drawerWidth = 240;

const sideNavRoutes = [
  {
    key: "teksi_sidenav_option1",
    route: "/",
    name: "Bookings",
    icon: <CalendarMonthIcon />,
  },
  {
    key: "teksi_sidenav_option2",
    route: "/cancellations",
    name: "Cancellations",
    icon: <CancelIcon />,
  },
  {
    key: "teksi_sidenav_option3",
    route: "/drivers",
    name: "Drivers",
    icon: <PeopleAltIcon />,
  },
  {
    key: "teksi_sidenav_option4",
    route: "/vehicles",
    name: "Vehicles",
    icon: <DirectionsCarIcon />,
  },
];

const sideNavRoutes2 = [
  {
    key: "teksi_sidenav_option10",
    route: "/revenue",
    name: "Revenue",
    icon: <CurrencyRupeeIcon />,
  },
  {
    key: "teksi_sidenav_option11",
    route: "/users",
    name: "Users",
    icon: <Groups2Icon />,
  },
  {
    key: "teksi_sidenav_option12",
    route: "/feedback",
    name: "Feedback",
    icon: <FeedbackIcon />,
  },
];

const MainLayout = ({ Component }) => {
  const navigate = useNavigate();
  const [openSideNav, setOpenSideNav] = useState(true);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [selectedRoute, setSelectedRoute] = useState("/");

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
  const toggleDrawer = (newOpen) => () => {
    setOpenSideNav(newOpen);
  };
  const handleRouteClick = (event) => {
    setSelectedRoute(event);
  };
  
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        // style={{
        //   "background-image": "linear-gradient(to right, #98DE5B, #08E1AE)",
        // }}
      >
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, alignItems: "center" }}
          >
            <img
              src="http://teksi.in/teksi_logo_white.png"
              alt="teksi"
              style={{ width: "100px" }}
            />
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        open={openSideNav}
        onClose={toggleDrawer(false)}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {sideNavRoutes.map((item, index) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.route);
                    handleRouteClick(item.route);
                  }}
                  selected={selectedRoute === item.route}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {sideNavRoutes2.map((item, index) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.route);
                    handleRouteClick(item.route);
                  }}
                  selected={selectedRoute === item.route}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 5 }}>
        {/* <Toolbar /> */}
        {/* Main Component */}
        <div>{Component}</div>
      </Box>
    </Box>
  );
};

export default MainLayout;
