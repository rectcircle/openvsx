/********************************************************************************
 * Copyright (c) 2020 TypeFox and others
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 ********************************************************************************/

import * as React from "react";
import {
    Theme, createStyles, WithStyles,
    withStyles, Box, Paper, Typography,
    Avatar, Button, Dialog, DialogTitle,
    DialogContent, DialogContentText,
    TextField, DialogActions, Popper, Fade, Tabs, Tab
} from "@material-ui/core";
import { UserData, Namespace, NamespaceMembership, isError } from "../../extension-registry-types";
import { ExtensionRegistryService } from "../../extension-registry-service";

const namespacesStyle = (theme: Theme) => createStyles({
    namespaceManagementContainer: {
        display: 'flex',
        width: '100%'
    },
    namespaceContainer: {
        flex: 1
    },
    namespace: {

    },
    memberName: {
        fontWeight: 'bold',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    memberContainer: {
        flex: 5,
        background: theme.palette.grey[200]
    },
    deleteBtnContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    deleteBtn: {
        color: theme.palette.error.main,
        height: 36
    },
    addButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px 16px 16px'
    },
    foundUserListPopper: {
        zIndex: 2000
    },
    foundUserListContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: 350
    },
    foundUserContainer: {
        display: 'flex',
        height: 60,
        alignItems: 'center',
        '&:hover': {
            cursor: 'pointer',
            background: theme.palette.grey[100]
        }
    }
});

class UserSettingsNamespacesComponent extends React.Component<UserSettingsNamespacesComponent.Props, UserSettingsNamespacesComponent.State> {

    constructor(props: UserSettingsNamespacesComponent.Props) {
        super(props);

        this.state = {
            namespaces: [],
            members: [],
            addDialogIsOpen: false,
            showUserPopper: false,
            foundUsers: [],
            popperTarget: undefined,
            chosenNamespace: undefined
        };
    }

    componentDidMount() {
        this.initNamespaces();
    }

    render() {
        return <React.Fragment>
            {
                this.state.namespaces.length > 0 && this.state.chosenNamespace ?
                    <React.Fragment>
                        <Box className={this.props.classes.namespaceManagementContainer}>
                            <Tabs
                                orientation='vertical'
                                value={this.state.chosenNamespace}
                                onChange={this.handleChangeNamespace}
                                className={this.props.classes.namespaceContainer}>
                                {
                                    this.state.namespaces.map(namespace => {
                                        return <Tab
                                            key={'nmspc-' + namespace.name}
                                            className={this.props.classes.namespace}
                                            value={namespace}
                                            label={namespace.name}
                                        />;
                                    })
                                }
                            </Tabs>
                            <Box className={this.props.classes.memberContainer}>
                                <Box padding='16px'>
                                    <Typography variant='h6'>Namespace: {this.state.chosenNamespace.name}</Typography>
                                </Box>
                                <Box className={this.props.classes.addButtonContainer}>
                                    <Button variant="contained" color="primary" onClick={this.handleOpenAddDialog}>
                                        Add Namespace Member
                                    </Button>
                                </Box>
                                <Paper>
                                    {this.state.members.map(member => this.renderMember(member))}
                                </Paper>
                            </Box>
                        </Box>
                        {this.renderAddDialog()}
                    </React.Fragment>
                    : 'No Namespaces Available'
            }
        </React.Fragment>;
    }

