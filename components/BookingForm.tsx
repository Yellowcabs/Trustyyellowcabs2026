
import React, { useState, useEffect } from 'react';
import { BookingDetails, VehicleType } from '../types';
import { MapPin, User, Phone, Car, Calendar, Clock, ArrowRight, ArrowLeft, CheckCircle2, MessageCircle } from 'lucide-react';
import { sendBookingEmail } from '../services/emailService';

export const BookingForm: React.FC = () => {
  const [step, setStep] = useState(1);
  
  // Helper to get current Indian Standard Time
  const getIndiaDateTime = () => {
    const now = new Date();
    const date = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now);
    
    const time = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(now);
    
    return { date, time };
  };

  const [formData, setFormData] = useState<BookingDetails>({
    name: '',
    phone: '',
    pickup: '',
    drop: '',
    date: '',
    time: '',
    vehicleType: VehicleType.SEDAN,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [indiaToday, setIndiaToday] = useState('');

  useEffect(() => {
    const { date, time } = getIndiaDateTime();
    setFormData(prev => ({
      ...prev,
      date: date,
      time: time
    }));
    setIndiaToday(date);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (formData.pickup && formData.drop && formData.date && formData.time) {
      setStep(2);
    } else {
      alert("Please fill in all journey details.");
    }
  };

  const prevStep = () => setStep(1);

  const handleWhatsAppConfirm = () => {
    const message = `*NEW RIDE BOOKING CONFIRMATION*%0A
*Name:* ${formData.name}%0A
*Phone:* ${formData.phone}%0A
*Vehicle:* ${formData.vehicleType}%0A
*From:* ${formData.pickup}%0A
*To:* ${formData.drop}%0A
*Date:* ${formData.date}%0A
*Time:* ${formData.time} (IST)%0A%0A
I just submitted my booking on your website. Please confirm availability.`;
    
    const phoneNumber = '918870088020';
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendBookingEmail({ ...formData, time: `${formData.time} (IST)` });
      setSubmitted(true);
    } catch (err) {
      console.error("Booking Error:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const InputWrapper: React.FC<{ children: React.ReactNode, icon: any, label?: string }> = ({ children, icon: Icon, label }) => (
    <div className="relative group">
      {label && <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-yellow transition-colors duration-300">
          <Icon size={16} />
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 w-full max-w-sm mx-auto transition-all duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-6 bg-brand-yellow rounded-full"></div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            {submitted ? 'Booking Received' : 'Book Your Ride'}
          </h3>
        </div>
        {!submitted && (
          <div className="flex gap-1.5">
            <div className={`h-1 w-6 rounded-full transition-colors ${step >= 1 ? 'bg-brand-yellow' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
            <div className={`h-1 w-6 rounded-full transition-colors ${step >= 2 ? 'bg-brand-yellow' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
          </div>
        )}
      </div>
      
      {submitted ? (
        <div className="py-6 text-center animate-fade-in flex flex-col items-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Booking Sent!</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest leading-relaxed px-4 mb-4">
            We have received your request. <br/> 
            <span className="text-brand-yellow">Timing: {formData.time} IST</span>
          </p>

          <div className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-6">
            <button
              onClick={handleWhatsAppConfirm}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-green-500/20 text-[10px] uppercase tracking-widest"
            >
              <MessageCircle size={18} />
              Confirm on WhatsApp
            </button>
          </div>
          
          <button
            onClick={() => { setSubmitted(false); setStep(1); }}
            className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            New Booking Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {step === 1 ? (
            <div className="space-y-3.5 animate-fade-in">
              <InputWrapper icon={MapPin}>
                <input
                  type="text"
                  name="pickup"
                  placeholder="Pickup Location"
                  required
                  value={formData.pickup}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow outline-none text-xs transition-all font-semibold"
                />
              </InputWrapper>

              <InputWrapper icon={MapPin}>
                <input
                  type="text"
                  name="drop"
                  placeholder="Destination"
                  required
                  value={formData.drop}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow outline-none text-xs transition-all font-semibold"
                />
              </InputWrapper>

              <div className="grid grid-cols-2 gap-3.5">
                <InputWrapper icon={Calendar} label="Date">
                  <input
                    type="date"
                    name="date"
                    required
                    min={indiaToday}
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-2 py-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:border-brand-yellow outline-none text-[11px] transition-all font-semibold"
                  />
                </InputWrapper>
                <InputWrapper icon={Clock} label="Time (IST)">
                  <input
                    type="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full pl-10 pr-2 py-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:border-brand-yellow outline-none text-[11px] transition-all font-semibold"
                  />
                </InputWrapper>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.98] transition-all uppercase tracking-widest text-[10px] shadow-lg"
              >
                Continue <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="space-y-3.5 animate-fade-in">
              <InputWrapper icon={Car} label="Vehicle Type">
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:border-brand-yellow outline-none appearance-none text-xs transition-all font-bold"
                >
                  {Object.values(VehicleType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </InputWrapper>

              <InputWrapper icon={User}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:border-brand-yellow outline-none text-xs transition-all font-semibold"
                />
              </InputWrapper>

              <InputWrapper icon={Phone}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-4 rounded-lg border-2 border-slate-900 dark:border-brand-yellow bg-white dark:bg-slate-950 dark:text-white focus:border-brand-yellow outline-none font-extrabold text-base"
                />
              </InputWrapper>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-shrink-0 w-12 bg-slate-50 dark:bg-slate-800 text-slate-400 p-3 rounded-lg hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-yellow text-slate-950 font-extrabold py-4 rounded-lg transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 uppercase tracking-widest shadow-xl shadow-brand-yellow/30 text-[10px]"
                >
                  {loading ? 'Processing...' : 'Book via Email'}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
