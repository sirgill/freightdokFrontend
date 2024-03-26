import {Box, Button, Stack, Typography} from "@mui/material";
import {PRIMARY_BLUE} from "../../components/layout/ui/Theme";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './style.css'

const LandingPage = () => {
    return <Box sx={{position: 'relative'}} className={'landingPageContainer'}>
        <Box component='main' p={8}>
            <Stack direction='row' justifyContent='space-between' alignItems={'center'}>
                <Typography sx={{color: PRIMARY_BLUE, fontSize: 32, fontWeight: 700}}>freightdok.</Typography>

            </Stack>
            <Box className={'landingPageMidSection'}>
                <Stack>
                    <Typography sx={{color: PRIMARY_BLUE, fontSize: 56, fontWeight: 600}}>Source.Book.Service</Typography>
                    <Typography sx={{color: '#000000', fontSize: 56, fontWeight: 600}}>Your Loads with <Typography component={'span'} sx={{color: PRIMARY_BLUE, fontSize: 56, fontWeight: 600}}>{'Data'}</Typography></Typography>
                    <Typography sx={{color: "#7d7d7d", fontSize: 22, fontWeight: 500, whiteSpace: 'pre'}}>
                        {'Source your loads, streamline your bookings, and automate\ncheck calls all within '}
                        <Typography component={'span'} sx={{color: PRIMARY_BLUE, fontSize: 22, fontWeight: 600}}>{'freightdok. '}</Typography>
                        {'The new way of booking loads\nbacked by data.'}
                    </Typography>
                </Stack>
                <Stack mt={3}>
                    <Button variant={'contained'}
                            sx={{py: '12px', width: 262, fontSize: 22, display: 'flex', justifyContent: 'space-around'}}
                            endIcon={<ArrowForwardIcon/>}
                    >
                        Contact Us
                    </Button>
                </Stack>
            </Box>
        </Box>
        <div className='landingPageOval'/>
    </Box>
}

export default LandingPage
