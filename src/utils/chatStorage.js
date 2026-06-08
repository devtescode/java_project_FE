const STORAGE_KEY = 'lumina-conversations';

export function createDefaultConversation() {
  const id = Date.now();
  return {
    conversations: [
      { id, title: 'New Conversation', messages: [], createdAt: new Date() },
    ],
    activeConvId: id,
  };
}

function reviveConversation(conv) {
  if (!conv || typeof conv.id !== 'number') return null;
  return {
    id: conv.id,
    title: typeof conv.title === 'string' ? conv.title : 'New Conversation',
    messages: Array.isArray(conv.messages)
      ? conv.messages.filter((m) => m && typeof m.content === 'string' && m.role)
      : [],
    createdAt: conv.createdAt ? new Date(conv.createdAt) : new Date(),
  };
}

export function loadChatState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.conversations) || data.conversations.length === 0) {
      return null;
    }

    const conversations = data.conversations
      .map(reviveConversation)
      .filter(Boolean);

    if (conversations.length === 0) return null;

    const activeExists = conversations.some((c) => c.id === data.activeConvId);
    const activeConvId = activeExists ? data.activeConvId : conversations[0].id;

    return { conversations, activeConvId };
  } catch {
    return null;
  }
}

export function saveChatState(conversations, activeConvId) {
  try {
    const payload = {
      activeConvId,
      conversations: conversations.map((c) => ({
        id: c.id,
        title: c.title,
        messages: c.messages,
        createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
      })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save conversations:', err);
  }
}
