import { useEffect, useState,useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


import { useTranslation } from "react-i18next";

import axios from 'axios';
import {
  LayoutDashboard, Languages, Mic, Camera, Route, History,
  BadgePercent, Settings, Bell, Search, User, Menu, X, Plus,
  Calendar, Compass, DollarSign, Users, Sparkles, Building,
  Utensils, Train, Lightbulb, Check, ChevronDown, Trash2,
  ArrowRight, ArrowLeft, Volume2, ShieldAlert, Download, CreditCard,
  LogOut, Star, TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Kyoto offline map download complete", time: "5 mins ago", read: false },
    { id: 2, text: "AI Travel Assistant has updated your itinerary", time: "1 hour ago", read: false },
    { id: 3, text: "Welcome to TravelBridge Premium!", time: "1 day ago", read: true }
  ]);

  // Trip planner states
  const [destination, setDestination] = useState('Kyoto, Japan');
  const [startDate, setStartDate] = useState('2026-07-10');
  const [endDate, setEndDate] = useState('2026-07-13');
  const [budgetTier, setBudgetTier] = useState('mid');
  const [travelersCount, setTravelersCount] = useState(2);
  const [selectedInterests, setSelectedInterests] = useState(['culture', 'food', 'nature']);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [activeDay, setActiveDay] = useState(1);

  // Translation states inside dashboard
  const [transInput, setTransInput] = useState('Hello, could you help me find the nearest restaurant?');
  const [transOutput, setTransOutput] = useState('こんにちは、一番近いレストランを探すのを手伝っていただけますか？ (Konnichiwa, ichiban chikai resutoran o sagasu no o tetsudatte itadakemasu ka?)');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ja');
  const [isTranslating, setIsTranslating] = useState(false);

  // // Simulated voice states
  // const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  // const [voiceResult, setVoiceResult] = useState('');

  // Settings states
  const [profileName, setProfileName] = useState(user?.fullname || 'Traveler');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'traveler@travelbridge.com');
  const [profileLang, setProfileLang] = useState('English');

  const unreadCount = notifications.filter(n => !n.read).length;
   
//   const { t, i18n } = useTranslation();
//   const handleProfile = async () => {
//     try {

//         localStorage.setItem("language", profileLang);

//         await axios.put(
//             "http://localhost:8000/api/auth/user_setting",
//             {
//                 language: profileLang
//             }
//         );

//         i18n.changeLanguage(profileLang);

//     } catch (err) {
//         console.log(err);
//     }
// };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

