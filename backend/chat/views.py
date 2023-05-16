from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.staticfiles import finders
from django.http import FileResponse
from django.conf import settings
from django.templatetags.static import static
from django.views.decorators.csrf import csrf_exempt

import json
import os

from langchain.chat_models import ChatOpenAI
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain.llms import OpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.document_loaders import CSVLoader
from langchain.document_loaders import PyPDFLoader
from langchain.document_loaders import Docx2txtLoader
from langchain.memory import ConversationBufferMemory
from langchain.chains.llm import LLMChain
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.chains.conversational_retrieval.prompts import CONDENSE_QUESTION_PROMPT, QA_PROMPT
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts.prompt import PromptTemplate
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage
)
from langchain.callbacks.base import BaseCallbackManager
from .consumers import MyCustomHandler


pdf_path = os.path.join(
    settings.BASE_DIR, 'chat/static/chat/trainingSuperComp.pdf')
if pdf_path is None:
    raise Exception("PDF file not found")
csv_path = os.path.join(
    settings.BASE_DIR, 'chat/static/chat/trainingSchoolCodes.csv')
if csv_path is None:
    raise Exception("CSV file not found")
docx_path = os.path.join(
    settings.BASE_DIR, 'chat/static/chat/DriverUserGuide.docx')
if docx_path is None:
    raise Exception("Docx file not found")
loader = PyPDFLoader(pdf_path)
loaderCSV = CSVLoader(csv_path)
loaderDocx = Docx2txtLoader(docx_path)
documents = loader.load()

loaders = [loader, loaderCSV, loaderDocx]
docs = []
for loader in loaders:
    docs.extend(loader.load())

text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
documents = text_splitter.split_documents(docs)

embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(documents, embeddings)

chat_history = []

llm = OpenAI(temperature=0, model_name="gpt-4")

streaming_llm = ChatOpenAI(streaming=True, callback_manager=BaseCallbackManager(
    [MyCustomHandler()]), temperature=0, model_name="gpt-4")

QAtemplate = """You are a support assistant named Clippy for RollCall Safety Solutions, a School Bus Management System.
You have been asked a question by a user the user. You have the documentation for RollCall.

Please follow these guidelines for providing support:

If there is no question simply introduce yourself and ask the user how you can help.
Always maintain your role as Clippy, the support worker for RollCall.
Keep the discussion focused on RollCall topics and directing the user.
The users are not tech savvy so keep your answers simple and easy to understand.
If you don't know the answer to a question, direct users to contact support by replying with [BOT_SWITCH: Human]
Always use the documentation to answer questions where possible. If you cant give an accurate answer, dont make one up.
Never use [BOT_SWITCH: Human] if you know the answer, just reply with you can contact support by asking me to connect you to an agent.
If a user asks you to connect them to support or speak to support,you must reply with [BOT_SWITCH: Human]
If you are asked a question that is not related to RollCall, politely respond that you are tuned to only answer questions that are related to RollCall.
The user is already logged in to RollCall.
Do not ask users for any personal information.
If the user asks you a question with multiple possible answers please respond by asking the user to clarify their question.
The image URL is a link to an image that is relevant to the question.
If passing an image URL to the user, you must format it like so: Here is a screenshot that may help you: imageURL
Remember the user can't see the documentation so there is no reason to reference its sections.
Context: {context}
Question: {question}
Helpful answer, short as possible formatted step by step if warranted, add notes if warranted, include a single image URL if one is given in exact document you have referenced.:
"""

CondenseTemplate = """You are a summary bot, your job is to condense the conversation into a single question.
      What you are doing is summarizing a conversation and potentially generating a question from it.
      It is crucial that you appear as a RollCall user, not a bot. 
      If the user is asking for an agent, or a human or any kind of support person that isnt you. Then you need to respond with: I need to speak to a human [Bot_Switch].

      Given the following conversation and the most recent question, rephrase the follow up question to be a standalone question.
      Chat History: {chat_history}
      Follow Up Input: {question}
      Standalone question:"""


QA_PROMPT_CUSTOM = PromptTemplate(
    input_variables=["context", "question"], template=QAtemplate
)

CONDENSE_QUESTION_PROMPT_CUSTOM = PromptTemplate(
    input_variables=["chat_history", "question"], template=CondenseTemplate
)

question_generator = LLMChain(llm=llm, prompt=CONDENSE_QUESTION_PROMPT_CUSTOM)
doc_chain = load_qa_chain(
    streaming_llm, chain_type="stuff", prompt=QA_PROMPT_CUSTOM)

qa = ConversationalRetrievalChain(
    retriever=vectorstore.as_retriever(), combine_docs_chain=doc_chain, question_generator=question_generator)

# query = "How do I add a parent in RollCall?"
# result = qa({"question": query, "chat_history": chat_history})


@csrf_exempt
def home(request):
    if request.method == 'POST':

        data = json.loads(request.body)
        message = data.get('message')
        role = data.get('role')
        print(message)
        if message == "":
            chat_history.clear()
            chat_history.append(HumanMessage(
                content="Hi, its great to meet you."))
            chat_history.append(AIMessage(
                content="Hello! My name is Clippy and I am a support assistant for RollCall Safety Solutions. How can I assist you with RollCall today?"))
            return JsonResponse({"message": "Hello! My name is Clippy and I am a support assistant for RollCall Safety Solutions. How can I assist you with RollCall today?"})
        else:
            query = message
            result = qa({"question": query, "chat_history": chat_history})

            response = result["answer"]

            chat_history.append(HumanMessage(content=message))
            chat_history.append(AIMessage(content=response))

            print(chat_history)
            print(response)

            return HttpResponse(response)
    else:
        return HttpResponse('No POST request')
