import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Image from "next/image";
import Bitpanda from "../../../../public/assets/images/bitpanda.webp";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function BitpandaCard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        bgcolor: "#00d578",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
          padding: isSmallScreen ? "16px" : "24px",
        }}
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.bitpanda.com/en?irclickid=Vc3zsX0JRxyKRViQNMVIXXdjUkHT9oXHexPzXE0&utm_source=Impact&utm_medium=Affiliates&utm_campaign=4425080&utm_content=Online%20Tracking%20Link&utm_term=upRocket%20AI%20GmbH&ref=615250356669422741&tag=affiliates&subid1=&irgwc=1#"
        >
          <Image
            src={Bitpanda}
            alt="Bitpanda"
            placeholder="blur"
            style={{
              width: "100%",
              height: isSmallScreen ? "200px" : "300px",
              cursor: "pointer",
              objectFit: "contain",
            }}
          />
        </a>
      </CardContent>
    </Card>
  );
}

export default BitpandaCard;
