import React, { useState, useEffect, useRef } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

import { 
  BookOpen, Home, MessageSquare, User, HelpCircle, 
  Moon, Sun, Send,CheckCircle, LogOut, Calendar as CalendarIcon, 
  Award, Activity, ChevronRight, Mail, Sparkles, 
  Target, Zap, ArrowRight, Info, Code, Terminal, Play, 
  Star, Globe, Users, TrendingUp, Plus
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_LEADERBOARD = [
  { id: 1, name: "Alice J.", points: 1250 },
  { id: 2, name: "Bob Smith", points: 1100 },
  { id: 3, name: "You", points: 950 },
];

const MOCK_COURSES = [
  { id: 1, title: "Introduction to AI", progress: 100, status: 'Completed' },
  { id: 2, title: "Machine Learning Basics", progress: 60, status: 'In Progress' },
  { id: 3, title: "Neural Networks", progress: 0, status: 'Pending' },
];

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Set the REAL user data from the database
  const handleLogin = (userData) => {
    setUser(userData); 
    setCurrentView('app');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  const animationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
    .delay-100 { animation-delay: 100ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-300 { animation-delay: 300ms; }
  `;

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
      <style>{animationStyles}</style>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300 font-sans">
        {currentView === 'home' && <HomeView navigate={setCurrentView} darkMode={darkMode} setDarkMode={setDarkMode} />}
        {currentView === 'login' && <LoginView navigate={setCurrentView} handleLogin={handleLogin} darkMode={darkMode} setDarkMode={setDarkMode} />}
        {currentView === 'signup' && <SignUpView navigate={setCurrentView} handleLogin={handleLogin} darkMode={darkMode} setDarkMode={setDarkMode} />}
        
        {currentView === 'app' && (
          <div className="flex h-screen w-full animate-fade-in-up">
            <aside className="w-64 border-r dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col justify-between hidden md:flex">
              <div>
                <div className="p-6 flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('home')}>
                  <div className="bg-indigo-600 p-2 rounded-lg"><BookOpen className="text-white w-6 h-6" /></div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">LearnSphere</h1>
                </div>
                <nav className="px-4 space-y-2 mt-4 overflow-y-auto">
                  <NavItem icon={<Home />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                  <NavItem icon={<BookOpen />} label="Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
                  <NavItem icon={<MessageSquare />} label="AI Assistant" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
                  <NavItem icon={<Code />} label="Code Editor" active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} />
                  <NavItem icon={<User />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                  <NavItem icon={<Info />} label="FAQ" active={activeTab === 'faq'} onClick={() => setActiveTab('faq')} />
                  <NavItem icon={<HelpCircle />} label="Help Desk" active={activeTab === 'help'} onClick={() => setActiveTab('help')} />
                </nav>
              </div>
              <div className="p-4 border-t dark:border-gray-800 space-y-4">
                <button onClick={() => setDarkMode(!darkMode)} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 w-full p-2">
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}<span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button onClick={handleLogout} className="flex items-center space-x-2 text-sm text-red-500 hover:text-red-400 w-full p-2">
                  <LogOut size={18} /><span>Sign Out</span>
                </button>
              </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8 relative">
              <div className="max-w-6xl mx-auto h-full">
                {activeTab === 'dashboard' && <DashboardView />}
                {activeTab === 'courses' && <CoursesView user={user} />}
                
                {/* Notice how the ChatView is safely inside the return statement now! */}
                {activeTab === 'chat' && <AIChatView user={user} />}
                
                {activeTab === 'editor' && <CodeEditorView />}
                {activeTab === 'profile' && <ProfileView user={user} />}
                {activeTab === 'faq' && <FAQView />}
                {activeTab === 'help' && <HelpDeskView user={user} />}
              </div>
            </main>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
// --- VIEWS ---

function HomeView({ navigate, darkMode, setDarkMode }) {
  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full relative z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg"><BookOpen className="text-white w-6 h-6" /></div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">LearnSphere</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => navigate('login')} className="font-medium hover:text-indigo-500 transition-colors">Log In</button>
          <button onClick={() => navigate('signup')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-transform hover:scale-105 shadow-lg shadow-indigo-500/30">Sign Up Free</button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 relative z-10 mt-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-4 animate-fade-in-up opacity-0">
            <TrendingUp size={16} /> #1 Trending AI Learning Platform Globally
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight animate-fade-in-up opacity-0 delay-100">
            Master Any Topic with <br className="hidden md:block"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">LearnSphere AI</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in-up opacity-0 delay-200">
            LearnSphere is your personal learning assistant. Write code, track progress, and get AI-powered answers strictly based on your curriculum.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0 delay-300">
            <button onClick={() => navigate('signup')} className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg transition-transform hover:scale-105 shadow-xl">
              Start Learning Now <ArrowRight size={20} />
            </button>
            <button onClick={() => navigate('login')} className="px-8 py-4 rounded-2xl font-bold text-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
              View Dashboard
            </button>
          </div>
        </div>

        {/* Global Stats Section */}
        <div className="w-full max-w-5xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-gray-200 dark:border-gray-800 py-10 animate-fade-in-up opacity-0" style={{animationDelay: '400ms'}}>
          <div className="flex flex-col items-center"><Globe className="text-indigo-500 w-8 h-8 mb-3" /><h4 className="text-4xl font-bold">150+</h4><p className="text-gray-500 mt-1">Countries</p></div>
          <div className="flex flex-col items-center"><Users className="text-purple-500 w-8 h-8 mb-3" /><h4 className="text-4xl font-bold">2.5M</h4><p className="text-gray-500 mt-1">Active Learners</p></div>
          <div className="flex flex-col items-center"><Code className="text-pink-500 w-8 h-8 mb-3" /><h4 className="text-4xl font-bold">10M+</h4><p className="text-gray-500 mt-1">Lines of Code Run</p></div>
          <div className="flex flex-col items-center"><Star className="text-yellow-500 w-8 h-8 mb-3" /><h4 className="text-4xl font-bold">4.9/5</h4><p className="text-gray-500 mt-1">User Rating</p></div>
        </div>

        {/* User Testimonials Section */}
        <div className="w-full max-w-6xl mx-auto mt-24 pb-20 animate-fade-in-up opacity-0" style={{animationDelay: '500ms'}}>
          <h3 className="text-3xl font-bold mb-10 text-center">Loved by students worldwide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <TestimonialCard 
              name="Sarah Jenkins" role="Computer Science Student" 
              text="The AI assistant is a lifesaver. It strictly sticks to my syllabus so I don't get distracted by irrelevant info online. The built-in code editor is super fast!" 
            />
            <TestimonialCard 
              name="David Chen" role="Self-Taught Developer" 
              text="LearnSphere completely changed how I study. Seeing myself climb the global leaderboard motivates me to finish my courses every single day." 
            />
            <TestimonialCard 
              name="Maria Rodriguez" role="High School Senior" 
              text="I love how the AI suggests exactly what I should study next when I'm stuck. It feels like having a private tutor available 24/7." 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ name, role, text }) {
  return (
    <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm relative">
      <div className="flex text-yellow-500 mb-4">
        {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">{name.charAt(0)}</div>
        <div>
          <h4 className="font-bold text-sm">{name}</h4>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

function SignUpView({ navigate, handleLogin, darkMode, setDarkMode }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const API_URL = "https://localhost:5000/api/Auth/register"; // <-- CHANGE 7123 TO YOUR C# PORT

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });

      if (response.ok) {
        alert("Registration Successful! Please log in.");
        navigate('login');
      } else {
        const errorText = await response.text();
        setError(errorText);
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  // Google Login hook (Keep your existing one here)
  const loginWithGoogle = useGoogleLogin({
    onSuccess: () => { console.log("Google Auth Success!"); },
    onError: () => console.error('Google Login Failed'),
  });

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decorations omitted for brevity - keep your existing ones! */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800 z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold dark:text-white">Create an Account</h2>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-xl text-sm">{error}</div>}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Full Name</label>
            <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" placeholder="Alex Student" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" placeholder="student@university.edu" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02]">Create Account</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">Already have an account? <button onClick={() => navigate('login')} className="text-indigo-500 font-medium hover:underline">Log in</button></p>
      </div>
    </div>
  );
}

function LoginView({ navigate, handleLogin, darkMode, setDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

 const API_URL = "https://localhost:5000/api/Auth/login";// <-- CHANGE 7123 TO YOUR C# PORT

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const userData = await response.json();
        handleLogin(userData); // Pass real DB data to the app!
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800 z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold dark:text-white">Welcome Back</h2>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-xl text-sm">{error}</div>}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" placeholder="student@university.edu" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02]">Sign In</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">Don't have an account? <button onClick={() => navigate('signup')} className="text-indigo-500 font-medium hover:underline">Sign up for free</button></p>
      </div>
    </div>
  );
}
// --- DASHBOARD COMPONENTS ---

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-200 ${active ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
      {React.cloneElement(icon, { size: 20 })}<span>{label}</span>
    </button>
  );
}

function DashboardView() {
  return (
    <div className="animate-fade-in-up">
      <header className="mb-8"><h2 className="text-3xl font-bold dark:text-white">Overview</h2><p className="text-gray-500 dark:text-gray-400">Welcome back! Here is your real-time learning status.</p></header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<Activity />} title="Study Hours" value="24.5h" trend="+2.5h this week" color="indigo" />
        <StatCard icon={<BookOpen />} title="Topics Completed" value="12" trend="3 pending" color="purple" />
        <StatCard icon={<Award />} title="Current Rank" value="3rd" trend="Top 10%" color="pink" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold flex items-center gap-2"><CalendarIcon size={20}/> Study Calendar</h3></div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, index) => <div key={index} className="font-bold text-gray-400">{d}</div>)} 
            {Array.from({length: 31}).map((_, i) => (<div key={i} className={`p-2 rounded-lg ${i === 14 ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{i + 1}</div>))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Award size={20}/> Leaderboard</h3>
          <ul className="space-y-4">
            {MOCK_LEADERBOARD.map((user, index) => (
              <li key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3"><span className={`font-bold ${index === 0 ? 'text-yellow-500' : 'text-gray-400'}`}>#{index + 1}</span><span className="font-medium">{user.name}</span></div>
                <span className="text-indigo-500 font-bold">{user.points} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, color }) {
  const colorMap = { indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400', purple: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400', pink: 'bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400'};
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${colorMap[color]}`}>{icon}</div>
      <div><p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p><h4 className="text-2xl font-bold">{value}</h4><p className="text-xs text-green-500 mt-1">{trend}</p></div>
    </div>
  );
}

function AdminCoursePanel({ onCourseAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalModules, setTotalModules] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    const newCourse = { title, description, totalModules: parseInt(totalModules) };

    try {
      const response = await fetch("https://localhost:5000/api/Courses", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });

      if (response.ok) {
        alert("Course added to SQL Database successfully!");
        setTitle('');
        setDescription('');
        setTotalModules(1);
        onCourseAdded(); // Refresh the course list
      }
    } catch (err) {
      console.error("Error adding course:", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl mb-10 border-2 border-dashed border-indigo-200 dark:border-indigo-800">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
        <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded">Admin</span> Add New Course
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="Course Title" value={title} onChange={e => setTitle(e.target.value)} required 
          className="p-3 rounded-xl bg-white dark:bg-gray-800 dark:text-white border-none outline-none focus:ring-2 focus:ring-indigo-500" />
        
        <input type="number" placeholder="Total Modules" value={totalModules} onChange={e => setTotalModules(e.target.value)} required 
          className="p-3 rounded-xl bg-white dark:bg-gray-800 dark:text-white border-none outline-none focus:ring-2 focus:ring-indigo-500" />
        
        <button type="submit" disabled={isAdding} className="bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors">
          {isAdding ? "Saving..." : "Push to Database"}
        </button>
        
        <textarea placeholder="Course Description" value={description} onChange={e => setDescription(e.target.value)} required 
          className="md:col-span-3 p-3 rounded-xl bg-white dark:bg-gray-800 dark:text-white border-none outline-none focus:ring-2 focus:ring-indigo-500 h-20" />
      </form>
    </div>
  );
}



function CoursesView({ user }) {
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const userId = user?.id || user?.Id;

  const fetchCatalogAndEnrollments = async () => {
    try {
      const catalogRes = await fetch("https://localhost:5000/api/Courses");
      const catalogData = await catalogRes.json();
      setCourses(catalogData);

      if (userId) {
        const userRes = await fetch(`https://localhost:5000/api/Courses/user/${userId}`);
        if (userRes.ok) {
          const enrolledData = await userRes.json();
          const enrolledMap = {};
          enrolledData.forEach(uc => {
            const courseId = uc.courseId || uc.CourseId || uc.id || uc.Id;
            enrolledMap[courseId] = uc; 
          });
          setUserCourses(enrolledMap);
        }
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogAndEnrollments();
  }, [user]);

  const handleEnroll = async (courseId) => {
    if (!userId) return alert("Please log in first!");

    try {
      const response = await fetch("https://localhost:5000/api/Courses/enroll", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, courseId: courseId })
      });

      if (response.ok) {
        // FIXED: We update the UI instantly but DO NOT fetch stale data from the DB yet.
        setUserCourses(prev => ({
          ...prev,
          [courseId]: { Status: "In Progress", ProgressPercentage: 0 }
        }));
      } else {
        alert(await response.text());
      }
    } catch (err) { alert("Server connection error."); }
  };

  const handleCompleteModule = async (courseId) => {
    if (!userId) {
      alert("Please log in first!");
      return;
    }

    try {
      const response = await fetch("https://localhost:5000/api/Courses/progress", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, courseId: courseId })
      });

      if (response.ok) {
        const result = await response.json();
        const newProgress = result.progress || result.Progress;
        const newStatus = result.status || result.Status;

        // FIXED: Instantly update the UI state
        setUserCourses(prev => ({
          ...prev,
          [courseId]: { 
            ...prev[courseId], 
            ProgressPercentage: newProgress,
            Status: newStatus 
          }
        }));

        if (newStatus === "Completed") {
          setTimeout(() => alert("🎉 Congratulations! You completed this course!"), 100);
        }
      }
    } catch (err) { alert("Failed to update progress."); }
  };

  if (isLoading) return <div className="p-10 text-center dark:text-white">Loading Curriculum...</div>;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-3xl font-bold dark:text-white">Course Catalog</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage and explore your curriculum.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const courseId = course.id || course.Id;
          const title = course.title || course.Title;
          const desc = course.description || course.Description;
          const totalModules = course.totalModules || course.TotalModules || 1;

          const enrollment = userCourses[courseId];
          const isEnrolled = !!enrollment;
          const status = enrollment?.status || enrollment?.Status;
          const isCompleted = status === "Completed";
          const progressPercent = enrollment ? (enrollment.progressPercentage || enrollment.ProgressPercentage || 0) : 0;

          return (
            <div key={courseId} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all flex flex-col">
              
              {/* Top Badges */}
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${isCompleted ? 'bg-green-100 text-green-700' : isEnrolled ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'}`}>
                  {isCompleted ? 'Course completed' : isEnrolled ? 'In Progress' : 'Available'}
                </span>
                <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <BookOpen size={14} /> {totalModules} Modules
                </span>
              </div>
              
              {/* Course Info */}
              <h3 className="text-xl font-bold mb-2 dark:text-white">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 h-12 overflow-hidden flex-1">{desc}</p>
              
              {/* Progress Bar (Only visible if enrolled) */}
              {isEnrolled && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold mb-1 dark:text-gray-400">
                    <span>Progress</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ease-out ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`} 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS (Side-by-side layout) */}
              <div className="flex gap-2 mt-auto">
                {/* Left Side: Enroll / In Progress / Completed */}
                {!isEnrolled ? (
                  <button onClick={() => handleEnroll(courseId)} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-md">
                    Enroll Now
                  </button>
                ) : isCompleted ? (
                  <button disabled className="w-full py-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 font-bold rounded-xl cursor-default flex items-center justify-center gap-2 border border-green-200 dark:border-green-800">
                    <CheckCircle size={18} /> Course Completed
                  </button>
                ) : (
                  <button disabled className="flex-1 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-bold rounded-xl cursor-default border border-blue-200 dark:border-blue-800">
                    In Progress
                  </button>
                )}

                {/* Right Side: Mark as Completed (Hides when 100% finished) */}
                {!isCompleted && (
                  <button 
                    onClick={() => isEnrolled ? handleCompleteModule(courseId) : alert("Please click 'Enroll Now' first!")} 
                    className="flex-1 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold rounded-xl transition-colors shadow-md text-sm">
                    Mark as Completed
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}


//Notice we added 'user' here to get the logged-in user's ID
function AIChatView({ user }) {
  const [sessions, setSessions] = useState([]); // Holds the history sidebar items
  const [currentSessionId, setCurrentSessionId] = useState(null); // Which chat is active
  const [messages, setMessages] = useState([]); // Current conversation messages
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Safely grab the user ID regardless of how the backend formats it (id vs Id)
  const activeUserId = user?.id || user?.Id;
  const activeEmpId = user?.empId || user?.EmpId || "";

  // Fetch the sidebar session history when the component loads
  const fetchSessions = async () => {
    if (!activeUserId) return;
    try {
      const res = await fetch(`https://localhost:5000/api/Ai/sessions/${activeUserId}`);
      if (res.ok) setSessions(await res.json());
    } catch (err) { console.error("Failed to load sessions"); }
  };

  useEffect(() => { fetchSessions(); }, [user]);

  // Load a specific chat from the sidebar
  const loadSession = async (sessionId) => {
    setCurrentSessionId(sessionId);
    try {
      const res = await fetch(`https://localhost:5000/api/Ai/history/${sessionId}`);
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch (err) { console.error("Failed to load chat history"); }
  };

  // Start a brand new blank chat
  const startNewChat = () => {
    setCurrentSessionId(null); 
    setMessages([{ role: 'assistant', text: "Starting a fresh session! What do you want to learn today?" }]);
  };

  // Initialize a default message if it's completely empty
  useEffect(() => {
    if (!currentSessionId && messages.length === 0) {
      setMessages([{ role: 'assistant', text: "Hi! I'm your LearnSphere AI Assistant. How can I help today?" }]);
    }
  }, [currentSessionId, messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch("https://localhost:5000/api/Ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // FIXED: Now safely sending the integer ID and the EmpId!
        body: JSON.stringify({ 
          userId: activeUserId || 0, 
          empId: activeEmpId,
          sessionId: currentSessionId || "", // Pass active session, or empty for new
          message: userMessage.text 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: data.role, text: data.text }]);
        
        // If this was a new chat, the server generated an ID. Set it and refresh sidebar!
        if (!currentSessionId) {
          setCurrentSessionId(data.sessionId);
          fetchSessions(); 
        }
      } else {
         // This will help us see exactly what goes wrong if it fails again
         const errorText = await response.text();
         console.error("Server returned an error:", response.status, errorText);
      }
    } catch (error) {
      console.error("Connection error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] animate-fade-in-up bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      
      {/* SIDEBAR: Chat History */}
      <div className="w-64 border-r dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex flex-col">
        <div className="p-4">
          <button 
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-md"
          >
            <Plus size={18} /> New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
          <p className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Previous Chats</p>
          {sessions.length === 0 && <p className="px-3 text-sm text-gray-400">No history yet.</p>}
          {sessions.map((session) => (
            <button 
              key={session.sessionId}
              onClick={() => loadSession(session.sessionId)}
              className={`w-full text-left px-4 py-3 text-sm rounded-xl truncate transition-colors ${
                currentSessionId === session.sessionId 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              {/* Truncate long titles to look clean */}
              {session.title.length > 25 ? session.title.substring(0, 25) + "..." : session.title}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col relative">
        <header className="p-6 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Sparkles className="text-indigo-500" /> AI Curriculum Tutor
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-gray-500 text-sm ml-4 animate-pulse">AI is thinking...</div>}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              disabled={isLoading}
              placeholder="Ask a question about the curriculum..." 
              className="flex-1 bg-transparent border-none outline-none px-4 dark:text-white" 
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-400 text-white p-3 rounded-xl transition-colors">
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
 
// --- NEW REALISTIC CODE EDITOR COMPONENT ---
function CodeEditorView() {
  const [code, setCode] = useState("function calculateProgress() {\n  const totalTopics = 10;\n  let completed = 7;\n  return (completed / totalTopics) * 100;\n}\n\nconsole.log(`Your progress is ${calculateProgress()}%`);");
  const [output, setOutput] = useState("");

  const handleRunCode = () => {
    setOutput("Executing code...\n\n> Your progress is 70%\n\nProgram exited with code 0.");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in-up">
      <header className="mb-4 flex-shrink-0 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold dark:text-white">Code Playground</h2>
          <p className="text-gray-500 dark:text-gray-400">Practice your coding assignments here.</p>
        </div>
        <button onClick={handleRunCode} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-green-500/30 transition-transform hover:scale-105">
          <Play size={18} fill="currentColor" /> Run Code
        </button>
      </header>
      
      {/* Fake IDE Layout */}
      <div className="flex-1 bg-[#1e1e1e] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col overflow-hidden font-mono text-sm">
        {/* Editor Tabs */}
        <div className="flex bg-[#252526] border-b border-[#3c3c3c]">
          <div className="px-4 py-2 bg-[#1e1e1e] border-t-2 border-indigo-500 text-gray-200 flex items-center gap-2">
            <Code size={14} className="text-yellow-400" /> main.js
          </div>
          <div className="px-4 py-2 text-gray-500 hover:bg-[#2a2d2e] cursor-pointer flex items-center gap-2">
            <Code size={14} className="text-blue-400" /> style.css
          </div>
        </div>
        
        {/* Code Input Area (Mocking Line Numbers) */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-10 bg-[#1e1e1e] border-r border-[#3c3c3c] flex flex-col items-center py-4 text-[#858585] select-none">
            {[1,2,3,4,5,6,7,8].map(num => <div key={num}>{num}</div>)}
          </div>
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 bg-transparent resize-none outline-none text-[#d4d4d4] leading-relaxed whitespace-pre"
            spellCheck="false"
          ></textarea>
        </div>

        {/* Console Output Terminal */}
        <div className="h-48 bg-[#1e1e1e] border-t border-[#3c3c3c] flex flex-col">
          <div className="bg-[#252526] px-4 py-1 flex items-center gap-2 text-gray-300 text-xs tracking-wider uppercase border-b border-[#3c3c3c]">
            <Terminal size={12} /> Output Console
          </div>
          <div className="flex-1 p-4 overflow-y-auto text-green-400 whitespace-pre-wrap">
            {output || "> Ready to run."}
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQView() {
  const faqs = [
    { q: "How does the LearnSphere AI Assistant work?", a: "Our AI is strictly programmed to answer questions based solely on your assigned curriculum. It will not give you outside information, ensuring you stay focused on your specific learning path." },
    { q: "How is my leaderboard rank calculated?", a: "Your rank is based on a point system. You earn points by completing course modules, taking quizzes, and interacting actively with the curriculum." },
    { q: "What languages does the Code Editor support?", a: "The built-in code playground currently supports JavaScript, Python, HTML, and CSS. We are adding more languages soon!" },
    { q: "What should I do if I find an error in the curriculum?", a: "Please head over to the 'Help Desk' tab and submit a ticket under the 'Curriculum Error' category. Our admin team will fix it immediately." }
  ];

  return (
    <div className="animate-fade-in-up max-w-3xl mx-auto mt-4">
      <header className="mb-8 text-center">
        <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4"><Info size={32} /></div>
        <h2 className="text-3xl font-bold dark:text-white">Frequently Asked Questions</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Everything you need to know about LearnSphere.</p>
      </header>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold mb-2 flex items-start gap-3"><span className="text-indigo-500">Q.</span> {faq.q}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed ml-7">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileView({ user }) {
  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto mt-10">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
        <div className="w-32 h-32 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-xl"><User className="w-16 h-16 text-white" /></div>
        <h2 className="text-3xl font-bold mb-2">{user?.name}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{user?.email} • {user?.role}</p>
        <div className="text-left space-y-4 border-t dark:border-gray-800 pt-6">
          <h3 className="font-bold text-lg">Account Details</h3>
          <div className="flex justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"><span className="text-gray-500 dark:text-gray-400">Student ID</span><span className="font-medium">#STU-84920</span></div>
          <div className="flex justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"><span className="text-gray-500 dark:text-gray-400">Enrollment Date</span><span className="font-medium">September 1, 2023</span></div>
        </div>
      </div>
    </div>
  );
}

// Notice we pass the 'user' prop here!
function HelpDeskView({ user }) {
  const [category, setCategory] = useState('Technical Issue');
  const [description, setDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setStatusMessage('Sending...');

    try {
      const response = await fetch("https://localhost:5000/api/HelpDesk/submit", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.Id,
          category: category,
          description: description
        })
      });

      if (response.ok) {
        setStatusMessage('Success! Your ticket has been sent to the administrators.');
        setDescription(''); // Clear the textarea
      } else {
        setStatusMessage('Error: Failed to submit the ticket.');
      }
    } catch (err) {
      setStatusMessage('Error: Could not connect to the server.');
    }
  };

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto mt-10">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl"><Mail size={24} /></div>
          <div><h2 className="text-2xl font-bold">Help Desk</h2><p className="text-gray-500 dark:text-gray-400">Raise a query to the administrators.</p></div>
        </div>

        {/* Status Message Display */}
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${statusMessage.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleQuerySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Issue Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none">
              <option>Technical Issue</option>
              <option>Curriculum Error</option>
              <option>Account Assistance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="5" required className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none resize-none" placeholder="Describe your issue here..."></textarea>
          </div>
          <button type="submit" className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl transition-transform hover:scale-[1.02]">
            Send Message to Admin
          </button>
        </form>
      </div>
    </div>
  );
}