// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('workspace-cli is now active!');

    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders(() => {
            console.log('Workspace folders changed, checking and creating PowerShell profile if necessary.');
            checkAndCreateProfile();
        }),
        vscode.commands.registerCommand('workspace-cli.createPowerShellProfile', () => {
            console.log('Command "createPowerShellProfile" invoked.');
            checkAndCreateProfile();
        }),
        vscode.window.onDidOpenTerminal(terminal => {
            configureTerminal(terminal);
        })
    );

    // Configure already opened terminals
    vscode.window.terminals.forEach(terminal => {
        configureTerminal(terminal);
    });
}

function checkAndCreateProfile() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        const workspacePath = workspaceFolders[0].uri.fsPath;
        const vscodeSubfolderPath = path.join(workspacePath, '.vscode');
        const profilePath = path.join(vscodeSubfolderPath, 'vscode_profile.ps1');
        const historyPath = path.join(vscodeSubfolderPath, 'workspace_history.clixml');

        if (!fs.existsSync(vscodeSubfolderPath)) {
            console.log(`Creating .vscode directory at ${vscodeSubfolderPath}`);
            fs.mkdirSync(vscodeSubfolderPath);
        }

        const profileContent = `
# Workspace-specific PowerShell profile
Import-Module PSReadLine
Set-PSReadlineOption -HistorySavePath '${historyPath}'
Set-PSReadlineOption -MaximumHistoryCount 30
`;
        fs.writeFileSync(profilePath, profileContent);
        console.log(`PowerShell profile created or updated at ${profilePath}`);
        vscode.window.showInformationMessage('Workspace-specific PowerShell profile created or updated.');
    } else {
        console.log('No workspace folders found, unable to create PowerShell profile.');
    }
}

function configureTerminal(terminal: vscode.Terminal) {
    if (terminal.name === "PowerShell") {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            const workspacePath = workspaceFolders[0].uri.fsPath;
            const vscodeSubfolderPath = path.join(workspacePath, '.vscode');
            const profilePath = path.join(vscodeSubfolderPath, 'vscode_profile.ps1');
            terminal.sendText(`. '${profilePath}'`);
        }
    }
}

// This method is called when your extension is deactivated
export function deactivate() {
    console.log('workspace-cli has been deactivated.');
}
