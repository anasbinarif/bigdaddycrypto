import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import {
  categoriesDisplay,
  reverseCategoriesDisplay,
} from "../../../../lib/data";
import { useAtom } from "jotai/index";
import { portfolioAtom } from "../../../../app/stores/portfolioStore";
import { useTranslations } from "next-intl";
import { calculateScore } from "../../../../lib/data";

const categoryColors = {
  AI: "#FFD700",
  "Gaming/ Metaverse": "#00BFFF",
  DeFi: "#1155bb",
  "Web3/ Anonymität": "#DC143C",
  "Grüne Coins": "#00aa66",
  "BTC- Zusammenhang": "#FF9900",
  "CBDC- Netzwerke": "#667788",
  eCommerce: "#8833bb",
  "Tokenisierung/ RWA": "#ff5aac",
};

const DonutChart = ({
  preCalcPort,
  portfolioCalculations,
  loadingPortfolio,
}) => {
  const canvasRef = useRef(null);
  const [portfolio] = preCalcPort || useAtom(portfolioAtom, { assets: [] });
  const [securityScore, setSecurityScore] = useState(0);
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
    angle: 0,
    category: "",
    count: 0,
    color: "",
  });
  const t = useTranslations("donutChart");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const calculateSecurityScore = () => {
      let totalInvestment = 0;
      let weightedScore = 0;

      portfolio.assetsCalculations.assets.forEach((asset) => {
        totalInvestment += asset.totalInvest;
      });

      portfolio.assetsCalculations.assets.forEach((asset) => {
        const assetDetails = portfolio.assets.find(
          (a) => a.CoinGeckoID === asset.CoinGeckoID
        );
        if (assetDetails && assetDetails.Sicherheit) {
          const weight = asset.totalInvest / totalInvestment;
          weightedScore += weight * assetDetails.Sicherheit;
        }
      });

      setSecurityScore(weightedScore.toFixed(1));
    };

    if (portfolio?.assetsCalculations && portfolio.assets) {
      calculateSecurityScore();
    }
  }, [portfolio]);

  useEffect(() => {
    const drawChart = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const data = loadingPortfolio
        ? Object.entries(portfolioCalculations?.percentages || {}).map(
            ([key, value]) => {
              return [
                categoriesDisplay[key] || key,
                parseFloat(value.replace("%", "")),
              ];
            }
          )
        : [["AI", 100.0]];

      const colors = data.map((item) => categoryColors[item[0]] || "#CCCCCC");

      const total = data.reduce((acc, [, value]) => acc + value, 0);
      let startAngle = -0.5 * Math.PI;
      const radius = Math.min(canvas.width, canvas.height) / 2;
      const innerRadius = radius * 0.75;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      data.forEach(([category, value], index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();

        startAngle = endAngle;
      });
    };

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientWidth;
      drawChart();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [portfolioCalculations, loadingPortfolio]);

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2;
    const innerRadius = radius * 0.65;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < innerRadius || distance > radius) {
      setTooltip({ visible: false, text: "", x: 0, y: 0, angle: 0 });
      return;
    }

    let angle = Math.atan2(dy, dx);
    if (angle < -0.5 * Math.PI) {
      angle += 2 * Math.PI;
    }

    const data = loadingPortfolio
      ? Object.entries(portfolioCalculations?.percentages || {}).map(
          ([key, value]) => {
            return [
              categoriesDisplay[key] || key,
              parseFloat(value.replace("%", "")),
            ];
          }
        )
      : [["AI", 100.0]];

    const total = data.reduce((acc, [, value]) => acc + value, 0);
    let startAngle = -0.5 * Math.PI;

    for (let i = 0; i < data.length; i++) {
      const [category, value] = data[i];
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      if (angle >= startAngle && angle < endAngle) {
        const tooltipAngle = (startAngle + endAngle) / 2;
        const tooltipX = centerX + (radius + 10) * Math.cos(tooltipAngle);
        const tooltipY = centerY + (radius + 10) * Math.sin(tooltipAngle);
        const categoryCount =
          portfolioCalculations?.counts[reverseCategoriesDisplay[category]] ||
          0;

        setTooltip({
          visible: true,
          text: category,
          count: categoryCount,
          x: tooltipX,
          y: tooltipY,
          angle: tooltipAngle,
          color: categoryColors[category] || "#CCCCCC",
        });
        return;
      }

      startAngle = endAngle;
    }

    setTooltip({ visible: false, text: "", x: 0, y: 0, angle: 0 });
  };

  const handleMouseOut = () => {
    setTooltip({ visible: false, text: "", x: 0, y: 0, angle: 0 });
  };
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchScore = async () => {
      if (portfolio?.assets) {
        console.log(portfolio.assets);
        try {
          const calculatedScore = await calculateScore(portfolio.assets);
          setScore(calculatedScore?.score);
          console.log("Calculated Score:", calculatedScore);
        } catch (error) {
          console.error("Error calculating score:", error);
        }
      }
    };
    fetchScore();
  }, [portfolio]);
  useEffect(() => {
    console.log("Calculated Score2:", score);
  }, [score]);

  function calculateNote(score) {
    if (score >= 91) {
      return "Sehr gut"; // Sehr gut
    } else if (score >= 80) {
      return "Gut"; // Gut
    } else if (score >= 67) {
      return "Befriedigend"; // Befriedigend
    } else if (score >= 50) {
      return "Ausreichend"; // Ausreichend
    } else if (score >= 30) {
      return "Mangelhaft"; // Ausreichend
    } else {
      return "Schlecht"; // Mangelhaft
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "35%",
        maxWidth: "250px",
        height: "auto",
        display: "flex",
        margin: "0 auto",
        "@media only screen and (max-width:1600px)": {
          width: "40%",
          // mr: 0,
        },
        "@media only screen and (max-width:500px)": {
          width: "100%",
          margin: "1rem auto 0",
          display: "flex",
          justifyContent: "center",
          // marginLeft: 0,
          // marginRight: 0,
        },
      }}
    >
      <Box
        sx={{
          height: "auto",
          width: "100%",
          margin: "0 auto",
          // maxWidth: "none",
          alignSelf: "flex-end",
          "@media only screen (max-width:1500px)": {
            scale: 0.9,
          },
          "@media only screen (max-width:500px)": {
            display: "flex",
            justifyContent: "center",
            margin: 0,
          },
        }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          onMouseMove={handleMouseMove}
          onMouseOut={handleMouseOut}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          zIndex: "100",
        }}
      >
        <Typography
          variant="caption"
          style={{
            color: "#FFFFFF",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {t("score")}
        </Typography>
        <Typography
          variant="h4"
          component="div"
          style={{ color: "#FFFFFF" }}
          sx={{
            "@media (max-width:1500px)": {
              fontSize: "clamp(1.75rem, 0.25rem + 2vw, 2.125rem)",
            },
          }}
        >
          {portfolio?.assets?.length > 0 && score}
        </Typography>
        <Typography variant="caption" style={{ color: "#FFFFFF" }}>
          {portfolio?.assets?.length > 0 && t(`${calculateNote(score)}`)}
        </Typography>
      </Box>
      {tooltip.visible && (
        <Box
          sx={{
            position: "absolute",
            top: tooltip.y,
            left: tooltip.x,
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "#FFFFFF",
            padding: "5px",
            borderRadius: "3px",
            pointerEvents: "none",
            zIndex: "1000",
            whiteSpace: "nowrap",
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {tooltip.text}
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}
          >
            <Box
              sx={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                backgroundColor: tooltip.color,
                border: "1px solid #FFFFFF",
                marginRight: "5px",
              }}
            ></Box>
            <Typography variant="body2">{tooltip.count}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DonutChart;
