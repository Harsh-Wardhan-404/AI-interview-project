import os
from groq import Groq

def count_pauses(transcription_result, pause_threshold=2.0):
    """
    Count the number of pauses in a transcription where the time difference between words exceeds a threshold.

    Args:
        transcription_result (dict): The transcription result containing words and timestamps.
        pause_threshold (float): The duration in seconds to consider a pause.

    Returns:
        dict: A dictionary containing pause statistics and details
    """
    pauses = 0
    pause_details = []
    
    # Ensure the transcription contains word timings
    if "segments" not in transcription_result or not transcription_result["segments"]:
        return {
            "error": "The transcription result does not contain word timings.",
            "pause_count": 0,
            "pause_details": [],
            "fluency_score": 100  # Perfect score if no segments to analyze
        }

    # Extract segments with word timings
    segments = transcription_result["segments"]
    total_duration = 0
    total_pause_duration = 0

    for segment in segments:
        words = segment.get("words", [])
        for i in range(1, len(words)):
            prev_word = words[i - 1]
            current_word = words[i]
            
            # Calculate the pause duration
            pause_duration = current_word["start"] - prev_word["end"]
            total_duration += pause_duration

            if pause_duration > pause_threshold:
                pauses += 1
                total_pause_duration += pause_duration
                pause_details.append({
                    "word_before": prev_word["text"],
                    "word_after": current_word["text"],
                    "duration": round(pause_duration, 2)
                })

    # Calculate fluency score (100 - percentage of time spent in long pauses)
    if total_duration > 0:
        fluency_score = max(0, min(100, 100 - (total_pause_duration / total_duration * 100)))
    else:
        fluency_score = 100

    return {
        "pause_count": pauses,
        "pause_details": pause_details,
        "fluency_score": round(fluency_score, 1),
        "total_pause_duration": round(total_pause_duration, 2)
    }

def process_audio_fluency(audio_file_path):
    """
    Process an audio file and analyze its fluency.

    Args:
        audio_file_path (str): Path to the audio file

    Returns:
        dict: Fluency analysis results
    """
    try:
        client = Groq()
        
        # Open the audio file
        with open(audio_file_path, "rb") as file:
            # Create a transcription of the audio file
            transcription = client.audio.transcriptions.create(
                file=(audio_file_path, file.read()),
                model="whisper-large-v3",
                response_format="json",
                language="en",
                temperature=0.0
            )

            # Analyze pauses and fluency
            fluency_analysis = count_pauses(transcription, pause_threshold=1.0)
            
            return fluency_analysis
    except Exception as e:
        return {
            "error": str(e),
            "pause_count": 0,
            "pause_details": [],
            "fluency_score": 0
        }