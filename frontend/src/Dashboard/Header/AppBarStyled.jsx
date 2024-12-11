import PropTypes from "prop-types";

// material-ui
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";

// ==============================|| HEADER - APP BAR STYLED ||============================== //

const drawerWidth = 260;

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ open }) => ({
  zIndex: 1201, // Hardcoded value equivalent to theme.zIndex.drawer + 1
  left: 0,
  transition:
    "width 225ms cubic-bezier(0.4, 0, 0.6, 1), margin 225ms cubic-bezier(0.4, 0, 0.6, 1)", // Hardcoded Material-UI default transitions
  ...(!open && {
    width: `calc(100%)`,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition:
      "width 225ms cubic-bezier(0.4, 0, 0.6, 1), margin 225ms cubic-bezier(0.4, 0, 0.6, 1)", // Hardcoded Material-UI default transitions
  }),
}));

AppBarStyled.propTypes = {
  open: PropTypes.bool,
};

export default AppBarStyled;
