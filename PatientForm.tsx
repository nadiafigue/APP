
import React from 'react';
import { UserRole, UserProfile } from '../types';

interface LayoutProps {
  user: UserProfile;
  children: React.ReactNode;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, children, onLogout, activeTab, setActiveTab }) => {
  const isProfessional = user.role === UserRole.PROFESSIONAL;

  const NavItem = ({ id, label, icon }: { id: string; label: string; icon: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
        activeTab === id 
          ? 'bg-[#F28C8C] text-white shadow-lg shadow-[#F28C8C]/20' 
          : 'text-[#5F6C7B] hover:bg-white hover:text-[#F28C8C]'
      }`}
    >
      <i className={`fas ${icon} text-lg ${activeTab === id ? 'text-white' : 'group-hover:text-[#F28C8C]'}`}></i>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFF7F9]">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-72 bg-white/60 backdrop-blur-md border-r border-[#E8DDE2] flex-col p-8 sticky top-0 h-screen z-40">
        <div className="flex flex-col gap-1 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F28C8C] rounded-xl flex items-center justify-center text-white shadow-xl shadow-[#F28C8C]/20">
              <i className="fas fa-hand-holding-heart text-xl"></i>
            </div>
            <h1 className="font-extrabold text-2xl tracking-tight text-[#1F2933]">EVA ClínicApp</h1>
          </div>
          <p className="text-[9px] text-[#5F6C7B] font-black uppercase tracking-[0.15em] ml-1 mt-1 opacity-60">
            CUIDADO QUE CONECTA – LACTANCIA & CRIANZA
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem id="dashboard" label="Inicio" icon="fa-home" />
          {isProfessional ? (
            <NavItem id="patients" label="Gestión Familias" icon="fa-book-open-reader" />
          ) : (
            <NavItem id="history" label="Mi Historia" icon="fa-heart" />
          )}
          <NavItem id="chat" label="Mensajería" icon="fa-comment-dots" />
          <NavItem id="profile" label="Mi Perfil" icon="fa-user-circle" />
        </nav>

        <div className="mt-auto pt-8 border-t border-[#E8DDE2]">
          <div className="flex items-center gap-4 px-2 mb-6">
            <div className="relative">
              <img src={`https://picsum.photos/seed/${user.id}/80/80`} className="rounded-xl w-11 h-11 object-cover border-2 border-white shadow-sm" alt="Avatar" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#7FB7A6] border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-[#1F2933]">{user.name}</p>
              <p className="text-[10px] text-[#5F6C7B] uppercase font-black tracking-wider">{isProfessional ? 'Asesora' : 'Mamá'}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#5F6C7B] hover:text-[#F28C8C] hover:bg-[#F28C8C]/5 rounded-xl transition-all"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span className="text-xs font-bold uppercase tracking-widest">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-md px-6 py-4 flex flex-col border-b border-[#E8DDE2] sticky top-0 z-50">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-[#F28C8C] rounded-lg flex items-center justify-center text-white">
                  <i className="fas fa-hand-holding-heart text-sm"></i>
               </div>
               <h1 className="font-extrabold text-[#1F2933] text-lg">EVA ClínicApp</h1>
            </div>
            <img src={`https://picsum.photos/seed/${user.id}/32/32`} className="rounded-lg w-8 h-8" alt="Avatar" />
          </div>
          <p className="text-[7px] text-[#5F6C7B] font-black uppercase tracking-[0.1em] text-center mt-2 opacity-60">
            CUIDADO QUE CONECTA – LACTANCIA & CRIANZA
          </p>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-28 md:pb-10">
          {children}
        </div>

        {/* Mobile Navbar */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white rounded-2xl px-2 py-2 flex justify-around items-center z-50 shadow-2xl border border-[#E8DDE2]">
          {[
            { id: 'dashboard', icon: 'fa-home' },
            { id: isProfessional ? 'patients' : 'history', icon: isProfessional ? 'fa-book-open-reader' : 'fa-heart' },
            { id: 'chat', icon: 'fa-comment-dots' },
            { id: 'profile', icon: 'fa-user-circle' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-[#F28C8C]/10 text-[#F28C8C]' : 'text-[#5F6C7B]'}`}
            >
              <i className={`fas ${item.icon} text-lg`}></i>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
