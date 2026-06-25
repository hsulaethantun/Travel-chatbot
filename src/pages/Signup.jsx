import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

/* ── Styles ─────────────────────────────────────────────────── */
const s = {
    container: {
        fontFamily: "system-ui, sans-serif",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        position: "relative",
        overflow: "hidden",
        padding: "1rem",
    },
    /* animated blobs */
    bg: { position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 },
    blobBase: {
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(80px)",
        opacity: 0.35,
        animation: "blobFloat 8s ease-in-out infinite alternate",
    },
    blob1: {
        width: 500, height: 500,
        background: "radial-gradient(circle, #2E3D5D, #1a54d0ff)",
        top: -100, left: -150,
    },
    blob2: {
        width: 400, height: 400,
        background: "radial-gradient(circle, #6d28d9, #ce4472ff)",
        bottom: -80, right: -100,
        animationDelay: "-3s",
    },
    blob3: {
        width: 300, height: 300,
        background: "radial-gradient(circle, #1a54d0ff, #49A5D4)",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        animationDelay: "-5s",
    },
    /* card */
    card: {
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 420,
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 24,
        padding: "2.5rem 2rem",
        boxShadow:
            "0 0 0 1px rgba(255,255,255,0.05), 0 32px 64px rgba(0,0,0,0.6)",
    },
    header: { textAlign: "center", marginBottom: "2rem" },
    logoWrap: {
        display: "inline-flex",
        marginBottom: "1.25rem",
        filter: "drop-shadow(0 4px 16px rgba(124,58,237,0.5))",
    },
    title: {
        fontSize: "1.75rem", fontWeight: 700, color: "#f0f0ff",
        margin: "0 0 0.4rem", letterSpacing: "-0.02em",
    },
    subtitle: { fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", margin: 0 },
    /* alerts */
    errorBox: {
        display: "flex", alignItems: "center", gap: "0.5rem",
        background: "rgba(239,68,68,0.12)",
        border: "1px solid rgba(239,68,68,0.3)",
        color: "#f87171", borderRadius: 10,
        padding: "0.75rem 1rem", fontSize: "0.875rem", marginBottom: "1.25rem",
    },
    successBox: {
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", gap: "0.75rem", padding: "0.5rem 0",
    },
    successTitle: {
        fontSize: "1.25rem", fontWeight: 700, color: "#f0f0ff", margin: 0,
    },
    successText: {
        fontSize: "0.9rem", color: "rgba(255,255,255,0.5)",
        margin: 0, lineHeight: 1.6,
    },
    /* form */
    form: { display: "flex", flexDirection: "column", gap: "1.25rem" },
    formGroup: { display: "flex", flexDirection: "column", gap: "0.5rem" },
    label: { fontSize: "0.875rem", fontWeight: 500, color: "rgba(255,255,255,0.7)" },
    inputWrap: { position: "relative", display: "flex", alignItems: "center" },
    inputIcon: {
        position: "absolute", left: "0.875rem",
        color: "rgba(255,255,255,0.3)", pointerEvents: "none", flexShrink: 0,
    },
    input: {
        width: "100%",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: "0.75rem 3rem 0.75rem 2.75rem",
        fontSize: "0.9375rem", fontFamily: "inherit",
        color: "#f0f0ff", outline: "none", boxSizing: "border-box",
    },
    eyeBtn: {
        position: "absolute", right: "0.875rem",
        background: "none", border: "none", cursor: "pointer",
        color: "rgba(255,255,255,0.35)", padding: 0,
        display: "flex", alignItems: "center",
    },
    submitBtn: {
        marginTop: "0.5rem", width: "100%", padding: "0.85rem",
        background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
        color: "#fff", fontSize: "0.9375rem", fontWeight: 600,
        fontFamily: "inherit", border: "none", borderRadius: 12,
        cursor: "pointer",
        boxShadow: "0 4px 24px rgba(124,58,237,0.4)",
    },
    submitBtnDisabled: { opacity: 0.65, cursor: "not-allowed" },
    spinnerWrap: {
        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
    },
    backBtn: {
        display: "block", textAlign: "center", textDecoration: "none",
        marginTop: "1.5rem", width: "100%", padding: "0.85rem",
        background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
        color: "#fff", fontSize: "0.9375rem", fontWeight: 600,
        fontFamily: "inherit", border: "none", borderRadius: 12,
        cursor: "pointer", boxSizing: "border-box",
        boxShadow: "0 4px 24px rgba(124,58,237,0.4)",
    },
    footer: {
        textAlign: "center", marginTop: "1.75rem", marginBottom: 0,
        fontSize: "0.875rem", color: "rgba(255,255,255,0.4)",
    },
    signinLink: { color: "#a78bfa", fontWeight: 500, textDecoration: "none" },
};

/* ── Eye icons ──────────────────────────────────────────────── */
const EyeOpen = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
);
const EyeOff = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

