# MaphoshaLogistics - Azure Deployment Guide

This guide walks you through deploying the MaphoshaLogistics platform to Microsoft Azure.

## Prerequisites

- Azure subscription
- Azure CLI installed (`az` command)
- Node.js 18+
- Git

## Step 1: Create Azure Resources

### 1.1 Create Resource Group

```bash
az group create \
  --name maphosha-rg \
  --location eastus
```

### 1.2 Create SQL Database

```bash
# Create SQL Server
az sql server create \
  --name maphosha-server \
  --resource-group maphosha-rg \
  --location eastus \
  --admin-user admin \
  --admin-password YourPassword123!

# Create SQL Database
az sql db create \
  --resource-group maphosha-rg \
  --server maphosha-server \
  --name maphosha_db \
  --service-objective S0

# Configure firewall to allow Azure services
az sql server firewall-rule create \
  --resource-group maphosha-rg \
  --server maphosha-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### 1.3 Create App Service Plan

```bash
az appservice plan create \
  --name maphosha-plan \
  --resource-group maphosha-rg \
  --sku B2 \
  --is-linux
```

### 1.4 Create Web App

```bash
az webapp create \
  --resource-group maphosha-rg \
  --plan maphosha-plan \
  --name maphosha-app \
  --runtime "NODE|18.0"
```

## Step 2: Configure Application Settings

```bash
# Get your SQL connection string
CONNECTION_STRING="Server=tcp:maphosha-server.database.windows.net,1433;Initial Catalog=maphosha_db;Persist Security Info=False;User ID=admin;Password=YourPassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

# Set application settings
az webapp config appsettings set \
  --resource-group maphosha-rg \
  --name maphosha-app \
  --settings \
    NODE_ENV=production \
    DATABASE_SERVER=maphosha-server.database.windows.net \
    DATABASE_NAME=maphosha_db \
    DATABASE_USER=admin \
    DATABASE_PASSWORD=YourPassword123! \
    JWT_SECRET=your-super-secret-jwt-key \
    FRONTEND_URL=https://maphosha-app.azurewebsites.net \
    PORT=8080
```

## Step 3: Initialize Database

Before deploying, initialize the database schema:

```bash
# Connect to your SQL Database
# Use Azure Data Studio or SQL Server Management Studio

# Or run the migration script locally:
npm run migrate --workspace=backend
```

## Step 4: Build and Deploy

### 4.1 Build the Application

```bash
npm run build
```

### 4.2 Deploy to Azure

**Option A: Using Git (Recommended)**

```bash
# Initialize git remote
az webapp deployment source config-local-git \
  --resource-group maphosha-rg \
  --name maphosha-app

# Add Azure remote to your git repository
git remote add azure https://maphosha-app.scm.azurewebsites.net/maphosha-app.git

# Deploy
git push azure main
```

**Option B: Using ZIP deployment**

```bash
# Create deployment package
zip -r deploy.zip . -x "node_modules/*" ".git/*"

# Deploy
az webapp deployment source config-zip \
  --resource-group maphosha-rg \
  --name maphosha-app \
  --src deploy.zip
```

## Step 5: Configure Custom Domain (Optional)

```bash
# Add custom domain
az webapp config hostname add \
  --resource-group maphosha-rg \
  --webapp-name maphosha-app \
  --hostname yourdomain.com

# Configure SSL certificate (using Let's Encrypt)
az webapp config ssl bind \
  --resource-group maphosha-rg \
  --name maphosha-app \
  --certificate-name maphosha-cert \
  --ssl-type SNI
```

## Step 6: Monitor and Logs

### View Application Logs

```bash
az webapp log tail \
  --resource-group maphosha-rg \
  --name maphosha-app
```

### Configure Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app maphosha-insights \
  --location eastus \
  --resource-group maphosha-rg \
  --application-type web

# Link to App Service
az webapp config appsettings set \
  --resource-group maphosha-rg \
  --name maphosha-app \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=your-key
```

## Step 7: Scaling

### Auto-scale Configuration

```bash
# Create autoscale settings
az monitor autoscale create \
  --resource-group maphosha-rg \
  --resource maphosha-app \
  --resource-type "Microsoft.Web/sites" \
  --name maphosha-autoscale \
  --min-count 1 \
  --max-count 5 \
  --count 2
```

## Troubleshooting

### Connection Issues

1. Check firewall rules:
```bash
az sql server firewall-rule list \
  --resource-group maphosha-rg \
  --server maphosha-server
```

2. Verify connection string in Application Settings

### Deployment Failures

1. Check deployment logs:
```bash
az webapp deployment log show \
  --resource-group maphosha-rg \
  --name maphosha-app
```

2. Verify Node.js version:
```bash
az webapp config show \
  --resource-group maphosha-rg \
  --name maphosha-app
```

### Database Issues

1. Connect to database:
```bash
# Using Azure Data Studio
# Server: maphosha-server.database.windows.net
# Database: maphosha_db
# User: admin
# Password: YourPassword123!
```

2. Run migration script:
```bash
npm run migrate --workspace=backend
```

## Backup and Recovery

### Backup Database

```bash
az sql db copy \
  --resource-group maphosha-rg \
  --server maphosha-server \
  --name maphosha_db \
  --dest-name maphosha_db_backup
```

### Restore Database

```bash
az sql db restore \
  --resource-group maphosha-rg \
  --name maphosha_db \
  --server maphosha-server \
  --time "2024-01-15T10:00:00"
```

## Cost Optimization

1. **Use B1 tier** for development/testing
2. **Enable auto-shutdown** for non-production environments
3. **Use reserved instances** for production
4. **Monitor and optimize** database queries

## Security Best Practices

1. ✅ Enable HTTPS only
2. ✅ Use managed identities for authentication
3. ✅ Enable Azure Defender for SQL
4. ✅ Implement network security groups
5. ✅ Regularly update dependencies
6. ✅ Use Azure Key Vault for secrets

## Support

For issues or questions, refer to:
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure SQL Database Documentation](https://docs.microsoft.com/en-us/azure/azure-sql/)
- [GitHub Issues](https://github.com/NtuliMpendulo/MaphoshaLogistics/issues)
