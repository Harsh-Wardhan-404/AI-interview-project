import { api, fastApi, uploadToS3, processMedia, analyzeText } from './api';

/**
 * Handles the complete media processing pipeline:
 * 1. Uploads video to S3
 * 2. Processes the audio for transcription
 * 3. Analyzes the transcribed text
 */
export const sendMediaToServer = async (mediaBlob, questionIndex) => {
  if (!mediaBlob || mediaBlob.size === 0) {
    throw new Error("No recording data available");
  }

  try {
    // First upload to S3
    const s3Response = await uploadToS3(mediaBlob, questionIndex);
    console.log("Video uploaded to S3:", s3Response.url);

    // Then process the audio
    const processResponse = await processMedia(mediaBlob, questionIndex);

    if (processResponse.status === "success" && processResponse.text) {
      // Get feedback analysis
      const feedbackData = await analyzeText(processResponse.text);

      return {
        transcribedText: processResponse.text,
        feedback: feedbackData,
        videoUrl: s3Response.url
      };
    } else {
      throw new Error(processResponse.message || "Failed to transcribe audio");
    }
  } catch (error) {
    console.error("Media processing error:", error);
    throw new Error(error.message || "Failed to process recording");
  }
};

/**
 * Gets feedback analysis for transcribed text
 */
export const getFeedbackAnalysis = async (text) => {
  try {
    return await analyzeText(text);
  } catch (error) {
    console.error("Feedback analysis error:", error);
    throw new Error("Failed to get feedback analysis");
  }
};

/**
 * Uploads a video file directly to S3
 */
export const uploadVideo = async (file, questionIndex) => {
  try {
    const response = await uploadToS3(file, questionIndex);
    return response;
  } catch (error) {
    console.error("Video upload error:", error);
    throw new Error("Failed to upload video");
  }
};

/**
 * Processes audio for transcription
 */
export const processAudio = async (file, questionIndex) => {
  try {
    const response = await processMedia(file, questionIndex);
    return response;
  } catch (error) {
    console.error("Audio processing error:", error);
    throw new Error("Failed to process audio");
  }
};

export default {
  sendMediaToServer,
  getFeedbackAnalysis,
  uploadVideo,
  processAudio
};