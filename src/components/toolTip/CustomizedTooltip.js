import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgb(17, 24, 38)",
    color: "white",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid var(--color-secondary)",
  },
}));

export default function CustomizedTooltips({ texts = [] }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <HtmlTooltip
        title={
          <>
            {texts.map((text) => (
              <>
                {text}
                <br />
              </>
            ))}
          </>
        }
      >
        <InfoIcon
          sx={{ color: "#ffffff33", cursor: "help" }}
          fontSize="small"
        />
      </HtmlTooltip>
    </div>
  );
}
