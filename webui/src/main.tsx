/********************************************************************************
 * Copyright (c) 2019 TypeFox and others
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 ********************************************************************************/

import * as React from 'react';
import { Container, AppBar, Typography, CssBaseline, Box, Theme, Link } from '@material-ui/core';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import GitHubIcon from '@material-ui/icons/GitHub';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import { Route, Switch } from 'react-router-dom';
import { ExtensionListContainer, ExtensionListRoutes } from './pages/extension-list/extension-list-container';
import { UserSettings, UserSettingsRoutes } from './pages/user/user-settings';
import { ExtensionDetailRoutes, ExtensionDetail } from './pages/extension-detail/extension-detail';

import { ExtensionRegistryService } from './extension-registry-service';
import { UserData, isError } from './extension-registry-types';
import { PageSettings } from './page-settings';
import { handleError } from './utils';
import { ErrorDialog } from './components/error-dialog';
import "../src/main.css";
import { Toolbar } from './components/toolbar';

const mainStyles = (theme: Theme) => createStyles({
    footer: {
        backgroundColor: theme.palette.primary.dark,
        padding: `${theme.spacing(1.5)}px ${theme.spacing(3)}px`
    },
    footerBox: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.1rem'
    }
});

const MainComponent = (props: Main.Props) => {
    const [user, setUser] = React.useState<UserData | undefined>();
    const [userLoading, setUserLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string>('');
    const [isErrorDialogOpen, setIsErrorDialogOpen] = React.useState<boolean>(false);

    const updateUser = async () => {
        try {
            const theUser = await props.service.getUser();
            if (isError(theUser)) {
                setUser(undefined);
                setUserLoading(false);
            } else {
                setUser(theUser);
                setUserLoading(false);
            }
        } catch (err) {
            setError(handleError(err));
            setIsErrorDialogOpen(true);
            setUserLoading(false);
        }
    };

    React.useEffect(() => {
        updateUser();
    }, []);

    const setTheError = (err: {}) => {
        const errorMessage = handleError(err);
        setError(errorMessage);
        setIsErrorDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsErrorDialogOpen(false);
    };

    return (
        <React.Fragment>
                <CssBaseline />
                <Box display='flex' flexDirection='column' height='100%'>
                    <AppBar position='sticky'>
                        <Toolbar
                            darkMode={props.darkMode}
                            setDarkMode={props.setDarkMode}
                            service={props.service}
                            user={user}
                            setTheError={setTheError}
                            pageSettings={props.pageSettings}
                        />
                    </AppBar>
                    <Box flex='1' overflow='auto'>
                        <Switch>
                            <Route exact path={[ExtensionListRoutes.MAIN]}
                                render={routeProps =>
                                    <ExtensionListContainer
                                        {...routeProps}
                                        service={props.service}
                                        pageSettings={props.pageSettings}
                                        setError={setTheError}
                                    />
                                } />
                            <Route path={UserSettingsRoutes.MAIN}
                                render={routeProps =>
                                    <UserSettings
                                        {...routeProps}
                                        user={user}
                                        userLoading={userLoading}
                                        service={props.service}
                                        pageSettings={props.pageSettings}
                                        setError={setTheError}
                                    />
                                } />
                            <Route path={ExtensionDetailRoutes.MAIN}
                                render={routeProps =>
                                    <ExtensionDetail
                                        {...routeProps}
                                        user={user}
                                        service={props.service}
                                        pageSettings={props.pageSettings}
                                        setError={setTheError}
                                    />
                                } />
                            <Route path='*'>
                                <Container>
                                    <Box height='30vh' display='flex' flexWrap='wrap' justifyContent='center' alignItems='center'>
                                        <Typography variant='h3'>Oooups...this is a 404 page.</Typography>
                                        <BrokenImageIcon style={{ fontSize: '4rem', flexBasis: '100%' }} />
                                    </Box>
                                </Container>
                            </Route>
                        </Switch>
                    </Box>
                    {
                        error ? (
                            <ErrorDialog
                                errorMessage={error}
                                isErrorDialogOpen={isErrorDialogOpen}
                                handleCloseDialog={handleDialogClose}
                            />
                        )
                            : null
                    }
                    <footer className={props.classes.footer}>
                        <Link target='_blank' href='https://github.com/eclipse/openvsx'>
                            <Box className={props.classes.footerBox}>
                                <GitHubIcon />&nbsp;eclipse/openvsx
                        </Box>
                        </Link>
                    </footer>
                </Box>
        </React.Fragment>
    );
};

export namespace Main {
    export interface Props extends WithStyles<typeof mainStyles> {
        service: ExtensionRegistryService;
        pageSettings: PageSettings;
        setDarkMode: () => void;
        darkMode: true | false;
    }
}

export const Main = withStyles(mainStyles)(MainComponent);
