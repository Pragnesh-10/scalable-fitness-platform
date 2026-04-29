import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Eye,
  EyeOff,
  Zap,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const Card = ({ className, children, ...props }) => (
  <div className={cn("bg-[#030303]/80 backdrop-blur-xl text-white flex flex-col gap-6 rounded-[40px] border border-white/10 py-6 shadow-2xl shadow-black", className)} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className, children, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-10", className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
    {children}
  </h3>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={cn("p-10 pt-0", className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className, children, ...props }) => (
  <div className={cn("flex items-center p-10 pt-0", className)} {...props}>
    {children}
  </div>
);

const Input = ({ className, type, ...props }) => (
  <input 
    type={type} 
    className={cn(
      "flex h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm transition-all focus:outline-none focus:border-[#6C63FF]/50 placeholder:text-white/10 text-white font-space", 
      className
    )} 
    {...props} 
  />
);

const Label = ({ className, children, ...props }) => (
  <label className={cn("text-[10px] font-space font-bold text-white/40 uppercase tracking-widest ml-1", className)} {...props}>
    {children}
  </label>
);

export default function SignupForm({ onSubmit, isLoading, error: externalError }) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
    registrationKey: "",
    fitnessGoals: "general_fitness"
  });
  const [localError, setLocalError] = useState("");

  const nextStep = () => {
    if (step === 1 && (!form.firstName || !form.lastName || !form.email || !form.password)) {
      setLocalError("ALL CREDENTIALS REQUIRED FOR CLEARANCE");
      return;
    }
    if (step === 1 && form.password.length < 6) {
      setLocalError("ACCESS KEY MUST BE AT LEAST 6 CHARACTERS");
      return;
    }
    setLocalError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    try {
      await onSubmit({
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
        fitnessGoals: form.fitnessGoals,
        registrationKey: form.role === 'coach' ? form.registrationKey : undefined
      });
    } catch (err) {
      setLocalError(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 relative overflow-hidden bg-[#030303]">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#6C63FF] rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-secondary rounded-full blur-[120px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <Card className="glass-strong border-white/10 shadow-2xl rounded-[40px] overflow-hidden">
          <CardHeader className="pt-12 pb-8 px-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
              <motion.div 
                className="h-full bg-[#6C63FF]"
                initial={{ width: "50%" }}
                animate={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>
            
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center mb-8 shadow-lg shadow-[#6C63FF]/20"
            >
              <Zap className="w-8 h-8 text-white" fill="currentColor" />
            </motion.div>
            <CardTitle className="text-3xl font-space font-black uppercase tracking-tighter text-white px-1">
              MISSION <span className="text-secondary italic">ENROLLMENT</span>
            </CardTitle>
            <p className="text-white/40 font-lexend text-[10px] uppercase font-bold tracking-[0.4em] mt-3">
              Phase {step} of 2: {step === 1 ? 'Credentials' : 'Optimization'}
            </p>
          </CardHeader>

          <CardContent className="px-10 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>GIVEN NAME</Label>
                        <Input 
                          placeholder="FIRST"
                          value={form.firstName}
                          onChange={(e) => setForm({...form, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SURNAME</Label>
                        <Input 
                          placeholder="LAST"
                          value={form.lastName}
                          onChange={(e) => setForm({...form, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>COMM-LINK EMAIL</Label>
                      <Input 
                        type="email"
                        placeholder="EMAIL@PROTOCOL.COM"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>ACCESS KEY</Label>
                      <div className="relative group">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          className="pr-12" 
                          placeholder="••••••••"
                          value={form.password}
                          onChange={(e) => setForm({...form, password: e.target.value})}
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-white text-black font-space font-black py-5 rounded-2xl shadow-xl hover:bg-[#6C63FF] hover:text-white transition-all uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 group"
                    >
                      PROCEED TO BIO-TARGETS
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <Label>OPERATIONAL ROLE</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {['user', 'coach'].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setForm({...form, role: r})}
                            className={cn(
                              "py-4 rounded-2xl font-space font-bold text-[10px] uppercase tracking-widest border transition-all",
                              form.role === r 
                                ? "bg-[#6C63FF] text-white border-[#6C63FF] shadow-lg shadow-[#6C63FF]/20" 
                                : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
                            )}
                          >
                            {r === 'user' ? 'ATHLETE' : 'COMMANDER'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence>
                      {form.role === 'coach' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <Label className="text-secondary">VERIFICATION KEY</Label>
                          <Input 
                            className="border-secondary/30" 
                            placeholder="INVITE-X-000"
                            value={form.registrationKey}
                            onChange={(e) => setForm({...form, registrationKey: e.target.value})}
                            required
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      <Label>PRIMARY OBJECTIVE</Label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 text-white h-14 rounded-2xl px-4 font-lexend text-sm outline-none focus:border-[#6C63FF]/50 appearance-none"
                        value={form.fitnessGoals}
                        onChange={(e) => setForm({...form, fitnessGoals: e.target.value})}
                      >
                        <option value="general_fitness" className="bg-[#030303]">GENERAL PERFORMANCE</option>
                        <option value="weight_loss" className="bg-[#030303]">FAT OXIDATION</option>
                        <option value="muscle_gain" className="bg-[#030303]">HYPERTROPHY</option>
                        <option value="endurance" className="bg-[#030303]">STAMINA OPTIMIZATION</option>
                      </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className="flex-1 bg-[#6C63FF] text-white font-space font-black py-5 rounded-2xl shadow-xl shadow-[#6C63FF]/20 hover:bg-[#5a52e0] transition-all uppercase tracking-[0.2em] text-[11px] disabled:opacity-50"
                      >
                        {isLoading ? 'ENROLLING...' : 'INITIALIZE PROTOCOL'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <AnimatePresence>
              {(localError || externalError) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3"
                >
                  <Activity className="w-4 h-4 text-rose-500 shrink-0" />
                  <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide">
                    {localError || externalError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="px-10 pb-12 pt-0 flex justify-center border-t border-white/5 pt-10">
            <p className="text-[10px] font-space font-bold text-white/20 uppercase tracking-[0.2em]">
              ALREADY REGISTERED?{" "}
              <Link to="/login" className="text-[#6C63FF] hover:text-white transition-colors underline underline-offset-4 ml-2">
                RESTORE SESSION
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
