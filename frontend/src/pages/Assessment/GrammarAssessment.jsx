import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  ChevronRight,
  Volume2,
  Video,
  VideoOff,
  Clock,
  Target,
  BookOpen,
  Star,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WaveformVisualizer from "../../components/WaveformVisualizer";
import VideoPreview from "../../components/VideoPreview";

function GrammarAssessment() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [assessmentStage, setAssessmentStage] = useState("preview");
  const [transcribedText, setTranscribedText] = useState(""); // New state for transcribed text

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const videoRef = useRef(null);

  const MAX_RECORDING_TIME = 120; // 2 minutes

  const questions = [
    "Describe your typical daily routine.",
    "What did you do last weekend?",
    "What are your plans for the future?",
    "Tell me about your favorite hobby.",
  ];

  const questionIcons = [
    <Clock key="clock" className="text-brand-blue" size={24} />,
    <BookOpen key="book" className="text-brand-purple" size={24} />,
    <Target key="target" className="text-brand-orange" size={24} />,
    <Star key="star" className="text-brand-yellow" size={24} />,
  ];

  useEffect(() => {
    return () => {
      stopRecording();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const sendMediaToServer = async (mediaBlob) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate blob
      if (!mediaBlob || mediaBlob.size === 0) {
        throw new Error("No recording data available");
      }

      const formData = new FormData();
      formData.append(
        "file",
        mediaBlob,
        `question_${currentQuestionIndex}.webm`
      );
      formData.append("questionIndex", currentQuestionIndex);

      const response = await fetch("http://localhost:8000/process-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      
      // Set the transcribed text if successful
      if (data.status === "success" && data.text) {
        setTranscribedText(data.text);
      } else {
        setError(data.message || "Failed to transcribe audio");
      }

      return data;
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error.message || "Failed to upload recording. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    setError(null);
    setTranscribedText(""); // Clear previous transcription
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9,opus",
      });

      setMediaStream(stream);
      videoRef.current.srcObject = stream;
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        // Stop video stream tracks
        stream.getTracks().forEach((track) => track.stop());

        // Create blob from recorded chunks
        const mediaBlob = new Blob(chunksRef.current, { type: "video/webm" });

        try {
          await sendMediaToServer(mediaBlob);
          setAssessmentStage("review");
        } catch (error) {
          console.error("Failed to process recording:", error);
          setAssessmentStage("preview");
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAssessmentStage("recording");
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      setError(
        "Error accessing media devices. Please check your camera and microphone permissions."
      );
      console.error("Error accessing media devices:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();

      // Ensure we stop all tracks
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }

      setIsRecording(false);

      // Clear video source
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAssessmentStage("preview");
      setError(null);
      setRecordingDuration(0);
      setTranscribedText(""); // Clear transcription when moving to next question
    }
  };

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setAssessmentStage("preview");
    setError(null);
    setRecordingDuration(0);
    setTranscribedText(""); // Clear transcription when resetting
    stopRecording();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gradient-to-br from-gray-50 to-gray-100 p-6"
    >
      <div className="h-full flex gap-6">
        {/* Left Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="w-[50%] flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-lg font-bold text-brand-purple flex items-center gap-2"
              >
                <CheckCircle className="text-brand-blue" size={20} />
                Grammar Assessment
              </motion.span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="px-3 py-1 bg-brand-purple/10 rounded-full text-xs font-medium text-brand-purple"
              >
                {currentQuestionIndex + 1}/{questions.length}
              </motion.span>
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-brand-blue/10 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              {questionIcons[currentQuestionIndex]}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 pr-10">
              {questions[currentQuestionIndex]}
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <Volume2 className="text-brand-orange" size={18} />
              Speak clearly into your microphone
            </p>
          </motion.div>

          {/* Recording Interface */}
          <div className="relative">
            <AnimatePresence>
              {!isRecording ? (
                <motion.button
                  key="start-recording"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startRecording}
                  className="w-full h-16 flex items-center justify-center gap-3 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Video size={20} />
                  Start Recording
                </motion.button>
              ) : (
                <motion.div
                  key="recording-wave"
                  initial={{ height: 64, opacity: 0.8 }}
                  animate={{ height: 128, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden relative"
                >
                  <WaveformVisualizer
                    isRecording={isRecording}
                    stream={mediaStream}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {isRecording && (
              <div className="absolute top-4 left-4 text-sm font-medium text-brand-purple">
                {formatTime(recordingDuration)} /{" "}
                {formatTime(MAX_RECORDING_TIME)}
              </div>
            )}

            {isRecording && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopRecording}
                className="absolute -top-3 -right-3 bg-brand-red text-white px-4 py-3 rounded-full shadow-lg hover:bg-brand-red/90 transition-colors flex items-center gap-2 font-medium border-2 border-white"
              >
                <VideoOff size={20} />
                <span>Stop Recording</span>
              </motion.button>
            )}
          </div>

          {/* Transcribed Text Display */}
          {transcribedText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-white rounded-xl shadow-md border border-brand-blue/10"
            >
              <h3 className="text-sm font-medium text-gray-500 mb-2">Transcribed Speech:</h3>
              <p className="text-gray-800">{transcribedText}</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-auto flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetAssessment}
              className="w-1/3 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl flex items-center justify-center font-medium shadow-md hover:shadow-lg transition-all"
            >
              Restart
              <XCircle className="ml-2" size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="w-2/3 bg-gradient-to-r from-brand-yellow to-brand-orange text-white py-3 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg transition-all"
            >
              Next Question
              <ChevronRight className="ml-2" size={18} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Section - Video Preview */}
        <VideoPreview videoRef={videoRef} isRecording={isRecording} />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <Loader className="animate-spin" />
            <span>Processing recording...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default GrammarAssessment;