// material-ui
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

// project import
import Search from "./Search";
import Profile from "./Profile";
import Notification from "./Notification";
import MobileSection from "./MobileSection";

// project import
import { GithubOutlined } from "@ant-design/icons";

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  // Hardcoded media query for "down LG"
  const downLG = window.innerWidth <= 1200;

  return (
    <>
      {!downLG && <Search />}
      {downLG && <Box sx={{ width: "100%", ml: 1 }} />}
      <IconButton
        component={Link}
        href="https://github.com/codedthemes/mantis-free-react-admin-template"
        target="_blank"
        disableRipple
        color="secondary"
        title="Download Free Version"
        sx={{
          color: "#000000", // Hardcoded equivalent of 'text.primary'
          bgcolor: "#f5f5f5", // Hardcoded equivalent of 'grey.100'
        }}
      >
        <GithubOutlined />
      </IconButton>

      <Notification />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
