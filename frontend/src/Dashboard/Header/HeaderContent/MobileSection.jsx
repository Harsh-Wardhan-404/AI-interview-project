import { useEffect, useRef, useState } from "react";

// material-ui
import AppBar from "@mui/material/AppBar";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Popper from "@mui/material/Popper";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade"; // Using Fade for transitions

// assets
import MoreOutlined from "@ant-design/icons/MoreOutlined";

// ==============================|| HEADER CONTENT - MOBILE ||============================== //

export default function MobileSection() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const iconBackColorOpen = "#e0e0e0"; // Equivalent to grey.300
  const iconBackColor = "#f5f5f5"; // Equivalent to grey.100

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          sx={{
            color: "#000000", // Hardcoded value for text.primary
            bgcolor: open ? iconBackColorOpen : iconBackColor,
          }}
          aria-label="open more menu"
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="secondary"
          variant="light"
        >
          <MoreOutlined />
        </IconButton>
      </Box>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        sx={{ width: "100%" }}
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Fade in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)" }}>
              {" "}
              {/* Custom shadow */}
              <ClickAwayListener onClickAway={handleClose}>
                <AppBar
                  position="relative"
                  sx={{
                    backgroundColor: "#ffffff", // Equivalent to theme.palette.background.paper
                  }}
                >
                  <Toolbar>
                    {/* Replace these with actual components */}
                    <Box sx={{ flexGrow: 1 }}>Search Component</Box>
                    <Box>Profile Component</Box>
                  </Toolbar>
                </AppBar>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
}
