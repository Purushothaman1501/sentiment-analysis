# Sentiment Analysis App

A full-stack web application designed to perform sentiment analysis using Deep Learning. It provides user authentication, RESTful APIs, and a modern frontend.

## 🚀 Features
- **Sentiment Analysis Engine**: Uses an LSTM-based deep learning model to predict the sentiment of textual data.
- **RESTful APIs**: Powered by Django REST Framework (DRF) to handle sentiment predictions and frontend communication.
- **User Authentication**: Secure registration and login functionalities leveraging JWT (JSON Web Tokens).
- **Modern User Interface**: A fast, responsive frontend application built with Vite.
- **Containerized**: Fully containerized backend and frontend environments using Docker and Docker Compose for a seamless setup.

## 🛠️ Tech Stack
- **Backend**: Python, Django, DRF, JWT Auth
- **AI/ML**: Keras, TensorFlow (LSTM Model), pandas, scikit-learn
- **Frontend**: Vite
- **Deployment**: Docker, Docker Compose, Nginx

## 📂 Project Structure
- `/senti_ana`: Django application and core backend setup.
- `/sentianalyzer-main`: Vite frontend code and assets.
- `docker-compose.yml`: Container orchestration setup.

## ⚙️ How to Run

### Prerequisites
Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Setup using Docker

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd sentiment-analysis
   ```

2. **Start the containers:**
   Run the following command to build and start the containers.
   ```bash
   docker-compose up --build
   ```

3. **Access the Application:**
   - Frontend will typically be accessible via port configured in your local setup (e.g., `http://localhost`).
   - The backend API and Django Admin will be accessible at `http://localhost:8000/api/` or according to your server configuration.

## 📜 Usage
1. First, register an account or log in via the web interface. 
2. Enter your text in the input box to analyze the sentiment.
3. View the prediction output in real time.

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.