import {Box, Divider} from "@mui/material"
import KryptoFilter from "./kryptoFilter"
import ScrollableKryptoTabs from "@/components/portfolio/cards/kryptoAssets/kryptoCoinsTabs";

const KryptoAssets = () => {
  return (
    <Box sx={{ backgroundColor: "#202530", color: 'white', height: "100%", borderRadius: "2px" }}>
        <KryptoFilter/>
        <Divider />
        <ScrollableKryptoTabs/>
    </Box>
  )
}

export default KryptoAssets