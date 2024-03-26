import React, {Component} from 'react';
import {Box, CircularProgress, Grid, Typography} from "@mui/material";
import CompanyText from "./CompanyText";

const Container = ({children, sx={},showCompanyText}) => {
    return <Grid sx={{height: '100dvh', ...sx}}>
        {showCompanyText && <CompanyText style={{textAlign: 'left', pl: 4, pt: 4}}/>}
        <Box sx={{height: 'calc(100% - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, px: 2}}>
            {children}
        </Box>
    </Grid>
}

const LoadModuleAsync = (importComponent, showCompanyText = false) => {
    return class extends Component {
        state = {
            component: null,
            error: ''
        }

        componentDidMount() {
            importComponent()
                .then(cmp => {
                    this.setState({component: cmp.default});
                })
                .catch(e => {
                    console.log(e.message)
                    if(e.message.includes('failed')){
                        this.setState({ error: 'Loading failed! Please check your connection or try again later.'})
                    }
                });
        }

        render() {
            const C = this.state.component;
            if(this.state.error) {
                return <Container showCompanyText={showCompanyText}>
                    <Typography variant='h6'>{this.state.error}</Typography>
                </Container>
            }
            return C ? <C {...this.props}/> : <Container>
                <CircularProgress />
                <Typography variant='h5'>Loading...</Typography>
            </Container>;
        }
    }
};

export default LoadModuleAsync;