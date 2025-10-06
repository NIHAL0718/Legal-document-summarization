import google.generativeai as genai

API_KEY = "AIzaSyDzYR2oMAaeJ3a4lnNviywhIi5fi1B_qh4"
genai.configure(api_key=API_KEY)

def ask_google_bot(extracted_text, summary, question):
    prompt = f"""
You are a helpful legal assistant chatbot for a legal document summarization website.

You have access to the following legal document information, which you can use to answer questions related to it:

Extracted Text:
{extracted_text}

Summary:
{summary}

You should answer any question the user asks, including:
- Questions about the legal document,
- General questions (e.g., about dates, time),
- Website usage (e.g., how to register, login, summarize),
- Or any other topic.

Examples:
Q: How do I register on this website?
A: To register, click on the Register button, fill the form with your details, and submit.

Q: What is today's date?
A: Today's date is May 30, 2025.

Q: How to summarize a document?
A: Upload your legal document and click Summarize to get a concise summary.

User's Question:
{question}
"""

    try:
        model_name = "models/gemini-2.0-flash"
        response = genai.GenerativeModel(model_name).generate_content(prompt)
        return response.text
    except Exception as e:
        print("Error:", e)
        return "Sorry, couldn't get a response from the chatbot."
