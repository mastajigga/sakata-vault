"""
LLM Provider Architecture - Agnostic to any AI provider

This module implements the Provider Pattern to support multiple LLM providers:
- Claude (Anthropic)
- Gemini (Google)
- GPT (OpenAI)
- Grok (XAI)
- Qwen (Alibaba)

Usage:
    from lib.llm_providers import LLMProviderFactory

    llm = LLMProviderFactory.create()  # Uses LLM_PROVIDER env var (default: claude)
    answer = llm.synthesize(question, context)
"""

from abc import ABC, abstractmethod
import os


class LLMProvider(ABC):
    """Abstract base class for all LLM providers"""

    @abstractmethod
    def synthesize(self, question: str, context: str) -> str:
        """
        Synthesize intelligent response from question and context.

        Args:
            question: User's question
            context: Concatenated relevant document passages

        Returns:
            Synthesized answer as string
        """
        pass


class ClaudeProvider(LLMProvider):
    """Provider for Anthropic Claude"""

    def __init__(self):
        """Initialize Claude client with API key from environment"""
        try:
            from anthropic import Anthropic
        except ImportError:
            raise ImportError("anthropic package required: pip install anthropic")

        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError(
                "ANTHROPIC_API_KEY not configured. "
                "Add to .env.local: ANTHROPIC_API_KEY=sk-ant-..."
            )

        self.client = Anthropic(api_key=api_key)
        self.model = "claude-haiku-4-5-20251001"

    def synthesize(self, question: str, context: str) -> str:
        """Synthesize answer using Claude API"""
        system_prompt = """You are an expert on Sakata culture, spirituality, and history.
Your role is to provide comprehensive, intelligent answers synthesizing information from sources.

Guidelines:
- Synthesize all provided sources into coherent narrative
- Connect concepts across different documents
- Be specific and cite cultural concepts clearly
- Maintain academic rigor while being conversational and accessible
- Answer in the same language as the question
- Provide complete understanding, not just summaries
- Integrate all sources naturally without obvious "source 1 says... source 2 says..."

Respond in French if the question is in French, in English if it's in English."""

        user_message = f"""Based on these sources about Sakata culture, spirituality, and history:

{context}

Please provide a comprehensive answer to this question:
{question}

Synthesize all the information above into a clear, complete response that demonstrates deep understanding."""

        message = self.client.messages.create(
            model=self.model,
            max_tokens=2048,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_message}
            ]
        )

        return message.content[0].text


class GeminiProvider(LLMProvider):
    """Provider for Google Gemini"""

    def __init__(self):
        """Initialize Gemini client with API key from environment"""
        try:
            import google.generativeai as genai
            self.genai = genai
        except ImportError:
            raise ImportError("google-generativeai package required: pip install google-generativeai")

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY not configured. "
                "Add to .env.local: GEMINI_API_KEY=AIzaSy..."
            )

        self.genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    def synthesize(self, question: str, context: str) -> str:
        """Synthesize answer using Gemini API"""
        prompt = f"""You are an expert on Sakata culture, spirituality, and history.
Synthesize comprehensive, intelligent answers from sources provided.

Sources about Sakata culture:
{context}

Question: {question}

Provide a comprehensive answer synthesizing all information above."""

        response = self.model.generate_content(prompt)
        return response.text


class GPTProvider(LLMProvider):
    """Provider for OpenAI GPT"""

    def __init__(self):
        """Initialize GPT client with API key from environment"""
        try:
            from openai import OpenAI
        except ImportError:
            raise ImportError("openai package required: pip install openai")

        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError(
                "OPENAI_API_KEY not configured. "
                "Add to .env.local: OPENAI_API_KEY=sk-..."
            )

        self.client = OpenAI(api_key=api_key)
        self.model = "gpt-4o"

    def synthesize(self, question: str, context: str) -> str:
        """Synthesize answer using GPT API"""
        response = self.client.chat.completions.create(
            model=self.model,
            max_tokens=2048,
            messages=[
                {
                    "role": "system",
                    "content": "Expert on Sakata culture and history. Synthesize comprehensive answers from sources provided."
                },
                {
                    "role": "user",
                    "content": f"Based on:\n{context}\n\nAnswer: {question}"
                }
            ]
        )

        return response.choices[0].message.content


class QwenProvider(LLMProvider):
    """Provider for Alibaba Qwen"""

    def __init__(self):
        """Initialize Qwen client with API key from environment"""
        try:
            from dashscope import Generation
            self.Generation = Generation
        except ImportError:
            raise ImportError("dashscope package required: pip install dashscope")

        api_key = os.getenv("ALIBABA_QWEN_API_KEY")
        if not api_key:
            raise ValueError(
                "ALIBABA_QWEN_API_KEY not configured. "
                "Add to .env.local: ALIBABA_QWEN_API_KEY=..."
            )

        self.api_key = api_key

    def synthesize(self, question: str, context: str) -> str:
        """Synthesize answer using Qwen API"""
        response = self.Generation.call(
            api_key=self.api_key,
            model="qwen-max",
            messages=[
                {
                    "role": "system",
                    "content": "Expert on Sakata culture and history. Synthesize comprehensive answers from sources."
                },
                {
                    "role": "user",
                    "content": f"Based on:\n{context}\n\nAnswer: {question}"
                }
            ]
        )

        return response.output.text


class LLMProviderFactory:
    """Factory for instantiating LLM providers based on configuration"""

    _providers = {
        "claude": ClaudeProvider,
        "gemini": GeminiProvider,
        "gpt": GPTProvider,
        "qwen": QwenProvider,
    }

    @classmethod
    def create(cls, provider_name: str = None) -> LLMProvider:
        """
        Create an instance of the specified LLM provider.

        Args:
            provider_name: Name of provider (default: LLM_PROVIDER env var, default: claude)

        Returns:
            Instance of LLMProvider

        Raises:
            ValueError: If provider is unknown or API key is missing

        Example:
            llm = LLMProviderFactory.create()  # Uses env var or defaults to Claude
            llm = LLMProviderFactory.create("gemini")  # Explicitly use Gemini
        """
        if provider_name is None:
            provider_name = os.getenv("LLM_PROVIDER", "claude").lower()
        else:
            provider_name = provider_name.lower()

        if provider_name not in cls._providers:
            available = ", ".join(cls._providers.keys())
            raise ValueError(
                f"Unknown provider: {provider_name}. "
                f"Available providers: {available}"
            )

        try:
            return cls._providers[provider_name]()
        except (ImportError, ValueError) as e:
            raise ValueError(
                f"Failed to initialize {provider_name} provider: {str(e)}"
            )

    @classmethod
    def get_available_providers(cls) -> list:
        """Get list of available provider names"""
        return list(cls._providers.keys())
