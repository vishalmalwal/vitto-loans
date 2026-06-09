import React, { useState, FocusEvent } from "react";
import { Coins, CheckCircle, ArrowRight, RefreshCcw, Loader2, HelpCircle } from "lucide-react";
import { useApplications } from "../hooks/useApplications.ts";

export default function ApplyPage() {
  const { submitApplication } = useApplications();
  
  // Submission process states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amountInput, setAmountInput] = useState(""); // Holds string value, formats on blur
  const [purpose, setPurpose] = useState("");
  const [language, setLanguage] = useState<"Hindi" | "Tamil" | "Telugu" | "Marathi" | "English" | "">("");

  // Error States
  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    amount: "",
    purpose: "",
    language: "",
  });

  // Shaking animations mapping (trigger shake per field on error detection)
  const [shakeFields, setShakeFields] = useState({
    name: false,
    mobile: false,
    amount: false,
    purpose: false,
    language: false,
  });

  // Helper trigger for field shake
  const triggerShake = (fieldName: keyof typeof shakeFields) => {
    setShakeFields((prev) => ({ ...prev, [fieldName]: true }));
    setTimeout(() => {
      setShakeFields((prev) => ({ ...prev, [fieldName]: false }));
    }, 500);
  };

  // Convert Indian formatted string back to primitive float
  const getNumericAmount = (str: string): number => {
    return parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
  };

  // 1. Validation Logic: Name (min 2 chars)
  const validateName = (val: string): boolean => {
    if (!val || val.trim().length < 2) {
      setErrors((prev) => ({ ...prev, name: "Full name must be at least 2 characters." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, name: "" }));
    return true;
  };

  // 2. Validation Logic: Mobile (10 digits)
  const validateMobile = (val: string): boolean => {
    if (!val || !/^\d{10}$/.test(val)) {
      setErrors((prev) => ({ ...prev, mobile: "Mobile number must be exactly 10 digits." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, mobile: "" }));
    return true;
  };

  // 3. Validation Logic: Amount (min 1000)
  const validateAmount = (val: string): boolean => {
    const rawNum = getNumericAmount(val);
    if (!val || isNaN(rawNum) || rawNum < 1000) {
      setErrors((prev) => ({ ...prev, amount: "Amount must be at least ₹1,000." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, amount: "" }));
    return true;
  };

  // 4. Validation Logic: Purpose (min 10 chars)
  const validatePurpose = (val: string): boolean => {
    if (!val || val.trim().length < 10) {
      setErrors((prev) => ({ ...prev, purpose: "Purpose must describe at least 10 characters." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, purpose: "" }));
    return true;
  };

  // 5. Validation Logic: Language (non-empty select)
  const validateLanguage = (val: string): boolean => {
    if (!val) {
      setErrors((prev) => ({ ...prev, language: "Please choose a preferred language." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, language: "" }));
    return true;
  };

  // Format currency on blur (e.g. 100000 -> ₹1,00,000)
  const handleAmountBlur = () => {
    const rawVal = getNumericAmount(amountInput);
    if (!isNaN(rawVal) && rawVal > 0) {
      setAmountInput(`₹${rawVal.toLocaleString("en-IN")}`);
    }
    validateAmount(amountInput);
  };

  // Format currency on focus (reveal pure numeric digits for easy edit)
  const handleAmountFocus = () => {
    const rawVal = getNumericAmount(amountInput);
    if (rawVal > 0) {
      setAmountInput(rawVal.toString());
    }
  };

  // Real-time blur validation dispatcher
  const handleBlur = (field: "name" | "mobile" | "amount" | "purpose" | "language") => {
    let isValid = true;
    switch (field) {
      case "name":
        isValid = validateName(name);
        break;
      case "mobile":
        isValid = validateMobile(mobile);
        break;
      case "amount":
        isValid = validateAmount(amountInput);
        break;
      case "purpose":
        isValid = validatePurpose(purpose);
        break;
      case "language":
        isValid = validateLanguage(language);
        break;
    }
    if (!isValid) {
      triggerShake(field);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dispatch checks on submit
    const isNameValid = validateName(name);
    const isMobileValid = validateMobile(mobile);
    const isAmountValid = validateAmount(amountInput);
    const isPurposeValid = validatePurpose(purpose);
    const isLangValid = validateLanguage(language);

    if (!isNameValid) triggerShake("name");
    if (!isMobileValid) triggerShake("mobile");
    if (!isAmountValid) triggerShake("amount");
    if (!isPurposeValid) triggerShake("purpose");
    if (!isLangValid) triggerShake("language");

    if (!isNameValid || !isMobileValid || !isAmountValid || !isPurposeValid || !isLangValid) {
      return;
    }

    setIsSubmitting(true);

    const data = {
      name: name.trim(),
      mobile: mobile.trim(),
      amount: getNumericAmount(amountInput),
      purpose: purpose.trim(),
      language: language as "Hindi" | "Tamil" | "Telugu" | "Marathi" | "English",
    };

    const result = await submitApplication(data);
    
    setIsSubmitting(false);

    if (result.success && result.data) {
      setSubmittedAppId(result.data.id);
    } else {
      // API error fallback
      alert(result.error || "An unexpected error occurred. Please try again.");
    }
  };

  // Reset form to submit another application
  const resetForm = () => {
    setName("");
    setMobile("");
    setAmountInput("");
    setPurpose("");
    setLanguage("");
    setSubmittedAppId(null);
    setErrors({
      name: "",
      mobile: "",
      amount: "",
      purpose: "",
      language: "",
    });
  };

  // Check form validity for disabled state helper
  const formIsInvalid = 
    !name || !mobile || !amountInput || !purpose || !language ||
    !!errors.name || !!errors.mobile || !!errors.amount || !!errors.purpose || !!errors.language;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4 py-8">
      
      {!submittedAppId ? (
        
        /* FORM VIEW CONTAINER */
        <div className="w-full max-w-[520px] glass-card p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-500/10 bg-white/70 dark:bg-slate-950/70 text-slate-900 dark:text-white transition-all">
          <div className="text-center mb-6 sm:mb-8 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 bg-clip-text text-transparent">
              Apply for a Loan
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
              Quick, simple, and transparent financing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {/* NAME FIELD */}
            <div className={`space-y-1.5 ${shakeFields.name ? "animate-shake" : ""}`}>
              <label htmlFor="name-input" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Full Name
              </label>
              <input
                id="name-input"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) validateName(e.target.value);
                }}
                onBlur={() => handleBlur("name")}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-indigo-500/15 bg-white dark:bg-slate-900/60 font-semibold text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 glow-input"
              />
              {errors.name && <p className="text-[11px] font-semibold text-rose-500">{errors.name}</p>}
            </div>

            {/* MOBILE FIELD */}
            <div className={`space-y-1.5 ${shakeFields.mobile ? "animate-shake" : ""}`}>
              <label htmlFor="mobile-input" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Mobile Number
              </label>
              <input
                id="mobile-input"
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                value={mobile}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, "");
                  setMobile(cleaned);
                  if (errors.mobile) validateMobile(cleaned);
                }}
                onBlur={() => handleBlur("mobile")}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-indigo-500/15 bg-white dark:bg-slate-900/60 font-semibold text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 glow-input"
              />
              {errors.mobile && <p className="text-[11px] font-semibold text-rose-500">{errors.mobile}</p>}
            </div>

            {/* LOAN AMOUNT */}
            <div className={`space-y-1.5 ${shakeFields.amount ? "animate-shake" : ""}`}>
              <label htmlFor="amount-input" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Loan Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-sm">₹</span>
                <input
                  id="amount-input"
                  type="text"
                  placeholder="1,00,000"
                  value={amountInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAmountInput(val);
                    if (errors.amount) validateAmount(val);
                  }}
                  onFocus={handleAmountFocus}
                  onBlur={handleAmountBlur}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 dark:border-indigo-500/15 bg-white dark:bg-slate-900/60 font-extrabold text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 glow-input font-mono"
                />
              </div>
              {errors.amount && <p className="text-[11px] font-semibold text-rose-500">{errors.amount}</p>}
            </div>

            {/* PURPOSE OF LOAN */}
            <div className={`space-y-1.5 ${shakeFields.purpose ? "animate-shake" : ""}`}>
              <label htmlFor="purpose-input" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Loan Purpose
              </label>
              <textarea
                id="purpose-input"
                placeholder="Please describe why you are borrowing (minimum 10 characters)..."
                rows={3}
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  if (errors.purpose) validatePurpose(e.target.value);
                }}
                onBlur={() => handleBlur("purpose")}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-indigo-500/15 bg-white dark:bg-slate-900/60 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 glow-input font-medium leading-relaxed resize-none"
              />
              {errors.purpose && <p className="text-[11px] font-semibold text-rose-500">{errors.purpose}</p>}
            </div>

            {/* PREFERRED LANGUAGE REPRESENTATION */}
            <div className={`space-y-1.5 ${shakeFields.language ? "animate-shake" : ""}`}>
              <label htmlFor="language-select" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Preferred Language
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => {
                  const val = e.target.value as "Hindi" | "Tamil" | "Telugu" | "Marathi" | "English" | "";
                  setLanguage(val);
                  if (errors.language) validateLanguage(val);
                }}
                onBlur={() => handleBlur("language")}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-indigo-500/15 bg-white dark:bg-slate-900/60 font-semibold text-sm glow-input text-slate-900 dark:text-white"
              >
                <option value="" className="text-slate-400 bg-white dark:bg-slate-900">-- Choose Language --</option>
                <option value="Hindi" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">Hindi</option>
                <option value="Tamil" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">Tamil</option>
                <option value="Telugu" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">Telugu</option>
                <option value="Marathi" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">Marathi</option>
                <option value="English" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">English</option>
              </select>
              {errors.language && <p className="text-[11px] font-semibold text-rose-500">{errors.language}</p>}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              id="apply-submit-btn"
              type="submit"
              disabled={formIsInvalid || isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 mt-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 hover:scale-[1.01] hover:brightness-[1.05] disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none transition-all shadow-lg shadow-indigo-500/10 cursor-pointer shine-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Loan...
                </>
              ) : (
                <>
                  Submit Loan Application
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        </div>
      ) : (
        
        /* SUCCESS SCREEN CARD */
        <div className="w-full max-w-[480px] glass-card p-8 rounded-3xl text-center border border-indigo-500/10 bg-white/70 dark:bg-slate-950/70 text-slate-900 dark:text-white space-y-6 shadow-2xl animate-fade-in">
          
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-extrabold tracking-tight">Application Submitted!</h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
              We received your loan request. Your reference ID is listed below.
            </p>
          </div>

          {/* Reference code badge */}
          <div className="p-4 bg-indigo-500/5 dark:bg-white/5 border border-indigo-500/10 dark:border-white/5 rounded-2xl">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Reference Reference Code</span>
            <span className="inline-block mt-1 px-4 py-1.5 text-xs sm:text-sm font-bold font-mono tracking-widest bg-gradient-to-r from-indigo-500/15 to-violet-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-lg">
              Ref: {submittedAppId.substring(0, 8).toUpperCase()}
            </span>
          </div>

          {/* Button Submit Another */}
          <button
            onClick={resetForm}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold border border-indigo-500/20 hover:bg-indigo-500/5 dark:hover:bg-white/5 active:scale-95 transition-all text-indigo-600 dark:text-indigo-300 font-sans cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" />
            Submit Another Application
          </button>

        </div>
      )}
    </div>
  );
}
