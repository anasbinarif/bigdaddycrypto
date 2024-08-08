"use client";
import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import AlertBar from "../../../components/customAllert/Alert";
import SuspenseWrapper from "../../../components/SuspenseWrapper";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [pending, setPending] = useState(false);

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: false,
    newPasswordMessage: "",
    confirmNewPassword: false,
    confirmNewPasswordMessage: "",
  });

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: false, // Reset the error state when a field is changed
    }));
  };

  const handleSubmit = async () => {
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setErrors({
        newPassword: true,
        confirmNewPassword: true,
        newPasswordMessage: "Passwords do not match.",
        confirmNewPasswordMessage: "Passwords do not match.",
      });
      return;
    }

    setPending(true);

    console.log(email);

    try {
      const response = await fetch("/api/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          email: email.toLowerCase(),
          newPassword: passwords.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setAlert({
          open: true,
          message: "Password reset successfully.",
          severity: "success",
        });
        router.push("/login");
      } else {
        setAlert({
          open: true,
          message: result.error || "Failed to reset password.",
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
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              mt: 2,
              fontFamily: "inherit",
              fontWeight: "bold",
              fontSize: "1rem",
              textAlign: "center",
              color: "white",
            }}
          >
            Reset Password
          </Typography>

          <TextField
            name="newPassword"
            label="New Password"
            variant="filled"
            type="password"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            fullWidth
            sx={{
              mb: 2,
              "& .MuiInputBase-root .MuiInputBase-input.Mui-disabled": {
                color: "#fff",
                WebkitTextFillColor: "#fff",
              },
              "& .MuiFilledInput-input": {
                color: "#fff", // Change the color to white
              },
              "& .MuiFormLabel-root": {
                color: "#ffffff80",
                "&.Mui-disabled": {
                  color: "#ffffff80",
                },
                "&.MuiInputLabel-root.Mui-focused": {
                  color: "var(--color-secondary)",
                },
              },
              "& .MuiInputBase-root": {
                "&.MuiFilledInput-root": {
                  "&::after": {
                    borderBottom: "2px solid var(--color-secondary)",
                  },
                },
              },
              "& .MuiFilledInput-root": {
                borderRadius: "8px",
                backgroundColor: "#202530",
                border: "1px solid #ffffff80",
              },
              "& .MuiFormHelperText-root": {
                margin: 0,
                width: "100%",
                textAlign: "center",
                padding: "5px 0",
                "&.Mui-disabled": {
                  color: "#ffffff80",
                  backgroundColor: "#ffc70022",
                },
              },
            }}
            required
            error={errors.newPassword}
            helperText={errors.newPassword ? errors.newPasswordMessage : ""}
          />

          <TextField
            name="confirmNewPassword"
            label="Confirm New Password"
            variant="filled"
            type="password"
            value={passwords.confirmNewPassword}
            onChange={handlePasswordChange}
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
            error={errors.confirmNewPassword}
            helperText={
              errors.confirmNewPassword ? errors.confirmNewPasswordMessage : ""
            }
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
            {pending ? "Resetting..." : "Reset Password"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const ResetPasswordPageWithSuspense = () => (
  <SuspenseWrapper>
    <ResetPasswordPage />
  </SuspenseWrapper>
);

export default ResetPasswordPageWithSuspense;
