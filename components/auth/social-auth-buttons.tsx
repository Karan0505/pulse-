import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronRight, ArrowLeft, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { isUserRegistered, registerUser, getRoleRedirect } from "@/lib/user-registry";

type AccountItem = {
  name: string;
  email: string;
  avatarColor?: string;
};

const DEFAULT_GOOGLE_ACCOUNTS: AccountItem[] = [
  { name: "karan Parmar", email: "karanparmar552003@gmail.com", avatarColor: "#4285F4" },
  { name: "Max max", email: "maxparmar09@gmail.com", avatarColor: "#EA4335" },
];

const DEFAULT_GITHUB_ACCOUNTS: AccountItem[] = [
  { name: "sarahchen-dev", email: "sarah.chen@github.dev", avatarColor: "#2ea44f" },
  { name: "karanparmar552003", email: "karan.github@pulse.io", avatarColor: "#0969da" },
];

export function SocialAuthButtons({ mode = "login" }: { mode?: "login" | "signup" }) {
  const router = useRouter();
  const { setSession } = useAuth();
  const [activeModal, setActiveModal] = useState<"google" | "github" | null>(null);

  // Dynamic lists of accounts
  const [googleAccounts, setGoogleAccounts] = useState<AccountItem[]>(DEFAULT_GOOGLE_ACCOUNTS);
  const [githubAccounts, setGithubAccounts] = useState<AccountItem[]>(DEFAULT_GITHUB_ACCOUNTS);

  // Screen inside modal: 'list' or 'add'
  const [modalScreen, setModalScreen] = useState<"list" | "add">("list");

  // Input states for adding another account
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleOAuthLogin = async (email: string, name: string, provider: "google" | "github") => {
    setAuthError(null);

    // If on LOGIN page, verify user has ALREADY signed up
    if (mode === "login") {
      const registered = isUserRegistered(email);
      if (!registered) {
        setAuthError(`No account found for ${email}. Please sign up first!`);
        return;
      }
    } else {
      // If on SIGNUP page, register user in registry & send Welcome email
      registerUser(email, name, provider);
      fetch("/api/auth/send-welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      }).catch(() => {});
    }

    setIsAuthenticating(true);
    await new Promise((res) => setTimeout(res, 600));

    setSession({
      email,
      name,
      token: `${provider}-oauth-${Date.now()}`,
    });

    setIsAuthenticating(false);
    setActiveModal(null);
    setModalScreen("list");
    const targetPath = getRoleRedirect(email);
    router.push(targetPath);
  };

  const handleAddNewAccount = (e: React.FormEvent, provider: "google" | "github") => {
    e.preventDefault();
    if (!newEmail) return;

    const name = newName.trim() || newEmail.split("@")[0];
    const newAcc: AccountItem = {
      name,
      email: newEmail.trim(),
      avatarColor: provider === "google" ? "#34A853" : "#8957e5",
    };

    if (provider === "google") {
      setGoogleAccounts((prev) => [newAcc, ...prev]);
    } else {
      setGithubAccounts((prev) => [newAcc, ...prev]);
    }

    handleOAuthLogin(newAcc.email, newAcc.name, provider);
  };

  const actionText = mode === "login" ? "Sign in with" : "Sign up with";

  return (
    <>
      <div className="space-y-4">
        {/* Social Auth Buttons Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Google Login / Signup Button */}
          <button
            type="button"
            onClick={() => {
              setModalScreen("list");
              setNewEmail("");
              setNewName("");
              setActiveModal("google");
            }}
            className="relative flex items-center justify-center gap-2.5 rounded-xl border border-canvas-line bg-canvas-raised px-4 py-2.5 font-body text-xs font-medium text-text-primary transition-all duration-200 hover:border-[#FFB454]/50 hover:bg-canvas-line/30 hover:shadow-lg active:scale-95 group"
          >
            <GoogleIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span>{actionText} Google</span>
          </button>

          {/* GitHub Login / Signup Button */}
          <button
            type="button"
            onClick={() => {
              setModalScreen("list");
              setNewEmail("");
              setNewName("");
              setActiveModal("github");
            }}
            className="relative flex items-center justify-center gap-2.5 rounded-xl border border-canvas-line bg-canvas-raised px-4 py-2.5 font-body text-xs font-medium text-text-primary transition-all duration-200 hover:border-text-primary/40 hover:bg-canvas-line/30 hover:shadow-lg active:scale-95 group"
          >
            <GitHubIcon className="h-4 w-4 shrink-0 fill-current text-text-primary transition-transform duration-200 group-hover:scale-110" />
            <span>{actionText} GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-2">
          <div className="w-full border-t border-canvas-line/70" />
          <span className="absolute bg-canvas px-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Google OAuth Account Picker Modal (Matches Google One-Tap Design) */}
      <AnimatePresence>
        {activeModal === "google" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-[420px] rounded-3xl bg-[#1f1f1f] p-6 text-white shadow-2xl overflow-hidden border border-white/10"
            >
              {/* Google Scalloped Badge Header */}
              <div className="flex flex-col items-center text-center">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  {/* Decorative Outer Ring / Scallop effect */}
                  <div className="absolute inset-0 rounded-full bg-[#2a2a2a] border border-white/10 animate-pulse" />
                  <GoogleIcon className="relative z-10 h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-white">
                  Sign in to pulse.com with google.com
                </h3>
                <p className="mt-1 font-body text-xs text-gray-400">
                  Choose an account to continue
                </p>
              </div>

              {/* Screen 1: Account List */}
              {modalScreen === "list" ? (
                <>
                  <div className="mt-6 border-t border-white/10 divide-y divide-white/10 max-h-60 overflow-y-auto">
                    {googleAccounts.map((acc) => (
                      <button
                        key={acc.email}
                        disabled={isAuthenticating}
                        onClick={() => handleOAuthLogin(acc.email, acc.name, "google")}
                        className="flex w-full items-center justify-between py-3.5 px-2 text-left transition-colors hover:bg-white/5 disabled:opacity-50 group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Circular Avatar */}
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-body text-sm font-semibold shadow-md"
                            style={{ backgroundColor: acc.avatarColor || "#4285F4" }}
                          >
                            {acc.name[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-body text-sm font-medium text-white truncate">{acc.name}</p>
                            <p className="font-body text-xs text-gray-400 truncate">{acc.email}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                      </button>
                    ))}
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="mt-6 flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        setNewEmail("");
                        setNewName("");
                        setModalScreen("add");
                      }}
                      className="rounded-full border border-[#8ab4f8] px-5 py-2 font-body text-xs font-medium text-[#8ab4f8] transition-colors hover:bg-[#8ab4f8]/10 active:scale-95"
                    >
                      Use a different account
                    </button>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="rounded-full border border-[#8ab4f8] px-5 py-2 font-body text-xs font-medium text-[#8ab4f8] transition-colors hover:bg-[#8ab4f8]/10 active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                /* Screen 2: Add Custom Google Account Form */
                <form onSubmit={(e) => handleAddNewAccount(e, "google")} className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setModalScreen("list")}
                      className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <span className="font-body text-xs font-medium text-gray-300">
                      Add a new Google Account
                    </span>
                  </div>

                  <div>
                    <label className="block font-body text-xs text-gray-400 mb-1">Google Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@gmail.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full rounded-xl bg-[#2b2b2b] border border-white/10 px-4 py-2.5 font-body text-xs text-white outline-none focus:border-[#8ab4f8]"
                    />
                  </div>

                  <div>
                    <label className="block font-body text-xs text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Karan Parmar"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full rounded-xl bg-[#2b2b2b] border border-white/10 px-4 py-2.5 font-body text-xs text-white outline-none focus:border-[#8ab4f8]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalScreen("list")}
                      className="rounded-full border border-white/20 px-4 py-2 font-body text-xs text-gray-300 hover:bg-white/10"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isAuthenticating || !newEmail}
                      className="flex items-center gap-2 rounded-full bg-[#8ab4f8] px-5 py-2 font-body text-xs font-semibold text-[#1f1f1f] hover:brightness-110 active:scale-95 disabled:opacity-50"
                    >
                      {isAuthenticating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Add & Sign In
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GitHub OAuth Authorization Modal */}
      <AnimatePresence>
        {activeModal === "github" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-[420px] rounded-3xl bg-[#161b22] p-6 text-white shadow-2xl overflow-hidden border border-white/10"
            >
              {/* GitHub Scalloped Badge Header */}
              <div className="flex flex-col items-center text-center">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#21262d] border border-white/10 animate-pulse" />
                  <GitHubIcon className="relative z-10 h-7 w-7 fill-current text-white" />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-white">
                  Sign in to GitHub to continue to Pulse
                </h3>
                <p className="mt-1 font-body text-xs text-gray-400">
                  Choose a GitHub account to authorize
                </p>
              </div>

              {/* Screen 1: Account List */}
              {modalScreen === "list" ? (
                <>
                  <div className="mt-6 border-t border-white/10 divide-y divide-white/10 max-h-60 overflow-y-auto">
                    {githubAccounts.map((acc) => (
                      <button
                        key={acc.email}
                        disabled={isAuthenticating}
                        onClick={() => handleOAuthLogin(acc.email, acc.name, "github")}
                        className="flex w-full items-center justify-between py-3.5 px-2 text-left transition-colors hover:bg-white/5 disabled:opacity-50 group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-body text-sm font-semibold shadow-md"
                            style={{ backgroundColor: acc.avatarColor || "#2ea44f" }}
                          >
                            {acc.name[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-body text-sm font-medium text-white truncate">{acc.name}</p>
                            <p className="font-body text-xs text-gray-400 truncate">{acc.email}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                      </button>
                    ))}
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="mt-6 flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        setNewEmail("");
                        setNewName("");
                        setModalScreen("add");
                      }}
                      className="rounded-full border border-[#58a6ff] px-5 py-2 font-body text-xs font-medium text-[#58a6ff] transition-colors hover:bg-[#58a6ff]/10 active:scale-95"
                    >
                      Use a different account
                    </button>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="rounded-full border border-[#58a6ff] px-5 py-2 font-body text-xs font-medium text-[#58a6ff] transition-colors hover:bg-[#58a6ff]/10 active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                /* Screen 2: Add Custom GitHub Account Form */
                <form onSubmit={(e) => handleAddNewAccount(e, "github")} className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setModalScreen("list")}
                      className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <span className="font-body text-xs font-medium text-gray-300">
                      Add a new GitHub Account
                    </span>
                  </div>

                  <div>
                    <label className="block font-body text-xs text-gray-400 mb-1">GitHub Email / Handle</label>
                    <input
                      type="text"
                      required
                      placeholder="username or email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full rounded-xl bg-[#21262d] border border-white/10 px-4 py-2.5 font-body text-xs text-white outline-none focus:border-[#58a6ff]"
                    />
                  </div>

                  <div>
                    <label className="block font-body text-xs text-gray-400 mb-1">Display Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Karan Parmar"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full rounded-xl bg-[#21262d] border border-white/10 px-4 py-2.5 font-body text-xs text-white outline-none focus:border-[#58a6ff]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalScreen("list")}
                      className="rounded-full border border-white/20 px-4 py-2 font-body text-xs text-gray-300 hover:bg-white/10"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isAuthenticating || !newEmail}
                      className="flex items-center gap-2 rounded-full bg-[#2ea44f] px-5 py-2 font-body text-xs font-semibold text-white hover:brightness-110 active:scale-95 disabled:opacity-50"
                    >
                      {isAuthenticating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Add & Authorize
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}


