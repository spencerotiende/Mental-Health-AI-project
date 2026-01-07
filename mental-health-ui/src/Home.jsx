import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predict } from "./services/api";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// --- Configuration ---
const steps = [
  {
    id: 1,
    title: "The Basics",
    subtitle: "Let's get to know you.",
    fields: [
      { name: "age", label: "Age", type: "number", width: "half", placeholder: "e.g. 24" },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"], width: "half" },
      { name: "city", label: "Current City", type: "text", width: "full", placeholder: "e.g. Nairobi, London" },
    ]
  },
  {
    id: 2,
    title: "Occupation & Study",
    subtitle: "What keeps you busy?",
    fields: [
      { name: "occupation_status", label: "Status", type: "select", options: ["Student", "Working Professional", "Retired", "Unemployed"], width: "half" },
      { name: "profession", label: "Profession/Major", type: "text", width: "half", placeholder: "e.g. Computer Science" },
      { name: "degree", label: "Current Degree", type: "text", width: "full", placeholder: "e.g. B.Sc in IT" },
      { name: "work_study_hours", label: "Daily Hours Spent", type: "number", width: "half", placeholder: "e.g. 8" },
      { name: "cgpa", label: "CGPA / GPA", type: "number", step: "0.1", width: "half", placeholder: "e.g. 3.5" },
    ]
  },
  {
    id: 3,
    title: "Pressure & Satisfaction",
    subtitle: "How are things weighing on you?",
    fields: [
      { name: "academic_pressure", label: "Academic Pressure (1-5)", type: "range", min: 1, max: 5, width: "half" },
      { name: "work_pressure", label: "Work Pressure (1-5)", type: "range", min: 1, max: 5, width: "half" },
      { name: "study_satisfaction", label: "Study Satisfaction (1-5)", type: "range", min: 1, max: 5, width: "half" },
      { name: "job_satisfaction", label: "Job Satisfaction (1-5)", type: "range", min: 1, max: 5, width: "half" },
    ]
  },
  {
    id: 4,
    title: "Lifestyle Habits",
    subtitle: "Your daily routine matters.",
    fields: [
      { name: "sleep_duration", label: "Sleep Duration", type: "select", options: ["Less than 5 hours", "5-6 hours", "7-8 hours", "More than 8 hours"], width: "half" },
      { name: "dietary_habits", label: "Dietary Habits", type: "select", options: ["Healthy", "Moderate", "Unhealthy"], width: "half" },
      { name: "financial_stress", label: "Financial Stress (1-5)", type: "range", min: 1, max: 5, width: "full" },
    ]
  },
  {
    id: 5,
    title: "Mental History",
    subtitle: "Strictly confidential.",
    fields: [
      { name: "family_history_mental_illness", label: "Family History of Mental Illness", type: "select", options: ["No", "Yes"], width: "full" },
      { name: "suicidal_thoughts", label: "History of Suicidal Thoughts", type: "select", options: ["No", "Yes"], width: "full" },
    ]
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [form, setForm] = useState({
    age: "", gender: "Male", city: "",
    occupation_status: "Student", profession: "", degree: "",
    work_study_hours: "", cgpa: "",
    academic_pressure: 3, work_pressure: 3, study_satisfaction: 3, job_satisfaction: 3,
    sleep_duration: "7-8 hours", dietary_habits: "Healthy", financial_stress: 3,
    family_history_mental_illness: "No", suicidal_thoughts: "No",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    const currentFields = steps[currentStep].fields;
    const isStepValid = currentFields.every(field => {
        if ((field.type === 'text' || field.type === 'number') && form[field.name] === "") {
            return false;
        }
        return true;
    });

    if (!isStepValid) {
        alert("Please fill in all fields to continue.");
        return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await predict(form);
      navigate("/result", { state: result });
    } catch (error) {
      console.error("Prediction failed", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="page-container">
      {/* --- INJECTED CSS --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --bg-cream: #F9F7F2;
          --text-espresso: #2C241F;
          --text-mocha: #5D4037;
          --text-muted: #8C6B5D;
          --border-latte: #E6D5C3;
          --white-glass: rgba(255, 255, 255, 0.95);
        }

        * { box-sizing: border-box; }
        
        .page-container {
          min-height: 100vh;
          background-color: var(--bg-cream);
          font-family: 'Inter', sans-serif;
          color: var(--text-espresso);
          padding: 2rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; z-index: 0; animation: float 10s infinite ease-in-out; }
        .blob-1 { top: -10%; right: -5%; width: 500px; height: 500px; background: #E6D5C3; }
        .blob-2 { bottom: -10%; left: -10%; width: 600px; height: 600px; background: #D4C4B5; animation-delay: 2s; }
        @keyframes float { 0% { transform: translate(0, 0); } 50% { transform: translate(20px, 40px); } 100% { transform: translate(0, 0); } }

        .card-wrapper {
          position: relative; z-index: 10; width: 100%; max-width: 650px;
          background: var(--white-glass); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255,255,255, 0.6); border-radius: 32px;
          box-shadow: 0 25px 50px -12px rgba(74, 59, 50, 0.15);
          overflow: hidden; transition: height 0.3s ease;
        }

        .progress-container { width: 100%; height: 6px; background: #EAE0D5; }
        .progress-fill { height: 100%; background: var(--text-espresso); transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); }

        .card-header { padding: 2.5rem 2.5rem 0.5rem 2.5rem; text-align: left; }
        .step-indicator { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-weight: 600; margin-bottom: 0.5rem; display: block; }
        h2 { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: var(--text-espresso); margin: 0 0 0.5rem 0; }
        .subtitle { color: var(--text-mocha); font-size: 1rem; opacity: 0.8; margin: 0; }

        .card-body { padding: 2rem 2.5rem; }
        .fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .full { grid-column: span 2; }
        .half { grid-column: span 1; }

        label { display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; }

        /* SHARED INPUT STYLES */
        input[type="text"], input[type="number"], select {
          width: 100%; padding: 16px; border-radius: 16px; border: 1px solid var(--border-latte);
          background: #FCFAF8; color: var(--text-espresso); font-family: 'Inter', sans-serif;
          font-size: 1rem; outline: none; transition: all 0.2s;
        }
        input::placeholder { color: #C8B6A6; font-style: italic; }
        
        /* DROPDOWN SPECIFIC STYLING */
        select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          cursor: pointer;
          /* Custom SVG Chevron Arrow in Brown */
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235D4037%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.2rem;
          padding-right: 2.5rem;
        }

        /* Focus States */
        input:focus, select:focus {
          border-color: var(--text-muted); box-shadow: 0 0 0 4px rgba(140, 107, 93, 0.1); background: #fff;
        }

        .range-wrapper { background: #FCFAF8; padding: 1.25rem; border-radius: 16px; border: 1px solid var(--border-latte); }
        .range-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .range-val { font-size: 1.25rem; font-weight: bold; font-family: 'Playfair Display', serif; }
        
        input[type="range"] { width: 100%; -webkit-appearance: none; background: transparent; }
        input[type="range"]::-webkit-slider-runnable-track { width: 100%; height: 6px; background: #E6D5C3; border-radius: 3px; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 20px; width: 20px; border-radius: 50%;
          background: var(--text-espresso); cursor: pointer; margin-top: -7px;
          border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .card-footer { padding: 1.5rem 2.5rem 2.5rem 2.5rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(230, 213, 195, 0.3); }

        .btn { padding: 14px 28px; border-radius: 14px; border: none; font-size: 1rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .btn-ghost { background: transparent; color: var(--text-muted); }
        .btn-ghost:hover { background: rgba(140, 107, 93, 0.1); color: var(--text-espresso); }
        .btn-primary { background: var(--text-espresso); color: #fff; box-shadow: 0 8px 20px -5px rgba(44, 36, 31, 0.3); }
        .btn-primary:hover { transform: translateY(-2px); background: #43302B; box-shadow: 0 12px 25px -5px rgba(44, 36, 31, 0.4); }
        .btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        @media (max-width: 600px) {
          .card-header, .card-body, .card-footer { padding-left: 1.5rem; padding-right: 1.5rem; }
          .grid { grid-template-columns: 1fr; }
          .half { grid-column: span 1; }
          h2 { font-size: 1.8rem; }
        }
      `}</style>

      {/* Background Ambience */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="card-wrapper">
        <div className="progress-container">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <div className="card-header fade-in-up" key={`header-${currentStep}`}>
          <span className="step-indicator">Step {currentStep + 1} of {steps.length}</span>
          <h2>{steps[currentStep].title}</h2>
          <p className="subtitle">{steps[currentStep].subtitle}</p>
        </div>

        <div className="card-body">
          <form className="grid fade-in-up" key={`form-${currentStep}`}>
            {steps[currentStep].fields.map((field) => (
              <div key={field.name} className={field.width}>
                
                {field.type === "range" ? (
                  <div className="range-wrapper">
                     <div className="range-header">
                        <label style={{marginBottom: 0}}>{field.label}</label>
                        <span className="range-val">{form[field.name]}</span>
                     </div>
                     <input
                      type="range"
                      name={field.name}
                      min={field.min} max={field.max}
                      value={form[field.name]}
                      onChange={handleChange}
                    />
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'#8C6B5D', marginTop:'0.5rem'}}>
                        <span>Low</span><span>High</span>
                    </div>
                  </div>
                ) : field.type === "select" ? (
                  <div>
                    <label>{field.label}</label>
                    <select name={field.name} value={form[field.name]} onChange={handleChange}>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label>{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      step={field.step}
                      placeholder={field.placeholder || "..."}
                      required
                    />
                  </div>
                )}
              </div>
            ))}
          </form>
        </div>

        <div className="card-footer">
          {currentStep > 0 ? (
            <button className="btn btn-ghost" onClick={handleBack} type="button">
              <ChevronLeft size={20} /> Back
            </button>
          ) : (
             <div></div>
          )}

          <button 
            className="btn btn-primary" 
            onClick={handleNext} 
            disabled={loading}
          >
            {currentStep === steps.length - 1 ? (
              <>{loading ? "Analyzing..." : "Finish Analysis"} <Sparkles size={18} /></>
            ) : (
              <>Continue <ChevronRight size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}