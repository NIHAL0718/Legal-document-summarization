from transformers import pipeline
import spacy

# Load spaCy model (it must be installed in Docker build)
nlp = spacy.load("en_core_web_sm")

# Initialize summarization pipeline with a reliable model
abstractive_model = pipeline(
    "summarization",
    model="facebook/bart-large-cnn",
    tokenizer="facebook/bart-large-cnn",
    framework="pt"
)

def sentence_tokenize(text):
    """Use SpaCy for sentence tokenization."""
    doc = nlp(text)
    return [sent.text for sent in doc.sents]

def split_text_into_chunks(text, max_chunk_size=1024):
    """
    Splits text into chunks close to max_chunk_size without breaking sentences.
    """
    sentences = sentence_tokenize(text)
    chunks = []
    current_chunk = []

    current_length = 0
    for sentence in sentences:
        sent_len = len(sentence)
        if current_length + sent_len <= max_chunk_size:
            current_chunk.append(sentence)
            current_length += sent_len
        else:
            # Finalize current chunk and start a new one
            chunks.append(' '.join(current_chunk))
            current_chunk = [sentence]
            current_length = sent_len
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    return chunks

def remove_duplicates(text):
    """Remove duplicate sentences from text."""
    seen = set()
    result = []
    for sentence in sentence_tokenize(text):
        s = sentence.strip()
        if s and s not in seen:
            seen.add(s)
            result.append(s)
    return ' '.join(result)

def format_summary_paragraph_with_points(text):
    """
    Format the summary to include a mix of paragraphs and main points.
    """
    sentences = sentence_tokenize(text)
    paragraph = []
    points = []

    for i, sentence in enumerate(sentences):
        if i % 5 == 0 and i > 0:  # Add a point after every 5 sentences
            points.append(f"- {sentence.strip()}")
        else:
            paragraph.append(sentence.strip())

    formatted_paragraph = ' '.join(paragraph)
    formatted_points = '\n'.join(points)
    return f"{formatted_paragraph}\n\nKey Points:\n{formatted_points}"

def summarize_text_abstractive(text, verbose=True):
    """
    Perform abstractive summarization on intelligently split chunks.
    Returns raw and formatted summaries.
    """
    chunks = split_text_into_chunks(text, max_chunk_size=1024)

    chunk_summaries = []
    for idx, chunk in enumerate(chunks):
        if verbose:
            print(f"Processing chunk {idx+1}/{len(chunks)}...")
        try:
            summary = abstractive_model(
                chunk,
                max_length=150,   # Slightly longer max length for completeness
                min_length=50,
                do_sample=False
            )
            summary_text = summary[0]["summary_text"]
            chunk_summaries.append(summary_text)
        except Exception as e:
            if verbose:
                print(f"Error processing chunk {idx+1}: {e}")

    raw_summary = ' '.join(chunk_summaries).strip()
    raw_summary = remove_duplicates(raw_summary)
    formatted_summary = format_summary_paragraph_with_points(raw_summary)

    return raw_summary, formatted_summary

def summarize_text_extractive(text):
    """
    Simple extractive summarization: returns the first 5 sentences.
    """
    sentences = sentence_tokenize(text)
    summary = ' '.join(sentences[:5])
    return summary.strip()