/* ── Component ─────────────────────────────────────────────── */
export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { signUpNewUser } = UserAuth();
    const navigate = useNavigate();

    const showError = (msg) => {
        setError(msg);
        setTimeout(() => setError(null), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            showError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            showError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        const { success: ok, error: err } = await signUpNewUser(email, password);
        setLoading(false);

        if (err) {
            showError(err.message ?? "Sign-up failed. Please try again.");
        } else if (ok) {
            // If email confirmation is ON in Supabase → show success screen
            // If email confirmation is OFF → redirect instead:
            navigate("/homepage");
            setSuccess(true);
        }
    };

    return (
        <div style={s.container}>
            {/* Animated background */}
            <div style={s.bg} aria-hidden="true">
                <div style={{ ...s.blobBase, ...s.blob1 }} />
                <div style={{ ...s.blobBase, ...s.blob2 }} />
                <div style={{ ...s.blobBase, ...s.blob3 }} />
            </div>

            <div style={s.card}>
                {/* Header */}
                <div style={s.header}>
                    <div style={s.logoWrap}>
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                            <rect width="36" height="36" rx="10" fill="url(#su-grad)" />
                            <path d="M18 10v8M14 14h8" stroke="white" strokeWidth="3" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="su-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#7c3aed" />
                                    <stop offset="1" stopColor="#4f46e5" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1 style={s.title}>Sign Up</h1>
                    <p style={s.subtitle}>Sign up to your account</p>
                </div>

                {/* ── Success state ── */}
                {success ? (
                    <div style={s.successBox}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" stroke="#34d399" strokeWidth="2" />
                            <path d="M7 12l3.5 3.5 6.5-7" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p style={s.successTitle}>Success!</p>
                        <p style={s.successText}>
                            You have successfully signed up.
                        </p>
                        <Link to="/" style={s.backBtn}>Login</Link>
                    </div>
                ) : (
                    /* ── Sign-up form ── */
                    <form style={s.form} onSubmit={handleSubmit} noValidate>
                        {error && (
                            <div style={s.errorBox} role="alert">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="12" cy="16" r="1" fill="currentColor" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div style={s.formGroup}>
                            <label htmlFor="su-email" style={s.label}>Email</label>
                            <div style={s.inputWrap}>
                                <svg style={s.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
                                    <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <input
                                    id="su-email"
                                    type="email"
                                    style={s.input}
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={s.formGroup}>
                            <label htmlFor="su-password" style={s.label}>Password</label>
                            <div style={s.inputWrap}>
                                <svg style={s.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <input
                                    id="su-password"
                                    type={showPw ? "text" : "password"}
                                    style={s.input}
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    style={s.eyeBtn}
                                    onClick={() => setShowPw((v) => !v)}
                                    aria-label={showPw ? "Hide password" : "Show password"}
                                >
                                    {showPw ? <EyeOff /> : <EyeOpen />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div style={s.formGroup}>
                            <label htmlFor="su-confirm" style={s.label}>Confirm Password</label>
                            <div style={s.inputWrap}>
                                <svg style={s.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <input
                                    id="su-confirm"
                                    type={showConfirmPw ? "text" : "password"}
                                    style={s.input}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    style={s.eyeBtn}
                                    onClick={() => setShowConfirmPw((v) => !v)}
                                    aria-label={showConfirmPw ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPw ? <EyeOff /> : <EyeOpen />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            id="signup-submit"
                            style={{ ...s.submitBtn, ...(loading ? s.submitBtnDisabled : {}) }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span style={s.spinnerWrap}>
                                    <svg
                                        width="18" height="18" viewBox="0 0 24 24" fill="none"
                                        aria-hidden="true"
                                        style={{ animation: "spin 0.75s linear infinite" }}
                                    >
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 60" />
                                    </svg>
                                    Loading...
                                </span>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>
                )}

                {!success && (
                    <p style={s.footer}>
                        Already have an account?{" "}
                        <Link to="/signin" style={s.signinLink}>Sign In</Link>
                    </p>
                )}
            </div>

            <style>{`
                @keyframes blobFloat {
                    from { transform: scale(1) translate(0, 0); }
                    to   { transform: scale(1.15) translate(30px, 20px); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                #su-email::placeholder,
                #su-password::placeholder,
                #su-confirm::placeholder { color: rgba(255,255,255,0.2); }
                #su-email:focus,
                #su-password:focus,
                #su-confirm:focus {
                    border-color: #7c3aed;
                    background: rgba(124,58,237,0.08);
                    box-shadow: 0 0 0 3px rgba(124,58,237,0.2);
                }
            `}</style>
        </div>
    );
}
