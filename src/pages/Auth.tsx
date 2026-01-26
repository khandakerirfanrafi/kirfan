import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Mail, Lock, User, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("সফলভাবে লগইন হয়েছে!");
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("একাউন্ট তৈরি হয়েছে!");
          navigate("/");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b-4 border-foreground bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-foreground flex items-center justify-center shadow-sm bg-primary text-primary-foreground">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tight">akta</h1>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Study Time Tracker
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="border-4 border-foreground bg-card shadow-lg p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-wide">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                {isLogin
                  ? "আপনার স্টাডি ট্র্যাকিং চালিয়ে যান"
                  : "ক্লাউডে আপনার ডেটা সেভ করুন"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="uppercase text-xs tracking-wide font-medium">
                    নাম
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="আপনার নাম"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10 border-2 h-12"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="uppercase text-xs tracking-wide font-medium">
                  ইমেইল
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 border-2 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="uppercase text-xs tracking-wide font-medium">
                  পাসওয়ার্ড
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 border-2 h-12"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-bold uppercase tracking-wide border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isLogin ? (
                  "লগইন"
                ) : (
                  "সাইন আপ"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                {isLogin
                  ? "একাউন্ট নেই? সাইন আপ করুন"
                  : "একাউন্ট আছে? লগইন করুন"}
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: "☁️", label: "ক্লাউড সিঙ্ক" },
              { icon: "📊", label: "পরিসংখ্যান" },
              { icon: "🔥", label: "স্ট্রিক" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="border-2 border-foreground p-3 bg-card shadow-xs"
              >
                <div className="text-2xl mb-1">{feature.icon}</div>
                <div className="text-xs uppercase tracking-wide font-medium">
                  {feature.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
