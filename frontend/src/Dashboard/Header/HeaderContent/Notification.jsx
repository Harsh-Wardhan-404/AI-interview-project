import { useRef, useState } from "react";

// material-ui
import useMediaQuery from "@mui/material/useMediaQuery";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade"; // Using Fade for transitions

// assets
import BellOutlined from "@ant-design/icons/BellOutlined";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";
import GiftOutlined from "@ant-design/icons/GiftOutlined";
import MessageOutlined from "@ant-design/icons/MessageOutlined";
import SettingOutlined from "@ant-design/icons/SettingOutlined";

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: "1rem",
};

const actionSX = {
  mt: "6px",
  ml: 1,
  top: "auto",
  right: "auto",
  alignSelf: "flex-start",
  transform: "none",
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

export default function Notification() {
  const matchesXs = window.innerWidth <= 960;

  const anchorRef = useRef(null);
  const [read, setRead] = useState(2);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = "#f5f5f5"; // Hardcoded equivalent for grey.100

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{
          color: "#000000", // Hardcoded value for text.primary
          bgcolor: open ? iconBackColorOpen : "transparent",
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={read} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? "bottom" : "bottom-end"}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            { name: "offset", options: { offset: [matchesXs ? -5 : 0, 9] } },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Fade in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)", // Custom shadow
                width: "100%",
                minWidth: 285,
                maxWidth: { xs: 285, md: 420 },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box
                  sx={{
                    padding: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">Notification</Typography>
                  {read > 0 && (
                    <Tooltip title="Mark all as read">
                      <IconButton
                        color="success"
                        size="small"
                        onClick={() => setRead(0)}
                      >
                        <CheckCircleOutlined style={{ fontSize: "1.15rem" }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Divider />
                <List
                  component="nav"
                  sx={{
                    p: 0,
                    "& .MuiListItemButton-root": {
                      py: 0.5,
                      "&.Mui-selected": {
                        bgcolor: "#f9f9f9", // Equivalent to grey.50
                        color: "#000000", // text.primary
                      },
                      "& .MuiAvatar-root": avatarSX,
                      "& .MuiListItemSecondaryAction-root": {
                        ...actionSX,
                        position: "relative",
                      },
                    },
                  }}
                >
                  <ListItemButton selected={read > 0}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          color: "#66bb6a", // success.main
                          bgcolor: "#e8f5e9", // success.lighter
                        }}
                      >
                        <GiftOutlined />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6">
                          It&apos;s{" "}
                          <Typography component="span" variant="subtitle1">
                            Cristina Danny&apos;s
                          </Typography>{" "}
                          birthday today.
                        </Typography>
                      }
                      secondary="2 min ago"
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="caption" noWrap>
                        3:00 AM
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItemButton>
                  <Divider />
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          color: "#42a5f5", // primary.main
                          bgcolor: "#e3f2fd", // primary.lighter
                        }}
                      >
                        <MessageOutlined />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6">
                          <Typography component="span" variant="subtitle1">
                            Aida Burg
                          </Typography>{" "}
                          commented on your post.
                        </Typography>
                      }
                      secondary="5 August"
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="caption" noWrap>
                        6:00 PM
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItemButton>
                  <Divider />
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          color: "#ef5350", // error.main
                          bgcolor: "#ffebee", // error.lighter
                        }}
                      >
                        <SettingOutlined />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6">
                          Your Profile is Complete &nbsp;
                          <Typography component="span" variant="subtitle1">
                            60%
                          </Typography>{" "}
                        </Typography>
                      }
                      secondary="7 hours ago"
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="caption" noWrap>
                        2:45 PM
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItemButton>
                  <Divider />
                  <ListItemButton
                    sx={{ textAlign: "center", py: `${12}px !important` }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" color="primary">
                          View All
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}
