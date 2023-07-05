import React, {Component} from 'react';
import {Box, CircularProgress, Grid, Typography} from "@mui/material";

const Container = ({children}) => {
    return <Grid sx={{height: '100dvh'}} alignItems='center' justifyContent='center'>
        <Box sx={{height: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3}}>
            {children}
        </Box>
    </Grid>
}

const LoadModuleAsync = (importComponent) => {
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
                return <Container>
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