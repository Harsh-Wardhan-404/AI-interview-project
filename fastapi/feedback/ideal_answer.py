import os
from groq import Groq
from typing import Dict, Optional
from fastapi import HTTPException

class IdealAnswerGenerator:
    def __init__(self):
        api_key = os.environ.get("Grok_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set")
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.2-3b-preview"

    async def generate_ideal_answer(self, question: str, user_answer: str) -> Dict:
        """
        Generate an ideal answer and comparison with user's answer using Groq API.
        
        Args:
            question (str): The original question
            user_answer (str): The user's answer to analyze
            
        Returns:
            Dict: Contains ideal answer and analysis of user's answer
        """
        try:
            prompt = f"""
            Question: {question}
            User's Answer: {user_answer}
            
            Please provide:
            1. An ideal answer to this question
            2. Analysis of what the user did well
            3. Areas where the user's answer could be improved
            4. Specific suggestions for improvement
            
            Format the response as a JSON with the following structure:
            {{
                "ideal_answer": "the ideal answer",
                "user_strengths": "what the user did well",
                "areas_for_improvement": "where the answer could be improved",
                "improvement_suggestions": "specific suggestions"
            }}
            """

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model=self.model,
            )

            response = chat_completion.choices[0].message.content
            
            # The response should already be in JSON format based on our prompt
            # But you might want to add error handling for parsing if needed
            return {
                "status": "success",
                "data": response
            }

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate ideal answer: {str(e)}"
            )

# Create a singleton instance
ideal_answer_generator = IdealAnswerGenerator()