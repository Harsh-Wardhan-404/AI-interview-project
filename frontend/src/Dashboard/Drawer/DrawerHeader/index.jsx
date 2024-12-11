import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";

// project import
import DrawerHeaderStyled from "./DrawerHeaderStyled";

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  return <DrawerHeaderStyled open={!!open}>Logo Here</DrawerHeaderStyled>;
}

DrawerHeader.propTypes = { open: PropTypes.bool };
