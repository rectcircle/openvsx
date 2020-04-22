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
import { Switch, FormControlLabel } from '@material-ui/core';
import IconSun from './sun';
import IconMoon from './moon';

const ThemeSwitcher = (props: ThemeSwitcher.Props) => (
   <FormControlLabel
        control={
            <Switch
                checked={props.darkMode}
                onChange={props.setDarkMode}
                icon={<IconSun height={20} />}
                checkedIcon={<IconMoon height={20} />}
                color="default"
            />
        }
        label="Dark Theme"
   />
);

export namespace ThemeSwitcher {
    export interface Props {
        darkMode: boolean;
        setDarkMode: () => void;
    }
}

export default ThemeSwitcher;