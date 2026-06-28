// import { useState, useCallback, useEffect, useRef } from 'react';
// import { chatAPI } from '../services/api';
// import {
//   loadChatState,
//   saveChatState,
//   createDefaultConversation,
// } from '../utils/chatStorage';

// const SYSTEM_MESSAGE = {
//   role: 'system',
//   content: `You are Lumina, an exceptionally intelligent and helpful AI assistant.
// You communicate with clarity, depth, and elegance.
// When appropriate, use markdown formatting — headers, lists, code blocks, and emphasis.
// Be direct, insightful, and genuinely helpful.`,
// };

// function getInitialState() {
//   return loadChatState() ?? createDefaultConversation();
// }

// let cachedInitialState = null;
// function initialState() {
//   if (!cachedInitialState) {
//     cachedInitialState = getInitialState();
//   }
//   return cachedInitialState;
// }

// export function useChat() {
//   const [conversations, setConversations] = useState(() => initialState().conversations);
//   const [activeConvId, setActiveConvId] = useState(() => initialState().activeConvId);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
//   const isFirstSave = useRef(true);

//   const streamingContent = '';

//   const activeConversation = conversations.find((c) => c.id === activeConvId);

//   useEffect(() => {
//     if (isFirstSave.current) {
//       isFirstSave.current = false;
//       return;
//     }
//     saveChatState(conversations, activeConvId);
//   }, [conversations, activeConvId]);

//   const updateConversation = useCallback((id, updater) => {
//     setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
//   }, []);

//   const sendMessage = useCallback(async (userText) => {
//     if (!userText.trim() || isLoading) return;

//     const userMessage = { id: Date.now(), role: 'user', content: userText };
//     const convId = activeConvId;

//     updateConversation(convId, (conv) => ({
//       ...conv,
//       messages: [...conv.messages, userMessage],
//       title: conv.messages.length === 0
//         ? userText.slice(0, 45) + (userText.length > 45 ? '…' : '')
//         : conv.title,
//     }));

//     setIsLoading(true);

//     const history = [
//       SYSTEM_MESSAGE,
//       ...(activeConversation?.messages || []),
//       userMessage,
//     ].map(({ role, content }) => ({ role, content }));

//     try {
//       const response = await chatAPI.sendMessage(history, selectedModel);

//       const assistantMessage = {
//         id: Date.now() + 1,
//         role: 'assistant',
//         content: response.content,
//       };

//       updateConversation(convId, (conv) => ({
//         ...conv,
//         messages: [...conv.messages, assistantMessage],
//       }));
//     } catch (err) {
//       const errorMessage = {
//         id: Date.now() + 1,
//         role: 'assistant',
//         content: `⚠️ **Error:** ${err.message}\n\nTry again later or select a different model.`,
//         isError: true,
//       };
//       updateConversation(convId, (conv) => ({
//         ...conv,
//         messages: [...conv.messages, errorMessage],
//       }));
//     } finally {
//       setIsLoading(false);
//     }
//   }, [activeConvId, activeConversation, isLoading, selectedModel, updateConversation]);

//   const newConversation = useCallback(() => {
//     const c = { id: Date.now(), title: 'New Conversation', messages: [], createdAt: new Date() };
//     setConversations((prev) => [c, ...prev]);
//     setActiveConvId(c.id);
//   }, []);

//   const deleteConversation = useCallback((id) => {
//     setConversations((prev) => {
//       const filtered = prev.filter((c) => c.id !== id);
//       if (filtered.length === 0) {
//         const fresh = createDefaultConversation();
//         setActiveConvId(fresh.activeConvId);
//         return fresh.conversations;
//       }
//       if (id === activeConvId) setActiveConvId(filtered[0].id);
//       return filtered;
//     });
//   }, [activeConvId]);

//   const clearMessages = useCallback(() => {
//     updateConversation(activeConvId, (conv) => ({
//       ...conv,
//       messages: [],
//       title: 'New Conversation',
//     }));
//   }, [activeConvId, updateConversation]);

//   return {
//     conversations,
//     activeConversation,
//     activeConvId,
//     setActiveConvId,
//     isLoading,
//     streamingContent,
//     selectedModel,
//     setSelectedModel,
//     sendMessage,
//     newConversation,
//     deleteConversation,
//     clearMessages,
//   };
// }


import { useState, useCallback, useEffect, useRef } from "react";
import { chatAPI } from "../services/api";
import {
  loadChatState,
  saveChatState,
  createDefaultConversation,
} from "../utils/chatStorage";

