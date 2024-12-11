import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../../firebase/firebase";
import { useNavigate } from "react-router-dom";

// assets
import Google from "../../../assets/icons/google.svg";
import Twitter from "../../../assets/icons/twitter.svg";
import Facebook from "../../../assets/icons/facebook.svg";
import { fromPairs } from "lodash";

// ==============================|| FIREBASE - SOCIAL BUTTON ||============================== //

export default function FirebaseSocial() {
  const navigate = useNavigate();
  const googleHandler = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Handle the result here (e.g., save user info, redirect, etc.)
      navigate("/dashboard");
      console.log(result.user);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  const twitterHandler = async () => {
    // login || singup
  };

  const facebookHandler = async () => {
    // login || singup
  };

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, sm: 2 }}
      justifyContent={{ xs: "space-around", sm: "space-between" }}
      sx={{
        "& .MuiButton-startIcon": {
          mr: { xs: 0, sm: 1 },
          ml: { xs: 0, sm: -0.5 },
        },
      }}
    >
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<img src={Google} alt="Google" />}
        onClick={googleHandler}
      ></Button>
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<img src={Twitter} alt="Twitter" />}
        onClick={twitterHandler}
      ></Button>
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<img src={Facebook} alt="Facebook" />}
        onClick={facebookHandler}
      ></Button>
    </Stack>
  );
}
