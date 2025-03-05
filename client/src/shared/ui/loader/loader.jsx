import {Box, CircularProgress} from "@mui/material";

export const Loader = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
    );
}