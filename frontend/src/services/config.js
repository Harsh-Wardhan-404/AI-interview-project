const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  fastApiUrl: import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000',
  s3BucketUrl: import.meta.env.VITE_S3_BUCKET_URL || 'https://decentralized-fiverr-project.s3.eu-north-1.amazonaws.com'
};

export default config;