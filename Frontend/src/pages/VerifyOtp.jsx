import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { ShieldCheck, Loader2, RefreshCw } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const { verifyOtp, resendOtp, isResentingOtp } = useAuthStore()
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsVerifying(true);
      const finalOtp = otp.join("");
      console.log("Verifying OTP:", finalOtp);
      await verifyOtp({ otp: finalOtp })
    } catch (error) {
      console.log(error)
    }finally{
      setIsVerifying(false)
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 mt-10">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ShieldCheck className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Verify Code</h1>
              <p className="text-base-content/60">We sent a 6-digit code to your email.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg bg-base-200 border-base-300 focus:border-primary focus:outline-none transition-all"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isVerifying}>
              {isVerifying ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Account"}
            </button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-base-content/60 text-sm">
              Didn't receive the code?{" "}
              <button className="link link-primary font-medium flex items-center gap-2 mx-auto mt-2" disabled={isResentingOtp} onClick={(e) => {
                e.preventDefault();
                resendOtp()
              }}>
                <RefreshCw className={`size-4 ${isResentingOtp && 'animate-spin'}`} /> Resend Code
              </button>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title={"One Step Away"}
        subtitle={"Verify your identity to ensure your account stays protected from unauthorized access."}
      />
    </div>
  );
};

export default VerifyOTP;