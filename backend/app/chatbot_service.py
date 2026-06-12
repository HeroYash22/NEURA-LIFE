"""
Mental Health Chatbot Service using LangGraph and Gemini
"""
from typing import TypedDict, Annotated, Sequence
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
import os
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv, find_dotenv

# Define the state structure for the chatbot
class ChatbotState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], "The conversation messages"]
    user_emotion: Annotated[str, "Detected user emotion"]
    session_id: Annotated[str, "Session identifier"]

# Mental health support system prompt
MENTAL_HEALTH_PROMPT = """You are a compassionate and empathetic AI mental health support assistant named "NeuraLife Assistant". 

Your role is to:
1. Provide emotional support and active listening
2. Offer evidence-based coping strategies for stress, anxiety, depression, and other mental health concerns
3. Suggest mindfulness exercises, breathing techniques, and relaxation methods
4. Provide psychoeducation about mental health conditions
5. Encourage healthy lifestyle habits (sleep, exercise, nutrition, social connection)
6. Help users identify and challenge negative thought patterns (CBT techniques)
7. Offer crisis resources when appropriate

Important guidelines:
- Always be warm, non-judgmental, and supportive
- Validate users' feelings and experiences
- Never diagnose mental health conditions
- Never prescribe medication or replace professional treatment
- If a user expresses suicidal thoughts or immediate danger, provide crisis hotline numbers
- Encourage professional help for serious concerns
- Use simple, clear language
- Ask clarifying questions to better understand the user's situation
- Provide actionable, practical advice
- Be culturally sensitive and inclusive

Crisis Resources:
- National Suicide Prevention Lifeline: 1800-599-0019 or 1-800-273-8255
- Crisis Text Line: Text HOME to 741741
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

Remember: You are a supportive companion, not a replacement for professional mental health care."""


