# AI Interview Assessment Frontend

## Deployment Guide

### Prerequisites
- Node.js 18+ installed
- Vercel account
- AWS S3 bucket configured
- Backend API deployed
- FastAPI server deployed

### Environment Variables

Set the following environment variables in your Vercel project settings:

```env
VITE_BACKEND_URL=https://your-backend-url.com
VITE_FASTAPI_URL=https://your-fastapi-url.com
VITE_S3_BUCKET_URL=https://decentralized-fiverr-project.s3.eu-north-1.amazonaws.com

# Firebase Config (if using Firebase)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Deployment Steps

1. Install Vercel CLI (optional):
```bash
npm install -g vercel
```

2. Login to Vercel (if using CLI):
```bash
vercel login
```

3. Deploy using one of these methods:

#### Method 1: Vercel CLI
```bash
# From the frontend directory
vercel
```

#### Method 2: GitHub Integration
1. Push your code to GitHub
2. Import your repository in Vercel dashboard
3. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Configuration Files

The project includes several configuration files for deployment:

- `vercel.json`: Vercel-specific configuration
  - Handles routing
  - Sets up build commands
  - Configures headers and environment

- `vite.config.ts`: Vite build configuration
  - Optimizes build output
  - Configures development server
  - Sets up environment variables

### CORS Configuration

The backend needs to allow requests from your Vercel deployment URL. Add your Vercel domain to the CORS configuration in your backend server.

### Post-Deployment Checks

After deploying, verify:

1. Environment variables are correctly set
2. API endpoints are accessible
3. Video upload functionality works
4. Authentication flow is working
5. All routes are accessible

### Troubleshooting

Common issues and solutions:

1. **API Connection Issues**
   - Verify environment variables
   - Check CORS configuration
   - Ensure backend is running

2. **Build Failures**
   - Check build logs in Vercel dashboard
   - Verify dependencies are installed
   - Check for environment variable issues

3. **Video Upload Issues**
   - Verify S3 bucket permissions
   - Check file size limits
   - Verify backend upload endpoint

### Development vs Production

The application uses different environment variables for development and production:

- Development: Uses local `.env` file
- Production: Uses Vercel environment variables

### Monitoring

Monitor your deployment using:

1. Vercel Analytics
2. Browser Developer Tools
3. Backend server logs

### Support

For issues:
1. Check Vercel deployment logs
2. Review browser console errors
3. Verify API endpoint responses
4. Check S3 bucket permissions