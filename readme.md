# _[WIP]_ Revizor for Microsoft Azure
## About
Serverless portal for monitoring resource leaks in your Microsoft subscriprions

## Requirements
* Azure AD Application. Configuration guide: https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app
  * Enable Access Tokens
  * Enable ID Tokens
  * Enter Redirect URLs (URL of a current app or localhost)
  * Allow API permission to Azure Service Management (user_impersonation)
  * Allow API permissions to Microsoft.Graph (at least for User.Read)


## Development
Azure login process based on [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser). Azure interaction process based on [Azure Resource Graph](https://docs.microsoft.com/en-us/azure/governance/resource-graph/)
### Build
Build the app and start watch for changes  
`npm run build-dev`  
Start a local _express.js_ server on port 3000  
`npm run start-dev`  


