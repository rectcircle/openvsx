import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import  ThemeProvider from '../src/theme-provider';
import { Extension } from '../src/extension-registry-types';
import { PageSettings } from '../src/page-settings';
import { ExtensionRegistryService } from '../src/extension-registry-service';

let serverHost = location.hostname;
if (serverHost.startsWith('3000-')) {
    // The frontend runs on port 3000, but the server runs on port 8080
    serverHost = '8080-' + serverHost.substring(5);
}
const service = new ExtensionRegistryService(`${location.protocol}//${serverHost}`);

const reportAbuseText = encodeURIComponent('<Please describe the issue>');
const extensionURL = (extension: Extension) => encodeURIComponent(
    `${location.protocol}//${location.hostname}/extension/${extension.namespace}/${extension.name}`);
const pageSettings: PageSettings = {
    pageTitle: 'Open VSX Registry',
    listHeaderTitle: 'Extensions for VS Code Compatible Editors',
    logoAlt: 'Open VSX Registry',
    logoURL: '/openvsx-registry.svg',
    extensionDefaultIconURL: '/default-icon.png',
    namespaceAccessInfoURL: 'https://github.com/eclipse/openvsx/wiki/Namespace-Access',
    reportAbuseHref: extension => `mailto:abuse@example.com?subject=Report%20Abuse%20-%20${extension.namespace}.${extension.name}&Body=${reportAbuseText}%0A%0A${extensionURL(extension)}`,
    claimNamespaceHref: namespace => `https://github.com/myorg/myrepo/issues/new?title=Claiming%20ownership%20of%20${namespace}`
};

const node = document.getElementById('main');

ReactDOM.render(<BrowserRouter>
   <ThemeProvider 
        service={service}
        pageSettings={pageSettings}
   />
</BrowserRouter>, node);
