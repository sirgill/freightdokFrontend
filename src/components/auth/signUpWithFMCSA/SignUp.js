import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Box, Grid, Stack, TextField, Typography} from "@mui/material";
import CompanyText from "../../Atoms/CompanyText";
import axios from "axios";
import {FMCSA_VERIFICATION_LINK, LOGIN_LINK} from "../../constants";
import {notification} from "../../../actions/alert";
import {getCheckStatusIcon, verticalAlignStyle} from "../../../utils/utils";
import {LoadingButton} from "../../Atoms";


function ErrorComponent () {
    const icon = getCheckStatusIcon(false);
    return <Stack justifyContent='center' gap={1} flex={1}>
        <Typography align='center'>{icon}</Typography>
        <Typography align={'center'} sx={{fontWeight: 550}}>Sorry!</Typography>
        <Typography align={'center'} variant='subtitle2'>Your Authority is not active</Typography>
    </Stack>
}

const SignUp = (props) => {
    const [text, setText] = useState('');
    const [isAllowedToOperate, setIsAllowedToOperate] = useState(true),
        [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            let {data = {}, status} = await axios.get(`https://mobile.fmcsa.dot.gov/qc/services/carriers/${text}?webKey=e1b9823bbb9dd36dc33b53bc0e8ed0710f1bedca`, {
                headers : {
                    'content-type': "application/json"
                }
            });
            if(status){
                // data.content.carrier.allowedToOperate = 'n'
                const {content: { carrier:  {allowedToOperate = 'n'} = {}} = {}} = data || {};
                if(allowedToOperate.equalsIgnoreCase('y')){
                    props.history.push(FMCSA_VERIFICATION_LINK, data)
                } else {
                    setIsAllowedToOperate(false);
                }
            } else {
                notification('Unable to verify, Please try later.', 'error')
            }
        } catch (e) {
            console.log(e.message)
            notification(e.message, 'error')
        } finally {
            setLoading(false)
        }
    };

    const onChange = (e) => {
        setText(e.target.value);
    }

    return  <section className="login">
        <div className="auth-wrapper auth-inner" style={verticalAlignStyle}>
            <CompanyText />
            <Box component='form' sx={{flex: 1, display: 'flex', alignItems: 'center'}} className="" onSubmit={onSubmit}>
                {isAllowedToOperate ? <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            type={'number'}
                            label='Please enter DOT#'
                            sx={{width: '100%'}}
                            inputProps={{min: 1}}
                            value={text}
                            onChange={onChange}
                            name='dot'
                            size='small'
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item textAlign='center' xs={12}>
                        <LoadingButton type='submit' isLoading={loading} loadingText='Verifying DOT#. Please wait...' disabled={!text || loading}>
                            Next
                        </LoadingButton>
                    </Grid>
                </Grid> : <ErrorComponent />}

            </Box>
            {!isAllowedToOperate && <Typography className="forgot-password text-center">
                <Link to={'/signup/support'}>Contact Support</Link>
            </Typography>}
                <p className="forgot-password text-center">
                   <Link to={LOGIN_LINK}>Sign In</Link>
                </p>
        </div>
    </section>

}

export default SignUp