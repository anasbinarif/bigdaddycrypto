import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  styled,
} from "@mui/material";
import {categoryColors, categoryColorsNew, getUserPortfolio, storeUserPortfolioCoin} from "../../../../lib/data";
import { portfolioAtom } from "../../../../app/stores/portfolioStore";
import { useAtom } from "jotai";
import { sessionAtom } from "../../../../app/stores/sessionStore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#333", // Dark background
  color: "#fff", // White text
  margin: theme.spacing(1),
  position: "relative", // To position the category color bar
  borderRadius: theme.shape.borderRadius,
  userSelect: "none",
}));

const CategoryColorBar = styled(Box)(({ colors, selected }) => {
  const gradient = colors.length > 1
      ? `linear-gradient(${colors.join(', ')})`
      : colors[0];

  return {
    width: 4,
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    display: selected ? "none" : "block",
    background: gradient,
  };
});

const CoinCard = ({ coin, selected, search = false, risk }) => {
  const { Name, cgImageURL, Ticker, Potential, Sicherheit, Category } = coin;
  const [sessionJotai] = useAtom(sessionAtom);
  const [, setPortfolio] = useAtom(portfolioAtom);

  const getCategoryColors = (categories) => {
    return categories.map((category) => categoryColorsNew[category] || "#ffffff");
  };

  const checkCalculation = (Potential, Sicherheit) => {
    return !!Potential && !!Sicherheit;
  };

  const handleDoubleClick = async () => {
    const userId = sessionJotai?.user.id;
    console.log("double clicked", userId, coin);
    const res = await storeUserPortfolioCoin(userId, coin);
    console.log("Server response:", res);

    if (res.ok) {
      const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
      setPortfolio(userPortfolio.data);
    } else {
      console.error(
          "Error handling the portfolioGenerator update:",
          res.message
      );
    }
  };

  return (
      <>
        {search ? (
            <StyledCard
                onDoubleClick={handleDoubleClick}
                sx={{
                  cursor: "pointer",
                  border: `${selected ? "1px solid #00aa66aa" : risk ? "1px solid red" : "none"}`,
                  backgroundColor: `${selected ? "#00aa6633" : risk ? "rgba(222,11,11,0.05)" : "#333"}`,
                  width: "95%",
                  borderStyle: `${risk ? "dashed" : "none"}`,
                  borderLeft: `${selected ? "" : risk ? "none" : ""}`
                }}
            >
              <CategoryColorBar colors={getCategoryColors(Category)} selected={selected} />
              <CardContent>
                <CheckCircleIcon
                    sx={{
                      color: "#00aa66",
                      display: `${selected ? "block" : "none"}`,
                      position: "absolute",
                      zIndex: 1,
                      top: "5px",
                    }}
                />
                <Box sx={{ display: "flex", alignItems: "center", mb: 1, pl: 1 }}>
                  <Avatar
                      src={cgImageURL}
                      sx={{ width: 35, height: 35, marginRight: 1 }}
                  />
                  <Typography variant="subtitle2" noWrap>
                    {Ticker}
                  </Typography>
                  <Typography
                      component="div"
                      variant="body2"
                      noWrap
                      sx={{ marginLeft: "10px" }}
                  >
                    {Name}
                  </Typography>
                </Box>
                {checkCalculation(Potential, Sicherheit) && (
                    <Box
                        sx={{
                          position: "absolute",
                          right: "0",
                          bottom: "0",
                          bgcolor: "red",
                          borderBottomRightRadius: "4px",
                          borderTopLeftRadius: "4px",
                          padding: "1px 6px 0",
                        }}
                    >
                      <Typography
                          component="div"
                          variant="body2"
                          sx={{
                            fontSize: 13,
                            display: "flex",
                            gap: "2px",
                          }}
                      >
                        <span>{Potential}</span>
                        <span>|</span>
                        <span>{Sicherheit}</span>
                      </Typography>
                    </Box>
                )}
              </CardContent>
            </StyledCard>
        ) : (
            <StyledCard
                onDoubleClick={handleDoubleClick}
                sx={{
                  cursor: "pointer",
                  border: `${selected ? "1px solid #00aa66aa" : risk ? "1px solid red" : "none"}`,
                  backgroundColor: `${selected ? "#00aa6633" : risk ? "rgba(222,11,11,0.05)" : "#333"}`,
                  width: "195px",
                  borderStyle: `${risk ? "dashed" : "none"}`,
                  borderLeft: `${selected ? "" : risk ? "none" : ""}`
                }}
            >
              <CategoryColorBar colors={getCategoryColors(Category)} selected={selected} />
              <CardContent sx={{ display: "flex", alignItems: "flex-start" }}>
                <CheckCircleIcon
                    sx={{
                      color: "#00aa66",
                      display: `${selected ? "block" : "none"}`,
                      position: "absolute",
                      zIndex: 1,
                      top: "5px",
                    }}
                />
                <Box sx={{ display: "flex", alignItems: "center", mb: 1, pl: 1 }}>
                  <Avatar
                      src={cgImageURL}
                      sx={{ width: 35, height: 35, marginRight: 1 }}
                  />
                </Box>
                <Box sx={{ paddingLeft: 1 }}>
                  <Typography
                      variant="subtitle2"
                      noWrap
                      sx={{ marginBottom: "5px" }}
                  >
                    {Ticker}
                  </Typography>
                  <Typography component="div" variant="body2" noWrap>
                    {Name}
                  </Typography>
                </Box>
                {checkCalculation(Potential, Sicherheit) && (
                    <Box
                        sx={{
                          position: "absolute",
                          right: "0",
                          bottom: "0",
                          bgcolor: "red",
                          borderBottomRightRadius: "4px",
                          borderTopLeftRadius: "4px",
                          padding: "1px 6px 0",
                        }}
                    >
                      <Typography
                          component="div"
                          variant="body2"
                          sx={{
                            fontSize: 13,
                            display: "flex",
                            gap: "2px",
                          }}
                      >
                        <span>{Potential}</span>
                        <span>|</span>
                        <span>{Sicherheit}</span>
                      </Typography>
                    </Box>
                )}
              </CardContent>
            </StyledCard>
        )}
      </>
  );
};

export default CoinCard;