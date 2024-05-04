"use client"
import Link from "next/link";
import { useState } from "react";
import { Box, TextField, Checkbox, Button, Typography, FormControlLabel } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AlertBar from "@/components/customAllert/Alert";

const LoginPage = () => {
  const router = useRouter();
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  const [pending, setPending] = useState(false);

  const [user, setUser] = useState({
    userEmail: "",
    pin: "",
  })

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

  async function handleLogin() {
    let hasErrors = false;

    // Email Validation
    if (user.userEmail.trim() === "") {
      setErrors((prev) => ({ ...prev, userEmail: true, userEmailMessage: "Email is required." }));
      hasErrors = true;
    } else if (!isValidEmail(user.userEmail)) {
      setErrors((prev) => ({
        ...prev,
        userEmail: true,
        userEmailMessage: "Invalid email format.",
      }));
      hasErrors = true;
    } else {
      setErrors((prev) => ({ ...prev, userEmail: false, userEmailMessage: "" }));
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
          redirect: false
        })
        console.log("res = ", res)
        if (res.error) {
          console.log(res.error)
          setPending(false);
          setAlert({ open: true, message: "Login Failed", severity: 'error' });
        }
        else {
          setUser({
            userEmail: "",
            pin: "",
          })
          console.log("hellloooooooo", res);
          setPending(false);
          setAlert({ open: true, message: "Login Successful", severity: 'success' });
          router.push("/");
        }
      } catch (error) {
        console.log(error);
        setPending(false);
        setAlert({ open: true, message: "Login Failed", severity: 'error' });
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
    <>
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
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4">LOGO</Typography>
          </Box>

          <Typography variant="h5" sx={{ mb: 2 }}>
            Login
          </Typography>

          <TextField
            name="userEmail"
            label="Email"
            variant="filled"
            value={user.userEmail}
            onChange={handleUserChange}
            fullWidth
            sx={{ mb: 2 }}
            helperText={errors.userEmail ? errors.userEmailMessage : "Your email address."}
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
            sx={{ mb: 2 }}
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

          <Typography variant="caption" sx={{ mt: 2, maxWidth: "400px", }}>
            Noch keinen Account? <Link href="/register">Registrieren</Link>
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default LoginPage