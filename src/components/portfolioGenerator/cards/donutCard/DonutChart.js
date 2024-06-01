import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { categoriesDisplay } from "../../../../lib/data";
import { useAtom } from "jotai/index";
import { portfolioAtom } from "../../../../app/stores/portfolioStore";
import { useTranslations } from "next-intl";

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

const DonutChart = ({ portfolioCalculations, loadingPortfolio }) => {
  const canvasRef = useRef(null);
  const [portfolio] = useAtom(portfolioAtom, { assets: [] });
  const [securityScore, setSecurityScore] = useState(0);
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0, angle: 0 });
  const t = useTranslations("donutChart");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    console.log("portfolioportfolio", portfolio)
  }, [portfolio]);

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
      const innerRadius = radius * 0.68;
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
      canvas.height = parent.clientWidth; // keep it square
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
    const innerRadius = radius * 0.65; // Adjusted for desired width

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

        setTooltip({
          visible: true,
          text: `${category}: ${value.toFixed(1)}%`,
          x: tooltipX,
          y: tooltipY,
          angle: tooltipAngle,
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

  return (
    <Box
      sx={{
        position: "relative",
        width: "60%",
        height: "auto",
        display: "flex",
        mr: "-25px",
        "@media only screen and (max-width:1600px)": {
          width: "40%",
          mr: 0,
        },
        "@media only screen and (max-width:500px)": {
          width: "100%",
          mt: "1rem",
        },
      }}
    >
      <Box
        sx={{
          height: "auto",
          width: "100%",
          alignSelf: "flex-end",
          "@media (max-width:1500px)": {
            scale: 0.9,
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
          {securityScore}
        </Typography>
        <Typography variant="caption" style={{ color: "#FFFFFF" }}>
          {t("veryGood")}
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
            "::before": {
              content: '""',
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(45deg)",
              width: "10px",
              height: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            },
          }}
        >
          {tooltip.text}
        </Box>
      )}
    </Box>
  );
};

export default DonutChart;
