"use client";
import {
  Box,
  TextField,
  Checkbox,
  Button,
  Typography,
  FormControlLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HomeIcon from "../../../../public/assets/svg/bdc.svg";
import { customAlphabet } from "nanoid";
import Link from "next/link";
import { signIn } from "next-auth/react";
import AlertBar from "../../../components/customAllert/Alert";
import { LanguageProvider, useLanguage } from "../LanguageContext";
import LanguageSwitcher from "../LanguageSwitcher";

const RegisterPage = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
  });
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email regex
    return emailPattern.test(email);
  };

  const generateUserName = (length) => {
    const alphabet =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const name = customAlphabet(alphabet);
    return name(length); // Generates a unique 6-character ID with numbers and alphabets
  };

  useEffect(() => {
    setUser((prevUser) => ({
      ...prevUser,
      userName: generateUserName(6),
    }));
  }, []);

  async function handleRegister() {
    setLoading(true);
    let hasErrors = false;

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
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;
    if (user.pin.trim() === "" || user.pin.length < 8) {
      setErrors((prev) => ({
        ...prev,
        pin: true,
        pinMessage: "Passwort must be at least 4 digits.",
      }));
      hasErrors = true;
    } else if (!passwordRegex.test(user.pin)) {
      setErrors((prev) => ({
        ...prev,
        pin: true,
        pinMessage:
          "Passwort must be at least 8 letters. Atleast 1 capital letter, number and special character",
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
        // const verificationToken = customAlphabet(user.userEmail, 24)();
        const email = { email: user.userEmail };
        // const result = await signIn("email", { redirect: false, email, verificationToken });
        const res = await fetch("/api/sendEmailVarification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        });
        if (res.error) {
          setError(res.error);
        } else {
          // router.push("/check-email");
          // alert("check Your Email");
          console.log("check Your Email");
        }
        setUser({
          userName: generateUserName(),
          userEmail: "",
          pin: "",
        });
        console.log("user register");
        setAlert({ open: true, message: "User Register", severity: "success" });
        // router.push("/login");
        // router.push("/checkEmail");
        setPending(false);
      } else {
        const error = await res.json();
        setAlert({
          open: true,
          message: error.error ? error.error : "Error registering user",
          severity: "error",
        });
        setPending(false);
      }
    }
    setLoading(false);
  }

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Language switch logic
  const { languageData } = useLanguage();
  // console.log(languageData);

  return (
    <>
      <LanguageSwitcher />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 6rem)",
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
              width: "70px",
              height: "70px",
            }}
          >
            <Box
              color="inherit"
              sx={{
                borderRadius: "50%",
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
            {languageData["createAccount"]}
          </Typography>

          <TextField
            name="userName"
            label="ID*"
            variant="filled"
            value={user.userName}
            fullWidth
            disabled
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
            helperText="Für eine höchstmögliche Anonymität werden die Benutzernamen per Zufall generiert."
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
            helperText={
              errors.userEmail
                ? errors.userEmailMessage
                : languageData["emailLabel"]
            }
          />

          <TextField
            name="pin"
            label={languageData["password"]}
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
            error={errors.pin}
            helperText={
              errors.pin ? errors.pinMessage : languageData["passwordLabel"]
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={disclaimerAccepted}
                onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                sx={{
                  "&.MuiCheckbox-root": {
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                    "&.Mui-checked": {
                      color: "var(--color-secondary)",
                    },
                  },
                }}
              />
            }
            label={languageData["disclaimer"]}
            sx={{
              alignItems: "flex-start",
              mb: "1rem",
              "& .MuiButtonBase-root": {
                padding: "0 10px",
                // ml: "10px",
              },
              "& .MuiTypography-root": {
                color: "#ffffff80",
                fontSize: "14px", // Set desired font size here
                textAlign: "left",
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
            }}
          >
            {pending ? "Loading..." : languageData["register"]}
          </Button>
          <Typography
            variant="caption"
            sx={{ mt: 4, maxWidth: "400px", color: "#ffffff80" }}
          >
            {languageData["registerLabel"]}{" "}
            <Link
              href="/login"
              style={{ color: "white", textDecoration: "underline" }}
            >
              Login
            </Link>
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{ mt: 2, maxWidth: "400px", fontSize: "12px" }}
        >
          Disclaimer:
          <br /> {languageData["registerDisclaimer"]}
        </Typography>
      </Box>
      <AlertBar
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </>
  );
};

const Register = () => {
  return (
    <LanguageProvider>
      <RegisterPage />
    </LanguageProvider>
  );
};

export default Register;
