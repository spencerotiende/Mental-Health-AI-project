import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# --- LangChain Imports ---
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.messages import HumanMessage, AIMessage
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_community.vectorstores import Chroma
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_text_splitters import RecursiveCharacterTextSplitter

# ---------------------------------------------------------------
# 1. Load Environment Variables
# ---------------------------------------------------------------
load_dotenv()
# .env should contain:
# OPENAI_API_KEY=...
# LANGCHAIN_API_KEY=...
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_PROJECT=mental-health-app

# ---------------------------------------------------------------
# 2. FastAPI App
# ---------------------------------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------
# 3. Load ML Model
# ---------------------------------------------------------------
try:
    artifact        = joblib.load("depression_model (1).pkl")
    model           = artifact["model"]
    feature_columns = artifact["feature_columns"]
    sleep_mapping   = artifact["sleep_mapping"]
except FileNotFoundError:
    print("CRITICAL WARNING: Model file not found. Prediction endpoint will fail.")

# ---------------------------------------------------------------
# 4. Build RAG Chain
#    Place your 3 PDFs inside a folder called /docs:
#      docs/nimh_depression.pdf
#      docs/cci_dealing_with_depression.pdf
#      docs/who_mhgap_depression.pdf
# ---------------------------------------------------------------
def build_rag_retriever():
    docs_path = "./docs"

    if not os.path.exists(docs_path) or not os.listdir(docs_path):
        print("WARNING: No PDFs found in ./docs — RAG will not have a knowledge base.")
        return None

    # Load all PDFs
    loader    = DirectoryLoader(docs_path, glob="**/*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()
    print(f"Loaded {len(documents)} pages from PDFs.")

    # Split into smaller chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=200,
        chunk_overlap=20
    )
    chunks = splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks.")

    embeddings = OpenAIEmbeddings()

    # Use Chroma — persists to disk, memory friendly, no rebuild on restart
    chroma_path = "./chroma_db"

    if os.path.exists(chroma_path) and os.listdir(chroma_path):
        print("Loading existing Chroma index from disk...")
        vectorstore = Chroma(
            persist_directory=chroma_path,
            embedding_function=embeddings
        )
    else:
        print("Building new Chroma index (this may take a minute)...")
        vectorstore = Chroma.from_documents(
            chunks,
            embeddings,
            persist_directory=chroma_path
        )

    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
    print("RAG retriever ready.")
    return retriever


def build_rag_chain(retriever):
    """Modern LangChain RAG chain using LCEL (replaces deprecated RetrievalQA)"""
    rag_prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are a mental health assistant. Use the following context from clinical documents "
         "to inform your answer. If the context does not cover the question, answer from your "
         "general knowledge but stay focused on mental health topics only.\n\n"
         "Clinical context:\n{context}"),
        ("human", "{question}")
    ])

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)

    rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | rag_prompt
        | llm
        | StrOutputParser()
    )

    return rag_chain


# Build on startup
retriever = build_rag_retriever()
rag_chain = build_rag_chain(retriever) if retriever else None

# ---------------------------------------------------------------
# 5. Build Conversational Chain with Memory
# ---------------------------------------------------------------
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

system_prompt = (
    "You are a dedicated Mental Health Assistant with access to clinical mental health resources. "
    "You ONLY discuss mental health, emotional well-being, psychology, and wellness strategies. "
    "If a user asks about anything unrelated (e.g., cooking, coding, sports), politely decline "
    "and redirect them to mental health topics. "
    "Always be empathetic, non-judgmental, and supportive in your responses."
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

conversation_chain = prompt | llm | StrOutputParser()

# In-memory session store
session_store: dict = {}

def get_session_history(session_id: str) -> ChatMessageHistory:
    if session_id not in session_store:
        session_store[session_id] = ChatMessageHistory()
    return session_store[session_id]

chain_with_memory = RunnableWithMessageHistory(
    conversation_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history"
)

# ---------------------------------------------------------------
# 6. ML Prediction Endpoint
# ---------------------------------------------------------------
class AssessmentInput(BaseModel):
    age: int
    gender: str
    city: str
    occupation_status: str
    profession: str
    degree: str
    academic_pressure: float
    work_pressure: float
    cgpa: float
    study_satisfaction: float
    job_satisfaction: float
    financial_stress: float
    sleep_duration: str
    dietary_habits: str
    work_study_hours: int
    suicidal_thoughts: str
    family_history_mental_illness: str

def clean_diet(val):
    valid_diet = {
        'Healthy': 'Healthy',        'More Healthy': 'Healthy',
        'No Healthy': 'Unhealthy',   'Less than Healthy': 'Unhealthy',
        'Less Healthy': 'Unhealthy', 'Unhealthy': 'Unhealthy',
        'Moderate': 'Moderate'
    }
    return valid_diet.get(val, 'Other')

@app.post("/predict")
def predict_risk(data: AssessmentInput):
    try:
        input_data = data.model_dump()
        df         = pd.DataFrame([input_data])

        df['dietary_habits'] = df['dietary_habits'].apply(clean_diet)
        df['sleep_duration'] = df['sleep_duration'].map(sleep_mapping)

        df_encoded = pd.get_dummies(df)
        df_final   = df_encoded.reindex(columns=feature_columns, fill_value=0)

        probability = model.predict_proba(df_final)[0][1]
        prediction  = int(model.predict(df_final)[0])

        return {"prediction": prediction, "risk_score": probability}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------------------------------------------
# 7. Chat Endpoint — RAG-aware with memory
# ---------------------------------------------------------------
class ChatRequest(BaseModel):
    session_id: str  # unique ID per user/conversation
    message: str     # latest message only, memory handles history

@app.post("/chat/")
def chat_endpoint(request: ChatRequest):
    try:
        user_message = request.message

        # If RAG is available, retrieve relevant clinical context first
        if rag_chain:
            rag_context = rag_chain.invoke(user_message)
            augmented_message = (
                f"Relevant clinical context retrieved from mental health documents:\n\n"
                f"{rag_context}\n\n"
                f"User question: {user_message}"
            )
        else:
            augmented_message = user_message

        # Run through conversational chain with memory
        response = chain_with_memory.invoke(
            {"input": augmented_message},
            config={"configurable": {"session_id": request.session_id}}
        )

        return {"reply": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------------------------------------------
# 8. Health Check
# ---------------------------------------------------------------
@app.get("/")
def root():
    return {
        "status": "running",
        "rag_enabled": rag_chain is not None,
        "sessions_active": len(session_store)
    }