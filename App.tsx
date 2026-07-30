
import React, { useState } from 'react';
import { UserRole, UserProfile, ClinicalCase, CaseType } from './types';
import Layout from './components/Layout';
import ClinicalCaseDetails from './components/ClinicalCaseDetails';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [showConsultSelector, setShowConsultSelector] = useState(false);
  
  const [cases, setCases] = useState<ClinicalCase[]>([
    { id: 'case-1', patientName: 'Elena García', professionalId: 'prof-1', patientId: 'pat-1', status: 'active', type: 'lactancia', createdAt: '20-10-2023', lastUpdate: '25-10-2023' },
    { id: 'case-2', patientName: 'Sofía Martínez', professionalId: 'prof-1', patientId: 'pat-2', status: 'active', type: 'destete', createdAt: '15-10-2023', lastUpdate: '22-10-2023' }
  ]);

  const loginAs = (role: UserRole) => {
    const newUser: UserProfile = {
      id: role === UserRole.PROFESSIONAL ? 'prof-1' : 'pat-1',
      name: role === UserRole.PROFESSIONAL ? 'Marina Asesora' : 'Elena García',
      email: role === UserRole.PROFESSIONAL ? 'marina@evaclinic.uy' : 'elena@gmail.com',
      role
    };
    setUser(newUser);
    setActiveTab('dashboard');
    
    // Si es mamá, seleccionamos automáticamente su caso (simulación de caso único)
    if (role === UserRole.PATIENT) {
      const myCase = cases.find(c => c.patientId === 'pat-1');
      if (myCase) {
        setSelectedCase(myCase);
        setActiveTab('history');
      }
    } else {
      setSelectedCase(null);
    }
  };

  const startNewConsultation = (type: CaseType) => {
    const newCase: ClinicalCase = {
      id: `case-${Date.now()}`,
      patientName: user?.role === UserRole.PATIENT ? user.name : 'Nueva Familia',
      professionalId: 'prof-1',
      patientId: user?.id || 'new-pat',
      status: 'active',
      type: type,
      createdAt: new Date().toLocaleDateString(),
      lastUpdate: new Date().toLocaleDateString(),
      formData: {}
    };
    setSelectedCase(newCase);
    setShowConsultSelector(false);
  };

  const saveCaseData = (data: any) => {
    if (!selectedCase) return;
    const updatedCase = { ...selectedCase, formData: data, lastUpdate: new Date().toLocaleDateString() };
    setCases(prev => {
      const exists = prev.find(c => c.id === updatedCase.id);
      if (exists) {
        return prev.map(c => c.id === updatedCase.id ? updatedCase : c);
      }
      return [updatedCase, ...prev];
    });
    setSelectedCase(updatedCase);
    alert('Consulta guardada exitosamente');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF7F9] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#F28C8C]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#7FB7A6]/5 rounded-full blur-2xl"></div>
        
        <div className="max-w-md w-full relative z-10 text-center">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-[#F28C8C] rounded-[32px] text-white shadow-2xl mb-8 transform -rotate-3 transition-transform hover:rotate-0">
              <i className="fas fa-hand-holding-heart text-4xl"></i>
            </div>
            <h1 className="text-5xl font-black text-[#1F2933] tracking-tighter mb-1">EVA ClínicApp</h1>
            <p className="text-[#5F6C7B] font-bold uppercase tracking-[0.2em] text-[10px] opacity-70">
              CUIDADO QUE CONECTA – LACTANCIA & CRIANZA
            </p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => loginAs(UserRole.PROFESSIONAL)}
              className="w-full flex items-center justify-between p-6 rounded-3xl bg-white border border-[#E8DDE2] hover:border-[#F28C8C] transition-all group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-5 text-left">
                <div className="w-14 h-14 bg-[#FFF0F0] rounded-2xl flex items-center justify-center text-[#F28C8C] group-hover:scale-105 transition-transform">
                  <i className="fas fa-hand-sparkles text-xl"></i>
                </div>
                <div>
                  <p className="font-bold text-[#1F2933] text-lg tracking-tight">Soy asesora en lactancia / puericultora</p>
                  <p className="text-[9px] text-[#5F6C7B] font-black tracking-widest uppercase">Gestión Profesional</p>
                </div>
              </div>
              <i className="fas fa-arrow-right text-[#E8DDE2] group-hover:text-[#F28C8C] group-hover:translate-x-1 transition-all"></i>
            </button>

            <button 
              onClick={() => loginAs(UserRole.PATIENT)}
              className="w-full flex items-center justify-between p-6 rounded-3xl bg-white border border-[#E8DDE2] hover:border-[#7FB7A6] transition-all group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-5 text-left">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-[#7FB7A6] group-hover:scale-105 transition-transform">
                  <i className="fas fa-person-shelter text-xl"></i>
                </div>
                <div>
                  <p className="font-bold text-[#1F2933] text-lg tracking-tight">Soy mamá</p>
                  <p className="text-[9px] text-[#5F6C7B] font-black tracking-widest uppercase">Seguimiento de mi Familia</p>
                </div>
              </div>
              <i className="fas fa-arrow-right text-[#E8DDE2] group-hover:text-[#7FB7A6] group-hover:translate-x-1 transition-all"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isProfessional = user.role === UserRole.PROFESSIONAL;

  const renderDashboard = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#1F2933] tracking-tighter">Hola, {user.name.split(' ')[0]}</h2>
          <p className="text-[#5F6C7B] font-medium mt-1">
            {isProfessional ? 'Tu panel de gestión y acompañamiento familiar.' : 'Tu espacio seguro para el cuidado de tu bebé.'}
          </p>
        </div>
        {isProfessional && (
          <button 
            onClick={() => setShowConsultSelector(true)}
            className="bg-[#F28C8C] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#e07b7b] transition-all flex items-center gap-3 shadow-xl shadow-[#F28C8C]/20 active:scale-95"
          >
            <i className="fas fa-plus"></i> Nueva Consulta
          </button>
        )}
      </header>

      {/* Stats - Diferentes por rol */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isProfessional ? (
          <>
            {[
              { label: 'Familias', val: cases.length.toString(), icon: 'fa-users', bg: 'bg-white', text: 'text-[#4A6FA5]' },
              { label: 'En proceso', val: '4', icon: 'fa-clock', bg: 'bg-[#FFF0F0]', text: 'text-[#F28C8C]' },
              { label: 'Mensajes', val: '2', icon: 'fa-comment-dots', bg: 'bg-white', text: 'text-[#7FB7A6]' },
              { label: 'IA Apoyo', val: 'Activa', icon: 'fa-magic', bg: 'bg-white', text: 'text-slate-400' }
            ].map((stat, idx) => (
              <div key={idx} className={`${stat.bg} p-6 rounded-3xl border border-[#E8DDE2] flex flex-col justify-between h-36 transition-all hover:shadow-md`}>
                <div className={`w-10 h-10 rounded-xl ${stat.bg === 'bg-white' ? 'bg-[#FFF7F9]' : 'bg-white'} flex items-center justify-center ${stat.text}`}>
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#5F6C7B] mb-1">{stat.label}</p>
                  <p className={`text-2xl font-black tracking-tighter ${stat.text}`}>{stat.val}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
             {[
              { label: 'Mi Historia', val: 'Completa', icon: 'fa-heart', bg: 'bg-[#FFF0F0]', text: 'text-[#F28C8C]' },
              { label: 'Visitas', val: '1', icon: 'fa-calendar-check', bg: 'bg-white', text: 'text-[#4A6FA5]' },
              { label: 'Registros', val: '12', icon: 'fa-pen-fancy', bg: 'bg-white', text: 'text-[#7FB7A6]' },
              { label: 'Chat Asesora', val: 'Activo', icon: 'fa-comment-dots', bg: 'bg-white', text: 'text-[#4A6FA5]' }
            ].map((stat, idx) => (
              <div key={idx} className={`${stat.bg} p-6 rounded-3xl border border-[#E8DDE2] flex flex-col justify-between h-36 transition-all hover:shadow-md`}>
                <div className={`w-10 h-10 rounded-xl ${stat.bg === 'bg-white' ? 'bg-[#FFF7F9]' : 'bg-white'} flex items-center justify-center ${stat.text}`}>
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#5F6C7B] mb-1">{stat.label}</p>
                  <p className={`text-2xl font-black tracking-tighter ${stat.text}`}>{stat.val}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <section className="bg-white p-8 rounded-[40px] border border-[#E8DDE2] shadow-sm">
         <div className="flex justify-between items-center mb-8">
           <h3 className="text-xl font-black text-[#1F2933] tracking-tight">
             {isProfessional ? 'Historias Recientes' : 'Mi Acompañamiento Actual'}
           </h3>
         </div>
         <div className="space-y-3">
           {cases.filter(c => isProfessional || c.patientId === user.id).map(c => (
             <div 
               key={c.id} 
               onClick={() => { setSelectedCase(c); setActiveTab('history'); }}
               className="p-5 rounded-2xl border border-transparent hover:border-[#F28C8C]/20 hover:bg-[#FFF7F9] transition-all cursor-pointer flex items-center justify-between group"
             >
               <div className="flex items-center gap-5">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${
                   c.type === 'lactancia' ? 'bg-rose-50 text-rose-400' :
                   c.type === 'destete' ? 'bg-slate-50 text-slate-400' :
                   c.type === 'crianza' ? 'bg-green-50 text-green-400' : 'bg-indigo-50 text-indigo-400'
                 }`}>
                    <i className={`fas ${
                      c.type === 'prenatal' ? 'fa-calendar-day' :
                      c.type === 'lactancia' ? 'fa-heart' :
                      c.type === 'crianza' ? 'fa-child' : 'fa-leaf'
                    }`}></i>
                 </div>
                 <div>
                   <p className="font-bold text-[#1F2933]">{isProfessional ? c.patientName : 'Mi proceso de ' + c.type}</p>
                   <p className="text-[10px] text-[#5F6C7B] font-bold uppercase tracking-widest">
                     {c.type === 'prenatal' ? 'Prenatal Lactancia' : c.type}
                   </p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <p className="hidden md:block text-[9px] font-black uppercase tracking-widest text-slate-300">Actualizado: {c.lastUpdate}</p>
                 <i className="fas fa-chevron-right text-slate-200 group-hover:text-[#F28C8C] group-hover:translate-x-1 transition-all"></i>
               </div>
             </div>
           ))}
         </div>
      </section>

      {showConsultSelector && isProfessional && (
        <div className="fixed inset-0 z-[100] bg-[#1F2933]/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl relative">
            <button 
              onClick={() => setShowConsultSelector(false)}
              className="absolute top-8 right-8 text-slate-300 hover:text-[#F28C8C]"
            ><i className="fas fa-times text-xl"></i></button>
            <h3 className="text-2xl font-black text-[#1F2933] mb-2 tracking-tighter">¿Qué consulta iniciamos?</h3>
            <p className="text-[#5F6C7B] text-sm mb-8">Cada formulario está diseñado para tu proceso específico.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'prenatal', label: 'Prenatal Lactancia', icon: 'fa-calendar-day', color: 'bg-indigo-50 text-indigo-500' },
                { id: 'lactancia', label: 'Consulta Lactancia', icon: 'fa-heart', color: 'bg-rose-50 text-rose-500' },
                { id: 'crianza', label: 'Crianza', icon: 'fa-child', color: 'bg-green-50 text-green-500' },
                { id: 'destete', label: 'Destete', icon: 'fa-leaf', color: 'bg-slate-50 text-slate-500' }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => startNewConsultation(type.id as CaseType)}
                  className="flex flex-col items-start p-6 rounded-3xl border border-[#E8DDE2] hover:border-[#F28C8C] hover:shadow-lg transition-all text-left group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 ${type.color}`}>
                    <i className={`fas ${type.icon}`}></i>
                  </div>
                  <p className="font-bold text-[#1F2933]">{type.label}</p>
                  <p className="text-[10px] text-[#5F6C7B] font-medium mt-1">Ir al registro</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Layout 
      user={user} 
      onLogout={() => setUser(null)}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {(activeTab === 'history' || selectedCase) ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isProfessional && (
            <button 
              onClick={() => { setSelectedCase(null); setActiveTab('dashboard'); }}
              className="mb-8 flex items-center gap-2 text-[#5F6C7B] hover:text-[#F28C8C] transition-all font-black text-[10px] uppercase tracking-widest"
            >
              <i className="fas fa-arrow-left"></i> Volver al Inicio
            </button>
          )}
          <ClinicalCaseDetails 
            clinicalCase={selectedCase || cases[0]} 
            user={user} 
            onSaveData={saveCaseData}
          />
        </div>
      ) : renderDashboard()}
    </Layout>
  );
};

export default App;