// const handleStartVoice = () => {
//     setIsVoiceRecording(true);
//     setVoiceResult('Listening...');
//     setTimeout(() => {
//       setVoiceResult('Captured: "How much is this ticket?"');
//       setTimeout(() => {
//         setVoiceResult('Translated (Spanish): "¿Cuánto cuesta este boleto?" 🔊');
//         setIsVoiceRecording(false);
//       }, 1000);
//     }, 1500);
//   };

  const handleToggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const startAIGeneration = (e) => {
    e.preventDefault();
    if (!destination.trim()) return;
    setIsGenerating(true);
    setGenerationStep(0);
    setShowResults(false);
  };

  // Simulated AI generation steps
  useEffect(() => {
    if (!isGenerating) return;

    const timer = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev >= 3) {
          clearInterval(timer);
          setTimeout(() => {
            setIsGenerating(false);
            setShowResults(true);
          }, 800);
          return 3;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [isGenerating]);

  // handle text translation

const [inputText, setInputText] = useState("");
const [translatedText, setTranslatedText] = useState("");
const [sourceLanguagetext, setSourceLanguagetext] = useState("en");
const [targetLanguagetext, setTargetLanguagetext] = useState("ja ");

  const handletextTranslate = async(e) => {
    if (!transInput.trim()) return;
    // setIsTranslating(true);
    // setTimeout(() => {
    //   // if (sourceLang === 'en' && targetLang === 'ja') {
    //   //   if (transInput.toLowerCase().includes('restaurant')) {
    //   //     setTransOutput('こんにちは、一番近いレストランを探すのを手伝っていただけますか？ (Konnichiwa, ichiban chikai resutoran o sagasu no o tetsudatte itadakemasu ka?)');
    //   //   } else {
    //   //     setTransOutput('翻訳が完了しました (Hon\'yaku ga kanryou shimashita)');
    //   //   }
    //   // } else {
    //   //   setTransOutput('Traduction réussie! (Translation complete!)');
    //   // }
    //   // setIsTranslating(false);
    // }, 500);

    

try{
    const res= await axios.post("http://localhost:8000/api/text/uplaod-text",{
            text: inputText,
         sourceLanguagetext,
         targetLanguagetext
    }
    )

    console.log("inputText:", inputText);
console.log("sourceLanguagetext:", sourceLanguagetext);
console.log("targetLanguagetext:", targetLanguagetext);
    setTranslatedText(res.data.translated)

  }catch (error) {
    console.error(error);
  }

  };

  const handleStartVoice = () => {
    setIsVoiceRecording(true);
    setVoiceResult('Listening...');
    setTimeout(() => {
      setVoiceResult('Captured: "How much is this ticket?"');
      setTimeout(() => {
        setVoiceResult('Translated (Spanish): "¿Cuánto cuesta este boleto?" 🔊');
        setIsVoiceRecording(false);
      }, 1000);
    }, 1500);
  };

  const mockGeneratedItinerary = {
    destination: destination,
    days: {
      1: {
        title: 'Arrival & Ancient Traditions',
        activities: [
          { time: '10:00 AM', title: 'Check-in & Tea Ceremony', desc: 'Settle into your hotel and enjoy a peaceful machiya tea house welcome.', location: 'Gion', cost: '$15', type: 'culture' },
          { time: '01:30 PM', title: 'Kiyomizu-dera exploration', desc: 'Visit the historic wooden temple built without a single nail. Enjoy hillside panoramas.', location: 'Higashiyama', cost: '$4', type: 'nature' },
          { time: '06:00 PM', title: 'Authentic Kaiseki Dinner', desc: 'Feast on a multi-course seasonal Japanese dining experience.', location: 'Pontocho Alley', cost: '$60', type: 'food' }
        ]
      },
      2: {
        title: 'Bamboo Forests & Scenic Rivers',
        activities: [
          { time: '08:30 AM', title: 'Arashiyama Bamboo Grove Walk', desc: 'Beat the crowds and hike through the towering jade bamboo stalks.', location: 'Arashiyama', cost: '$0', type: 'nature' },
          { time: '11:30 AM', title: 'Tenryu-ji Temple Zen Gardens', desc: 'Walk around the pond which has remained in its original 14th-century layout.', location: 'Arashiyama', cost: '$5', type: 'culture' },
          { time: '02:00 PM', title: 'Stray Monkey Feeding Park', desc: 'Trek up to Iwatayama Monkey Park to feed wild Japanese macaques.', location: 'Arashiyama', cost: '$4', type: 'adventure' }
        ]
      },
      3: {
        title: 'Shinto Shrine Torii Trails',
        activities: [
          { time: '07:30 AM', title: 'Fushimi Inari Shrine Torii gates hike', desc: 'Hike under the thousands of vibrant orange gates leading up Mt. Inari.', location: 'Fushimi', cost: '$0', type: 'culture' },
          { time: '12:00 PM', title: 'Nishiki Market Culinary Feast', desc: 'Stroll the narrow market corridor sampling skewers, local sweets, and seafood.', location: 'Central Kyoto', cost: '$25', type: 'food' },
          { time: '03:30 PM', title: 'Nijo Shogun Castle Tour', desc: 'Listen to squeaking nightingale floorboards built to warn guards of ninjas.', location: 'Central Kyoto', cost: '$8', type: 'culture' }
        ]
      }
    },
    hotels: [
      { name: 'Hotel The Mitsui Kyoto', rating: 4.9, price: '$420/night', location: 'Central Kyoto', desc: 'Luxury garden resort near Nijo Castle featuring private thermal springs.', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=300' },
      { name: 'Sora Niwa Terrace Ryokan', rating: 4.7, price: '$240/night', location: 'Gion District', desc: 'Traditional inn with open-air rooftop hot bath overlooking Kamogawa River.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300' }
    ],
    foods: [
      { dish: 'Yofu Kaiseki (Seasonal Course)', shop: 'Gion Karyo', desc: 'Elegant traditional multi-course meal illustrating Kyoto seasonal aesthetics.' },
      { dish: 'Tonkotsu Ramen Bowl', shop: 'Gion Ramen DX', desc: 'Savory, rich pork broth noodles served at a local wooden counter shop.' }
    ],
    transit: [
      { mode: 'JR Kansai Area Pass', desc: 'Best option for express lines connecting Kyoto, Osaka, Nara, and Kobe.' },
      { mode: 'ICOCA Card', desc: 'Smart-card transit pass for local buses, subway rails, and convenience stores.' }
    ],
    tips: [
      { icon: <Check className="w-4 h-4 text-emerald-400" />, text: 'Carry cash: many traditional temples and street food vendors do not accept credit cards.' },
      { icon: <Check className="w-4 h-4 text-emerald-400" />, text: 'Quiet bus etiquette: speaking loudly on public transport is heavily discouraged in Kyoto.' },
      { icon: <Check className="w-4 h-4 text-emerald-400" />, text: 'Trash bins: public trash cans are extremely rare. Keep a small bag with you to store trash.' }
    ]
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };



  // payment handler

  // const res=false

  const handlePyment = async () => {

    // Create a new order on the backend
    try {
       const {data:order}  = await axios.post('http://localhost:8000/api/payment/create-order', {

         amount: 2200 }, // amount in cents for $22.00
           {
        withCredentials: true,
    
       })
       // Initialize Razorpay payment
        const options = {
          // key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Your Razorpay key ID
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount, // Amount in paise
          currency: order.currency,
          name: "TravelBridge Premium",
          description: "Upgrade to Elite Plan",
          order_id: order.id, // Order ID from backend
          handler: async function (response) {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
            try{

              // Verify payment on the backend
              const {data:verificationResult} = await axios.post('http://localhost:8000/api/payment/verify-payment',{
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              signature: razorpay_signature,
               amount: order.amount / 100,
               currency: order.currency,
               },

                {
     withCredentials: true,
  
              })
              
              // res=true,
              alert('Payment successful! Your plan has been upgraded.');
            }catch(error){
              alert('Payment verification failed. Please contact support.');
              console.error('Payment verification error:', error);
            }
          },
        
         prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        }
      };
       const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) { 
      console.error('Error creating order:', error);
      alert('Failed to initiate payment. Please try again later.');
    }
  }

  const handleChangePaymentSec = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/api/payment/payment/${paymentId}`
    );

    console.log(data.payment.createdAt);
  } catch (error) {
    console.log(error);
  }
};


const [premium,setPremium]=useState({
   premium:false,
    premiumPlan:"Free",
    premiumExpiry:null
})
const fetchPremium = async () => {
    try {
        const { data } = await axios.get(
            "http://localhost:8000/api/auth/premium-status",
            {
                withCredentials: true,
            }
        );

        setPremium(data);
    } catch (err) {
        console.log(err);
    }
};

useEffect(() => {
    fetchPremium();
}, []);


// camera Translation



const fileInputRef = useRef(null);
const [file, setFile] = useState(null);
const [preview,setPreview]=useState("")
const [text,setText]=useState(null)
const [targetLanguage,setTargetLanguage]=useState("hi")

// const handleScan= async ()=>{

//   const formData=new FormData();
//   formData.append("image",file);
//   formData.append("targetLanguage",targetLanguage);
//    const res=await axios.post("http://localhost:8000/api/img/upload-img",
//       formData,
//         {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         }
//     );
//     console.log(res.data);

//      setText(res.data.translated);

// }

const handleScan = async () => {
  try {
    const formData = new FormData();

    formData.append("image", file);
    formData.append("targetLanguage", targetLanguage);

    const res = await axios.post(
      "http://localhost:8000/api/img/upload-img",
      formData
    );

    console.log("Backend response:", res.data);

    setText(res.data.translated);

    setNotifications([
      {
        id: Date.now(),
        text: "Camera OCR text successfully translated",
        time: "Just now",
        read: false,
        ...preview,
      },
      ...notifications,
    ]);

  } catch (error) {
    console.error("OCR ERROR:", error);
    console.error("Backend response:", error.response?.data);
  }
};
// handle copy 

const [copied,setCopied]=useState(false)

const handleCopy =async()=>{
  try {

    await navigator.clipboard.writeText(translatedText);
     setTimeout(() => {
      setCopied(false);
    }, 2000);
  } catch (error) {
    console.log(error)
  }
}
// voice translation
const [recording,setRecording]=useState(false);
const [mediaRecorder,setMediaRecorder]=useState(null);
const [audioBlob,setAudioBlob]=useState(null);
const [isVoiceRecording,setIsVoiceRecording]=useState(false);
const [isTranscribing,setIsTranscribing]=useState(false);
const [voiceResult,setVoiceResult]=useState('');
const [voiceError,setVoiceError]=useState(null);


const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, {
        type: "audio/webm"
      });

      console.log("Audio Blob:", blob);

      setAudioBlob(blob);

      // Stop microphone
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    };

    recorder.start();

    setMediaRecorder(recorder);
    setRecording(true);

    console.log("Recording started");

  } catch (error) {
    console.error("Microphone error:", error);
  }
};
const stopRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    setRecording(false);

    console.log("Recording stopped");
  }
  
  
};



const sendVoiceToBackend = async () => {

    if (!audioBlob) {
        console.error("No audio recorded");
        return;
    }

    try {

        setIsTranscribing(true);
        setVoiceError(null);

        // =====================================
        // STEP 1: AUDIO → TEXT
        // =====================================

        const formData = new FormData();

        formData.append(
            "audio",
            audioBlob,
            "voice.webm"
        );

        const sttResponse = await axios.post(
            "http://localhost:8000/api/audio/upload-audio",
            formData
        );

        console.log(
            "STT:",
            sttResponse.data
        );

        const originalText =
            sttResponse.data.text;


        // =====================================
        // STEP 2: TEXT → TRANSLATION
        // =====================================

        const translationResponse =
            await axios.post(
                "http://localhost:8000/api/audio/translate-audio",
                {
                    text: originalText,
                    targetLanguage: "hi"
                }
            );

        console.log(
            "Translation:",
            translationResponse.data
        );

        const translatedText =
            translationResponse.data.text;


        setVoiceResult(
            translatedText
        );


        // =====================================
        // STEP 3: TRANSLATION → SPEECH
        // =====================================

        const ttsResponse =
            await axios.post(
                "http://localhost:8000/api/audio/text-to-speech",
                {
                    text: translatedText
                }
            );

        console.log(
            "TTS:",
            ttsResponse.data
        );


        // =====================================
        // STEP 4: PLAY AUDIO
        // =====================================

        const audioUrl =
            `http://localhost:8000${ttsResponse.data.audio}`;

        console.log(
            "Audio URL:",
            audioUrl
        );

        const audio =
            new Audio(audioUrl);

        await audio.play();


    } catch (error) {

        console.error(
            "VOICE TRANSLATION ERROR:",
            error
        );

        console.error(
            "Backend response:",
            error.response?.data
        );

        setVoiceError(
            error.response?.data?.message ||
            "Voice translation failed"
        );

    } finally {

        setIsTranscribing(false);

    }
};

 useEffect(() => {
    if (audioBlob) {
      sendVoiceToBackend();
    }

   }, [audioBlob]);


