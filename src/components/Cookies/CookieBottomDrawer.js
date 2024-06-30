import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Divider } from '@mui/material';
import { useAtom } from 'jotai';
import { sessionAtom } from '../../app/stores/sessionStore';

export default function CookieBottomDrawer() {
    const [open, setOpen] = React.useState(true);
    const [sessionJotai] = useAtom(sessionAtom);


    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    const handleAcceptAll = () => {
        console.log("Accepted all cookies");
        const userID = sessionJotai?.user.id;
        const res = fetch("/api/acceptCookies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID  }),
        });
        setOpen(false);
    };

    const handleRejectAll = () => {
        console.log("Rejected all cookies");
        setOpen(false);
    };

    const drawerContent = (
        <Box
            sx={{ width: 'auto', padding: 2 }}
            role="presentation"
            onKeyDown={toggleDrawer(false)}
        >
            <IconButton
                sx={{ position: 'absolute', right: 8, top: 8 }}
                onClick={toggleDrawer(false)}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ marginTop: 4, marginBottom: 2 }}>
                This website uses cookies to improve your experience. You can accept or reject them.
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "10px", padding: 2 }}>
                <Button variant="contained" color="primary" onClick={handleAcceptAll}>
                    Accept All
                </Button>
                <Button variant="contained" color="secondary" onClick={handleRejectAll}>
                    Reject
                </Button>
            </Box>
        </Box>
    );

    return (
        <div>
            <Drawer
                anchor="bottom"
                open={open}
                onClose={toggleDrawer(false)}
            >
                {drawerContent}
            </Drawer>
        </div>
    );
}
