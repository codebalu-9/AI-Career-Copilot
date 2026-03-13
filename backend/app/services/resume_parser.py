import io
from typing import Optional
import PyPDF2


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text content from a PDF file."""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")


def clean_text(text: str) -> str:
    """Clean extracted text for NLP processing."""
    import re
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep alphanumeric, spaces, and common punctuation
    text = re.sub(r'[^\w\s\.\,\-\+\#]', ' ', text)
    return text.strip()


def extract_sections(text: str) -> dict:
    """Attempt to extract common resume sections."""
    import re
    sections = {
        "skills": "",
        "experience": "",
        "education": "",
        "projects": "",
        "full_text": text,
    }

    section_patterns = {
        "skills": r'(?i)(skills|technical skills|core competencies|technologies)(.*?)(?=\n[A-Z][A-Z\s]+\n|$)',
        "experience": r'(?i)(experience|work experience|employment)(.*?)(?=\n[A-Z][A-Z\s]+\n|$)',
        "education": r'(?i)(education|academic background)(.*?)(?=\n[A-Z][A-Z\s]+\n|$)',
        "projects": r'(?i)(projects|personal projects|academic projects)(.*?)(?=\n[A-Z][A-Z\s]+\n|$)',
    }

    for section, pattern in section_patterns.items():
        match = re.search(pattern, text, re.DOTALL)
        if match:
            sections[section] = match.group(2).strip()

    return sections
