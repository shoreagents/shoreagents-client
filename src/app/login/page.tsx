"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { WorldMap } from "@/components/ui/world-map";
import { motion } from "motion/react";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  // Load saved credentials on component mount
  useEffect(() => {
    const savedRememberMe = localStorage.getItem('rememberMe')
    if (savedRememberMe === 'true') {
      setRememberMe(true)
      // Load saved email
      const savedEmail = localStorage.getItem('savedEmail')
      if (savedEmail) setEmail(savedEmail)
      // Load saved password
      const savedPassword = localStorage.getItem('savedPassword')
      if (savedPassword) {
        try {
          const decryptedPassword = atob(savedPassword) // Decode base64
          setPassword(decryptedPassword)
        } catch (error) {
          console.warn('Failed to load saved password:', error)
          localStorage.removeItem('savedPassword')
        }
      }
    }
  }, [])

  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false)
  
  // Track which testimonial cards should be visible based on path completion
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false, false])
  // Track which cards have finished their blur animation
  const [cardBlurDone, setCardBlurDone] = useState<boolean[]>([false, false, false, false])

  // Function to convert lat/lng to CSS position with improved accuracy
  const projectPoint = (lat: number, lng: number) => {
    // Normalize longitude to 0-360 range
    const normalizedLng = ((lng + 180) % 360 + 360) % 360
    
    // Convert to percentage with better precision
    const x = (normalizedLng / 360) * 100
    
    // Convert latitude with better precision and account for map aspect ratio
    const y = ((90 - lat) / 180) * 100
    
    return { x, y }
  }

  // Static testimonial card positions
  const testimonialOffsets = {
    sanFrancisco: { x: -120, y: 130 },
    canada: { x: -120, y: 20 },
    australia: { x: -270, y: -200 },
    newZealand: { x: -240, y: -30 }
  };

  // Animation classes for subtle movement
  const animationClasses = [
    'animate-[float_6s_ease-in-out_infinite]',
    'animate-[floatGentle_7s_ease-in-out_infinite]',
    'animate-[floatWave_8s_ease-out_infinite]',
    'animate-[floatSlow_7s_ease-in-out_infinite]'
  ];

  // Handle path completion to show corresponding testimonial card
  const handlePathComplete = (index: number) => {
    setVisibleCards(prev => {
      const newCards = [...prev];
      newCards[index] = true;
      return newCards;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const { error } = await login(email, password, rememberMe)
      if (error) {
        // Check if it's a client access error
        if (error.message?.includes('Access denied') || error.message?.includes('Only clients can log in')) {
          toast.error("Access denied. Only clients can log in to this application.")
        } else {
          toast.error(error.message || "Invalid email or password")
        }
        setIsSubmitting(false)
      } else {
        // Keep loading state during redirect
        router.push("/")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      setIsSubmitting(false)
    }
  }

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsForgotSubmitting(true)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("If this email exists, a reset link has been sent.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsForgotSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - World Map */}
      <div className="hidden lg:flex lg:w-[63%] bg-[rgb(8,8,8)] flex-col justify-between p-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-semibold text-white">Analytics Inc</span>
        </div>
        
        <div className="flex-1 flex items-center justify-center px-4 relative">
          <div className="w-full">
            <WorldMap 
              dots={useMemo(() => [
                {
                  start: { lat: -1, lng: 121.7740, label: "Philippines" },
                  end: { lat: 37.7749, lng: -122.4194, label: "San Francisco" }
                },
                {
                  start: { lat: -1, lng: 121.774, label: "Philippines" },
                  end: { lat: 55.6532, lng: -110.3832, label: "Toronto" }
                },
                {
                  start: { lat: -1, lng: 121.774, label: "Philippines" },
                  end: { lat: -45.2744, lng: 125.7751, label: "Australia" }
                },
                {
                  start: { lat: -1, lng: 121.774, label: "Philippines" },
                  end: { lat: -60.9006, lng: 174.8860, label: "New Zealand" }
                },

              ], [])}
              lineColor="#FFFFFF"
              onPathComplete={handlePathComplete}
            />
            
            {/* Static Testimonials */}
            <div className="absolute inset-0 pointer-events-none">
              {/* San Francisco Connection */}
              <motion.div
                className="absolute"
                style={{ 
                  top: `calc(${projectPoint(37.7749, -122.4194).y}% + ${testimonialOffsets.sanFrancisco.y}px)`, 
                  left: `calc(${projectPoint(37.7749, -122.4194).x}% + ${testimonialOffsets.sanFrancisco.x}px)`
                }}
                initial={{ 
                }}
                animate={{ 
                  y: visibleCards[0] ? [0, -3, 2, -1, 0] : 0,
                  x: visibleCards[0] ? [0, 1, -1, 0] : 0
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  y: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  x: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                onAnimationComplete={() => setCardBlurDone(prev => { const arr = [...prev]; arr[0] = true; return arr; })}
              >
                <div
                  className="testimonial-card bg-white/5 backdrop-blur-sm border border-white/30 rounded-lg p-2 w-[260px] flex flex-col justify-center text-white"
                >
                  <p className="text-[11px] font-medium">"We've used multiple Outsourcing companies and ShoreAgents has surpassed our expectations by far."</p>
                  <div className="flex items-center mt-2">
                    <div className="w-6 h-6 min-w-6 min-h-6 rounded-full mr-2 flex-shrink-0 overflow-hidden">
                      <img 
                        src="/images/testimonials/Kuahiwi-Kahapea.webp" 
                        alt="Kuahiwi Kahapea" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-300 font-semibold">Kuahiwi Kahapea</p>
                      <p className="text-[9px] text-gray-400 -mt-0.5">Ballast, United States</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* Canada Connection */}
              <motion.div
                className="absolute"
                style={{ 
                  top: `calc(${projectPoint(55.6532, -110.3832).y}% + ${testimonialOffsets.canada.y}px)`, 
                  left: `calc(${projectPoint(55.6532, -110.3832).x}% + ${testimonialOffsets.canada.x}px)`
                }}
                initial={{ 
                }}
                animate={{ 
                  y: visibleCards[1] ? [0, -2, 1, -3, 0] : 0,
                  x: visibleCards[1] ? [0, -1, 2, -1, 0] : 0
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  y: {
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  x: {
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                onAnimationComplete={() => setCardBlurDone(prev => { const arr = [...prev]; arr[1] = true; return arr; })}
              >
                <div
                  className="testimonial-card bg-white/5 backdrop-blur-sm border border-white/30 rounded-lg p-2 w-[260px] flex flex-col justify-center text-white"
                >
                  <p className="text-[11px] font-medium">"Their systems and real estate industry experience set them apart from the rest. Plus recent advances in new technology and AI make things even better."</p>
                  <div className="flex items-center mt-2">
                    <div className="w-6 h-6 min-w-6 min-h-6 rounded-full mr-2 flex-shrink-0 overflow-hidden">
                      <img 
                        src="/images/testimonials/Ray-Wood.webp" 
                        alt="Ray Wood" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-300 font-semibold">Ray Wood</p>
                      <p className="text-[9px] text-gray-400 -mt-0.5">Bestagents Group, Canada</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* Australia Connection */}
              <motion.div
                className="absolute"
                style={{ 
                  top: `calc(${projectPoint(-45.2744, 120.7751).y}% + ${testimonialOffsets.australia.y}px)`, 
                  left: `calc(${projectPoint(-45.2744, 120.7751).x}% + ${testimonialOffsets.australia.x}px)`
                }}
                initial={{ 
                }}
                animate={{ 
                  y: visibleCards[2] ? [0, -4, 1, -2, 0] : 0,
                  x: visibleCards[2] ? [0, 2, -1, 1, 0] : 0
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  y: {
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeOut"
                  },
                  x: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                onAnimationComplete={() => setCardBlurDone(prev => { const arr = [...prev]; arr[2] = true; return arr; })}
              >
                <div
                  className="testimonial-card bg-white/5 backdrop-blur-sm border border-white/30 rounded-lg p-2 w-[260px] flex flex-col justify-center text-white"
                >
                  <p className="text-[11px] font-medium">"Outsourcing really allowed me to streamline what I do, particularly with my back office out of things which takes a lot of time off me, and allows me to focus on the role that I need."</p>
                  <div className="flex items-center mt-2">
                    <div className="w-6 h-6 min-w-6 min-h-6 rounded-full mr-2 flex-shrink-0 overflow-hidden">
                      <img 
                        src="/images/testimonials/Jason-Gard.webp" 
                        alt="Jason Gard" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-300 font-semibold">Jason Gard</p>
                      <p className="text-[9px] text-gray-400 -mt-0.5">Jason Gard Real Estate, Australia</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* New Zealand Connection */}
              <motion.div
                className="absolute"
                style={{ 
                  top: `calc(${projectPoint(-40.9006, 174.8860).y}% + ${testimonialOffsets.newZealand.y}px)`, 
                  left: `calc(${projectPoint(-40.9006, 174.8860).x}% + ${testimonialOffsets.newZealand.x}px)`
                }}
                initial={{ 
                }}
                animate={{ 
                  y: visibleCards[3] ? [0, -1, 3, -2, 0] : 0,
                  x: visibleCards[3] ? [0, -2, 1, -1, 0] : 0
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  y: {
                    duration: 11,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  x: {
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                onAnimationComplete={() => setCardBlurDone(prev => { const arr = [...prev]; arr[3] = true; return arr; })}
              >
                <div
                  className="testimonial-card bg-white/5 backdrop-blur-sm border border-white/30 rounded-lg p-2 w-[260px] flex flex-col justify-center text-white"
                >
                  <p className="text-[11px] font-medium">"We are extremely happy with the service and will be using them for other companies in our network."</p>
                  <div className="flex items-center mt-2">
                    <div className="w-6 h-6 min-w-6 min-h-6 rounded-full mr-2 flex-shrink-0 overflow-hidden">
                      <img 
                        src="/images/testimonials/Pernell-Callaghan.webp" 
                        alt="Pernell Callaghan" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-300 font-semibold">Pernell Callaghan</p>
                      <p className="text-[9px] text-gray-400 -mt-0.5">Arizto Real Estate, New Zealand</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        

      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">


          <div className="text-center mb-8">
            {!showForgot ? (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
                <p className="text-gray-600">Enter your email below to sign in to your account.</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h1>
                <p className="text-gray-600">Enter your email to receive a password reset link.</p>
              </>
            )}
          </div>

          {!showForgot ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-gray-600">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 underline"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot your password?
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isForgotSubmitting}>
                  {isForgotSubmitting ? "Sending..." : "Send reset link"}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-gray-600">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 underline"
                  onClick={() => setShowForgot(false)}
                >
                  Back to login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}