import { Typography, useTheme } from "@mui/material";

export const StyledText = ({ text = "" }) => {
  const theme = useTheme();

  return (
    <Typography
      variant="h5"
      sx={{
        textAlign: "center",
        mr: 4,
        ml: 4,
        mb: 1,
        color: theme.colors.textColor,
      }}
    >
      {text}
    </Typography>
  );
};