    protected renderAddDialog() {
        return <React.Fragment>
            <Dialog open={this.state.addDialogIsOpen} >
                <DialogTitle id="form-dialog-title">Add User to Namespace</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the Login Name of the User you want to add.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        autoComplete="off"
                        label="Open VSX User"
                        fullWidth
                        onChange={this.handleUserSearch}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.doCloseAddDialog()} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Popper
                className={this.props.classes.foundUserListPopper}
                open={this.state.showUserPopper}
                anchorEl={this.state.popperTarget}
                placement='bottom'
                transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper className={this.props.classes.foundUserListContainer}>
                            {
                                this.state.foundUsers.map(user => {
                                    return <Box
                                        onClick={() => { this.addUser(user); }}
                                        className={this.props.classes.foundUserContainer}
                                        key={'found' + user.loginName}>
                                        <Box flex='1' marginLeft='10px'>
                                            <Box fontWeight='bold'>
                                                {user.loginName}
                                            </Box>
                                            <Box fontSize='0.75rem'>
                                                {user.fullName}
                                            </Box>
                                        </Box>
                                        <Box flex='1'>
                                            <Avatar variant='rounded' src={user.avatarUrl} />
                                        </Box>
                                    </Box>;
                                })
                            }
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </React.Fragment>;
    }

    protected renderMember(member: NamespaceMembership): React.ReactNode {
        return <Box key={'member:' + member.loginName} p={2} display='flex'>
            <Box alignItems='center' overflow='auto' width='33%'>
                <Typography classes={{ root: this.props.classes.memberName }}>{member.loginName}</Typography>
                {member.fullName ? <Typography variant='body2'>{member.fullName}</Typography> : ''}
                {member.homepage ? <Typography variant='body2'><a href={member.homepage}>Homepage</a></Typography> : ''}
            </Box>
            {
                member.avatarUrl ?
                    <Box display='flex' alignItems='center'>
                        <Avatar src={member.avatarUrl}></Avatar>
                    </Box>
                    : ''
            }
            {
                member.role !==  'owner' ?
                <Box className={this.props.classes.deleteBtnContainer}>
                    <Button
                        variant='outlined'
                        onClick={() => this.removeUser(member)}
                        classes={{ root: this.props.classes.deleteBtn }}>
                        Delete
                </Button>
                </Box>
                : ''
            }
        </Box>;
    }

    protected async addUser(user: UserData) {
        try {
            if (this.state.chosenNamespace) {
                const result = await this.props.service.setNamespaceMembers(this.state.chosenNamespace.name, user.loginName, 'add');
                if (isError(result)) {
                    throw result;
                }
                const members = await this.props.service.getNamespaceMembers(this.state.chosenNamespace.name);
                this.setState({ members });
                this.doCloseAddDialog();
            }
        } catch (err) {
            throw err;
        }
    }

    protected async removeUser(memberShip: NamespaceMembership) {
        try {
            if (this.state.chosenNamespace) {
                const result = await this.props.service.setNamespaceMembers(memberShip.namespace, memberShip.loginName, 'remove');
                if (isError(result)) {
                    throw result;
                }
                const members = await this.props.service.getNamespaceMembers(this.state.chosenNamespace.name);
                this.setState({ members });
            }
        } catch (err) {
            throw err;
        }
    }

    protected handleUserSearch = (ev: React.ChangeEvent<HTMLInputElement>) => { this.doHandleUserSearch(ev); };
    protected async doHandleUserSearch(ev: React.ChangeEvent<HTMLInputElement>) {
        const popperTarget = ev.currentTarget;
        const val = popperTarget.value;
        let showUserPopper = false;
        let foundUsers: UserData[] = [];
        if (val) {
            const users = await this.props.service.getUserByName(val);
            if (users) {
                showUserPopper = true;
                foundUsers = users;
            }
        }
        this.setState({ showUserPopper, foundUsers, popperTarget });
    }

    protected handleOpenAddDialog = () => this.doOpenAddDialog();
    protected doOpenAddDialog() {
        this.setState({ addDialogIsOpen: true });
    }

    protected handleCloseAddDialog = () => this.doCloseAddDialog();
    protected doCloseAddDialog() {
        this.setState({ addDialogIsOpen: false, showUserPopper: false });
    }

    protected handleChangeNamespace = (event: React.ChangeEvent<{}>, value: Namespace) => {
        this.doHandleChangeNamespace(value);
    }

    protected async doHandleChangeNamespace(chosenNamespace: Namespace) {
        const members = await this.props.service.getNamespaceMembers(chosenNamespace.name);
        this.setState({ members, chosenNamespace });
    }

    protected async initNamespaces() {
        const namespaces = await this.props.service.getNamespaces();
        const chosenNamespace = namespaces.length ? namespaces[0] : undefined;
        let members: NamespaceMembership[] = [];
        if (chosenNamespace) {
            members = await this.props.service.getNamespaceMembers(chosenNamespace.name);
        }
        this.setState({ namespaces, chosenNamespace, members });
    }
}

export namespace UserSettingsNamespacesComponent {
    export interface Props extends WithStyles<typeof namespacesStyle> {
        user: UserData
        service: ExtensionRegistryService
    }

    export interface State {
        namespaces: Namespace[];
        members: NamespaceMembership[];
        addDialogIsOpen: boolean;
        showUserPopper: boolean;
        foundUsers: UserData[];
        popperTarget: any;
        chosenNamespace?: Namespace;
    }
}

export const UserSettingsNamespaces = withStyles(namespacesStyle)(UserSettingsNamespacesComponent);