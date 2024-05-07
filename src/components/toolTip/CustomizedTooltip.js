import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

export default function CustomizedTooltips({ text1, text2 }) {
    return (
        <div>
            <HtmlTooltip
                title={
                    <>
                        <em>{text1}</em>{' '}
                        <br/>
                        <br/>
                        {text2}
                    </>
                }
            >
                <InfoIcon sx={{color: "#ffffff33", cursor: "help"}} fontSize="small"/>
            </HtmlTooltip>
        </div>
    );
}