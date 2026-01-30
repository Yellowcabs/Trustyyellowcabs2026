
import React, { useState, useEffect } from 'react';
import { FileText, User, Phone, MapPin, Calendar, CreditCard, Car, MessageCircle, ArrowRight } from 'lucide-react';
import { BillRequestDetails } from '../types';

export const BillRequest: React.FC = () => {
  const [formData, setFormData] = useState<BillRequestDetails>({
    name: '',
    phone: '',
    date: '',
    pickup: '',
    drop: '',
    amount: '',
    vehicleNumber: '',
  });

  useEffect(() => {
    const now = new Date();
    const indiaDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now);
    
    setFormData(prev => ({ ...prev, date: indiaDate }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    
    const messageText = `*BILL REQUEST - Trustyyellowcabs*
--------------------------------
*Customer:* ${formData.name}
*Phone:* ${formData.phone}
*Trip Date:* ${formData.date}
*Pickup:* ${formData.pickup}
*Drop:* ${formData.drop}
*Vehicle No:* ${formData.vehicleNumber || 'Not Mentioned'}
*Total Fare:* ${formData.amount}
--------------------------------
Please generate a bill for the above trip.`;

    const phoneNumber = '918870088020';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const InputField: React.FC<{ 
    label: string; 
    name: string; 
    type: string; 
    placeholder: string; 
    icon: any; 
    required?: boolean;
    value: string;
    className?: string;
  }> = ({ label, name, type, placeholder, icon: Icon, required, value, className = "" }) => (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
        {label} {required && !label.includes('*') && <span className="text-brand-yellow">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-yellow transition-colors">
          <Icon size={16} />
        </div>
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow/10 focus:border-brand-yellow dark:text-white text-sm font-semibold transition-all"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-yellow/10 rounded-2xl text-brand-yellow mb-6">
            <FileText size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight mb-4">
            Request Bill
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-sm mx-auto">
            Provide your trip details to receive a digital invoice via WhatsApp. (Local IST Time)
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleWhatsAppSend} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Full Name" 
                name="name" 
                type="text" 
                placeholder="Name" 
                icon={User} 
                required 
                value={formData.name}
              />
              <InputField 
                label="Mobile" 
                name="phone" 
                type="tel" 
                placeholder="Phone Number" 
                icon={Phone} 
                required 
                value={formData.phone}
              />
            </div>

            <InputField 
              label="Trip Date (IST)" 
              name="date" 
              type="date" 
              placeholder="" 
              icon={Calendar} 
              required 
              value={formData.date}
            />

            <InputField 
              label="Total Fare *" 
              name="amount" 
              type="text" 
              placeholder="Enter Amount" 
              icon={CreditCard} 
              required 
              value={formData.amount}
              className="bg-brand-yellow/10 p-4 rounded-2xl border border-brand-yellow/30"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="From" 
                name="pickup" 
                type="text" 
                placeholder="Pickup Location" 
                icon={MapPin} 
                required 
                value={formData.pickup}
              />
              <InputField 
                label="To" 
                name="drop" 
                type="text" 
                placeholder="Drop Location" 
                icon={MapPin} 
                required 
                value={formData.drop}
              />
            </div>

            <InputField 
              label="Vehicle Number (Optional)" 
              name="vehicleNumber" 
              type="text" 
              placeholder="TN XX XX 0000" 
              icon={Car} 
              value={formData.vehicleNumber || ''}
            />

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-extrabold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-xl shadow-green-500/20 uppercase tracking-widest text-xs"
              >
                <MessageCircle size={20} />
                Send Request via WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
