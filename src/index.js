import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {StyledEngineProvider} from '@mui/material/styles'
import {ThemeProvider} from "@mui/material/styles";
import {Provider} from "react-redux";
import store from "./store";
import {themeNew} from "./components/layout/ui/Theme";


ReactDOM.render(
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themeNew}>
            <Provider store={store}>
                <App/>
            </Provider>
        </ThemeProvider>
    </StyledEngineProvider>
    , document.getElementById('root'));
