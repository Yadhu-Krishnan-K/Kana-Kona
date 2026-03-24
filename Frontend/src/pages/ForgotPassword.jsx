import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add your password reset logic here via your AuthStore
    console.log("Reset requested for:", email);
    setTimeout(() => setIsSubmitting(false), 2000); // Mock delay
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 mt-10">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <KeyRound className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Forgot Password?</h1>
              <p className="text-base-content/60">No worries, we'll send you reset instructions.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 focus:border-primary transition-all"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
            </button>
          </form>

          <div className="text-center">
            <Link to="/login" className="link link-primary inline-flex items-center gap-2 text-sm">
              <ArrowLeft className="size-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title={"Secure Your Account"}
        subtitle={"Advanced encryption keeps your recovery process private and safe."}
      />
    </div>
  );
};

export default ForgotPassword;