from flask import Flask, request, jsonify
from flask_cors import CORS
import openai 
from openai import OpenAI
from dotenv import load_dotenv
import os
from utils.extract_text import extract_text_from_pdf

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    organization=os.getenv("OPENAI_ORGANIZATION"),
    project=os.getenv("OPENAI_PROJECT")
)

app = Flask(__name__)
CORS(app)

@app.route("/generate", methods=["POST"])#Flask route to post the necessary information to the backend (Resume and Job Desc)
def generate():
    resume_file = request.files["resume"]
    job_description = request.form["job_description"]

    resume_text = extract_text_from_pdf(resume_file)

    prompt = f"""
                You're an expert resume coach. Write a compelling, personalized 3-paragraph cover letter based on the resume and job description below.

                Resume:
                {resume_text}

                Job Description:
                {job_description}

                Cover Letter:
                """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Hello"}],
        temperature=0.7,#controls creativity  (0 = dry, 1 = very creative)
        max_tokens=500 # limits output length
    )

    letter = response.choices[0].message.content.strip()
    return jsonify({"cover_letter": letter})

if __name__ == "__main__":
    app.run(debug=True)