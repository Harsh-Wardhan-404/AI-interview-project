// material-ui
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";

// project import
const drawerWidth = 260;

const openedMixin = {
  width: drawerWidth,
  borderRight: "1px solid #e0e0e0", // Hardcoded divider color
  transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1)", // Hardcoded Material-UI default transition
  overflowX: "hidden",
  boxShadow: "none",
};

const closedMixin = {
  transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1)", // Hardcoded Material-UI default transition
  overflowX: "hidden",
  width: 0,
  borderRight: "none",
  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)", // Hardcoded shadow (z1)
};

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin,
    "& .MuiDrawer-paper": openedMixin,
  }),
  ...(!open && {
    ...closedMixin,
    "& .MuiDrawer-paper": closedMixin,
  }),
}));

export default MiniDrawerStyled;
