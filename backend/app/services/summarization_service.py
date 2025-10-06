from transformers import pipeline
import torch

# Initialize the summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text: str, max_length: int = 130, min_length: int = 30) -> str:
    """
    Summarize the given text using BART model.
    
    Args:
        text (str): The text to summarize
        max_length (int): Maximum length of the summary
        min_length (int): Minimum length of the summary
        
    Returns:
        str: The summarized text
    """
    try:
        # Split text into chunks if it's too long (BART has a max input length)
        max_chunk_length = 1024
        chunks = [text[i:i + max_chunk_length] for i in range(0, len(text), max_chunk_length)]
        
        summaries = []
        for chunk in chunks:
            # Generate summary for each chunk
            summary = summarizer(chunk, 
                               max_length=max_length, 
                               min_length=min_length, 
                               do_sample=False)
            summaries.append(summary[0]['summary_text'])
        
        # Combine summaries
        final_summary = ' '.join(summaries)
        
        return final_summary
    except Exception as e:
        raise Exception(f"Summarization failed: {str(e)}") 