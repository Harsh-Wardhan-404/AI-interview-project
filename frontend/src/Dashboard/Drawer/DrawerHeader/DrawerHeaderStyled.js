// material-ui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const DrawerHeaderStyled = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ open }) => ({
  height: "64px", // Hardcoded value equivalent to theme.mixins.toolbar height
  display: "flex",
  alignItems: "center",
  justifyContent: open ? "flex-start" : "center",
  paddingLeft: open ? "24px" : "0px", // Replacing `theme.spacing(open ? 3 : 0)` with hardcoded values
}));

export default DrawerHeaderStyled;
