import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SlLogout } from "react-icons/sl";
import { BsRobot, BsMicFill, BsPlayFill, BsStopFill } from "react-icons/bs";
import { supabase } from "../lib/supabaseClient";
import { UserAuth } from "../context/AuthContext";
import { getGeminiResponse } from "../lib/gemini";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";

// SYSTEM_PROMPT, API_KEY, and API_URL are now handled in ../lib/gemini.js

const getWelcomeMsg = (t) => ({
    role: "bot",
    text: t('chat_welcome_subtitle'),
});

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function formatTime(ts, t) {
    if (!ts) return "";
    const d = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return t('chat_yesterday');
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function renderText(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br/>");
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
const Chatbot = () => {
    const { session, signOut } = UserAuth();
    const navigate = useNavigate();
    const userId = session?.user?.id ?? null;
    const userEmail = session?.user?.email ?? null;

    const { t } = useLanguage();
    const WELCOME_MSG = getWelcomeMsg(t);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [messages, setMessages] = useState([WELCOME_MSG]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [speakingMsgIndex, setSpeakingMsgIndex] = useState(null);

    const bottomRef = useRef(null);
    const textareaRef = useRef(null);
    const recognitionRef = useRef(null);

    /* auto-scroll */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    /* auto-resize textarea */
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 160) + "px";
        }
    }, [input]);

    /* load sessions list */
    const loadSessions = useCallback(async () => {
        if (!userId) return;
        const { data, error } = await supabase
            .from("chat_sessions")
            .select("id, title, updated_at")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false });
        if (!error) setSessions(data ?? []);
    }, [userId]);

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    /* load messages for a session */
    const loadSessionMessages = async (sessionId) => {
        setLoadingHistory(true);
        const { data, error } = await supabase
            .from("chat_messages")
            .select("role, content, created_at")
            .eq("session_id", sessionId)
            .order("created_at", { ascending: true });
        if (!error && data) {
            const msgs = data.map((m) => ({ role: m.role, text: m.content }));
            setMessages([WELCOME_MSG, ...msgs]);
        }
        setLoadingHistory(false);
    };

    /* ─── Actions ── */
    const startNewChat = async () => {
        setMessages([WELCOME_MSG]);
        setInput("");
        if (!userId) { setCurrentSessionId(null); return; }
        const { data, error } = await supabase
            .from("chat_sessions")
            .insert({ user_id: userId, title: t('chat_new_title') })
            .select()
            .single();
        if (!error && data) {
            setCurrentSessionId(data.id);
            setSessions((prev) => [data, ...prev]);
        }
    };

    const selectSession = async (sessionId) => {
        setCurrentSessionId(sessionId);
        await loadSessionMessages(sessionId);
    };

    const deleteSession = async (e, sessionId) => {
        e.stopPropagation();
        await supabase.from("chat_sessions").delete().eq("id", sessionId);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        if (currentSessionId === sessionId) {
            setCurrentSessionId(null);
            setMessages([WELCOME_MSG]);
        }
    };

    /* ─── Send ── */
    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        let sessionId = currentSessionId;
        if (userId && !sessionId) {
            const { data, error } = await supabase
                .from("chat_sessions")
                .insert({ user_id: userId, title: text.slice(0, 60) })
                .select()
                .single();
            if (!error && data) {
                sessionId = data.id;
                setCurrentSessionId(data.id);
                setSessions((prev) => [data, ...prev]);
            }
        }

        const userMsg = { role: "user", text };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        if (userId && sessionId) {
            await supabase
                .from("chat_messages")
                .insert({ session_id: sessionId, role: "user", content: text });

            const currentSession = sessions.find((s) => s.id === sessionId);
            if (!currentSession || currentSession.title === t('chat_new_title')) {
                const newTitle = text.slice(0, 60);
                await supabase
                    .from("chat_sessions")
                    .update({ title: newTitle, updated_at: new Date().toISOString() })
                    .eq("id", sessionId);
                setSessions((prev) =>
                    prev.map((s) =>
                        s.id === sessionId
                            ? { ...s, title: newTitle, updated_at: new Date().toISOString() }
                            : s
                    )
                );
            } else {
                await supabase
                    .from("chat_sessions")
                    .update({ updated_at: new Date().toISOString() })
                    .eq("id", sessionId);
            }
        }

        const history = updatedMessages
            .filter((_, i) => i > 0)
            .map((m) => ({
                role: m.role === "user" ? "user" : "model",
                parts: [{ text: m.text }],
            }));

        try {
            const reply = await getGeminiResponse(history);

            setMessages((prev) => [...prev, { role: "bot", text: reply }]);

            if (userId && sessionId) {
                await supabase
                    .from("chat_messages")
                    .insert({ session_id: sessionId, role: "bot", content: reply });
            }
        } catch (err) {
            console.error("Gemini Utility error:", err);
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: `⚠️ Error: ${err.message}. Please try again.` },
            ]);
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/signin");
    };

    /* ─── Speech ── */
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = "en-US";

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput((prev) => (prev ? prev + " " + transcript : transcript));
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.error("Speech recognition start error:", err);
            }
        }
    };

    const speakText = (text, index) => {
        if (!window.speechSynthesis) {
            alert("Text-to-speech is not supported in this browser.");
            return;
        }

        if (speakingMsgIndex === index) {
            window.speechSynthesis.cancel();
            setSpeakingMsgIndex(null);
            return;
        }

        window.speechSynthesis.cancel(); // Stop any previous speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setSpeakingMsgIndex(null);
        utterance.onerror = () => setSpeakingMsgIndex(null);

        setSpeakingMsgIndex(index);
        window.speechSynthesis.speak(utterance);
    };

    /* ─── Group sessions ── */
    const todayMs = new Date().setHours(0, 0, 0, 0);
    const yesterdayMs = todayMs - 86400000;
    const weekMs = todayMs - 7 * 86400000;
    const grouped = {
        [t('chat_today')]: sessions.filter((s) => new Date(s.updated_at) >= todayMs),
        [t('chat_yesterday')]: sessions.filter(
            (s) => new Date(s.updated_at) >= yesterdayMs && new Date(s.updated_at) < todayMs
        ),
        [t('chat_previous_7_days')]: sessions.filter(
            (s) => new Date(s.updated_at) >= weekMs && new Date(s.updated_at) < yesterdayMs
        ),
        [t('chat_older')]: sessions.filter((s) => new Date(s.updated_at) < weekMs),
    };

    const canSend = !!input.trim() && !loading;
    const currentSessionTitle =
        sessions.find((s) => s.id === currentSessionId)?.title ?? "Thailand Travel Assistant";

    /* ─── Render ── */
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .chat-page-wrap { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; }
        .chat-page-wrap * { box-sizing: border-box; }
        .chat-sidebar::-webkit-scrollbar,
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-sidebar::-webkit-scrollbar-track,
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-sidebar::-webkit-scrollbar-thumb,
        .chat-messages::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 4px; }

        /* Remove Bootstrap mt-5 gap between chat and footer */
        .chat-page-wrap > footer { margin-top: 0 !important; }

        .session-item:hover { background: #2a2a2a !important; }
        .session-item:hover .del-btn { opacity: 1 !important; }
        .new-chat-btn:hover { background: #252525 !important; }
        .sb-toggle:hover { background: #2a2a2a !important; }
        .send-btn-active:hover { background: #d0d0d0 !important; }
        .sign-out-btn:hover { color: #ececec !important; }
        .chip-btn:hover { background: #383838 !important; }
        .chat-input-textarea::placeholder { color: #edededff; opacity: 1; }

        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
        .dot1 { animation: dotPulse 1.2s infinite ease-in-out 0.0s; }
        .dot2 { animation: dotPulse 1.2s infinite ease-in-out 0.2s; }
        .dot3 { animation: dotPulse 1.2s infinite ease-in-out 0.4s; }

        @keyframes pulseMic {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        .mic-active {
          animation: pulseMic 1.5s infinite;
          background: #ef4444 !important;
          color: white !important;
        }

        @media (max-width: 768px) {
          .chat-sidebar {
            position: absolute;
            z-index: 1050;
            height: calc(100vh - 56px);
          }
          .chat-messages {
            padding: 10px 0 !important;
          }
          .chat-message-container {
            padding: 4px 12px !important;
          }
          .chat-bubble {
            max-width: 90% !important;
          }
          .chip-btn {
            font-size: 0.75rem !important;
            padding: 6px 10px !important;
          }
        }
      `}</style>

            {/* NavBar sits above everything (it's fixed-top via Bootstrap) */}
            <NavBar />

            {/* Page wrapper — sits below fixed NavBar (~56 px) */}
            <div
                className="chat-page-wrap"
                style={{
                    paddingTop: "56px",
                    background: "#2b2929ff",
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    overflow: "hidden",
                    position: "relative"
                }}
            >
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            display: window.innerWidth <= 768 ? "block" : "none",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0,0,0,0.5)",
                            zIndex: 1040,
                        }}
                    />
                )}
                {/* ── Chat shell (sidebar + messages) ── */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        overflow: "hidden",
                    }}
                >
                    {/* ── Sidebar ── */}
                    <div
                        className="chat-sidebar"
                        style={{
                            width: sidebarOpen ? "260px" : "0px",
                            minWidth: sidebarOpen ? "260px" : "0px",
                            background: "#ffffffff",
                            display: "flex",
                            flexDirection: "column",
                            transition: "width 0.25s ease, min-width 0.25s ease",
                            overflow: "hidden",
                            borderRight: "1px solid #616161ff",
                            flexShrink: 0,
                        }}
                    >
                        {/* inner is fixed-width so content doesn't collapse during animation */}
                        <div style={{ width: "260px", display: "flex", flexDirection: "column", height: "100%" }}>

                            {/* Top */}
                            <div style={{ padding: "14px 12px 8px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <button
                                    className="sb-toggle"
                                    onClick={() => setSidebarOpen(false)}
                                    title="Close sidebar"
                                    style={btnReset({ color: "#000000ff", padding: "6px", borderRadius: "8px", fontSize: "18px" })}
                                >
                                    ☰
                                </button>
                                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#000000ff" }}>
                                    🇹🇭 TravelChat
                                </span>
                            </div>

                            {/* New Chat */}
                            <button
                                className="new-chat-btn"
                                onClick={startNewChat}
                                style={{
                                    margin: "4px 12px 8px",
                                    background: "transparent",
                                    border: "1px solid #bcbbbbff",
                                    borderRadius: "10px",
                                    color: "#000000ff",
                                    padding: "10px 14px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    fontSize: "0.88rem",
                                    fontWeight: 500,
                                    width: "calc(100% - 24px)",
                                    fontFamily: "inherit",
                                }}
                            >
                                <span style={{ color: "#000000ff", fontSize: "15px" }}>✏️</span>
                                {t('chat_new')}
                            </button>

                            {/* Session list */}
                            <div
                                className="chat-sidebar"
                                style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}
                            >
                                {!userId ? (
                                    <div style={unauthHint}>
                                        <span
                                            style={{ color: "#4a9eff", cursor: "pointer" }}
                                            onClick={() => navigate("/signin")}
                                        >
                                            {t('signin_title')}
                                        </span>{" "}
                                        {t('chat_signin_hint')}
                                    </div>
                                ) : sessions.length === 0 ? (
                                    <div style={{ ...unauthHint, textAlign: "center" }}>
                                        Your recent chats will appear here.
                                    </div>
                                ) : (
                                    Object.entries(grouped).map(([label, items]) =>
                                        items.length === 0 ? null : (
                                            <div key={label}>
                                                <div style={sectionLabel}>{label}</div>
                                                {items.map((s) => (
                                                    <div
                                                        key={s.id}
                                                        className="session-item"
                                                        onClick={() => selectSession(s.id)}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                            padding: "8px 10px",
                                                            borderRadius: "8px",
                                                            cursor: "pointer",
                                                            background: s.id === currentSessionId ? "#5b5858ff" : "transparent",
                                                            marginBottom: "2px",
                                                            gap: "6px",
                                                        }}
                                                    >
                                                        <span style={{ fontSize: "12px", color: "#6b6b6b", flexShrink: 0 }}>💬</span>
                                                        <span style={{
                                                            flex: 1,
                                                            fontSize: "0.86rem",
                                                            color: "#000000ff",
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}>
                                                            {s.title}
                                                        </span>
                                                        <span style={{ fontSize: "0.71rem", color: "#6b6b6b", flexShrink: 0 }}>
                                                            {formatTime(s.updated_at, t)}
                                                        </span>
                                                        <button
                                                            className="del-btn"
                                                            onClick={(e) => deleteSession(e, s.id)}
                                                            title="Delete"
                                                            style={{
                                                                background: "none",
                                                                border: "none",
                                                                color: "#6b6b6b",
                                                                cursor: "pointer",
                                                                padding: "2px 4px",
                                                                borderRadius: "4px",
                                                                fontSize: "12px",
                                                                opacity: 0,
                                                                transition: "opacity 0.15s",
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            🗑
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    )
                                )}
                            </div>

                            {/* Bottom user row */}
                            <div style={{ padding: "12px", borderTop: "1px solid #bcbbbbff" }}>
                                {userId ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 8px" }}>
                                        <div style={{
                                            width: "30px", height: "30px", borderRadius: "50%",
                                            background: "linear-gradient(135deg, #2E3D5D 0%, #4a6fa5 100%)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "0.78rem", fontWeight: 700, color: "#fff", flexShrink: 0,
                                        }}>
                                            {(userEmail?.[0] ?? "?").toUpperCase()}
                                        </div>
                                        <span style={{
                                            flex: 1, fontSize: "0.8rem", color: "#000000ff",
                                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                        }} title={userEmail}>
                                            {userEmail}
                                        </span>
                                        <button
                                            className="sign-out-btn"
                                            onClick={handleSignOut}
                                            title="Sign out"
                                            style={btnReset({ color: "#000000ff", padding: "4px", borderRadius: "6px", fontSize: "15px" })}
                                        >
                                            <SlLogout />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => navigate("/signin")}
                                        style={{
                                            width: "100%", padding: "9px 14px", borderRadius: "8px",
                                            background: "#2E3D5D", border: "none", color: "#fff",
                                            fontWeight: 600, fontSize: "0.86rem", cursor: "pointer", fontFamily: "inherit",
                                        }}
                                    >
                                        {t('signin_title')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Main chat area ── */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fcfcfcff" }}>

                        {/* Top bar */}
                        <div style={{
                            display: "flex", alignItems: "center", padding: "10px 16px", gap: "10px",
                            borderBottom: "1px solid #918f8fff", background: "#2E3D5D", flexShrink: 0,
                        }}>
                            {!sidebarOpen && (
                                <>
                                    <button
                                        className="sb-toggle"
                                        onClick={() => setSidebarOpen(true)}
                                        title="Open sidebar"
                                        style={btnReset({ color: "#b4b4b4", padding: "6px", borderRadius: "8px", fontSize: "18px" })}
                                    >
                                        ☰
                                    </button>
                                    <button
                                        onClick={startNewChat}
                                        title="New chat"
                                        style={btnReset({ color: "#b4b4b4", padding: "6px", borderRadius: "8px", fontSize: "16px" })}
                                    >
                                        ✏️
                                    </button>
                                </>
                            )}
                            <div style={{ flex: 1, fontSize: "0.94rem", fontWeight: 600, color: "#ffffffff" }}>
                                {currentSessionId ? currentSessionTitle : "🇹🇭 Thailand Travel Assistant"}
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            className="chat-messages"
                            style={{ flex: 1, overflowY: "auto", padding: "20px 0", display: "flex", flexDirection: "column" }}
                        >
                            {loadingHistory ? (
                                <div style={{ textAlign: "center", color: "#6b6b6b", padding: "40px" }}>
                                    {t('loading')} history…
                                </div>
                            ) : messages.length === 1 && !currentSessionId ? (
                                /* Welcome splash */
                                <div style={{
                                    flex: 1, display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center",
                                    color: "#ececec", padding: "40px 24px",
                                }}>
                                    <div style={{ fontSize: "2.8rem", marginBottom: "14px" }}>🇹🇭</div>
                                    <div style={{ color: "#696565ff", fontSize: "15px", fontWeight: 700, marginBottom: "8px", textAlign: "center" }}>
                                        {t('chat_welcome_title')}
                                    </div>
                                    <div style={{ fontSize: "0.9rem", color: "#8a8a8a", textAlign: "center", maxWidth: "400px" }}>
                                        {t('chat_welcome_subtitle')}
                                    </div>
                                    <div style={{ marginTop: "28px", display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", maxWidth: "540px" }}>
                                        {[
                                            t('chat_q1'),
                                            t('chat_q2'),
                                            t('chat_q3'),
                                            t('chat_q4'),
                                            t('chat_q5'),
                                            t('chat_q6'),
                                            t('chat_q7')
                                        ].map((q) => (
                                            <button
                                                key={q}
                                                className="chip-btn"
                                                onClick={() => setInput(q)}
                                                style={{
                                                    background: "#7a7878ff", border: "1px solid #676666ff",
                                                    borderRadius: "20px", color: "#edededff",
                                                    padding: "8px 14px", fontSize: "0.82rem",
                                                    cursor: "pointer", fontFamily: "inherit",
                                                    transition: "background 0.15s",
                                                }}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, i) =>
                                    msg.role === "bot" ? (
                                        <div key={i} className="chat-message-container" style={{ display: "flex", padding: "4px 24px", maxWidth: "100%" }}>
                                            <div style={{ display: "flex", gap: "12px", maxWidth: "720px", width: "100%" }}>
                                                <div style={{
                                                    width: "26px", height: "26px", borderRadius: "50%",
                                                    background: "linear-gradient(135deg, #2E3D5D 0%, #4a9eff 100%)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: "13px", flexShrink: 0, marginTop: "2px",
                                                }}><BsRobot /></div>
                                                <div
                                                    className="chat-bubble"
                                                    style={{
                                                        flex: 1,
                                                        color: "#ececec",
                                                        fontSize: "0.93rem",
                                                        lineHeight: 1.65,
                                                        padding: "10px 14px",
                                                        background: "#2a2a2aff",
                                                        borderRadius: "18px 18px 18px 4px",
                                                        maxWidth: "85%"
                                                    }}
                                                >
                                                    <div dangerouslySetInnerHTML={{ __html: renderText(msg.text) }} />
                                                    <button
                                                        onClick={() => speakText(msg.text, i)}
                                                        title={speakingMsgIndex === i ? "Stop" : "Play"}
                                                        style={btnReset({
                                                            marginTop: "8px",
                                                            color: speakingMsgIndex === i ? "#ef4444" : "#b4b4b4",
                                                            fontSize: "14px",
                                                            gap: "6px",
                                                            padding: "4px 8px",
                                                            borderRadius: "6px",
                                                            background: "rgba(255,255,255,0.05)"
                                                        })}
                                                    >
                                                        {speakingMsgIndex === i ? <BsStopFill /> : <BsPlayFill />}
                                                        <span style={{ fontSize: "0.75rem" }}>{speakingMsgIndex === i ? t('chat_stop') : t('chat_listen')}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={i} className="chat-message-container" style={{ display: "flex", justifyContent: "flex-end", padding: "4px 14px" }}>
                                            <div className="chat-bubble" style={{
                                                maxWidth: "560px",
                                                background: "#7a7878ff",
                                                borderRadius: "18px 18px 4px 18px",
                                                padding: "11px 16px",
                                                color: "#ececec",
                                                fontSize: "0.93rem",
                                                lineHeight: 1.65,
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                            }}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    )
                                )
                            )}

                            {/* Typing indicator */}
                            {loading && (
                                <div style={{ display: "flex", padding: "4px 24px" }}>
                                    <div style={{ display: "flex", gap: "12px", maxWidth: "720px" }}>
                                        <div style={{
                                            width: "26px", height: "26px", borderRadius: "50%",
                                            background: "linear-gradient(135deg, #2E3D5D 0%, #4a9eff 100%)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "13px", flexShrink: 0,
                                        }}><BsRobot /></div>
                                        <div style={{ padding: "10px 0", display: "flex", alignItems: "center", gap: "4px" }}>
                                            {["dot1", "dot2", "dot3"].map((cls) => (
                                                <span key={cls} className={cls} style={{
                                                    display: "inline-block", width: "6px", height: "6px",
                                                    borderRadius: "50%", background: "#8a8a8a",
                                                }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input area */}
                        <div style={{ padding: "12px 20px 16px", flexShrink: 0 }}>
                            <div style={{
                                display: "flex", alignItems: "flex-end", gap: "10px",
                                background: "#7a7878ff", borderRadius: "14px",
                                padding: "10px 10px 10px 16px",
                                border: "1px solid #676666ff", color: "#fdfdfdff",
                            }}>
                                <textarea
                                    className="chat-input-textarea"
                                    ref={textareaRef}
                                    rows={1}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t('chat_placeholder')}
                                    style={{
                                        flex: 1, background: "transparent", border: "none", outline: "none",
                                        color: "#fdfdfdff", fontSize: "0.93rem", fontFamily: "inherit",
                                        resize: "none", lineHeight: 1.6, minHeight: "24px", maxHeight: "160px", padding: 0,
                                    }}
                                />
                                <button
                                    className={isListening ? "mic-active" : ""}
                                    onClick={toggleListening}
                                    title={isListening ? "Stop listening" : "Ask with voice"}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        borderRadius: "10px",
                                        width: "34px",
                                        height: "34px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        flexShrink: 0,
                                        color: isListening ? "#fff" : "#ececeeff",
                                    }}
                                >
                                    <BsMicFill size={18} />
                                </button>
                                <button
                                    className={canSend ? "send-btn-active" : ""}
                                    onClick={sendMessage}
                                    disabled={!canSend}
                                    title="Send"
                                    style={{
                                        background: canSend ? "#ececec" : "#8c8c8cff",
                                        border: "none", borderRadius: "10px",
                                        width: "34px", height: "34px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: canSend ? "pointer" : "not-allowed",
                                        transition: "background 0.2s", flexShrink: 0,
                                        color: canSend ? "#212121" : "#555",
                                    }}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 20V4M5 11l7-7 7 7" stroke="currentColor" strokeWidth="2.5"
                                            strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <Footer />
            </div>
        </>
    );
};

/* ─── Style helpers ──────────────────────────────────────────────────────── */
const btnReset = (extra = {}) => ({
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "background 0.15s, color 0.15s",
    fontFamily: "inherit",
    ...extra,
});

const sectionLabel = {
    padding: "10px 16px 4px",
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "#6b6b6b",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
};

const unauthHint = {
    margin: "12px",
    padding: "10px 12px",
    background: "#1e1e1e",
    borderRadius: "10px",
    fontSize: "0.8rem",
    color: "#8a8a8a",
    lineHeight: 1.5,
};

export default Chatbot;