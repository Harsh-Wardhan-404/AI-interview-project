
export const uploadVideo = async (videoUrl, index) => {
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error(`Failed to fetch video ${index + 1}`);
    
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("file", blob, `question_${index}.webm`);
    formData.append("questionIndex", index.toString());
  
    const uploadResponse = await fetch(`http://localhost:5000/upload`, {
      method: "POST",
      body: formData,
    });
  
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.error || `Failed to upload video ${index + 1}`);
    }
  
    return await uploadResponse.json();
  };