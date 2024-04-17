import {styled} from "@mui/material/styles";
import {Grid} from "@mui/material";
import {Alert} from "../Atoms";
import CompanyText from "../Atoms/CompanyText";

const Container = styled(Grid)(({}) => ({
    backgroundColor: '#F7FAFC',
    boxShadow: '0px 0px 80px rgba(34, 35, 58, 0.2)',
}))

const AuthContainer = ({children, alertConfig ={}, ...rest}) => {
    return <Container {...rest}>
        <Grid item sx={{mb: 3}}>
            <CompanyText style={{pointer: 'default'}}/>
        </Grid>
        <Grid item xs={12}>
            <Alert config={alertConfig}/>
        </Grid>
        {children}
    </Container>
}

export default AuthContainer;