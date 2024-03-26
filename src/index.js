import React from 'react';
import App from './App';
import {StyledEngineProvider} from '@mui/material/styles'
import {ThemeProvider} from "@mui/material/styles";
import {Provider} from "react-redux";
import store from "./store";
import {themeNew} from "./components/layout/ui/Theme";
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(<StyledEngineProvider injectFirst>
    <ThemeProvider theme={themeNew}>
        <Provider store={store}>
            <App/>
        </Provider>
    </ThemeProvider>
</StyledEngineProvider>);
