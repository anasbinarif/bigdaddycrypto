"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AlertBar from "../../../components/customAllert/Alert";
import { useAtom } from "jotai/index";
import { sessionAtom } from "../../../app/stores/sessionStore";
import Image from "next/image";
import HomeIcon from "../../../../public/assets/svg/bdc.svg";

const LoginPage = () => {
  const [sessionJotai] = useAtom(sessionAtom);
  const router = useRouter();
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [pending, setPending] = useState(false);

  const [user, setUser] = useState({
    userEmail: "",
    pin: "",
  });

  const [errors, setErrors] = useState({
    userEmail: false,
    userEmailMessage: "",
    pin: false,
    pinMessage: "",
  });

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  useEffect(() => {
    if (sessionJotai?.user) {
      router.push("/");
    }
  }, []);

  async function handleLogin() {
    let hasErrors = false;

    // Email Validation
    if (user.userEmail.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        userEmail: true,
        userEmailMessage: "Email is required.",
      }));
      hasErrors = true;
    } else if (!isValidEmail(user.userEmail)) {
      setErrors((prev) => ({
        ...prev,
        userEmail: true,
        userEmailMessage: "Invalid email format.",
      }));
      hasErrors = true;
    } else {
      setErrors((prev) => ({
        ...prev,
        userEmail: false,
        userEmailMessage: "",
      }));
    }

    // PIN Validation
    if (user.pin.trim() === "" || user.pin.length < 4) {
      setErrors((prev) => ({
        ...prev,
        pin: true,
        pinMessage: "PIN must be at least 4 digits.",
      }));
      hasErrors = true;
    } else {
      setErrors((prev) => ({ ...prev, pin: false, pinMessage: "" }));
    }

    if (!hasErrors) {
      console.log("Login creds:", user);
      try {
        setPending(true);
        const res = await signIn("credentials", {
          email: user.userEmail,
          password: user.pin,
          redirect: false,
        });
        console.log("res = ", res);
        if (res.error) {
          console.log(res.error);
          setPending(false);
          setAlert({ open: true, message: "Login Failed", severity: "error" });
        } else {
          setUser({
            userEmail: "",
            pin: "",
          });
          console.log("hellloooooooo", res);
          setPending(false);
          setAlert({
            open: true,
            message: "Login Successful",
            severity: "success",
          });
          router.push("/");
        }
      } catch (error) {
        console.log(error);
        setPending(false);
        setAlert({ open: true, message: "Login Failed", severity: "error" });
      }
    }
  }

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: false, // Reset the error state when a field is changed
    }));
  };

  return (
    <Box>
      <AlertBar
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#111826",
        }}
      >
        <Box
          sx={{
            padding: "20px",
            maxWidth: "400px",
            backgroundColor: "#202530",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
            position: "relative",
          }}
        >
          <Box sx={{ mb: 2, bottom: "85%", left: "42%", position: "absolute" }}>
            <Box color="inherit" sx={{}}>
              <Image
                src={HomeIcon}
                alt="Home Icon"
                style={{
                  width: "auto",
                  height: "60px",
                  cursor: "pointer",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  padding: "2px",
                }}
              />
            </Box>
          </Box>

          <Typography variant="h5" sx={{ mb: 2, mt: 2 }}>
            Login
          </Typography>

          <TextField
            name="userEmail"
            label="Email"
            variant="filled"
            value={user.userEmail}
            onChange={handleUserChange}
            fullWidth
            sx={{
              mb: 2,
              "& .MuiFormHelperText-root": {
                color: "#ffffff", // Helper text color
              },
              "& .MuiFormLabel-root": {
                color: "#ffffff",
              },
              "& .MuiFilledInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                "&.Mui-focused": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ffffff",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ffffff",
                },
              },
            }}
            helperText={
              errors.userEmail ? errors.userEmailMessage : "Your email address."
            }
            required
            error={errors.userEmail}
          />

          <TextField
            name="pin"
            label="PIN code"
            variant="filled"
            placeholder="4-8 numbers"
            type="password"
            value={user.pin}
            onChange={handleUserChange}
            fullWidth
            sx={{
              mb: 2,
              "& .MuiFormHelperText-root": {
                color: "#ffffff", // Helper text color
              },
              "& .MuiFormLabel-root": {
                color: "#ffffff",
              },
              "& .MuiFilledInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                "&.Mui-focused": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ffffff",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ffffff",
                },
              },
            }}
            required
            helperText={errors.pin ? errors.pinMessage : ""}
            error={errors.pin}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            disabled={pending}
          >
            {pending ? "Logging in..." : "Login"}
          </Button>

          <Typography variant="caption" sx={{ mt: 2, maxWidth: "400px" }}>
            Noch keinen Account? <Link href="/register">Registrieren</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
