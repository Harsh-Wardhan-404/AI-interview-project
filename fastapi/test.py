import os
from groq import Groq

# Initialize the Groq client
client = Groq(api_key="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")

# Specify the path to the audio file
filename = "sample2.flac" # Replace with your audio file!

# Open the audio file
with open(filename, "rb") as file:
    # Create a translation of the audio file
    translation = client.audio.translations.create(
      file=(filename, file.read()), # Required audio file
      model="whisper-large-v3", # Required model to use for translation
      prompt="no word correction ",  # Optional
      response_format="json",  # Optional
      temperature=0.0  # Optional
    )
    # Print the translation text
    print(translation.text)