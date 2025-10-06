def preprocess_text(text: str) -> str:
    """
    Preprocess text to ensure it doesn't exceed the summarizer's token limit.
    """
    max_chars = 1000  # Adjust as needed based on the model's capability
    return text[:max_chars]
