# AI Interview Assessment FastAPI Backend

## Vercel Deployment Guide

### Prerequisites
- Python 3.9+
- Vercel account
- MongoDB database
- OpenAI API key
- FFmpeg installed on Vercel (included in requirements.txt)

### Environment Variables

Set these environment variables in your Vercel project settings:

```env
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

### Project Structure

```
fastapi/
├── vercel.json          # Vercel configuration
├── vercel_app.py        # Entry point for Vercel
├── requirements.txt     # Python dependencies
├── main.py             # Main FastAPI application
├── audioProcessor.py    # Audio processing logic
├── config/             # Configuration files
├── feedback/           # Feedback processing modules
├── models/             # Data models
├── routers/            # API routes
└── temp_audio/         # Temporary storage for audio files
```

### Deployment Steps

1. Push your code to GitHub
2. In Vercel dashboard:
   - Import the repository
   - Set the root directory to 'fastapi'
   - Framework preset: Other
   - Build command: None
   - Output directory: None
   - Install command: `pip install -r requirements.txt`

3. Configure environment variables in Vercel:
   - Go to Project Settings > Environment Variables
   - Add all required environment variables

### Video Processing Configuration

The application handles video uploads with the following specifications:
- Accepts WebM video format from frontend
- Converts to MP4 using FFmpeg
- Maximum file size: 50MB
- Temporary storage in /tmp directory
- Automatic cleanup after processing

### API Endpoints

- `POST /process-audio`: Process video recordings
  - Accepts: multipart/form-data
  - Returns: Transcription and analysis

- `POST /analyze-text`: Analyze transcribed text
  - Accepts: JSON
  - Returns: Grammar and pronunciation feedback

- `POST /generate-questions`: Generate assessment questions
  - Accepts: JSON
  - Returns: List of questions

- `POST /get-ideal-answer`: Get ideal answers
  - Accepts: JSON
  - Returns: Model answers and analysis

### FFmpeg Configuration

FFmpeg is configured to:
- Convert WebM to MP4
- Extract audio for processing
- Handle video compression
- Maintain quality while reducing file size

### Troubleshooting

1. **Video Processing Issues**
   - Check FFmpeg installation
   - Verify temp directory permissions
   - Monitor memory usage

2. **API Connection Issues**
   - Verify environment variables
   - Check CORS configuration
   - Validate request formats

3. **Memory Issues**
   - Monitor /tmp directory usage
   - Check file cleanup
   - Verify Vercel function limits

### Development vs Production

Development:
- Uses local .env file
- Local FFmpeg installation
- Local file storage

Production (Vercel):
- Uses Vercel environment variables
- Serverless FFmpeg
- Temporary file storage in /tmp

### Monitoring

Monitor your deployment using:
1. Vercel deployment logs
2. Application logs
3. MongoDB logs
4. API endpoint monitoring

### Security Notes

- Keep environment variables secure
- Monitor API usage
- Regular security audits
- Validate file uploads
- Clean temporary files

### Support

For issues:
1. Check Vercel function logs
2. Monitor API responses
3. Verify environment variables
4. Check file processing status

### Performance Optimization

- Video processing is optimized for serverless
- Efficient file cleanup
- Minimal temporary storage usage
- Optimized FFmpeg settings