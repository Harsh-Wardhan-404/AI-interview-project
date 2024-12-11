import os
import json
from groq import Groq
from typing import Dict, List, Optional
from dotenv import load_dotenv

# # Load environment variables
load_dotenv()
from .vocab_check import analyze_vocabulary

class FeedbackProcessor:
    def __init__(self):
        self.client = Groq(
            # api_key="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",
            api_key=os.getenv("Grok_API_KEY"),
        )

        self.grammar_prompt = """You are a grammar expert. Analyze the given text for grammatical errors, focusing ONLY on:
        - Incorrect verb tenses (e.g., "I goes" instead of "I go")
        - Subject-verb agreement errors
        - Incorrect use of pronouns
        - Incorrect word usage or word choice
        - Run-on sentences or sentence fragments
        - Incorrect preposition usage
        - Spelling errors
        
        DO NOT flag or count:
        - Don't count the capitalization errors as grammar errors
        - Capitalization issues (e.g., 'i' vs 'I')(remember these are not grammar errors)
        - Missing periods at the end of sentences
        - Stylistic choices
        
        Format your response as a JSON object with two fields:
        {
            "error_count": number,
            "errors": [
                {
                    "word": "incorrect_phrase_or_word",
                    "suggestion": "correct_phrase_or_word",
                    "explanation": "brief explanation of the error"
                }
            ]
        }
        
        Return ONLY the JSON object, no additional text."""

        self.pronunciation_prompt = """You are a pronunciation expert. Analyze the given text for potential pronunciation challenges and mistakes, focusing on:
        - Common pronunciation difficulties for non-native speakers
        - Words with silent letters
        - Complex phonetic combinations
        - Stress patterns in multi-syllable words
        - Commonly mispronounced words
        - Sound pairs that are often confused (e.g., "th" vs "d")
        
        Format your response as a JSON object with two fields:
        {
            "error_count": number,
            "errors": [
                {
                    "word": "challenging_word",
                    "phonetic": "phonetic_representation",
                    "explanation": "brief explanation of the pronunciation challenge"
                }
            ]
        }
        
        Return ONLY the JSON object, no additional text."""

    async def analyze_grammar(self, text: str) -> Dict:
        """
        Analyze text for grammar mistakes using Groq LLM.
        """
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": self.grammar_prompt,
                    },
                    {
                        "role": "user",
                        "content": f"Analyze this text: {text}",
                    }
                ],
                model="llama3-8b-8192",
            )
            
            analysis = response.choices[0].message.content
            return self._parse_grammar_response(analysis)
        except Exception as e:
            print(f"Error in analyze_grammar: {str(e)}")
            return {
                "error_count": 0,
                "errors": []
            }

    async def analyze_pronunciation(self, text: str) -> Dict:
        """
        Analyze text for pronunciation challenges using Groq LLM.
        """
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": self.pronunciation_prompt,
                    },
                    {
                        "role": "user",
                        "content": f"Analyze this text: {text}",
                    }
                ],
                model="llama3-8b-8192",
            )
            
            analysis = response.choices[0].message.content
            return self._parse_pronunciation_response(analysis)
        except Exception as e:
            print(f"Error in analyze_pronunciation: {str(e)}")
            return {
                "error_count": 0,
                "errors": []
            }

    def _parse_grammar_response(self, response: str) -> Dict:
        """
        Parse the LLM response for grammar analysis.
        """
        try:
            # Parse the JSON response
            data = json.loads(response)
            return {
                "error_count": data.get("error_count", 0),
                "errors": data.get("errors", [])
            }
        except Exception as e:
            print(f"Error parsing grammar response: {str(e)}")
            return {
                "error_count": 0,
                "errors": []
            }

    def _parse_pronunciation_response(self, response: str) -> Dict:
        """
        Parse the LLM response for pronunciation analysis.
        """
        try:
            # Parse the JSON response
            data = json.loads(response)
            return {
                "error_count": data.get("error_count", 0),
                "errors": data.get("errors", [])
            }
        except Exception as e:
            print(f"Error parsing pronunciation response: {str(e)}")
            return {
                "error_count": 0,
                "errors": []
            }

    async def analyze_text(self, text: str) -> Dict:
        """
        Analyze text for grammar, pronunciation, and vocabulary.
        """
        grammar_analysis = await self.analyze_grammar(text)
        pronunciation_analysis = await self.analyze_pronunciation(text)
        vocabulary_analysis = analyze_vocabulary(text)

        return {
            "grammar": grammar_analysis,
            "pronunciation": pronunciation_analysis,
            "vocabulary": vocabulary_analysis,
            "text": text
        }