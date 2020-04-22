/********************************************************************************
 * Copyright (c) 2020 TypeFox and others
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 ********************************************************************************/

import * as React from 'react';

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import { Main } from './main';
import { PageSettings } from './page-settings';
import { ExtensionRegistryService } from './extension-registry-service';

const ThemeController = (props: ThemeController.Props) => {
    const [darkMode, setDarkMode] = React.useState<boolean>(false);

    const theme = createMuiTheme({
        palette: {
            primary: {
                main: darkMode ? '#555' : '#eeeeee', contrastText: '#3f3841', dark: darkMode ? '#f4f4f4' : '#565157'
            },
            secondary: {
                main: darkMode ? '#c160ef' : '#a60ee5', contrastText: '#edf5ea'
            },
            type: darkMode ? 'dark' : 'light'
        },
        breakpoints: {
            values: {
                xs: 340,
                sm: 550,
                md: 800,
                lg: 1040,
                xl: 1240
            }
        }
    });

    const setTheDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeProvider theme={theme}>
            <Main
                service={props.service}
                pageSettings={props.pageSettings}
                setDarkMode={setTheDarkMode}
                darkMode={darkMode}
            />
        </ThemeProvider>
    );
};

export namespace ThemeController {
    export interface Props {
        pageSettings: PageSettings;
        service: ExtensionRegistryService;
    }
}

export default ThemeController;