const [tripPlan, setTripPlan] = useState(null);
const [tripError, setTripError] = useState("");

   const calculateDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const difference = endDate - startDate;

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  ) + 1;
};

   const getBudgetFromTier = (tier) => {
  switch (tier) {
    case "budget":
      return 20000;

    case "mid":
      return 40000;

    case "luxury":
      return 80000;

    default:
      return 40000;
  }
};

   const handleGenerateTrip = async () => {
  try {
    setIsGenerating(true);
    setShowResults(false);
    setTripError("");
    setGenerationStep(1);

    const tripData = {
      destination: destination,
      days: calculateDays(startDate, endDate),
      travelers: Number(travelersCount),
      budget: getBudgetFromTier(budgetTier),
      currency: "INR",
      interests: selectedInterests,

      travel_style:
        budgetTier === "budget"
          ? "budget"
          : budgetTier === "mid"
          ? "moderate"
          : "luxury",

        check_in: startDate,
        check_out: endDate,   
    };

    console.log("Sending trip:", tripData);

    setGenerationStep(2);

    const response = await axios.post(
      "http://localhost:8000/api/trip/generate",
      tripData
    );

    console.log("Received trip:", response.data);

    if (!response.data.success) {
      throw new Error("Trip generation failed");
    }

    setTripPlan(response.data.plan);

    setGenerationStep(3);
    setShowResults(true);
    setActiveDay(1);

  } catch (error) {
    console.error("Trip generation error:", error);

    setTripError(
      error.response?.data?.message ||
      error.message ||
      "Failed to generate trip"
    );

  } finally {
    setIsGenerating(false);
  }
};






  return (
    <div className="bg-[#0B0F19] text-slate-100 min-h-screen flex overflow-hidden font-sans relative selection:bg-blue-600/30 selection:text-white">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none z-0" />

      {/* 1. Left Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex flex-col w-68 xl:w-72 bg-slate-900/60 border-r border-slate-800/80 backdrop-blur-md shrink-0 justify-between p-6 z-20">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">TravelBridge</span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
              { id: 'translate', label: 'Translate', icon: <Languages className="w-4.5 h-4.5" /> },
              { id: 'voice', label: 'Voice Translate', icon: <Mic className="w-4.5 h-4.5" /> },
              { id: 'camera', label: 'Camera Translate', icon: <Camera className="w-4.5 h-4.5" /> },
              { id: 'planner', label: 'Trip Planner', icon: <Route className="w-4.5 h-4.5" /> },
              { id: 'history', label: 'History', icon: <History className="w-4.5 h-4.5" /> },
              { id: 'pricing', label: 'Pricing Plan', icon: <BadgePercent className="w-4.5 h-4.5" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-4.5 h-4.5" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-3 bg-slate-800/30 border border-slate-800 p-3 rounded-2xl">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/20 shadow-inner">
              {getInitials(user?.fullname)}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold text-white truncate">{user?.fullname || 'Traveler'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || 'traveler@mail.com'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-68 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl">
                      <Compass className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white">TravelBridge</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
                    { id: 'translate', label: 'Translate', icon: <Languages className="w-4.5 h-4.5" /> },
                    { id: 'voice', label: 'Voice Translate', icon: <Mic className="w-4.5 h-4.5" /> },
                    { id: 'camera', label: 'Camera Translate', icon: <Camera className="w-4.5 h-4.5" /> },
                    { id: 'planner', label: 'Trip Planner', icon: <Route className="w-4.5 h-4.5" /> },
                    { id: 'history', label: 'History', icon: <History className="w-4.5 h-4.5" /> },
                    { id: 'pricing', label: 'Pricing Plan', icon: <BadgePercent className="w-4.5 h-4.5" /> },
                    { id: 'settings', label: 'Settings', icon: <Settings className="w-4.5 h-4.5" /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    {getInitials(user?.fullname)}
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-bold text-white truncate">{user?.fullname}</p>
                    <p className="text-[9px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors animate-pulse"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        {/* 2. Top Header */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/40">
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Page Tab Title */}
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest hidden sm:block">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'translate' && 'AI Text Translator'}
              {activeTab === 'voice' && 'Real-time Voice Voice'}
              {activeTab === 'camera' && 'Camera Scan OCR'}
              {activeTab === 'planner' && 'AI Itinerary Planner'}
              {activeTab === 'history' && 'Translation & Plans History'}
              {activeTab === 'pricing' && 'Upgrade Plan'}
              {activeTab === 'settings' && 'User Settings'}
            </h2>
          </div>

          <div className="flex items-center gap-4 relative">
            
            {/* Search Input */}
            <div className="relative max-w-xs hidden md:block">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search tools, locations..."
                className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-4 py-2 w-52 focus:outline-none focus:border-slate-700 placeholder-slate-500"
              />
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-80 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-50 p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
                      <button
                        onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-2.5 rounded-xl border text-left text-xs ${
                            notif.read
                              ? 'bg-slate-800/20 border-slate-800 text-slate-400'
                              : 'bg-blue-600/5 border-blue-500/20 text-white'
                          }`}
                        >
                          <p className="leading-relaxed">{notif.text}</p>
                          <span className="text-[9px] text-slate-500 mt-1 block">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile trigger */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('settings')}>
              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20">
                {getInitials(user?.fullname)}
              </div>
              <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
                {user?.fullname?.split(' ')[0] || 'User'}
              </span>
            </div>

          </div>
        </header>

        {/* Scrollable Work area */}
        <main className="flex-1 overflow-y-auto p-6 text-left">
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Greetings */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome back, {user?.fullname || 'Explorer'}! ✈️
                </h1>
                <p className="text-slate-400 text-sm mt-1">Ready for your next global travel plan?</p>
              </div>

              {/* 3. Dashboard Widgets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Trips */}
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
                  <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Trips</span>
                    <h3 className="text-lg font-black text-white mt-0.5">4 Saved</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">2 upcoming voyages</p>
                  </div>
                </div>

                {/* Saved Destinations */}
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
                  <div className="w-11 h-11 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Compass className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Destinations</span>
                    <h3 className="text-lg font-black text-white mt-0.5">15 Cities</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">3 added recently</p>
                  </div>
                </div>

                {/* Translation Usage */}
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                      <Languages className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">API Queries</span>
                      <h3 className="text-lg font-black text-white mt-0.5">342 / 500</h3>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '68%' }} />
                    </div>
                    <span className="text-[9px] text-slate-500 block">Resets in 8 days</span>
                  </div>
                </div>
                

                {/* Premium Status */}
                {/* <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden group border-blue-500/30">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <BadgePercent className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span  className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Premium Status</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <h3 className="text-lg font-black text-white">Pro Active</h3>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <p className="text-[10px] text-slate-400">Renews July 2026</p>
                  </div>
                </div>

              </div> */}
              <div className="bg-slate-900/40 border border-blue-500/30 p-5 rounded-2xl flex items-center gap-4">

    <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center

        ${
            premium.premium
            ? "bg-amber-500/10 border border-amber-500/20"
            : "bg-slate-700 border border-slate-600"
        }`}
    >

        <BadgePercent className="w-5 h-5 text-amber-300"/>

    </div>

    <div>

        <span className="text-[10px] uppercase text-slate-500">

            Premium Status

        </span>

        <div className="flex items-center gap-2">

            <h3 className="text-white font-bold">

                {premium.premium
                    ? premium.premiumPlan
                    : "Free Plan"}

            </h3>

            {premium.premium &&

                <Sparkles className="w-4 h-4 text-yellow-400"/>

            }

        </div>

        <p className="text-slate-400 text-xs">

            {

                premium.premium

                ?

                `Renews ${new Date(premium.premiumExpiry)
                    .toLocaleDateString()}`

                :

                "Upgrade to Premium"

            }

        </p>

    </div>

