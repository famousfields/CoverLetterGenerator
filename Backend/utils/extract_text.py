import fitz  # PyMuPDF

def extract_text_from_pdf(file_stream):
    text = ""
    with fitz.open(stream=file_stream.read(), filetype="pdf") as doc:#opens specified pdf from menory(no saving to disk)
        for page in doc:
            text += page.get_text()
    return text