# workspace-cli 
This extension enhances the Visual Studio Code environment by managing PowerShell profiles specific to your workspace. It ensures that each workspace has its own PowerShell settings and history, improving the development experience by tailoring the environment to project-specific needs.

## Features

The `workspace-cli` extension offers the following features:

- **PowerShell Profile Management**: Automatically creates and updates a PowerShell profile for each workspace. This profile includes custom settings for the PowerShell environment used within Visual Studio Code.

- **Workspace-specific History**: Maintains a separate command history for each workspace using the PowerShell profile, allowing for easier recall of previous commands relevant to your current project.

For example, here is how the PowerShell profile management works:

```
# Check if the VSCode workspace-specific profile exists and source it
$vscodeWorkspacePath = $env:VSCODE_WORKSPACE_PATH
if ($vscodeWorkspacePath -and (Test-Path -Path $vscodeWorkspacePath)) {
    $vscodeSubfolderPath = Join-Path -Path $vscodeWorkspacePath -ChildPath ".vscode"
    $workspaceIndicator = Join-Path -Path $vscodeWorkspacePath -ChildPath "*.code-workspace"

    # Check if it's a VSCode workspace by looking for .vscode directory or *.code-workspace files
    if ((Test-Path -Path $vscodeSubfolderPath) -or (Test-Path -Path $workspaceIndicator)) {
        if (-not (Test-Path $vscodeSubfolderPath)) {
            New-Item -ItemType Directory -Path $vscodeSubfolderPath
        }
        $workspaceProfilePath = Join-Path -Path $vscodeSubfolderPath -ChildPath "vscode_profile.ps1"
        $workspaceHistoryPath = Join-Path -Path $vscodeSubfolderPath -ChildPath "workspace_history.clixml"

        # Always create or overwrite the workspace-specific profile
        @"
# Workspace-specific PowerShell profile
Import-Module PSReadLine
Set-PSReadlineOption -HistorySavePath '$workspaceHistoryPath'
Set-PSReadlineOption -MaximumHistoryCount 100
"@ | Out-File $workspaceProfilePath -Force

        # Source the newly created or updated profile
        . $workspaceProfilePath
    }
}
```


## Requirements

There are no specific requirements or dependencies for installing this extension, other than having Visual Studio Code installed.

## Extension Settings

This extension contributes the following settings:

* `workspace-cli.enable`: Enable/disable this extension.
* `workspace-cli.createPowerShellProfile`: Command to manually trigger the creation or update of the PowerShell profile for the current workspace.

## Known Issues

Currently, there are no known issues. If you encounter any problems, please open an issue on the GitHub repository.

## Release Notes

### 1.0.0

Initial release of `workspace-cli`.

