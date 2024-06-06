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
// import AlertBar from "../../../components/customAllert/Alert";
import { useAtom } from "jotai/index";
// import { sessionAtom } from "../../../app/stores/sessionStore";
import Image from "next/image";
import HomeIcon from "../../../../public/assets/svg/bdc.svg";
import AlertBar from "../../../components/customAllert/Alert";
import { sessionAtom } from "../../../app/stores/sessionStore";

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
      try {
        setPending(true);
        const res = await signIn("credentials", {
          email: user.userEmail,
          password: user.pin,
          redirect: false,
        });
        if (res.error) {
          console.log(res.error);
          setPending(false);
          setAlert({ open: true, message: "Login Failed", severity: "error" });
        } else {
          setUser({
            userEmail: "",
            pin: "",
          });
          setPending(false);
          setAlert({
            open: true,
            message: "Login erfolgreich",
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
    <Box sx={{ overflew: "no-wrap", position: "relative" }}>
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
            // helperText={
            //   errors.userEmail ? errors.userEmailMessage : "Your email address."
            // }
            required
            error={errors.userEmail}
          />

          <TextField
            name="pin"
            label="PIN code"
            variant="filled"
            // placeholder="4-8 numbers"
            type="password"
            value={user.pin}
            onChange={handleUserChange}
            fullWidth
            sx={{
              mb: 2,
              "& .MuiFormHelperText-root": {
                color: "#ffffff", // Helper text color
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
                "& .MuiFilledInput-input": {
                  color: "#fff",
                  "&::placeholder": {
                    color: "#fff",
                  },
                },
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
            {pending ? "Logging in..." : "Anmelden"}
          </Button>

          <Typography
            variant="caption"
            sx={{ mt: 4, maxWidth: "400px", color: "#ffffff80" }}
          >
            Noch keinen Account?{" "}
            <Link
              href="/register"
              style={{ color: "white", textDecoration: "underline" }}
            >
              Registrieren
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
