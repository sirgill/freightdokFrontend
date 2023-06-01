import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Box, Button, Grid, TextField} from "@mui/material";
import CompanyText from "../../Atoms/CompanyText";
import axios from "axios";
import {FMCSA_VERIFICATION_LINK, LOGIN_LINK} from "../../constants";

const verticalAlignStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};

const SignUp = (props) => {
    const [text, setText] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        let {data = {}, status} = await axios.get(`https://mobile.fmcsa.dot.gov/qc/services/carriers/${text}?webKey=e1b9823bbb9dd36dc33b53bc0e8ed0710f1bedca`, {
            headers : {
                'content-type': "application/json"
            }
        });
        if(status){
            props.history.push(FMCSA_VERIFICATION_LINK, data)
        }
    };

    const onChange = (e) => {
        setText(e.target.value);
    }

    return  <section className="login">
        <div className="auth-wrapper auth-inner" style={verticalAlignStyle}>
            <CompanyText />
            <Box component='form' sx={{flex: 1, display: 'flex', alignItems: 'center'}} className="" onSubmit={onSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            type={'number'}
                            label='Please enter DOT#'
                            sx={{width: '100%'}}
                            placeholder='Miles'
                            inputProps={{min: 1}}
                            value={text}
                            onChange={onChange}
                            name='dot'
                            size='small'
                        />
                    </Grid>
                    <Grid item textAlign='center' xs={12}>
                        <Button type='submit' variant='contained' disabled={!text}>Next</Button>
                    </Grid>
                </Grid>

            </Box>
                <p className="forgot-password text-center">
                   <Link to={LOGIN_LINK}>Sign In</Link>
                </p>
        </div>
    </section>

}

export default SignUp