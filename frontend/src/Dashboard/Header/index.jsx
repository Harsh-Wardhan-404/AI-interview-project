import { useMemo } from "react";

// material-ui
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

// project import
import AppBarStyled from "./AppBarStyled";
import HeaderContent from "./HeaderContent";

import { handlerDrawerOpen, useGetMenuMaster } from "../../api/menu";

// assets
import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

export default function Header() {
  // Hardcoded media query for "down LG"
  const downLG = useMediaQuery("(max-width: 1200px)");

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  // header content
  const headerContent = useMemo(() => <HeaderContent />, []);

  const iconBackColor = "#f5f5f5"; // Hardcoded equivalent of "grey.100"
  const iconBackColorOpen = "#e0e0e0"; // Hardcoded equivalent of "grey.200"

  // common header
  const mainHeader = (
    <Toolbar>
      <IconButton
        disableRipple
        aria-label="open drawer"
        onClick={() => handlerDrawerOpen(!drawerOpen)}
        edge="start"
        color="secondary"
        variant="light"
        sx={{
          color: "#000000", // Hardcoded "text.primary"
          bgcolor: drawerOpen ? iconBackColorOpen : iconBackColor,
          ml: { xs: 0, lg: -2 },
        }}
      >
        {!drawerOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </IconButton>
      {headerContent}
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: "fixed",
    color: "inherit",
    elevation: 0,
    sx: {
      borderBottom: "1px solid #e0e0e0", // Hardcoded divider color
      // boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", // Example hardcoded shadow if needed
    },
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled open={!!drawerOpen} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
}