const SYSTEM_MESSAGE = {
  role: "system",
  content: `You are Lumina, an exceptionally intelligent and helpful AI assistant.
You communicate with clarity, depth, and elegance.
When appropriate, use markdown formatting — headers, lists, code blocks, and emphasis.
Be direct, insightful, and genuinely helpful.`,
};

function getInitialState() {
  return loadChatState() ?? createDefaultConversation();
}

let cachedInitialState = null;

function initialState() {
  if (!cachedInitialState) {
    cachedInitialState = getInitialState();
  }
  return cachedInitialState;
}

export function useChat() {
  const [conversations, setConversations] = useState(
    () => initialState().conversations
  );

  const [activeConvId, setActiveConvId] = useState(
    () => initialState().activeConvId
  );

  const [isLoading, setIsLoading] = useState(false);

  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const isFirstSave = useRef(true);

  const streamingContent = "";

  const activeConversation = conversations.find(
    (c) => c.id === activeConvId
  );

  /* ----------------------------
      Detect Internet
  ----------------------------- */

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  /* ----------------------------
      Save chats automatically
  ----------------------------- */

  useEffect(() => {
    if (isFirstSave.current) {
      isFirstSave.current = false;
      return;
    }

    saveChatState(conversations, activeConvId);
  }, [conversations, activeConvId]);

  /* ----------------------------
      Update conversation
  ----------------------------- */

  const updateConversation = useCallback((id, updater) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? updater(conv) : conv))
    );
  }, []);

  /* ----------------------------
      Send Message
  ----------------------------- */

  const sendMessage = useCallback(
    async (userText) => {
      if (!userText.trim() || isLoading) return;

      const convId = activeConvId;

      const userMessage = {
        id: Date.now(),
        role: "user",
        content: userText,
      };

      updateConversation(convId, (conv) => ({
        ...conv,
        messages: [...conv.messages, userMessage],
        title:
          conv.messages.length === 0
            ? userText.slice(0, 45) +
              (userText.length > 45 ? "…" : "")
            : conv.title,
      }));

      /* ----------------------------
          Offline
      ----------------------------- */

      if (!navigator.onLine) {
        const offlineMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "📡 **You're offline.**\n\nYour conversations are safely stored on this device.\nReconnect to the internet to continue chatting with Lumina.",
          isOffline: true,
        };

        updateConversation(convId, (conv) => ({
          ...conv,
          messages: [...conv.messages, offlineMessage],
        }));

        return;
      }

      setIsLoading(true);

      const history = [
        SYSTEM_MESSAGE,
        ...(activeConversation?.messages || []),
        userMessage,
      ].map(({ role, content }) => ({
        role,
        content,
      }));

      try {
        const response = await chatAPI.sendMessage(
          history,
          selectedModel
        );

        const assistantMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: response.content,
        };

        updateConversation(convId, (conv) => ({
          ...conv,
          messages: [...conv.messages, assistantMessage],
        }));
      } catch (err) {
        const errorMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: `⚠️ **Error:** ${err.message}

Please try again later.`,
          isError: true,
        };

        updateConversation(convId, (conv) => ({
          ...conv,
          messages: [...conv.messages, errorMessage],
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [
      activeConvId,
      activeConversation,
      isLoading,
      selectedModel,
      updateConversation,
    ]
  );

  /* ----------------------------
      New conversation
  ----------------------------- */

  const newConversation = useCallback(() => {
    const conversation = {
      id: Date.now(),
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
    };

    setConversations((prev) => [conversation, ...prev]);

    setActiveConvId(conversation.id);
  }, []);

  /* ----------------------------
      Delete conversation
  ----------------------------- */

  const deleteConversation = useCallback(
    (id) => {
      setConversations((prev) => {
        const filtered = prev.filter((c) => c.id !== id);

        if (filtered.length === 0) {
          const fresh = createDefaultConversation();

          setActiveConvId(fresh.activeConvId);

          return fresh.conversations;
        }

        if (id === activeConvId) {
          setActiveConvId(filtered[0].id);
        }

        return filtered;
      });
    },
    [activeConvId]
  );

  /* ----------------------------
      Clear messages
  ----------------------------- */

  const clearMessages = useCallback(() => {
    updateConversation(activeConvId, (conv) => ({
      ...conv,
      messages: [],
      title: "New Conversation",
    }));
  }, [activeConvId, updateConversation]);

  return {
    conversations,
    activeConversation,
    activeConvId,
    setActiveConvId,
    isLoading,
    streamingContent,
    selectedModel,
    setSelectedModel,
    sendMessage,
    newConversation,
    deleteConversation,
    clearMessages,
    isOnline,
  };
}