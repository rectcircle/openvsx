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

import { Theme, Toolbar as Bar, Box, IconButton } from '@material-ui/core';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { UserAvatar } from '../../pages/user/avatar';
import { Link as RouteLink } from 'react-router-dom';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { PageSettings } from '../../page-settings';
import { ExtensionRegistryService } from '../../extension-registry-service';
import { ExtensionListRoutes } from '../../pages/extension-list/extension-list-container';
import { UserData } from '../../extension-registry-types';
import { ErrorResponse } from '../../server-request';

const toolbarStyles = (theme: Theme) => createStyles({
    toolbar: {
        justifyContent: 'space-between'
    },
    toolbarLogo: {
        width: 'auto',
        height: '40px',
        marginTop: '6px',
        marginRight: theme.spacing(2)
    },
    alignVertically: {
        display: 'flex',
        alignItems: 'center'
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary
    },
});

const ToolbarComponent = (props: Toolbar.Props) => {
    const ToolbarContent = props.pageSettings.toolbarContent;
    return (
        <Bar classes={{ root: props.classes.toolbar }}>
            <Box>
                <RouteLink to={ExtensionListRoutes.MAIN} className={props.classes.link} aria-label={`Home - ${props.pageSettings.pageTitle}`}>
                    <Box className={props.classes.alignVertically}>
                        <ToolbarContent
                            darkMode={props.darkMode}
                            className={props.classes.toolbarLogo}
                        />
                    </Box>
                </RouteLink>
            </Box>
            <Box display='flex' alignItems='center'>
                {
                    props.user ?
                        <UserAvatar
                            user={props.user}
                            service={props.service}
                            setError={props.setTheError}
                        />
                        :
                        <IconButton href={props.service.getLoginUrl()} title="Log In">
                            <AccountBoxIcon />
                        </IconButton>
                }
            </Box>
        </Bar>
    );
};

export namespace Toolbar {
    export interface Props extends WithStyles<typeof toolbarStyles> {
        user: UserData | undefined;
        darkMode: boolean;
        setDarkMode: () => void;
        setTheError: (err: Error | Partial<ErrorResponse>) => void;
        pageSettings: PageSettings;
        service: ExtensionRegistryService;
    }
}

export const Toolbar = withStyles(toolbarStyles)(ToolbarComponent);