class MentalHealthChatbot:
    """Mental Health Chatbot using LangGraph and Gemini"""
    
    def __init__(self, api_key: str = None):
        """Initialize the chatbot with Gemini LLM"""
        # Ensure environment is loaded and resolve API key from multiple common names
        self.api_key = api_key or self._resolve_api_key()
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        # Workaround for langchain/langchain-core version mismatch issue
        import langchain
        if not hasattr(langchain, 'verbose'):
            langchain.verbose = False
        if not hasattr(langchain, 'debug'):
            langchain.debug = False
        if not hasattr(langchain, 'llm_cache'):
            langchain.llm_cache = None

        # Initialize Gemini LLM
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=self.api_key,
            temperature=0.7,
            max_tokens=1024
        )
        
        # Initialize memory saver (in-memory persistence)
        self.memory = MemorySaver()
        
        # Build the graph
        self.graph = self._build_graph()

    @staticmethod
    def _resolve_api_key() -> str:
        """Load .env robustly and resolve Google Gemini API key.

        Looks for the .env file starting from this file's parent (backend/) and upward,
        then tries common environment variable names that users might set.
        """
        # Load .env from nearest path if not already loaded
        try:
            env_path = find_dotenv(usecwd=False)
            if env_path:
                load_dotenv(env_path, override=False)
            else:
                # Fallback to backend/.env relative to this file
                fallback = Path(__file__).resolve().parents[1] / ".env"
                if fallback.exists():
                    load_dotenv(fallback.as_posix(), override=False)
        except Exception:
            # Don't fail on dotenv issues; we'll attempt to read env vars anyway
            pass

        # Try common key names
        for key_name in ("GOOGLE_API_KEY", "GEMINI_API_KEY", "GOOGLE_GENAI_API_KEY"):
            val = os.getenv(key_name)
            if val and val.strip():
                return val.strip()
        return None
    
    def _build_graph(self):
        """Build the LangGraph workflow"""
        workflow = StateGraph(ChatbotState)
        
        # Add nodes
        workflow.add_node("process_input", self._process_input)
        workflow.add_node("generate_response", self._generate_response)
        
        # Add edges
        workflow.set_entry_point("process_input")
        workflow.add_edge("process_input", "generate_response")
        workflow.add_edge("generate_response", END)
        
        # Compile with memory
        return workflow.compile(checkpointer=self.memory)
    
    def _process_input(self, state: ChatbotState) -> ChatbotState:
        """Process user input and detect emotion/intent"""
        messages = state["messages"]
        
        # Simple emotion detection based on keywords (can be enhanced)
        last_message = messages[-1].content if messages else ""
        emotion = self._detect_emotion(last_message)
        
        state["user_emotion"] = emotion
        return state
    
    def _detect_emotion(self, text: str) -> str:
        """Simple emotion detection based on keywords"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ["sad", "depressed", "hopeless", "worthless", "cry"]):
            return "sad"
        elif any(word in text_lower for word in ["anxious", "worried", "nervous", "panic", "fear"]):
            return "anxious"
        elif any(word in text_lower for word in ["angry", "frustrated", "irritated", "mad"]):
            return "angry"
        elif any(word in text_lower for word in ["stressed", "overwhelmed", "pressure", "burden"]):
            return "stressed"
        elif any(word in text_lower for word in ["happy", "good", "great", "better", "wonderful"]):
            return "positive"
        else:
            return "neutral"
    
    def _generate_response(self, state: ChatbotState) -> ChatbotState:
        """Generate response using Gemini LLM"""
        messages = state["messages"]
        emotion = state.get("user_emotion", "neutral")
        
        # Prepare messages for LLM
        llm_messages = [SystemMessage(content=MENTAL_HEALTH_PROMPT)]
        
        # Add context about detected emotion
        if emotion != "neutral":
            context_msg = SystemMessage(
                content=f"The user seems to be feeling {emotion}. Respond with extra empathy and support."
            )
            llm_messages.append(context_msg)
        
        # Add conversation history
        llm_messages.extend(messages)
        
        # Generate response
        response = self.llm.invoke(llm_messages)
        
        # Add AI response to messages
        state["messages"] = messages + [AIMessage(content=response.content)]
        
        return state
    
    def chat(self, user_message: str, session_id: str) -> dict:
        """
        Process a user message and return a response
        
        Args:
            user_message: The user's message
            session_id: Unique session identifier for conversation history
            
        Returns:
            dict with response and metadata
        """
        # Create thread config for memory
        config = {"configurable": {"thread_id": session_id}}
        
        # Get current state or initialize
        try:
            current_state = self.graph.get_state(config)
            messages = list(current_state.values.get("messages", []))
        except:
            messages = []
        
        # Add user message
        messages.append(HumanMessage(content=user_message))
        
        # Create initial state
        initial_state = {
            "messages": messages,
            "user_emotion": "neutral",
            "session_id": session_id
        }
        
        # Run the graph
        result = self.graph.invoke(initial_state, config)
        
        # Extract response
        ai_messages = [msg for msg in result["messages"] if isinstance(msg, AIMessage)]
        response_content = ai_messages[-1].content if ai_messages else "I'm here to help. How can I support you today?"
        
        return {
            "response": response_content,
            "emotion": result.get("user_emotion", "neutral"),
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        }
    
    def get_conversation_history(self, session_id: str) -> list:
        """Get conversation history for a session"""
        config = {"configurable": {"thread_id": session_id}}
        
        try:
            current_state = self.graph.get_state(config)
            messages = current_state.values.get("messages", [])
            
            # Format messages
            history = []
            for msg in messages:
                if isinstance(msg, HumanMessage):
                    history.append({"role": "user", "content": msg.content})
                elif isinstance(msg, AIMessage):
                    history.append({"role": "assistant", "content": msg.content})
            
            return history
        except:
            return []
    
    def clear_session(self, session_id: str):
        """Clear conversation history for a session"""
        # Note: MemorySaver doesn't have a direct clear method
        # History will be lost when the app restarts
        pass


# Global chatbot instance (will be initialized in main.py)
chatbot_instance = None

def get_chatbot() -> MentalHealthChatbot:
    """Get or create the chatbot instance"""
    global chatbot_instance
    if chatbot_instance is None:
        # Resolve API key via robust loader
        api_key = MentalHealthChatbot._resolve_api_key()
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found. Please set it in backend/.env (or GEMINI_API_KEY)")

        # Only print a redacted preview to avoid leaking secrets
        preview = f"{api_key[:6]}...{api_key[-4:]}" if len(api_key) > 10 else "***"
        print(f"[Chatbot] Initializing with API key: {preview}")
        chatbot_instance = MentalHealthChatbot(api_key=api_key)
        print("[Chatbot] Successfully initialized!")
    return chatbot_instance
