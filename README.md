# 🎉 RollCall-GPT 🤖

RollCall-GPT is a web-based chat application 🗨️ utilizing a React frontend and Django backend. The system uses advanced machine learning models 🧠 to provide comprehensive conversational capabilities.

## 💻 Installation

This project is composed of two main parts: the React frontend and the Django backend.

### 🏗️ Backend Setup

The backend is a Django project that uses several language processing libraries 📚 to facilitate the chat functionality.

1. Navigate to the Django project directory.

2. If you don't have pipenv installed, install it by running:

```bash
pip install pipenv

3. Create a pipenv environment and install dependencies:
pipenv install

4. Set up your OpenAI API key and Django settings:
export OPENAI_API_KEY="Your-OpenAI-Key-Goes-Here"
export DJANGO_SETTINGS_MODULE=rollcall_gpt_django.settings

5.Run the Django server:
daphne rollcall_gpt_django.asgi:application

The server will start, typically on http://localhost:8000.

Note: Make sure to set up your database correctly and run migrations with python manage.py migrate.

#### 🖼️ Frontend Setup

The frontend is a React application. To get it running, follow these steps:

1. Navigate to the React project directory.
2. Install all the necessary packages:

npm install

3. To start the development server:

npm start

The React application will start, typically on http://localhost:3000.

🚀 Usage
Open your browser and go to http://localhost:3000 to access the chat application 🎯. You can type in your queries in the input box and press enter to submit. The response will be generated and displayed in the chat box.

The application uses a GPT-4 model for generating responses. The model is fine-tuned to answer questions related to "RollCall", a hypothetical safety solution. The application is capable of handling different types of files including PDF, CSV, and Docx for its responses.

🧪 Testing
You can run tests on the React application using the following command:
npm test

Please remember to replace `"Your-OpenAI-Key-Goes-Here"` with your actual OpenAI key.







