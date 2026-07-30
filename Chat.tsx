
import React, { useState } from 'react';
import { ClinicalCase, UserRole, UserProfile, DailyLog, FollowUp, ClinicalFile } from '../types';
import VoiceInput from './VoiceInput';
import Chat from './Chat';
import CaseForms from './CaseForms';
import FileUploader from './FileUploader';
import { summarizeClinicalHistory, suggestActionPlan } from '../services/geminiService';

interface CaseProps {
  clinicalCase: ClinicalCase;
  user: UserProfile;
  onSaveData?: (data: any) => void;
}

const ClinicalCaseDetails: React.FC<CaseProps> = ({ clinicalCase, user, onSaveData }) => {
  const [activeView, setActiveView] = useState<'history' | 'strategy' | 'followups' | 'logs' | 'files' | 'chat'>('history');
  const [summary, setSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [strategy, setStrategy] = useState<string>('La guía aún no ha sido definida por la asesora.');
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [newLog, setNewLog] = useState('');
  const [newFollowUp, setNewFollowUp] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [logs, setLogs] = useState<DailyLog[]>([
    { id: '1', caseId: clinicalCase.id, patientId: clinicalCase.patientId, content: 'Día tranquilo. Mayor confianza al acompañar el sueño.', createdAt: new Date().toISOString() }
  ]);
  const [followups, setFollowups] = useState<FollowUp[]>([
    { id: '1', caseId: clinicalCase.id, date: '2023-10-24', notes: 'Observación de dinámica. La familia se siente escuchada.', privateNotes: 'Mantener seguimiento sobre el destete nocturno.' }
  ]);
  const [files, setFiles] = useState<ClinicalFile[]>([
    { id: 'f2', caseId: clinicalCase.id, name: 'Registro de sueño.jpg', type: 'image', url: 'https://picsum.photos/seed/sleep1/400/400', uploadedBy: 'Mama', createdAt: '2023-10-22T14:30:00Z' }
  ]);

  const isProfessional = user.role === UserRole.PROFESSIONAL;

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    const result = await summarizeClinicalHistory(clinicalCase.formData || { type: clinicalCase.type });
    setSummary(result);
    setIsLoadingSummary(false);
  };

  const handleGenerateStrategy = async () => {
    setIsGeneratingStrategy(true);
    const context = followups.map(f => f.notes).join('. ');
    const result = await suggestActionPlan(context);
    setStrategy(result);
    setIsGeneratingStrategy(false);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setTimeout(() => {
      const newFile: ClinicalFile = {
        id: Date.now().toString(),
        caseId: clinicalCase.id,
        name: file.name,
        type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'pdf',
        url: URL.createObjectURL(file),
        uploadedBy: user.name,
        createdAt: new Date().toISOString()
      };
      setFiles([newFile, ...files]);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* CASE HEADER - LIGHTER COLORS */}
      <div className="bg-white rounded-[40px] p-8 border border-[#E8DDE2] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF0F0] text-[#F28C8C] flex items-center justify-center text-3xl">
             <i className={`fas ${clinicalCase.type === 'prenatal' ? 'fa-calendar-day' : 'fa-hand-holding-heart'}`}></i>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#7FB7A6]/10 text-[#7FB7A6] rounded-lg text-[9px] font-black uppercase tracking-widest">
                En Acompañamiento
              </span>
              <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">
                ID: {clinicalCase.id.slice(-4)}
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#1F2933] tracking-tighter">
              {isProfessional ? clinicalCase.patientName : 'Mi Historia de Cuidado'}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{clinicalCase.type === 'prenatal' ? 'Prenatal Lactancia' : clinicalCase.type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isProfessional && (
            <button 
              onClick={handleGenerateSummary}
              disabled={isLoadingSummary}
              className="px-5 py-3 bg-[#F28C8C]/10 text-[#F28C8C] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#F28C8C] hover:text-white transition-all shadow-sm"
            >
              <i className={`fas ${isLoadingSummary ? 'fa-spinner fa-spin' : 'fa-magic'} mr-2`}></i>
              Análisis IA
            </button>
          )}
        </div>
      </div>

      {/* TABS - MORE SPACING AND LIGHTER WEIGHT */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-[#E8DDE2] overflow-x-auto scrollbar-hide">
        {[
          { id: 'history', label: 'Historia', icon: 'fa-book-open' },
          { id: 'strategy', label: 'Guía', icon: 'fa-lightbulb' },
          { id: 'followups', label: 'Visitas', icon: 'fa-calendar-check' },
          { id: 'logs', label: 'Mi Diario', icon: 'fa-pen-fancy' },
          { id: 'files', label: 'Galería', icon: 'fa-images' },
          { id: 'chat', label: 'Chat', icon: 'fa-comments' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeView === tab.id ? 'bg-[#F28C8C] text-white shadow-md' : 'text-slate-400 hover:text-[#F28C8C]'
            }`}
          >
            <i className={`fas ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-500">
        {activeView === 'history' && (
          <div className="space-y-6">
            {isProfessional && summary && (
              <div className="bg-[#FFF0F0] p-8 rounded-3xl border border-[#F28C8C]/20 shadow-sm animate-in zoom-in duration-300">
                <p className="text-[#F28C8C] font-black uppercase tracking-[2px] text-[10px] mb-3 flex items-center gap-2">
                  <i className="fas fa-brain"></i> Análisis Profesional (Solo Asesora)
                </p>
                <p className="text-[#1F2933] leading-relaxed font-medium italic">"{summary}"</p>
              </div>
            )}
            <CaseForms 
              type={clinicalCase.type} 
              initialData={clinicalCase.formData}
              readOnly={!isProfessional} // Mamá solo visualiza
              onSubmit={(data) => onSaveData?.(data)}
            />
          </div>
        )}

        {activeView === 'strategy' && (
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-[#E8DDE2]">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-[#1F2933] tracking-tighter">Guía Sugerida</h3>
               {isProfessional && (
                 <button 
                   onClick={handleGenerateStrategy}
                   disabled={isGeneratingStrategy}
                   className="text-[#F28C8C] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:underline"
                 >
                   <i className={`fas ${isGeneratingStrategy ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i> Sugerencia IA
                 </button>
               )}
             </div>
             <div className="p-8 bg-[#FFF7F9] rounded-3xl border border-dashed border-[#E8DDE2] text-[#5F6C7B] leading-loose whitespace-pre-wrap italic">
               {strategy}
             </div>
          </div>
        )}

        {activeView === 'followups' && (
          <div className="space-y-6">
            {isProfessional && (
              <div className="bg-white p-8 rounded-[32px] border border-[#E8DDE2] shadow-sm">
                <h3 className="text-lg font-black text-[#1F2933] mb-4">Nueva nota de visita</h3>
                <textarea 
                  className="w-full p-6 rounded-2xl bg-[#FFF7F9] border border-[#E8DDE2] outline-none min-h-[120px] mb-4 text-sm font-medium"
                  placeholder="Escribe los avances, acuerdos y sentires de hoy..."
                  value={newFollowUp}
                  onChange={e => setNewFollowUp(e.target.value)}
                />
                <button 
                  onClick={() => {
                    if (newFollowUp.trim()) {
                      setFollowups([{ id: Date.now().toString(), caseId: clinicalCase.id, date: new Date().toISOString(), notes: newFollowUp }, ...followups]);
                      setNewFollowUp('');
                    }
                  }}
                  className="w-full bg-[#F28C8C] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#e07b7b] transition-all"
                >
                  Registrar visita
                </button>
              </div>
            )}
            <div className="relative pl-8 space-y-6 before:content-[''] before:absolute before:left-[15px] before:top-0 before:w-0.5 before:h-full before:bg-[#E8DDE2]">
              {followups.map(f => (
                <div key={f.id} className="relative">
                  <div className="absolute -left-[10px] top-1 w-5 h-5 rounded-full bg-white border-4 border-[#F28C8C] shadow-sm"></div>
                  <div className="bg-white p-8 rounded-3xl border border-[#E8DDE2] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-[10px] font-black text-[#F28C8C] uppercase">{new Date(f.date).toLocaleDateString()}</p>
                      <span className="text-[8px] font-black text-[#7FB7A6] uppercase tracking-widest px-2 py-0.5 bg-green-50 rounded-md">Validado por Asesora</span>
                    </div>
                    <p className="text-[#1F2933] leading-relaxed font-medium">{f.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'logs' && (
          <div className="space-y-6">
            {!isProfessional && (
              <div className="bg-[#F28C8C] p-8 rounded-[32px] text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-full bg-white/5 -skew-x-12 translate-x-10"></div>
                <h3 className="text-xl font-black mb-4 relative z-10">Tu Diario de Calma</h3>
                <div className="relative z-10">
                  <textarea 
                    className="w-full p-6 rounded-2xl bg-white/10 text-white placeholder-white/50 border-none outline-none min-h-[120px] mb-4 font-medium"
                    placeholder="¿Cómo te sientes hoy? ¿Hay algo que quieras compartir con tu asesora?"
                    value={newLog}
                    onChange={e => setNewLog(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <VoiceInput className="flex-1 justify-center bg-white/20 hover:bg-white/30 text-white border-none" label="Voz a Texto" onTranscript={t => setNewLog(p => p + ' ' + t)} />
                    <button 
                      onClick={() => {
                        if (newLog.trim()) {
                          setLogs([{ id: Date.now().toString(), caseId: clinicalCase.id, patientId: user.id, content: newLog, createdAt: new Date().toISOString() }, ...logs]);
                          setNewLog('');
                        }
                      }}
                      className="flex-[2] bg-white text-[#F28C8C] py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#FFF7F9] transition-all"
                    >
                      Compartir registro
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {logs.map(l => (
                <div key={l.id} className="bg-white p-6 rounded-3xl border border-[#E8DDE2] shadow-sm relative group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7FB7A6]/10 text-[#7FB7A6] flex items-center justify-center text-xs">
                       <i className="fas fa-heart"></i>
                    </div>
                    <p className="text-[10px] font-black text-[#7FB7A6] uppercase tracking-widest">Familia García</p>
                  </div>
                  <p className="text-sm font-semibold italic text-[#1F2933]">"{l.content}"</p>
                  <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-4 text-right">
                    {new Date(l.createdAt).toLocaleDateString()} · {new Date(l.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'files' && (
          <div className="space-y-6">
            <FileUploader onUpload={handleFileUpload} isUploading={isUploading} />
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map(file => (
                <div key={file.id} className="aspect-square rounded-2xl overflow-hidden border border-[#E8DDE2] relative group shadow-sm bg-white">
                  <img src={file.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                  <div className="absolute inset-0 bg-[#F28C8C]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <button className="bg-white p-3 rounded-full text-[#F28C8C] shadow-lg"><i className="fas fa-expand"></i></button>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-[7px] font-black text-white uppercase bg-black/40 px-2 py-1 rounded truncate">{file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'chat' && (
          <div className="bg-white rounded-[40px] border border-[#E8DDE2] overflow-hidden shadow-sm">
             <Chat caseId={clinicalCase.id} user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalCaseDetails;
