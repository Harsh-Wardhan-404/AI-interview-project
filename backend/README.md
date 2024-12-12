# AI Interview Assessment Backend

## Vercel Deployment Guide

### Prerequisites
- Node.js 18+ installed
- Vercel account
- MongoDB database
- AWS S3 bucket configured
- AWS IAM user with S3 permissions

### Environment Variables

Set these environment variables in your Vercel project settings:

```env
MONGODB_URI=your_mongodb_connection_string
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### Setting Up Environment Variables in Vercel

1. Go to your project settings in Vercel dashboard
2. Navigate to the Environment Variables section
3. Add each variable with its corresponding value
4. Make sure to add variables to all environments (Production, Preview, Development)

### Deployment Steps

1. Push your code to GitHub
2. Import your repository in Vercel:
   - Select the repository
   - Configure project:
     - Framework Preset: Other
     - Build Command: `npm run build`
     - Output Directory: None (leave empty)
     - Install Command: `npm install`

3. Configure deployment settings:
   - Root Directory: `backend`
   - Node.js Version: 18.x

### MongoDB Setup

1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Add it to Vercel environment variables as `MONGODB_URI`
4. Ensure IP access is configured (allow all: 0.0.0.0/0)

### AWS S3 Configuration

1. Create an S3 bucket
2. Configure CORS in your S3 bucket:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```
3. Create IAM user with S3 access
4. Add AWS credentials to Vercel environment variables

### File Upload Configuration

The backend is configured to handle file uploads to S3 with:
- Maximum file size: 50MB
- Allowed file types: Video files
- Automatic file naming with timestamps

### API Routes

Main routes available:
- POST /upload - Video upload endpoint
- GET / - Health check endpoint

### Troubleshooting

Common issues and solutions:

1. **MongoDB Connection Issues**
   - Check connection string
   - Verify IP whitelist
   - Check MongoDB Atlas status

2. **S3 Upload Issues**
   - Verify AWS credentials
   - Check bucket permissions
   - Verify CORS configuration

3. **Build Failures**
   - Check build logs
   - Verify Node.js version
   - Check package dependencies

### Development vs Production

The application uses different configurations for development and production:

- Development: Uses local .env file
- Production: Uses Vercel environment variables

### Monitoring

Monitor your deployment using:

1. Vercel deployment logs
2. MongoDB Atlas monitoring
3. AWS CloudWatch logs

### Support

For issues:
1. Check Vercel deployment logs
2. Review MongoDB connection logs
3. Verify AWS S3 permissions
4. Check API endpoint responses

### Security Notes

- Keep your environment variables secure
- Regularly rotate AWS credentials
- Monitor S3 bucket access logs
- Use secure MongoDB connection string