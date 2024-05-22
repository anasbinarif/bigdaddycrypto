"use client";
import {
  Box,
  TextField,
  Checkbox,
  Button,
  Typography,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HomeIcon from "../../../../public/assets/svg/bdc.svg";

const RegisterPage = () => {
  const [pending, setPending] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error", // can be 'error', 'warning', 'info', 'success'
  });

  const router = useRouter();
  const [user, setUser] = useState({
    userName: "",
    userEmail: "",
    pin: "",
  });

  const [errors, setErrors] = useState({
    userEmail: false,
    userEmailMessage: "",
    pin: false,
    pinMessage: "",
    userName: false,
    userNameMessage: "",
  });
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email regex
    return emailPattern.test(email);
  };

  async function handleRegister() {
    let hasErrors = false;

    // Validate User Name
    if (user.userName.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        userName: true,
        userNameMessage: "User name is required.",
      }));
      hasErrors = true;
    } else {
      setErrors((prev) => ({
        ...prev,
        userName: false,
        userNameMessage: "",
      }));
    }

    // Validate Email
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

    // Validate PIN
    if (user.pin.trim() === "" || user.pin.length < 4) {
      setErrors((prev) => ({
        ...prev,
        pin: true,
        pinMessage: "PIN must be at least 4 digits.",
      }));
      hasErrors = true;
    } else {
      setErrors((prev) => ({
        ...prev,
        pin: false,
        pinMessage: "",
      }));
    }

    if (!hasErrors) {
      setPending(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        setUser({
          userName: "",
          userEmail: "",
          pin: "",
        });
        console.log("user register");
        setAlert({ open: true, message: "User Register", severity: "success" });
        router.push("/login");
        setPending(false);
      } else {
        setPending(false);
        setAlert({
          open: true,
          message: "Error registering user",
          severity: "error",
        });
      }
    }
  }

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            margin: "-58px 0 0 0",
            // mb: 2,
            // bottom: "85%",
            // left: "50%",
            // position: "absolute",
            // transform: "translateX(-50%)",
            width: "70px",
            height: "70px",
          }}
        >
          <Box
            color="inherit"
            sx={{
              // display: "inline-block",
              borderRadius: "50%",
              // overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={HomeIcon}
              alt="Home Icon"
              style={{
                padding: "1px 3px 3.5px",
                width: "100%",
                height: "auto",
                cursor: "pointer",
                backgroundColor: "white",
                borderRadius: "50%",
                // margin: "2px",
                objectFit: "cover",
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="h5"
          sx={{
            mb: 2,
            mt: 2,
            fontFamily: "inherit",
            fontWeight: "bold",
            fontSize: "1rem",
            textAlign: "center",
          }}
        >
          Create an account
        </Typography>

        <TextField
          name="userName"
          label="User"
          variant="filled"
          value={user.userName}
          onChange={handleUserChange}
          fullWidth
          sx={{
            mb: 2,
            "& .MuiFormHelperText-root": {
              color: "#ffffff", // Helper text color
            },
            "& .MuiFilledInput-input": {
              color: "#fff",
              "&::placeholder": {
                color: "#fff",
              },
            },
            "& .MuiInputBase-input": {
              height: "1.6em",
            },
            "& .MuiFormLabel-root": {
              color: "#ffffff80",
            },
            "& .MuiFilledInput-root": {
              borderRadius: "8px",
              backgroundColor: "#202530",
              border: "1px solid #ffffff80",
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
            errors.userName ? errors.userNameMessage : "Your unique username."
          }
          required
          error={errors.userName}
        />

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
            "& .MuiFilledInput-input": {
              color: "#fff",
              "&::placeholder": {
                color: "#fff",
              },
            },
            "& .MuiInputBase-input": {
              height: "1.6em",
            },
            "& .MuiFormLabel-root": {
              color: "#ffffff80",
            },
            "& .MuiFilledInput-root": {
              borderRadius: "8px",
              backgroundColor: "#202530",
              border: "1px solid #ffffff80",
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
          error={errors.userEmail}
          helperText={
            errors.userEmail ? errors.userEmailMessage : "Your email address."
          }
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
            "& .MuiFilledInput-input": {
              color: "#fff",
              "&::placeholder": {
                color: "#fff",
              },
            },
            "& .MuiInputBase-input": {
              height: "1.6em",
            },
            "& .MuiFormLabel-root": {
              color: "#ffffff80",
            },
            "& .MuiFilledInput-root": {
              borderRadius: "8px",
              backgroundColor: "#202530",
              border: "1px solid #ffffff80",
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
          error={errors.pin}
          helperText={errors.pin ? errors.pinMessage : ""}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={disclaimerAccepted}
              onChange={(e) => setDisclaimerAccepted(e.target.checked)}
            />
          }
          label="I have read and understood the disclaimer"
          sx={{
            "& .mui-1crmugn-MuiTypography-root": {
              fontSize: "12px", // Set desired font size here
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!disclaimerAccepted || pending}
          onClick={handleRegister}
          sx={{
            textTransform: "capitalize",
            color: "white",
            backgroundColor: "var(--color-secondary-2)",
            "&:hover": {
              backgroundColor: "var(--color-secondary-2)",
            },
            "&.Mui-disabled": {
              color: "white",
            },
            // backgroundColor: "red",
          }}
        >
          {pending ? "Loading..." : "to register"}
        </Button>
      </Box>
      <Typography
        variant="caption"
        sx={{ mt: 2, maxWidth: "400px", fontSize: "12px" }}
      >
        Disclaimer:
        <br /> The information provided is for informational purposes only and
        does not constitute financial advice. Any actions are taken at your own
        risk.
      </Typography>
    </Box>
  );
};

export default RegisterPage;
