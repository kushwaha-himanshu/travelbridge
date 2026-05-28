from pathlib import Path

import whisper

from deep_translator import GoogleTranslator

from gtts import gTTS


BASE_DIR = Path(__file__).resolve().parent
INPUT_AUDIO = BASE_DIR / "himanshu.mp3"
OUTPUT_AUDIO = BASE_DIR / "translated.mp3"

# Load Whisper model
model = whisper.load_model("base")

# Speech → Text
result = model.transcribe(
    str(INPUT_AUDIO)
)

english_text = result["text"]

print("\nEnglish:")
print(english_text)

# Translate
translated_text = GoogleTranslator(
    source='auto',
    target='hi'
).translate(english_text)

print("\nHindi:")
print(translated_text)

# Text → Speech
tts = gTTS(
    text=translated_text,
    lang='hi'
)

# Save audio
tts.save(str(OUTPUT_AUDIO))

print(f"\nTranslated voice saved as {OUTPUT_AUDIO}")



#by using groq API


# from groq import Groq

# client = Groq(
#     api_key="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"
# )

# audio_file = open(
#     "himanshu.mp3",
#     "rb"
# )

# transcription = client.audio.transcriptions.create(

#     file=audio_file,

#     model="whisper-large-v3",

#     response_format="verbose_json"
# )

# print(
#     transcription.text
# )
# from deep_translator import GoogleTranslator

# translated = GoogleTranslator(
#     source='auto',
#     target='hi'
# ).translate(transcription.text)

# print(translated)
# from gtts import gTTS

# tts = gTTS(
#     text=translated,
#     lang='hi'
# )

# tts.save("translated.mp3")