</div>
</div>

              {/* Interactive Widget Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Trips & AI Insights */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Recent Trips */}
                  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-bold text-white uppercase tracking-wider">Your Recent Itineraries</h3>
                      <button onClick={() => setActiveTab('planner')} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold">
                        <span>New Trip</span> <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Trip 1: Bali */}
                      <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">Upcoming</span>
                            <span className="text-[10px] text-slate-500">6 Days</span>
                          </div>
                          <h4 className="text-base font-bold text-white mt-3">Bali, Indonesia 🌴</h4>
                          <p className="text-xs text-slate-400 mt-1">July 18 - July 24, 2026</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center text-xs">
                          <span className="text-slate-400">Lodging: Seminyak Villa</span>
                          <button onClick={() => { setDestination('Bali, Indonesia'); setActiveTab('planner'); setShowResults(true); }} className="text-blue-400 hover:text-white font-bold">Open Itinerary</button>
                        </div>
                      </div>

                      {/* Trip 2: Paris */}
                      <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-slate-400 font-bold bg-slate-800 border border-slate-750 px-2 py-0.5 rounded">Saved Draft</span>
                            <span className="text-[10px] text-slate-500">4 Days</span>
                          </div>
                          <h4 className="text-base font-bold text-white mt-3">Paris, France 🗼</h4>
                          <p className="text-xs text-slate-400 mt-1">Sept 02 - Sept 06, 2026</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center text-xs">
                          <span className="text-slate-400">Budget: Luxury Tier</span>
                          <button onClick={() => { setDestination('Paris, France'); setActiveTab('planner'); setShowResults(true); }} className="text-blue-400 hover:text-white font-bold">Open Itinerary</button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* AI Travel Assistant Prompt Box */}
                  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-base font-bold text-white uppercase tracking-wider">AI Local Assistant</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      "I can recommend traditional foods, local weather summaries, currency exchange info, and custom warnings for any city. Ask me below."
                    </p>
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {[
                        'Suggest Kyoto local foods',
                        'Bali currency warnings',
                        'Paris transit tips'
                      ].map((prompt, pidx) => (
                        <button
                          key={pidx}
                          onClick={() => {
                            if (prompt.includes('Kyoto')) {
                              setDestination('Kyoto, Japan');
                            } else if (prompt.includes('Bali')) {
                              setDestination('Bali, Indonesia');
                            } else {
                              setDestination('Paris, France');
                            }
                            setActiveTab('planner');
                            setShowResults(true);
                          }}
                          className="bg-slate-800/40 border border-slate-750 hover:bg-slate-800 hover:border-slate-700 text-slate-300 text-xs px-3.5 py-2 rounded-xl transition-all"
                        >
                          {prompt} →
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right side: Offline Packs & Quick actions */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Offline Packs */}
                  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Offline Language Packs</h3>
                    <div className="space-y-3">
                      {[
                        { lang: 'Spanish', size: '120 MB', status: 'Downloaded', flag: '🇪🇸' },
                        { lang: 'French', size: '110 MB', status: 'Download', flag: '🇫🇷' },
                        { lang: 'Japanese', size: '130 MB', status: 'Downloaded', flag: '🇯🇵' },
                      ].map((pack, pidx) => (
                        <div key={pidx} className="flex justify-between items-center p-2.5 bg-slate-800/20 border border-slate-800/80 rounded-xl">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{pack.flag}</span>
                            <div>
                              <p className="text-xs font-bold text-white">{pack.lang}</p>
                              <p className="text-[10px] text-slate-500">{pack.size}</p>
                            </div>
                          </div>
                          <button
                            disabled={pack.status === 'Downloaded'}
                            className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors ${
                              pack.status === 'Downloaded'
                                ? 'bg-slate-800 text-emerald-400 border border-slate-750'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow shadow-blue-500/10'
                            }`}
                          >
                            {pack.status === 'Downloaded' ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                            <span>{pack.status}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Workspace shortcuts</h3>
                    <div className="grid grid-cols-2 gap-3.5">
                      <button onClick={() => setActiveTab('translate')} className="p-3 bg-slate-800/30 border border-slate-800 hover:border-slate-700 rounded-2xl text-left space-y-2 group transition-colors">
                        <Languages className="w-5 h-5 text-blue-400 group-hover:scale-105 transition-transform" />
                        <p className="text-xs font-bold text-white">Text Trans</p>
                      </button>
                      <button onClick={() => setActiveTab('voice')} className="p-3 bg-slate-800/30 border border-slate-800 hover:border-slate-700 rounded-2xl text-left space-y-2 group transition-colors">
                        <Mic className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform" />
                        <p className="text-xs font-bold text-white">Voice Mic</p>
                      </button>
                      <button onClick={() => setActiveTab('camera')} className="p-3 bg-slate-800/30 border border-slate-800 hover:border-slate-700 rounded-2xl text-left space-y-2 group transition-colors">
                        <Camera className="w-5 h-5 text-cyan-400 group-hover:scale-105 transition-transform" />
                        <p className="text-xs font-bold text-white">Camera OCR</p>
                      </button>
                      <button onClick={() => setActiveTab('settings')} className="p-3 bg-slate-800/30 border border-slate-800 hover:border-slate-700 rounded-2xl text-left space-y-2 group transition-colors">
                        <Settings className="w-5 h-5 text-slate-400 group-hover:scale-105 transition-transform" />
                        <p className="text-xs font-bold text-white">Settings</p>
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          )}



          {/* TAB 2: TRIP PLANNER VIEW */}
          {activeTab === 'planner' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Trip Planner</h1>
                <p className="text-slate-400 text-sm mt-1">Let TravelBridge AI assemble your perfect, physical timeline and local guide.</p>
              </div>

              {/* Trip Creation Form Panel */}
              {!isGenerating && !showResults && (
                <div className="bg-slate-900/50 border border-slate-850 p-6 md:p-8 rounded-[32px] max-w-3xl mx-auto space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-blue-500" /> Plan a New Trip
                  </h3>
                  
                  <form onSubmit={startAIGeneration} className="space-y-6 text-left">
                    
                    {/* Destination Input */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Destination City / Country</label>
                      <div className="relative">
                        <Compass className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="e.g. Kyoto, Japan"
                          className="w-full bg-slate-800/40 border border-slate-750 text-slate-100 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-slate-600 text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Dates Selector row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Start Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-500" />
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-800/40 border border-slate-750 text-slate-100 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-slate-600 text-sm"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">End Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-500" />
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-800/40 border border-slate-750 text-slate-100 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-slate-600 text-sm"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Budget & Travelers counter row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Budget Selector */}
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Budget Level</label>
                        <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                          {[
                            { key: 'economy', val: 'Economy ($)' },
                            { key: 'mid', val: 'Mid-range ($$)' },
                            { key: 'luxury', val: 'Luxury ($$$)' },
                          ].map((b) => (
                            <button
                              key={b.key}
                              type="button"
                              onClick={() => setBudgetTier(b.key)}
                              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                                budgetTier === b.key
                                  ? 'bg-blue-600 text-white shadow shadow-blue-600/10'
                                  : 'text-slate-400 hover:text-slate-100'
                              }`}
                            >
                              {b.val}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Travelers Counter */}
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Number of Travelers</label>
                        <div className="flex justify-between items-center bg-slate-800/40 border border-slate-750 px-4 py-2.5 rounded-xl">
                          <span className="text-sm font-semibold text-slate-300">
                            {travelersCount} {travelersCount === 1 ? 'Traveler' : 'Travelers'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-750 hover:border-slate-700 flex items-center justify-center font-extrabold text-white"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => setTravelersCount(travelersCount + 1)}
                              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-750 hover:border-slate-700 flex items-center justify-center font-extrabold text-white"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Interests tags selection */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">Interests / Travel Vibe</label>
                      <div className="flex flex-wrap gap-2.5">
                        {[
                          { key: 'culture', label: '🏛️ Historical Culture' },
                          { key: 'food', label: '🍣 Culinary & Food' },
                          { key: 'nature', label: '🏞️ Nature Trails' },
                          { key: 'adventure', label: '⛰️ Outdoors Adventure' },
                          { key: 'nightlife', label: '🍻 Pubs & Nightlife' },
                          { key: 'shopping', label: '🛍️ Shopping Markets' },
                        ].map((interest) => {
                          const active = selectedInterests.includes(interest.key);
                          return (
                            <button
                              key={interest.key}
                              type="button"
                              onClick={() => handleToggleInterest(interest.key)}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                                active
                                  ? 'bg-blue-600 text-white border-blue-500 shadow shadow-blue-500/10'
                                  : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:border-slate-750 hover:text-slate-300'
                              }`}
                            >
                              {interest.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Form submit */}
                    <button
                      type="submit"
                      onClick={handleGenerateTrip}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mt-4 hover:scale-[1.01]"
                    >
                      <Sparkles className="w-4.5 h-4.5" /> Generate AI Itinerary
                    </button>

                  </form>
                </div>
              )}

              {/* Trip Results Panel */}


</motion.div>)}



{/* ================= DESTINATION INFO ================= */}

{tripPlan?.destination_info?.research && (
  <div className="mt-8 bg-white rounded-xl shadow p-6 text-gray-900">

    <h2 className="text-2xl font-bold mb-4">
      🌍 About {tripPlan.destination}
    </h2>

    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
      {tripPlan.destination_info.research}
    </div>

  </div>
)}


{/* ================= HOTELS ================= */}

{tripPlan?.hotels?.length > 0 && (
  <div className="mt-8 bg-white rounded-xl shadow p-6 text-gray-900">

    <h2 className="text-2xl font-bold mb-6">
      🏨 Recommended Hotels
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

      {tripPlan.hotels.map((hotel, index) => (

        <div
          key={hotel.id || index}
          className="border rounded-xl p-5 hover:shadow-lg transition"
        >

          <h3 className="text-xl font-bold">
            {hotel.name || "Hotel"}
          </h3>

          {hotel.location && (
            <p className="mt-2 text-gray-600">
              📍{" "}
              {typeof hotel.location === "string"
                ? hotel.location
                : hotel.location.address ||
                  hotel.location.city ||
                  "Location available"}
            </p>
          )}

          {hotel.rating && (
            <p className="mt-2">
              ⭐ {hotel.rating}
            </p>
          )}

          {hotel.price && (
            <p className="mt-2 font-semibold">
              💰{" "}
              {typeof hotel.price === "object"
                ? `${hotel.price.currency || tripPlan.currency} ${
                    hotel.price.totalPrice ||
                    hotel.price.amount ||
                    ""
                  }`
                : hotel.price}
            </p>
          )}

          {hotel.platform && (
            <p className="mt-2 text-sm text-gray-500">
              Booking platform: {hotel.platform}
            </p>
          )}

          {hotel.url && (
            <a
              href={hotel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              View Hotel
            </a>
          )}

        </div>

      ))}

    </div>

  </div>
)}


{/* ================= ACTIVITIES ================= */}

{tripPlan?.activities?.length > 0 && (
  <div className="mt-8 bg-white rounded-xl shadow p-6 text-gray-900">

    <h2 className="text-2xl font-bold mb-6">
      🎯 Things To Do
    </h2>

    <div className="grid md:grid-cols-2 gap-5">

      {tripPlan.activities.map((activity, index) => (

        <div
          key={activity.id || index}
          className="border rounded-xl p-5"
        >

          <h3 className="text-xl font-bold">
            {activity.name || "Activity"}
          </h3>

          {activity.description && (
            <p className="mt-2 text-gray-600">
              {activity.description}
            </p>
          )}

          {activity.location && (
            <p className="mt-3">
              📍{" "}
              {typeof activity.location === "string"
                ? activity.location
                : activity.location.address ||
                  activity.location.city ||
                  "Location available"}
            </p>
          )}

          {activity.start_time && (
            <p className="mt-2">
              🕐 {activity.start_time}

              {activity.end_time &&
                ` - ${activity.end_time}`}
            </p>
          )}

        </div>

      ))}

    </div>

  </div>
)}


{/* ================= RESTAURANTS ================= */}

{tripPlan?.restaurants?.length > 0 && (
  <div className="mt-8 bg-white rounded-xl shadow p-6 text-gray-900">

    <h2 className="text-2xl font-bold mb-6">
      🍴 Recommended Restaurants
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

      {tripPlan.restaurants.map((restaurant, index) => (

        <div
          key={restaurant.id || index}
          className="border rounded-xl p-5"
        >

          <h3 className="text-xl font-bold">
            {restaurant.name || "Restaurant"}
          </h3>

          {restaurant.description && (
            <p className="mt-2 text-gray-600">
              {restaurant.description}
            </p>
          )}

          {restaurant.location && (
            <p className="mt-3">
              📍{" "}
              {typeof restaurant.location === "string"
                ? restaurant.location
                : restaurant.location.address ||
                  restaurant.location.city ||
                  "Location available"}
            </p>
          )}

          {restaurant.rating && (
            <p className="mt-2">
              ⭐ {restaurant.rating}
            </p>
          )}

          {restaurant.price_level && (
            <p className="mt-2">
              💰 {restaurant.price_level}
            </p>
          )}

        </div>

      ))}

    </div>

  </div>
)}


{/* ================= WEATHER ================= */}

{tripPlan?.weather?.length > 0 && (
  <div className="mt-8 bg-white rounded-xl shadow p-6 text-gray-900">

    <h2 className="text-2xl font-bold mb-6">
      🌤️ Weather Forecast
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      {tripPlan.weather.map((weather, index) => (

        <div
          key={`${weather.date}-${index}`}
          className="border rounded-xl p-5"
        >

          <h3 className="font-bold text-lg">
            {weather.date}
          </h3>

          <p className="mt-3">
            🌡️ Min: {weather.temperature_min}°C
          </p>

          <p>
            🌡️ Max: {weather.temperature_max}°C
          </p>

          <p className="mt-3">
            🌧️ Rain probability:{" "}
            {weather.precipitation_probability}%
          </p>

          <p className="mt-2">
            💧 Precipitation:{" "}
            {weather.precipitation_sum} mm
          </p>

        </div>

      ))}

    </div>

  </div>
)}

{/* ================= TRANSPORT ================= */}

{tripPlan?.transport_options?.length > 0 && (
  <div className="mt-8 bg-white rounded-xl shadow p-6 text-gray-900">

    <h2 className="text-2xl font-bold mb-6">
      🚗 Transport Options
    </h2>

    <div className="space-y-4">

      {tripPlan.transport_options.map((route, index) => (

        <div
          key={index}
          className="border rounded-xl p-5"
        >

          <div className="flex justify-between">

            <h3 className="text-xl font-bold">
              Route {index + 1}
            </h3>

            <span>
              {route.success
                ? "✅ Available"
                : "❌ Unavailable"}
            </span>

          </div>

          {route.distance_meters && (
            <p className="mt-3">
              📏 Distance:{" "}
              {(route.distance_meters / 1000).toFixed(2)}
              {" "}km
            </p>
          )}

          {route.duration && (
            <p className="mt-2">
              ⏱️ Duration: {route.duration}
            </p>
          )}

          {route.static_duration && (
            <p className="mt-2">
              🕐 Static duration:{" "}
              {route.static_duration}
            </p>
          )}

        </div>

      ))}

    </div>

  </div>
)}

{/* ================= OPTIMIZED ROUTES ================= */}

{tripPlan?.optimized_routes?.length > 0 && (
  <div className="mt-8 bg-white rounded-xl shadow p-6 text-gray-900">

    <h2 className="text-2xl font-bold mb-6">
      🗺️ Optimized Routes
    </h2>

    {tripPlan.optimized_routes.map((route, index) => (

      <div
        key={index}
        className="border rounded-xl p-5 mb-4"
      >

        <h3 className="text-xl font-bold">
          Optimized Route {index + 1}
        </h3>

        {route.distance_meters && (
          <p className="mt-3">
            📏 Distance:{" "}
            {(route.distance_meters / 1000).toFixed(2)}
            {" "}km
          </p>
        )}

        {route.duration && (
          <p className="mt-2">
            ⏱️ Duration: {route.duration}
          </p>
        )}

        {route.static_duration && (
          <p className="mt-2">
            🕐 Static duration: {route.static_duration}
          </p>
        )}

        {route.route_order?.length > 0 && (
          <div className="mt-3">
            <p className="font-semibold">
              🔄 Optimized waypoint order:
            </p>

            <p className="text-gray-600">
              {route.route_order.join(" → ")}
            </p>
          </div>
        )}

      </div>

    ))}

  </div>
)}

{/* ================= ITINERARY ================= */}

{tripPlan?.itinerary?.length > 0 && (

  <div className="mt-8">

    <h2 className="text-3xl font-bold text-white">
      🗓️ Your Itinerary
    </h2>

    {/* DAY BUTTONS */}

    <div className="flex gap-3 mt-6 flex-wrap">

      {tripPlan.itinerary.map((day) => (

        <button
          key={day.day}
          onClick={() => setActiveDay(day.day)}
          className={
            activeDay === day.day
              ? "px-4 py-2 rounded-lg bg-blue-600 text-white"
              : "px-4 py-2 rounded-lg bg-white text-gray-900"
          }
        >
          Day {day.day}
        </button>

      ))}

    </div>


    {/* ACTIVE DAY */}

    {tripPlan.itinerary
      .filter((day) => day.day === activeDay)
      .map((day) => (

        <div
          key={day.day}
          className="mt-6 p-6 rounded-xl shadow bg-white text-gray-900"
        >

          <h3 className="text-2xl font-bold">
            Day {day.day}: {day.title}
          </h3>

          {day.description && (
            <p className="mt-3 text-gray-700">
              {day.description}
            </p>
          )}

          {day.location && (
            <p className="mt-4 font-medium">
              📍 {day.location}
            </p>
          )}


          {/* DAY ACTIVITIES */}

          <div className="mt-5 space-y-4">

            {day.activities?.map((activity, index) => (

              <div
                key={`${day.day}-${index}`}
                className="p-4 rounded-lg bg-gray-100"
              >

                {typeof activity === "string" ? (

                  <p>
                    {activity}
                  </p>

                ) : (

                  <>

                    <h4 className="font-bold text-lg">
                      {activity.name}
                    </h4>

                    {activity.start_time && (
                      <p className="mt-2">
                        🕐 {activity.start_time}
                        {activity.end_time &&
                          ` - ${activity.end_time}`}
                      </p>
                    )}

                    {activity.location && (
                      <p className="mt-2">
                        📍 {activity.location}
                      </p>
                    )}

                    {activity.description && (
                      <p className="mt-2 text-gray-600">
                        {activity.description}
                      </p>
                    )}

                  </>

                )}

              </div>

            ))}

          </div>

        </div>

      ))}

  </div>
)}

{/* ================= BUDGET ================= */}

{tripPlan?.budget_breakdown?.daily_budget?.length > 0 && (

  <div className="mt-8 bg-white rounded-xl shadow p-6 text-gray-900">

    <h2 className="text-2xl font-bold mb-6">
      💰 Day-wise Budget
    </h2>

    <div className="space-y-6">

      {tripPlan.budget_breakdown.daily_budget.map((day) => (

        <div
          key={day.day}
          className="border rounded-xl p-5"
        >

          <h3 className="text-xl font-bold mb-4">
            Day {day.day}
          </h3>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>🏨 Accommodation</span>
              <span>
                {tripPlan.currency} {day.accommodation}
              </span>
            </div>

            <div className="flex justify-between">
              <span>🍴 Food</span>
              <span>
                {tripPlan.currency} {day.food}
              </span>
            </div>

            <div className="flex justify-between">
              <span>🚕 Transport</span>
              <span>
                {tripPlan.currency} {day.transport}
              </span>
            </div>

            <div className="flex justify-between">
              <span>🎟 Activities</span>
              <span>
                {tripPlan.currency} {day.activities}
              </span>
            </div>

            <div className="flex justify-between">
              <span>🛍 Miscellaneous</span>
              <span>
                {tripPlan.currency} {day.miscellaneous}
              </span>
            </div>

          </div>

          <div className="border-t mt-4 pt-4 flex justify-between font-bold">

            <span>
              Day {day.day} Total
            </span>

            <span>
              {tripPlan.currency} {day.day_total}
            </span>

          </div>

        </div>

      ))}

    </div>


    {/* TOTAL */}

    <div className="mt-6 p-5 rounded-xl bg-gray-900 text-white flex justify-between">

      <span className="text-xl font-bold">
        Total Trip Budget
      </span>

      <span className="text-xl font-bold">
        {tripPlan.currency}{" "}
        {tripPlan.budget_breakdown.total_budget}
      </span>

    </div>

  </div>
)}


{/* ================= VALIDATION ================= */}

{tripPlan?.validation && (

  <div className="mt-8 bg-white rounded-xl shadow p-6 text-gray-900">

    <h2 className="text-2xl font-bold">
      ✅ Trip Validation
    </h2>

    <p className="mt-3">
      Status:{" "}

      {tripPlan.validation.is_valid
        ? "✅ Valid"
        : "⚠️ Needs attention"}
    </p>


    {tripPlan.validation.errors?.length > 0 && (

      <div className="mt-4">

        <h3 className="font-bold">
          Warnings
        </h3>

        <ul className="list-disc ml-6 mt-2">

          {tripPlan.validation.errors.map(
            (error, index) => (
              <li key={index}>
                {error}
              </li>
            )
          )}

        </ul>

      </div>

    )}

  </div>
)}

          {/* TAB 3: TEXT TRANSLATION VIEW */}
          {activeTab === 'translate' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Text Translator</h1>
                <p className="text-slate-400 text-sm mt-1">Translate typed phrases dynamically in 100+ languages.</p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-[28px] max-w-4xl mx-auto space-y-6">
                
                {/* Language Selectors */}
                <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800 max-w-sm">
                  <select
                    value={sourceLanguagetext}
                    onChange={(e) => setSourceLanguagetext(e.target.value)}
                    className="bg-slate-900 text-xs text-white border border-slate-800 rounded-lg p-2 flex-1 focus:outline-none"
                  >
                    <option value="en">English</option>
    <option value="hi">Hindi</option>
    <option value="fr">French</option>
    <option value="es">Spanish</option>
    <option value="de">German</option>
    <option value="ja">Japanese</option>
    <option value="ko">Korean</option>
    <option value="zh">Chinese</option>
    <option value="ar">Arabic</option>
    <option value="ru">Russian</option>
                  </select>
                  
                  <span className="text-slate-500">⇄</span>
                  
                  <select
                    value={targetLanguagetext}
                    onChange={(e) => setTargetLanguagetext(e.target.value)}
                    className="bg-slate-900 text-xs text-white border border-slate-800 rounded-lg p-2 flex-1 focus:outline-none"
                  >
                    <option value="en">English</option>
    <option value="hi">Hindi</option>
    <option value="fr">French</option>
    <option value="es">Spanish</option>
    <option value="de">German</option>
    <option value="ja">Japanese</option>
    <option value="ko">Korean</option>
    <option value="zh">Chinese</option>
    <option value="ar">Arabic</option>
    <option value="ru">Russian</option>
                  </select>
                </div>

                {/* Translate block inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Original text</span>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="bg-slate-800/30 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-700 min-h-[160px] resize-none"
                      placeholder="Type text to translate..."
                    />
                  </div>

                  <div className="flex flex-col bg-slate-800/10 border border-slate-800 p-4 rounded-2xl min-h-[160px] justify-between">
                    <div>
                      <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-2">Translation output</span>
                      <p className={`text-base font-bold leading-relaxed ${isTranslating ? 'text-slate-600' : 'text-white'}`}>
                        {translatedText}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-850 mt-4">
                      <button className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg">
                        <Volume2 className="w-4.5 h-4.5" />
                      </button>
                     <button
                  onClick={handleCopy}
                 disabled={!translatedText}
                     className="text-xs bg-slate-800 hover:bg-slate-750 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 px-3.5 py-1.5 rounded-lg border border-slate-750"
                        >
                {copied ? "Copied ✓" : "Copy to Clipboard"}
                 </button>
                    </div>
                  </div>

                </div>

                <button
                  onClick={handletextTranslate}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow shadow-blue-500/10"
                >
                  {isTranslating ? 'Translating...' : 'Translate now'}
                </button>

              </div>
            </motion.div>
          )}

          {/* TAB 4: VOICE TRANSLATION VIEW */}
{activeTab === "voice" && (

  <motion.div
    initial={{
      opacity: 0,
      y: 10,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    className="space-y-6"
  >

    {/* HEADER */}
    <div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
        Voice Translator
      </h1>

      <p className="text-slate-400 text-sm mt-1">
        Real-time bi-directional conversation mic module.
      </p>

    </div>


    {/* VOICE CARD */}
    <div
      className="
        bg-slate-900/40
        border border-slate-800
        p-8
        rounded-[28px]
        max-w-xl
        mx-auto
        flex
        flex-col
        items-center
        justify-center
        min-h-[350px]
        space-y-6
        text-center
      "
    >

      {/* MICROPHONE BUTTON */}
      <button
        onClick={
          recording
            ? stopRecording
            : startRecording
        }

        disabled={isTranscribing}

        className={`
          w-24
          h-24
          rounded-full
          border
          flex
          items-center
          justify-center
          transition-all

          ${
            recording
              ? `
                bg-rose-600
                text-white
                animate-pulse
                shadow-lg
                shadow-rose-500/20
                border-rose-500/40
              `
              : `
                bg-blue-600
                hover:bg-blue-500
                text-white
                shadow-lg
                shadow-blue-600/20
                border-blue-500/40
              `
          }

          ${
            isTranscribing
              ? "opacity-50 cursor-not-allowed"
              : ""
          }
        `}
      >

        <Mic className="w-10 h-10" />

      </button>


      {/* STATUS */}
      <div>

        <h3 className="text-base font-bold text-white">

          {recording
            ? "Voice listening..."
            : isTranscribing
            ? "Processing voice..."
            : "Tap Mic to Speak"
          }

        </h3>


        <p className="text-slate-400 text-xs mt-1.5 max-w-xs leading-relaxed">

          {recording
            ? "Speak clearly and tap the microphone again when finished."
            : isTranscribing
            ? "Converting and translating your voice..."
            : "Speak naturally. TravelBridge will translate your voice."
          }

        </p>

      </div>


      {/* ANIMATED WAVES */}
      {recording && (

        <div className="flex gap-1.5 h-6 items-center">

          {[
            0.6,
            0.9,
            0.4,
            0.8,
            0.5,
            0.9,
            0.3,
          ].map((val, idx) => (

            <span
              key={idx}
              className="
                w-1
                bg-blue-500
                rounded-full
                animate-bounce
              "
              style={{
                height: `${val * 100}%`,
                animationDelay: `${idx * 0.1}s`,
              }}
            />

          ))}

        </div>

      )}


      {/* PROCESSING */}
      {isTranscribing && (

        <div className="flex items-center gap-2">

          <div className="
            w-4
            h-4
            border-2
            border-slate-600
            border-t-blue-500
            rounded-full
            animate-spin
          " />

          <span className="text-xs text-slate-400">
            Translating...
          </span>

        </div>

      )}


      {/* TRANSLATED RESULT */}
      {voiceResult && (

        <div
          className="
            w-full
            bg-slate-800/40
            border
            border-slate-800
            p-4
            rounded-2xl
            text-left
          "
        >

          <p className="
            text-[10px]
            uppercase
            tracking-wider
            text-slate-500
            mb-2
          ">
            Translated Text
          </p>

          <p className="
            text-slate-200
            text-sm
            leading-relaxed
          ">
            {voiceResult}
          </p>

        </div>

      )}


      {/* ERROR */}
      {voiceError && (

        <div
          className="
            w-full
            bg-rose-500/10
            border
            border-rose-500/20
            p-3
            rounded-xl
          "
        >

          <p className="text-rose-400 text-xs">
            {voiceError?.response?.data?.message ||
             voiceError?.message ||
             "Voice translation failed"}
          </p>

        </div>

      )}

    </div>

  </motion.div>

)}

          {/* TAB 5: CAMERA TRANSLATION VIEW */}
          {activeTab === 'camera' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Camera Translate (OCR)</h1>
                <p className="text-slate-400 text-sm mt-1">Scan signage, food menus, or flyers with local text overlay.</p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-8 rounded-[28px] max-w-2xl mx-auto space-y-6">
                
                {/* Simulated viewfinder */}
                <div className="relative aspect-video w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
                  
                  {/* <span className="text-xs text-slate-500 font-mono">[ Click "Simulate Scan" below ]</span> */}

                     {preview && (
                <img
                 src={preview}
                 alt="Preview"
                className="mt-4 rounded-xl w-auto"
           />
                    )             }
                      
                  
                  {/* Scan bar animation */}
                  {/* <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 opacity-60 animate-bounce" /> */}

                  {/* Japanese overlay text highlights
                  <div className="absolute top-12 left-12 text-center">
                    <span className="text-sm font-bold text-white bg-black/60 px-2 py-0.5 rounded">水</span>
                    <span className="text-[9px] text-cyan-400 block bg-slate-900/80 px-1 py-0.5 rounded border border-cyan-500/20 mt-1">WATER</span>
                  </div>

                  <div className="absolute bottom-16 right-16 text-center">
                    <span className="text-sm font-bold text-white bg-black/60 px-2 py-0.5 rounded">お勘定</span>
                    <span className="text-[9px] text-cyan-400 block bg-slate-900/80 px-1 py-0.5 rounded border border-cyan-500/20 mt-1">CHECK / BILL</span>
                  </div> */}

                

                </div>
               <input
                     type="file"
                     ref={fileInputRef}
                     accept="image/*,.pdf"
                     className="hidden"
                       onChange={(e) => {
                      const selectedFile = e.target.files[0];
                     setFile(selectedFile);
                      if (selectedFile.type.startsWith("image/")) {
                      setPreview(URL.createObjectURL(selectedFile));
                      console.log(selectedFile);
                           }}
                          }
                       />


              

                {/* <div className="flex gap-4">
                  <button   onClick={() => fileInputRef.current.click()} className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 py-3 rounded-xl border border-slate-700/60 font-bold text-xs">
                    Upload image / PDF
                  </button>
                  <button
                    onClick={() => {
                      handleScan()
                      ,
                      setNotifications([
                        { id: Date.now(), text: "Camera OCR text successfully translated", time: "Just now", read: false ,...preview,},
                        ...notifications
                      ]);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-xs shadow shadow-blue-500/10"
                  >
                    Simulate Scan
                  </button> */}

                   {/* lang option */}

                <div className="space-y-2">
  <label className="text-sm text-slate-300 font-medium">
    Target Language
  </label>

  <select
    value={targetLanguage}
    onChange={(e) => setTargetLanguage(e.target.value)}
    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="en">English</option>
    <option value="hi">Hindi</option>
    <option value="fr">French</option>
    <option value="es">Spanish</option>
    <option value="de">German</option>
    <option value="ja">Japanese</option>
    <option value="ko">Korean</option>
    <option value="zh">Chinese</option>
    <option value="ar">Arabic</option>
    <option value="ru">Russian</option>
  </select>
</div>

<div className="flex gap-4">
  <button
    onClick={() => fileInputRef.current.click()}
    className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 py-3 rounded-xl border border-slate-700/60 font-bold text-xs"
  >
    Upload image / PDF
  </button>

  <button
    onClick={() => {
      handleScan(),
      setNotifications([
        {
          id: Date.now(),
          text: "Camera OCR text successfully translated",
          time: "Just now",
          read: false,
          ...preview,
        },
        ...notifications,
      ]);
    }}
    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-xs shadow shadow-blue-500/10"
  >
    Simulate Scan
  </button>
</div>

<div>
  {text}
</div>
</div>

              {/* </div> */}
            </motion.div>
          )}

          {/* TAB 6: HISTORY VIEW */}
          {activeTab === 'history' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Travel History</h1>
                <p className="text-slate-400 text-sm mt-1">Access logs of your translated sentences and itinerary creations.</p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-[28px] max-w-3xl mx-auto space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Past Transactions</h3>
                <div className="space-y-3">
                  {[
                    { type: 'Plan', title: 'Tokyo, Japan 🗼', desc: '5-Day culture itinerary generated', time: 'Yesterday' },
                    { type: 'Translation', title: 'Where is the train station?', desc: 'English → Japanese translation', time: '2 days ago' },
                    { type: 'Plan', title: 'Paris, France 🥖', desc: '3-Day culinary itinerary saved', time: '1 week ago' },
                    { type: 'Translation', title: 'How much does this cost?', desc: 'English → French translation', time: '1 week ago' },
                  ].map((hist, hidx) => (
                    <div key={hidx} className="flex justify-between items-center p-3 bg-slate-800/20 border border-slate-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                          hist.type === 'Plan'
                            ? 'bg-blue-600/10 border-blue-500/20 text-blue-400'
                            : 'bg-cyan-600/10 border-cyan-500/20 text-cyan-400'
                        }`}>
                          {hist.type}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white">{hist.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{hist.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500">{hist.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 7: PRICING VIEW */}
          {activeTab === 'pricing' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Subscription Management</h1>
                <p className="text-slate-400 text-sm mt-1">Upgrade or modify your billing options for TravelBridge.</p>
              </div>

              {/* Plans */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Current Plan</span>
                    <h3 className="text-xl font-bold text-white">TravelBridge Pro</h3>
                    <p className="text-xs text-slate-400">Renews on June 21, 2027 ($108 billed annually)</p>
                    <div className="h-[1px] bg-slate-800 w-full my-4" />
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Unlimited AI trip builds</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Offline language packages</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Real-time vocal translation</li>
                    </ul>
                  </div>
                  <button className="w-full mt-6 bg-slate-800 text-slate-300 border border-slate-750 py-2.5 rounded-xl text-xs font-bold">
                    Manage Billing
                  </button>
                </div>

                <div className="bg-slate-900/40 border border-blue-500/40 p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                    Save 30%
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">Recommended Upgrade</span>
                    <h3 className="text-xl font-bold text-white">TravelBridge Premium Elite</h3>
                    <p className="text-xs text-slate-400">For group travel managers and travel planners.</p>
                    <div className="h-[1px] bg-slate-800 w-full my-4" />
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Priority access generation servers</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Live group trip timeline collaboration</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Direct travel agent custom chat widget</li>
                    </ul>
                  </div>
                  <button onClick={handlePyment} className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10">
                    Upgrade to Elite ($22/mo)
                  </button>
                </div>
              </div> */}


                {/* Plans */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

  {premium?.premium ? (
    // ================= PREMIUM USER =================
    <div className="md:col-span-2 bg-slate-900/40 border border-green-500/30 rounded-3xl p-8">

      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-green-400 font-bold">
            Active Subscription
          </span>

          <h2 className="text-3xl font-bold text-white mt-2">
            {premium.premiumPlan}
          </h2>

          <p className="text-slate-400 mt-1">
            Your premium membership is active.
          </p>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 px-5 py-2 rounded-full">
          <span className="text-green-400 font-semibold">
            ● Active
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-slate-800/50 rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Current Plan</p>
          <h3 className="text-white text-xl font-bold mt-1">
            {premium.premiumPlan}
          </h3>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Expires On</p>

          <h3 className="text-white text-xl font-bold mt-1">
            {premium.premiumExpiry
              ? new Date(premium.premiumExpiry).toLocaleDateString()
              : "Lifetime"}
          </h3>
        </div>

      </div>

      <div className="mt-8 border-t border-slate-700 pt-6">

        <h3 className="text-white font-semibold mb-4">
          Premium Benefits
        </h3>

        <div className="grid md:grid-cols-2 gap-3 text-slate-300">

          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            Unlimited AI Trip Planner
          </div>

          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            Unlimited Voice Translation
          </div>

          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            Camera Translation
          </div>

          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            OCR & Document Translation
          </div>

          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            Offline Language Packs
          </div>

          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            Priority Support
          </div>

        </div>

      </div>
    </div>

  ) : (
    // ================= FREE USER =================
    <>
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
        <div className="space-y-4">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
            Current Plan
          </span>

          <h3 className="text-xl font-bold text-white">
            TravelBridge Pro
          </h3>

          <p className="text-xs text-slate-400">
            Renews on June 21, 2027 ($108 billed annually)
          </p>

          <div className="h-[1px] bg-slate-800 w-full my-4" />

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" />
              Unlimited AI trip builds
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" />
              Offline language packages
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" />
              Real-time vocal translation
            </li>
          </ul>
        </div>

        <button className="w-full mt-6 bg-slate-800 text-slate-300 border border-slate-750 py-2.5 rounded-xl text-xs font-bold">
          Manage Billing
        </button>
      </div>

      <div className="bg-slate-900/40 border border-blue-500/40 p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden">

        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
          Save 30%
        </div>

        <div className="space-y-4">

          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
            Recommended Upgrade
          </span>

          <h3 className="text-xl font-bold text-white">
            TravelBridge Premium Elite
          </h3>

          <p className="text-xs text-slate-400">
            For group travel managers and travel planners.
          </p>

          <div className="h-[1px] bg-slate-800 w-full my-4" />

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" />
              Priority access generation servers
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" />
              Live group collaboration
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-400" />
              Dedicated AI Assistant
            </li>
          </ul>

        </div>

        <button
          onClick={handlePyment}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10"
        >
          Upgrade to Elite ($22/mo)
        </button>

      </div>
    </>
  )}

</div>




            </motion.div>
          )}

          {/* TAB 8: SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Account Settings</h1>
                <p className="text-slate-400 text-sm mt-1">Configure profile coordinates, preferences, and data privacy options.</p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-6 md:p-8 rounded-[28px] max-w-2xl mx-auto space-y-6 text-left">
                
                <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-3">Profile Info</h3>
                
                {/* Form fields */}
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-700"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Primary App Language</label>
                    <select
                      value={profileLang}
                      onChange={(e) => setProfileLang(e.target.value)}
                      className="w-full bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>Japanese</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button className="bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors border border-slate-750">
                    Reset
                  </button>
                  <button
                    onClick={() => {
                      setNotifications([
                        { id: Date.now(), text: "Profile details updated successfully", time: "Just now", read: false },
                        ...notifications
                      ]);
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shadow shadow-blue-500/10"
                  >
                    Save Changes
                  </button>
                </div>

              </div>
            </motion.div>
          )}

        </main>
      </div>

    </div>
  );
};

export default Dashboard;
