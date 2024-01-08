import {verticalAlignStyle} from "../../utils/utils";
import {Grid, Typography} from "@mui/material";
import {LoadingButton, Password} from "../../components/Atoms";
import {useState} from "react";
import AuthContainer from "../../components/common/AuthContainer";
import CompanyText from "../../components/Atoms/CompanyText";
import useMutation from "../../hooks/useMutation";
import {Link} from "react-router-dom";
import {LOGIN_LINK} from "../../components/client/routes";

const ForgotPassword = () => {
    const [form, setForm] = useState({pass: '', confirmPass: ''}),
        {mutation, loading} = useMutation('');

    const onChange = ({name, value}) => {
        setForm({...form, [name]: value});
    }

    const onSubmit = (e) => {
        e.preventDefault();
        mutation()
    }

    return <div className='auth-wrapper' style={verticalAlignStyle}>
        <AuthContainer container direction='column' gap={2} p={8} component={'form'} onSubmit={onSubmit}>
            <Grid item sx={{mb: 3}}>
                <CompanyText style={{pointer: 'default'}}/>
            </Grid>
            <Grid item xs={12}>
                <Password label='New Password' onChange={onChange} value={form.pass} name='pass'/>
            </Grid>
            <Grid item xs={12}>
                <Password label='Confirm Password' onChange={onChange} value={form.confirmPass} name='confirmPass'/>
            </Grid>
            <Grid item xs={12} sx={{m: 'auto'}}>
                <LoadingButton isLoading={loading} type='submit' loadingText='Please wait...'>Submit</LoadingButton>
            </Grid>
            <Grid item xs={12} sx={{m: 'auto'}}>
                <Typography component={Link} to={LOGIN_LINK} sx={{display: 'block' }}>Login</Typography>
            </Grid>
        </AuthContainer>
    </div>
}

export default ForgotPassword