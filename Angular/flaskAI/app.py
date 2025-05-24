from flask import Flask, request, jsonify
from textblob import TextBlob
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # <-- This enables CORS for all routes

@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
    text = data.get('content', '')


    if not text:
        return jsonify({'error': 'No text provided'}), 400

    blob = TextBlob(text)
    sentiment = blob.sentiment

    return jsonify({
        'polarity': sentiment.polarity,
        'subjectivity': sentiment.subjectivity,
        'sentiment': 'positive' if sentiment.polarity > 0 else 'negative' if sentiment.polarity < 0 else 'neutral'
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
