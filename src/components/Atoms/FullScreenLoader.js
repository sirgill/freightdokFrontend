import Spinner from "../layout/Spinner";
import {Backdrop} from "@mui/material";

const FullScreenLoader = ({color = 'inherit'}) => {
    return <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
    >
        <Spinner sx={{color}} />
    </Backdrop>
}

export default FullScreenLoader;