"use client";
import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HomeIcon from "../../../../public/assets/svg/Logo-03.svg";
import AlertBar from "../../../components/customAllert/Alert";
import Link from "next/link";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [pending, setPending] = useState(false);

  const [user, setUser] = useState({
    userEmail: "",
  });

  const [errors, setErrors] = useState({
    userEmail: false,
    userEmailMessage: "",
  });

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

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

  const handleSubmit = async () => {
    if (user.userEmail.trim() === "" || !isValidEmail(user.userEmail)) {
      setErrors({
        userEmail: true,
        userEmailMessage: "Invalid email format.",
      });
      return;
    }

    setPending(true);

    try {
      const response = await fetch("/api/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ email: user.userEmail }),
      });

      const result = await response.json();

      if (response.ok) {
        setAlert({
          open: true,
          message: "Reset link sent to your email.",
          severity: "success",
        });
      } else {
        setAlert({
          open: true,
          message: result.error || "Failed to send reset link.",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Box sx={{ overflow: "no-wrap", position: "relative" }}>
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
            padding: "30px",
            maxWidth: "400px",
            backgroundColor: "#202530",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "400px",

            "& .MuiTypography-root": {
              color: "white",
            },
          }}
        >
          <Box
            sx={{
              margin: "0 12px 0 0",
              width: "150px",
              height: "50px",
            }}
          >
            <Box
              color="inherit"
              sx={{
                // borderRadius: "50%",
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
                  //   backgroundColor: "white",
                  //   borderRadius: "50%",
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
              color: "var(--color-secondary) !important",
            }}
          >
            Forgot Password
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
                color: "#ffffff",
              },
              "& .MuiFilledInput-input": {
                color: "#fff",
                "&::placeholder": {
                  color: "#fff",
                },
              },
              "& .MuiInputBase-root": {
                "&.MuiFilledInput-root": {
                  "&::after": {
                    borderBottom: "2px solid var(--color-secondary)",
                  },
                },
              },
              "& .MuiInputBase-input": {
                height: "1.6em",
              },
              "& .MuiFormLabel-root": {
                color: "#ffffff80",
                "&.MuiInputLabel-root.Mui-focused": {
                  color: "var(--color-secondary)",
                },
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
            helperText={errors.userEmail ? errors.userEmailMessage : ""}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={pending}
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
            }}
          >
            {pending ? "Sending..." : "Send Reset Link"}
          </Button>

          <Typography
            variant="caption"
            sx={{ mt: 2, maxWidth: "400px", color: "#ffffff80" }}
          >
            Back to login?{" "}
            <Link
              href="/login"
              style={{ color: "white", textDecoration: "underline" }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
