import React from 'react'
import { useState,useEffect } from 'react'
import { FaPlay } from "react-icons/fa";
import imageHero from '../assets/image-hero.png'
import imageFeature from '../assets/feature-page-image.png'
import languageImage from '../assets/lang-page-img.png'
import { FaMosque, FaGlobe } from "react-icons/fa";
import { GiJapan } from "react-icons/gi";
import  worldImage from '../assets/lang-img2.png'
import aboutImage from '../assets/about-img.png'
import Signup from './signup';
import { useNavigate } from 'react-router-dom';

const Hero = () => {

  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const languages = [
  {
    id: 1,
    logo: "https://flagcdn.com/w40/us.png",
    name: "English",
    speakers: "1.5B Speakers",
  },
  {
    id: 2,
    logo: "https://flagcdn.com/w40/es.png",
    name: "Spanish",
    speakers: "559M Speakers",
  },
  {
    id: 3,
    logo: "https://flagcdn.com/w40/fr.png",
    name: "French",
    speakers: "300M Speakers",
  },
  {
    id: 4,
    logo: "https://flagcdn.com/w40/in.png",
    name: "Hindi",
    speakers: "600M Speakers",
  },
  {
    id: 5,
    logo: "https://flagcdn.com/w40/cn.png",
    name: "Chinese",
    speakers: "1.1B Speakers",
  },
  {
    id: 6,
    logo: "https://flagcdn.com/w40/jp.png",
    name: "Japanese",
    speakers: "130M Speakers",
  },
  {
    id: 7,
    logo: "https://flagcdn.com/w40/kr.png",
    name: "Korean",
    speakers: "77M Speakers",
  },
  {
    id: 8,
    logo: "https://flagcdn.com/w40/sa.png",
    name: "Arabic",
    speakers: "420M Speakers",
  },
  {
    id: 9,
    logo: "https://flagcdn.com/w40/de.png",
    name: "German",
    speakers: "135M Speakers",
  },
  {
    id: 10,
    logo: "https://flagcdn.com/w40/ru.png",
    name: "Russian",
    speakers: "258M Speakers",
  },
  {
    id: 11,
    logo: "https://flagcdn.com/w40/pt.png",
    name: "Portuguese",
    speakers: "260M Speakers",
  },
  {
    id: 12,
    logo: "https://flagcdn.com/w40/it.png",
    name: "Italian",
    speakers: "67M Speakers",
  },
  {
    id: 13,
    logo: "https://flagcdn.com/w40/tr.png",
    name: "Turkish",
    speakers: "88M Speakers",
  },
  {
    id: 14,
    logo: "https://flagcdn.com/w40/nl.png",
    name: "Dutch",
    speakers: "25M Speakers",
  },
  {
    id: 15,
    logo: "https://flagcdn.com/w40/pl.png",
    name: "Polish",
    speakers: "45M Speakers",
  },
];
    const handleClick = (e) => {
     e.preventDefault();
 
     const isRegistered = localStorage.getItem('isRegistered');
     const isLoggedIn = localStorage.getItem('isLoggedIn');

    if(isRegistered === 'true' ) {
      navigate('/login');
      }

     else if(isLoggedIn === 'true') {
      navigate('/home');
     }
      else {  
        navigate('/signup');
      } 
  }
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
    <div className="  bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen">

      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white backdrop-blur-md shadow-sm flex justify-between items-center px-8 py-3">

        {/* Logo */}
        <h1 className="text-2xl font-bold ">
         🌐 Travel Bridge
        </h1>

        {/* Nav Links */}
        <ul className="flex items-center space-x-6 text-gray-700 font-medium">

          <li   onClick={() => document.getElementById('home').scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            Home
          </li>

          <li 
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            Features
          </li>

          <li  onClick={() => document.getElementById('language').scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            Language
          </li>

          <li  onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            How it works
          </li>

          <li  onClick={() => document.getElementById('about-us').scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            About us
          </li>

        </ul>

        {/* Buttons */}
        <div className="flex items-center space-x-4">

          <button onClick={() => navigate('/login')} className="text-blue-600 font-medium hover:text-white hover:bg-blue-400 px-5 py-2 rounded-xl transition">
          <button className="text-blue-600 font-medium hover:text-white hover:bg-blue-400 px-5 py-2 rounded-xl transition" onClick={() => navigate('/login')}>
            Login
          </button>

          <button onClick={() => navigate('/signup')} className="text-blue-600  font-medium hover:text-white hover:bg-blue-400 px-5 py-2 rounded-xl transition">
            Sign Up
          </button>

        </div>
        </div>

      {/* Home Section */}  
         <div id="home" className="flex flex-col-reverse lg:flex-row items-center justify-between px-10 py-18 gap-16">

  {/* Left Content */}
  <div  className="flex-1 max-w-xl">

    <p className="text-blue-600 font-semibold uppercase tracking-wide">
      Communicate Anywhere
    </p>

    <h1 className="text-5xl font-bold leading-tight mt-4 text-gray-900">
      Travel Anywhere
      <br />
      Without Language
      <br />
      <span className="text-blue-600">
        Barriers
      </span>
    </h1>

    <p className="text-lg text-gray-600 mt-6 leading-relaxed">
      Real-time translation for tourists using voice,
      text, camera, and smart multilingual assistance.
      Communicate effortlessly across countries with
      instant translation support.
    </p>

    {/* Buttons */}
    <div className="flex items-center gap-5 mt-8">

      <button onClick={(e) => handleClick(e)} className="bg-blue-600 text-white px-7 py-3 rounded-2xl hover:bg-blue-700 transition shadow-md">
        Start Translating
      </button>

      <button className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">

        <span className="text-blue-600">
          ▶
        </span>

        <span className="text-gray-700 font-medium">
          Watch Demo
        </span>

      </button>

    </div>

  </div>

  {/* Right Image */}
  <div className="flex-1 flex justify-center">

    <img
      src={imageHero}
      alt="Hero Image"
      className="w-full max-w-2xl object-contain"
    />

  </div>

</div>
{/* Features Section */}

<div id="features" className="bg-gradient-to-br from-blue-50 via-white to-cyan-50  py-16">
  <div className="flex flex-col items-center max-w-7xl mx-auto px-4">
   <h1 className=" text-4xl font-bold leading-tight mt-4 text-gray-900">
        Powerfull Features for<br/>
    Seamless <span className="text-blue-600">Communication</span>

      </h1>
      <p className="text-lg text-gray-600 mt-6 leading-relaxed text-center max-w-2xl">
        Travel Bridge combines AI-powered voice, text, and camera translation to break down language barriers for travelers. Communicate effortlessly across countries with instant multilingual support.
      </p>
      </div>

    <div  className="flex flex-col-reverse lg:flex-row items-center justify-between px-10 py-5 gap-5">

     
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">

  {/* Voice Translation */}
  <div className=" items-center items-start gap-2 p-2 rounded-2xl hover:bg-white hover:shadow-md transition">

    <div className="bg-blue-100 text-blue-600 p-2 rounded-2xl text-2xl * text-center w-12 flex items-center justify-center ">
      🎤
    </div>

    <div>
      <h2 className="font-semibold text-lg text-gray-900">
        Voice Translation
      </h2>

      <p className="text-gray-600 mt-2 text-sm leading-relaxed">
        Real-time voice conversations with instant multilingual translation.
      </p>

      {/* Features List */}
  <div className="mt-4 space-y-5">

    <div className="flex items-center gap-3">
      <span className="text-blue-600 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        Real-time voice recognition
      </p>
    </div>

    <div className="flex items-center gap-3">
      <span className="text-blue-600 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        Natural voice output
      </p>
    </div>

    <div className="flex items-center gap-3">
      <span className="text-blue-600 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        100+ languages supported
      </p>
    </div>

  </div>
    </div>

  </div>

  {/* Camera Translation */}
  <div className=" items-start gap-2 p-2 rounded-2xl hover:bg-white hover:shadow-md transition">

    <div className="bg-green-50 text-green-600 p-2 rounded-2xl text-2xl text-center w-12 flex items-center justify-center">
      📷
    </div>

    <div>
      <h2 className="font-semibold text-lg text-gray-900">
        Camera Translation
      </h2>

      <p className="text-gray-600 mt-2 text-sm leading-relaxed">
        Translate signs, menus, documents, and text instantly using camera OCR.
      </p>
    </div>
    {/* Features List */}
    
<div className="mt-4 space-y-5" >
  <div className="flex items-center gap-3">
      <span className="text-green-600 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        Instant text recognition
      </p>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-green-600 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        Accurate translation results
      </p>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-green-600 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        Works in 100+ languages
      </p>
    </div>
  </div>
    


    
    

  </div>

  {/* Offline Mode */}
  <div className=" items-start gap-2 p-2 rounded-2xl hover:bg-white hover:shadow-md transition">

    <div className="bg-red-100 text-red-500 p-2 rounded-2xl text-2xl text-center w-12 flex items-center justify-center">
      📡
    </div>

    <div>
      <h2 className="font-semibold text-lg text-gray-900">
        Offline Mode
      </h2>

      <p className="text-gray-600 mt-2 text-sm leading-relaxed">
        Access essential translation features even without internet connectivity.
      </p>
    </div>

    <div className="mt-4 space-y-5" >
  <div className="flex items-center gap-3">
      <span className="text-red-500 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        Access to offline translation
      </p>
    </div>

    <div className="flex items-center gap-3"> 
      <span className="text-red-500 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        Downloadable language packs
      </p>
    </div>

    <div className="flex items-center gap-3">
      <span className="text-red-500 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        Works without internet connection
      </p>
    </div>


  </div>
  </div>

  {/* Emergency Help */}
  <div className=" items-start gap-2 p-2 rounded-2xl hover:bg-white hover:shadow-md transition">

    <div className="bg-red-500 text-white p-2 rounded-2xl text-lg font-bold text-center w-12 flex items-center justify-center ">
      SOS
    </div>

    <div>
      <h2 className="font-semibold text-lg text-gray-900">
        Emergency Help
      </h2>

      <p className="text-gray-600 mt-2 text-sm leading-relaxed">
        Quickly communicate and get assistance during critical situations.
      </p>
    </div>

    {/* Features List */}
    <div className="mt-4 space-y-5" >
  <div className="flex items-center gap-3">
      <span className="text-red-500 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        One-tap emergency communication
      </p>
    </div>

    <div className="flex items-center gap-3">
      <span className="text-red-500 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        Pre-translated emergency phrases
      </p>
    </div>

    <div className="flex items-center gap-3"> 
      <span className="text-red-500 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        Works even in offline mode
      </p>
    </div>

  </div>
  </div>

  {/* Multi-language */}
  <div className=" items-start gap-2 p-2 rounded-2xl hover:bg-white hover:shadow-md transition">

    <div className="bg-blue-100 text-blue-600 p-2 rounded-2xl text-2xl text-center w-12 flex items-center justify-center">
      🌍
    </div>

    <div>
      <h2 className="font-semibold text-lg text-gray-900">
        Multi-language
      </h2>

      <p className="text-gray-600 mt-2 text-sm leading-relaxed">
        Support for 100+ languages for seamless global communication.
      </p>
    </div>
    {/* Features List */}
    <div className="mt-4 space-y-5" >
  <div className="flex items-center gap-3">
      <span className="text-blue-600 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        Supports 100+ languages
      </p>
    </div>

    <div className="flex items-center gap-3">
      <span className="text-blue-600 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        Accurate translations across languages
      </p>
    </div>

    <div className="flex items-center gap-3">
      <span className="text-blue-600 text-3m">✔</span>
      <p className="text-gray-700 text-3m">
        Continuous language updates
      </p>
    </div>

  </div>
  </div>
</div>
</div>
<div className="  p-10 ">

  <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

    {/* Left Side */}
    <div className="flex items-center gap-6 flex-1">

      {/* Image */}
      <img
        src={imageFeature}
        alt="Travel"
        className="w-40 object-contain"
      />

      {/* Content */}
      <div>

        <h1 className="text-3xl font-bold text-gray-900">
          Your Global Companion
        </h1>

        {/* Blue line */}
        <div className="w-20 h-1 bg-blue-600 rounded-full mt-3"></div>

        <p className="text-gray-600 mt-5 leading-relaxed max-w-md">

          Whether you're traveling, working,
          or exploring new cultures,
          Travel Bridge is here to help you
          communicate with confidence.

        </p>

      </div>

    </div>

    {/* Right Stats */}
    <div className="flex flex-wrap items-center justify-center gap-10">

      {/* Stat 1 */}
      <div className="text-center border-l border-gray-200 pl-10">

        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-3xl">
          👥
        </div>

        <h2 className="text-4xl font-bold text-blue-600 mt-4">
          1M+
        </h2>

        <p className="text-gray-500 mt-2">
          Happy Users
        </p>

      </div>

      {/* Stat 2 */}
      <div className="text-center border-l border-gray-200 pl-10">

        <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-3xl">
          🌍
        </div>

        <h2 className="text-4xl font-bold text-green-500 mt-4">
          100+
        </h2>

        <p className="text-gray-500 mt-2">
          Languages
        </p>

      </div>

      {/* Stat 3 */}
      <div className="text-center border-l border-gray-200 pl-10">

        <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-3xl">
          ⚡
        </div>

        <h2 className="text-4xl font-bold text-purple-500 mt-4">
          10M+
        </h2>

        <p className="text-gray-500 mt-2">
          Translations Daily
        </p>

      </div>

      {/* Stat 4 */}
      <div className="text-center border-l border-gray-200 pl-10">

        <div className="bg-yellow-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-3xl">
          ⭐
        </div>

        <h2 className="text-4xl font-bold text-yellow-500 mt-4">
          4.8
        </h2>

        <p className="text-gray-500 mt-2">
          User Rating
        </p>

      </div>

  


    </div>
    </div>
    </div>

</div>

{/* Language Section */}
<div id="language" className="max-w-7xl mx-auto  px-10 pt-10  ">
  {/* content Section */}
 <div className=" py-5 flex flex-row items-center justify-between gap-10">
  <div className="flex flex-col items-center max-w-7xl mx-auto px-4">
   <h1 className=" text-4xl font-bold leading-tight mt-4 text-gray-900">
        Travel Bridge<br/>
    Speaks Your Language
      </h1>
      <p className="text-lg text-gray-600 mt-6 leading-relaxed text-center max-w-2xl">
        With support for 100+ languages, Travel Bridge ensures you can communicate effortlessly no matter where you are in the world. Break down language barriers and connect with people globally.
      </p>
 
    <input type="text" placeholder="Search languages..." className="w-full max-w-md px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-8" />

  </div>
  {/*image Section */}
  <div className="flex items-center justify-center">
    <img
      src={languageImage}
      alt="Languages"
      className="w-full max-w-md object-contain  "
    />
  </div>
  
</div>

 <div className="justify-between gap-10 px-6 pt-5">

  <button
    onClick={() => setShowAll(!showAll)}
    className="text-blue-700 py-4 px-4 rounded-lg hover:bg-blue-200"
  >
    {showAll ? "View Less Languages" : "View More Languages"}
  </button>

  <div className="flex flex-wrap items-center gap-5 py-5">

    {(showAll ? languages : languages.slice(0, 7)).map((Lang) => (

      <div
        key={Lang.id}
        className="flex items-center gap-5 mb-5 w-35 p-3 rounded-xl hover:bg-gray-100 transition"
      >
      
        <img
          src={Lang.logo}
          alt={Lang.name}
          className="w-8 h-8 rounded-full"
        />

        <div className="flex flex-col">

          <h2 className="font-semibold text-gray-900">
            {Lang.name}
          </h2>

          <p className="text-sm text-gray-500">
            {Lang.speakers}
          </p>

        </div>

      </div>

    ))}

  </div>
  </div>
 <div className="w-full max-w-7xl mx-auto px-4 py-10">

  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

    {/* Live Translation Demo */}
    <div className="lg:col-span-5 bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-[28px] p-5 border border-gray-100 shadow-sm">

      <h1 className="text-2xl font-bold text-blue-700 mb-5">
        Live Translation Demo
      </h1>

      <div className="flex items-center gap-3">

        {/* Left Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex-1 min-h-[220px] flex flex-col justify-between">

          <div>

            <select className="font-semibold text-gray-700 outline-none text-sm">
              <option>English</option>
            </select>

            <h2 className="text-[32px] font-bold text-gray-900 mt-8 leading-tight">

              Where is
              <br />
              the train station?

            </h2>

          </div>

          <div className="flex justify-end text-blue-600 text-lg">
            🔊
          </div>

        </div>

        {/* Swap Button */}
        <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl shadow-sm shrink-0">

          ⇄

        </div>

        {/* Right Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex-1 min-h-[220px] flex flex-col justify-between">

          <div>

            <select className="font-semibold text-gray-700 outline-none text-sm">
              <option>Japanese</option>
            </select>

            <h2 className="text-[32px] font-bold text-gray-900 mt-8 leading-tight">
              駅はどこですか？
            </h2>

            <p className="text-gray-500 mt-3 text-base">
              (Eki wa doko desu ka?)
            </p>

          </div>

          <div className="flex justify-end text-blue-600 text-lg">
            🔊
          </div>

        </div>

      </div>

    </div>

    {/* Most Useful Languages */}
    <div className="lg:col-span-4 bg-white rounded-[28px] p-5 border border-gray-100 shadow-sm">

      <h1 className="text-2xl font-bold text-gray-900 mb-7">
        Most Useful Languages for Travelers
      </h1>

      <div className="grid grid-cols-2 gap-x-8 gap-y-7">

        {/* Europe */}
        <div>

          <h2 className="font-bold flex items-center gap-2 text-lg mb-4">
            🏛️ Europe
          </h2>

          <div className="space-y-3 text-gray-700">

            <p>🇬🇧 English</p>
            <p>🇫🇷 French</p>
            <p>🇩🇪 German</p>
            <p>🇪🇸 Spanish</p>

          </div>

        </div>

        {/* Asia */}
        <div>

          <h2 className="font-bold flex items-center gap-2 text-lg mb-4">
            ⛩️ Asia
          </h2>

          <div className="space-y-3 text-gray-700">

            <p>🇯🇵 Japanese</p>
            <p>🇰🇷 Korean</p>
            <p>🇨🇳 Chinese</p>
            <p>🇮🇳 Hindi</p>

          </div>

        </div>

        {/* Middle East */}
        <div>

          <h2 className="font-bold flex items-center gap-2 text-lg mb-4">
            🕌 Middle East
          </h2>

          <div className="space-y-3 text-gray-700">

            <p>🇸🇦 Arabic</p>
            <p>🇹🇷 Turkish</p>
            <p>🇮🇷 Persian</p>

          </div>

        </div>

        {/* Americas */}
        <div>

          <h2 className="font-bold flex items-center gap-2 text-lg mb-4">
            🗽 Americas
          </h2>

          <div className="space-y-3 text-gray-700">

            <p>🇬🇧 English</p>
            <p>🇪🇸 Spanish</p>
            <p>🇵🇹 Portuguese</p>

          </div>

        </div>

      </div>

    </div>

    {/* And Many More */}
    <div className="lg:col-span-3 bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-[28px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between">

      <div>

        <h1 className="text-3xl font-bold text-blue-700 leading-tight">
          And Many More!
        </h1>

        <p className="text-gray-600 text-lg mt-5 leading-relaxed">

          From Afrikaans to Zulu,
          we’ve got you covered.

        </p>

        <button className="mt-8 bg-blue-600 text-white px-5 py-3 rounded-2xl hover:bg-blue-700 transition shadow-md text-sm font-medium">

          Explore All Languages →

        </button>

      </div>

      {/* Image */}
      <div className="flex justify-center mt-8">

        <img
          src={worldImage}
          alt="Languages"
          className="w-full max-w-[220px] object-contain"
        />

      </div>

    </div>

  </div>

</div>



  </div>

{/* How It Works Section */}
  <div
  id="how-it-works"
  className="w-full max-w-7xl mx-auto px-6 pt-10"
>

  {/* Heading */}
  <div className="text-center mb-16">

    <p className="text-blue-600 font-semibold uppercase tracking-wide">
      Simple Process
    </p>

    <h1 className="text-5xl font-bold text-gray-900 mt-4">
      How It Works
    </h1>

    <p className="text-gray-600 text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
      Travel Bridge makes communication effortless while traveling.
      Translate conversations, signs, and text instantly in just a few simple steps.
    </p>

  </div>

  {/* Steps */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

    {/* Step 1 */}
    <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100 hover:shadow-lg transition duration-300">

      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl">
        🌍
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-6">
        Choose Language
      </h2>

      <p className="text-gray-600 mt-4 leading-relaxed">
        Select your preferred source and target languages from our wide range of supported languages.
      </p>

    </div>

    {/* Step 2 */}
    <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100 hover:shadow-lg transition duration-300">

      <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-3xl">
        🎤
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-6">
        Speak or Scan
      </h2>

      <p className="text-gray-600 mt-4 leading-relaxed">
        Use voice translation, camera scan, or text input to instantly capture conversations and signs.
      </p>

    </div>

    {/* Step 3 */}
    <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100 hover:shadow-lg transition duration-300">

      <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-3xl">
        ⚡
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-6">
        Instant Translation
      </h2>

      <p className="text-gray-600 mt-4 leading-relaxed">
        Get accurate real-time translations powered by smart AI technology for smooth communication.
      </p>

    </div>

    {/* Step 4 */}
    <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100 hover:shadow-lg transition duration-300">

      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-3xl">
        ✈️
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-6">
        Travel Confidently
      </h2>

      <p className="text-gray-600 mt-4 leading-relaxed">
        Explore new places, connect with locals, and enjoy stress-free travel without language barriers.
      </p>

    </div>

  </div>

</div>
{/* About Us Section */}
<div
  id="about-us"
  className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

    {/* Left Content */}
    <div>

      <p className="text-blue-600 font-semibold uppercase tracking-[3px]">
        About Travel Bridge
      </p>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-5 leading-tight">

        Breaking Language
        <br />
        Barriers Worldwide

      </h1>

      <p className="text-gray-600 text-base sm:text-lg mt-8 leading-relaxed">

        Travel Bridge is designed to help travelers communicate
        confidently anywhere in the world. Whether you're exploring
        busy cities, remote villages, or international destinations,
        our platform provides real-time translation through voice,
        text, and camera technology.

      </p>

      <p className="text-gray-600 text-base sm:text-lg mt-6 leading-relaxed">

        We believe travel should be about connection, discovery,
        and unforgettable experiences — not language limitations.
        Our mission is to make global communication simple,
        fast, and accessible for everyone.

      </p>

      {/* Stats */}
      <div className="flex flex-wrap gap-8 sm:gap-12 mt-12">

        <div>

          <h2 className="text-3xl sm:text-4xl font-bold text-blue-600">
            100+
          </h2>

          <p className="text-gray-500 mt-2">
            Languages Supported
          </p>

        </div>

        <div>

          <h2 className="text-3xl sm:text-4xl font-bold text-green-500">
            1M+
          </h2>

          <p className="text-gray-500 mt-2">
            Happy Travelers
          </p>

        </div>

        <div>

          <h2 className="text-3xl sm:text-4xl font-bold text-purple-500">
            50+
          </h2>

          <p className="text-gray-500 mt-2">
            Countries Connected
          </p>

        </div>

      </div>

    </div>

    {/* Right Side */}
    <div className="relative flex justify-center">

      {/* Main Card */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-[40px] p-6 sm:p-10 shadow-sm border border-gray-100 w-full max-w-xl">

        <img
          src={aboutImage}
          alt="About Travel Bridge"
          className="w-full object-contain rounded-3xl"
        />

      </div>

      {/* Floating Card 1 */}
      <div className="absolute top-4 left-0 sm:-left-6 bg-white shadow-lg rounded-2xl px-4 py-3 border border-gray-100 hidden sm:block">

        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          🌍 Global Access
        </h3>

        <p className="text-gray-500 text-sm mt-1">
          Translate anywhere instantly
        </p>

      </div>

      {/* Floating Card 2 */}
      <div className="absolute bottom-4 right-0 sm:-right-6 bg-white shadow-lg rounded-2xl px-4 py-3 border border-gray-100 hidden sm:block">

        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          ⚡ Real-Time AI
        </h3>

        <p className="text-gray-500 text-sm mt-1">
          Fast and smart translation
        </p>

      </div>

    </div>

  </div>

</div>

{/* Footer */}
<footer className="bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900 text-white mt-6 rounded-t-[40px]">

  <div className="w-full max-w-7xl mx-auto px-6 py-16">

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

      {/* Logo & About */}
      <div className="lg:col-span-2">

        <h1 className="text-4xl font-bold">
          Travel Bridge
        </h1>

        <p className="text-blue-100 mt-6 leading-relaxed text-lg">

          Breaking language barriers for travelers worldwide.
          Translate conversations, signs, and text instantly
          with smart AI-powered communication tools.

        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-4 mt-8">

          <div className="w-11 h-11 rounded-full bg-white/10 hover:bg-blue-600 transition flex items-center justify-center cursor-pointer">
            🌐
          </div>

          <div className="w-11 h-11 rounded-full bg-white/10 hover:bg-blue-600 transition flex items-center justify-center cursor-pointer">
            📘
          </div>

          <div className="w-11 h-11 rounded-full bg-white/10 hover:bg-blue-600 transition flex items-center justify-center cursor-pointer">
            📸
          </div>

          <div className="w-11 h-11 rounded-full bg-white/10 hover:bg-blue-600 transition flex items-center justify-center cursor-pointer">
            🐦
          </div>

        </div>

      </div>

      {/* Quick Links */}
      <div>

        <h2 className="text-2xl font-semibold mb-6">
          Quick Links
        </h2>

        <ul className="space-y-4 text-blue-100">

          <li className="hover:text-white transition cursor-pointer">
            Home
          </li>

          <li className="hover:text-white transition cursor-pointer">
            Features
          </li>

          <li className="hover:text-white transition cursor-pointer">
            Languages
          </li>

          <li className="hover:text-white transition cursor-pointer">
            How It Works
          </li>

          <li className="hover:text-white transition cursor-pointer">
            About Us
          </li>

        </ul>

      </div>

      {/* Features */}
      <div>

        <h2 className="text-2xl font-semibold mb-6">
          Features
        </h2>

        <ul className="space-y-4 text-blue-100">

          <li>🎤 Voice Translation</li>
          <li>📷 Camera Translation</li>
          <li>📝 Text Translation</li>
          <li>🌍 Multi-Language Support</li>
          <li>🚨 Emergency Assistance</li>

        </ul>

      </div>

      {/* Contact */}
      <div>

        <h2 className="text-2xl font-semibold mb-6">
          Contact
        </h2>

        <div className="space-y-5 text-blue-100">

          <p>
            📍 New York, USA
          </p>

          <p>
            📧 support@travelbridge.com
          </p>

          <p>
            📞 +1 (234) 567-890
          </p>

        </div>

      </div>

    </div>

    {/* Bottom Footer */}
    <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-5">

      <p className="text-blue-100 text-sm text-center md:text-left">

        © 2025 Travel Bridge. All rights reserved.

      </p>

      <div className="flex items-center gap-6 text-sm text-blue-100">

        <p className="hover:text-white transition cursor-pointer">
          Privacy Policy
        </p>

        <p className="hover:text-white transition cursor-pointer">
          Terms of Service
        </p>

        <p className="hover:text-white transition cursor-pointer">
          Cookies
        </p>

      </div>

    </div>

  </div>

</footer>
    </div>
    </div>
  )
}

export default Hero
