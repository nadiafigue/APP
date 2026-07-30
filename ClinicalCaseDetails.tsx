
import React, { useState } from 'react';
import VoiceInput from './VoiceInput';

interface PatientFormProps {
  onSubmit: (data: Record<string, any>) => void;
  initialData?: any;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    birthDate: '',
    babyName: '',
    birthWeight: '',
    feedingType: 'exclusive',
    concerns: '',
    history: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleVoiceTranscript = (field: string) => (text: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: prev[field] ? `${prev[field]} ${text}` : text }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Bebé</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none"
            value={formData.babyName}
            onChange={e => setFormData({...formData, babyName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
          <input 
            type="date" 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none"
            value={formData.birthDate}
            onChange={e => setFormData({...formData, birthDate: e.target.value})}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Motivo de consulta y preocupaciones</label>
        <div className="relative">
          <textarea 
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none"
            value={formData.concerns}
            onChange={e => setFormData({...formData, concerns: e.target.value})}
            placeholder="Describe brevemente por qué buscas asesoría..."
          />
          <VoiceInput 
            className="absolute bottom-2 right-2 scale-75" 
            onTranscript={handleVoiceTranscript('concerns')} 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Antecedentes relevantes</label>
        <div className="relative">
          <textarea 
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none"
            value={formData.history}
            onChange={e => setFormData({...formData, history: e.target.value})}
            placeholder="Parto, complicaciones, experiencias previas..."
          />
          <VoiceInput 
            className="absolute bottom-2 right-2 scale-75" 
            onTranscript={handleVoiceTranscript('history')} 
          />
        </div>
      </div>

      <button 
        type="submit"
        className="w-full bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 transition-colors shadow-lg shadow-rose-100"
      >
        Guardar Historia Clínica
      </button>
    </form>
  );
};

export default PatientForm;
