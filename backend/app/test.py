import google.generativeai as genai

API_KEY = "AIzaSyDdH9pHW4l83ptHwLDP41vic5IDT8xyfAc"
genai.configure(api_key=API_KEY)

def ask_google_bot(extracted_text, summary, question):
    prompt = f"""
You are a legal assistant. Answer based on this legal document info:

Extracted Text:
{extracted_text}

Summary:
{summary}

User's Question:
{question}
"""

    try:
        # Use the full model name exactly as in the list, for example:
        model_name = "models/gemini-2.0-flash"

        response = genai.GenerativeModel(model_name).generate_content(prompt)
        return response.text
    except Exception as e:
        print("Error:", e)
        return "Sorry, couldn't get a response from the chatbot."

if __name__ == "__main__":
    extracted_text = "This is a sample legal document text."
    summary = "This document covers contract obligations."
    question = "What are the main obligations stated in the contract?"

    answer = ask_google_bot(extracted_text, summary, question)
    print("Chatbot answer:\n", answer)
