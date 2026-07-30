
import React, { useState } from 'react';
import { CaseType, WeightControl } from '../types';
import VoiceInput from './VoiceInput';

interface CaseFormProps {
  type: CaseType;
  initialData?: any;
  onSubmit: (data: any) => void;
  readOnly?: boolean;
}

const CaseForms: React.FC<CaseFormProps> = ({ type, initialData = {}, onSubmit, readOnly = false }) => {
  const [formData, setFormData] = useState(initialData);

  const updateField = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }));
  };

  const handleWeightChange = (index: number, field: keyof WeightControl, value: string) => {
    const weights = [...(formData.crecimiento?.controles || [])];
    weights[index] = { ...weights[index], [field]: value };
    updateField('crecimiento', 'controles', weights);
  };

  const addWeightControl = () => {
    const weights = [...(formData.crecimiento?.controles || []), { date: '', weight: '' }];
    updateField('crecimiento', 'controles', weights);
  };

  const Section = ({ title, children, icon }: { title: string, children: React.ReactNode, icon: string }) => (
    <div className="bg-white rounded-[32px] p-8 border border-[#E8DDE2] space-y-6 mb-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-rose-50 pb-4 mb-2">
        <div className="w-10 h-10 bg-[#FFF0F0] text-[#F28C8C] rounded-xl flex items-center justify-center text-lg">
          <i className={`fas ${icon}`}></i>
        </div>
        <h3 className="text-md font-black text-[#1F2933] uppercase tracking-tight">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );

  const Input = ({ label, section, field, type = "text", placeholder = "", options }: any) => {
    const value = formData[section]?.[field] || '';
    
    return (
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{label}</label>
        {options ? (
          <select
            disabled={readOnly}
            className="w-full bg-[#FFF7F9] border border-[#E8DDE2] rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#F28C8C] transition-all outline-none"
            value={value}
            onChange={(e) => updateField(section, field, e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {options.map((opt: string) => <option key={opt} value={opt.toLowerCase()}>{opt}</option>)}
          </select>
        ) : (
          <input
            type={type}
            disabled={readOnly}
            className="w-full bg-[#FFF7F9] border border-[#E8DDE2] rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#F28C8C] transition-all outline-none"
            value={value}
            onChange={(e) => updateField(section, field, e.target.value)}
            placeholder={placeholder}
          />
        )}
      </div>
    );
  };

  const Toggle = ({ label, section, field }: any) => (
    <div className="flex items-center justify-between p-4 bg-[#FFF7F9] rounded-xl border border-[#E8DDE2]">
      <label className="text-sm font-semibold text-[#1F2933]">{label}</label>
      <button
        type="button"
        disabled={readOnly}
        onClick={() => updateField(section, field, !formData[section]?.[field])}
        className={`w-12 h-6 rounded-full transition-all relative ${formData[section]?.[field] ? 'bg-[#F28C8C]' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData[section]?.[field] ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );

  const TextArea = ({ label, section, field, placeholder = "" }: any) => (
    <div className="space-y-2 col-span-1 sm:col-span-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{label}</label>
      <div className="relative">
        <textarea
          disabled={readOnly}
          rows={3}
          className="w-full bg-[#FFF7F9] border border-[#E8DDE2] rounded-2xl px-4 py-3 text-sm font-semibold focus:border-[#F28C8C] transition-all outline-none resize-none"
          value={formData[section]?.[field] || ''}
          onChange={(e) => updateField(section, field, e.target.value)}
          placeholder={placeholder}
        />
        {!readOnly && (
          <VoiceInput 
            className="absolute bottom-3 right-3 bg-white scale-75 border-none shadow-sm" 
            onTranscript={(t) => updateField(section, field, (formData[section]?.[field] || '') + ' ' + t)} 
          />
        )}
      </div>
    </div>
  );

  const WeightList = () => (
    <div className="col-span-1 sm:col-span-2 space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Controles posteriores</label>
        {!readOnly && (
          <button 
            type="button"
            onClick={addWeightControl}
            className="text-[10px] font-black text-[#F28C8C] uppercase tracking-widest hover:underline"
          >
            + Añadir Control
          </button>
        )}
      </div>
      <div className="space-y-3">
        {(formData.crecimiento?.controles || []).map((ctrl: WeightControl, idx: number) => (
          <div key={idx} className="flex gap-4">
            <input
              type="date"
              disabled={readOnly}
              className="flex-1 bg-[#FFF7F9] border border-[#E8DDE2] rounded-xl px-4 py-3 text-sm font-semibold outline-none"
              value={ctrl.date}
              onChange={(e) => handleWeightChange(idx, 'date', e.target.value)}
            />
            <input
              type="text"
              disabled={readOnly}
              placeholder="Peso (gr/kg)"
              className="flex-1 bg-[#FFF7F9] border border-[#E8DDE2] rounded-xl px-4 py-3 text-sm font-semibold outline-none"
              value={ctrl.weight}
              onChange={(e) => handleWeightChange(idx, 'weight', e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrenatal = () => (
    <>
      <Section title="General" icon="fa-calendar-alt">
        <Input label="Fecha" section="general" field="fecha" type="date" />
        <Input label="Modalidad" section="general" field="modalidad" options={['Online', 'Presencial', 'Online + Presencial']} />
        <Input label="¿Cómo llegó a EVA ClínicApp?" section="general" field="origen" options={['Recomendación', 'Redes Sociales', 'Mildiascontigo.uy', 'Otro']} />
      </Section>
      <Section title="Datos de Contacto" icon="fa-address-card">
        <Input label="Teléfono" section="contacto" field="telefono" />
        <Input label="Dirección" section="contacto" field="direccion" />
        <Input label="Email" section="contacto" field="email" type="email" />
      </Section>
      <Section title="Datos de la Familia" icon="fa-users">
        <div className="col-span-full font-bold text-xs text-[#F28C8C] uppercase tracking-widest mt-2 border-b border-rose-50">Mamá</div>
        <Input label="Nombre y apellido" section="mama" field="nombre" />
        <Input label="Fecha de nacimiento" section="mama" field="nacimiento" type="date" />
        <Input label="Centro asistencial" section="mama" field="centro" />
        <Input label="Emergencia móvil" section="mama" field="emergencia" />
        <Input label="Profesión / Ocupación" section="mama" field="profesion" />
        
        <div className="col-span-full font-bold text-xs text-[#F28C8C] uppercase tracking-widest mt-6 border-b border-rose-50">Compañero/a</div>
        <Input label="Nombre y apellido" section="companero" field="nombre" />
        <Input label="Edad" section="companero" field="edad" />
        <Input label="Profesión / Ocupación" section="companero" field="profesion" />

        <div className="col-span-full font-bold text-xs text-[#F28C8C] uppercase tracking-widest mt-6 border-b border-rose-50">Bebé</div>
        <Input label="Nombre" section="bebe" field="nombre" />
        <Input label="Fecha prevista de parto" section="bebe" field="fpp" type="date" />
        <Input label="Centro asistencial" section="bebe" field="centro" />
        <Input label="Emergencia móvil" section="bebe" field="emergencia" />

        <TextArea label="Núcleo familiar / convivientes" section="familia" field="nucleo" />
        <TextArea label="Red de apoyo en la crianza" section="familia" field="red" placeholder="Abuelos, cuidadores, otros..." />
      </Section>
      <Section title="Datos Perinatales" icon="fa-notes-medical">
        <TextArea label="Patologías previas / tratamientos" section="perinatal" field="patologias" />
        <Input label="Gestas previas" section="perinatal" field="gestas" type="number" />
        <Toggle label="¿Cirugías mamarias?" section="perinatal" field="cirugias_mamas_bool" />
        <TextArea label="Detalle cirugías mamarias" section="perinatal" field="cirugias_mamas_det" />
        <Toggle label="¿Otras cirugías?" section="perinatal" field="cirugias_otras_bool" />
        <TextArea label="Detalle otras cirugías" section="perinatal" field="cirugias_otras_det" />
        <Toggle label="¿Consumo de medicación?" section="perinatal" field="farmacos_bool" />
        <TextArea label="Detalle medicación" section="perinatal" field="farmacos_det" />
        <Toggle label="¿Consumo de alcohol / tabaco?" section="perinatal" field="consumos" />
        <Toggle label="¿Lactancias previas?" section="perinatal" field="lactancias_prev" />
        <TextArea label="Antecedentes relevantes de lactancias previas" section="perinatal" field="antecedentes" />
      </Section>
      <Section title="Embarazo Actual" icon="fa-baby-carriage">
        <Input label="¿Cómo está transcurriendo?" section="embarazo" field="transcurso" options={['Bien', 'Con molestias', 'De riesgo', 'Otro']} />
        <Input label="Semanas de gestación" section="embarazo" field="semanas" type="number" />
        <Toggle label="¿Medicación actual?" section="embarazo" field="medicacion_bool" />
        <TextArea label="Detalle medicación" section="embarazo" field="medicacion_det" />
        <TextArea label="Indicaciones médicas" section="embarazo" field="indicaciones" />
        <Input label="Nombre del médico tratante" section="embarazo" field="medico" />
        <Toggle label="¿Recibió información sobre lactancia?" section="embarazo" field="info_lactancia" />
        <TextArea label="Observaciones destacables" section="embarazo" field="observaciones" />
      </Section>
      <Section title="Información Adicional" icon="fa-heart">
        <TextArea label="Expectativas en torno a la lactancia" section="expectativas" field="lactancia" />
        <TextArea label="Dudas o inquietudes puntuales" section="expectativas" field="dudas" />
        <TextArea label="Otra información relevante" section="expectativas" field="otra_info" />
        <TextArea label="Expectativas de la asesoría prenatal" section="expectativas" field="asesoria" />
      </Section>
    </>
  );

  const renderCrianzaDestete = (isDestete = false) => (
    <>
      <Section title="General" icon="fa-calendar-alt">
        <Input label="Fecha" section="general" field="fecha" type="date" />
        <Input label="Modalidad" section="general" field="modalidad" options={['Online', 'Presencial']} />
        <Input label="Motivo de consulta" section="general" field="motivo" options={['Sueño', 'Límites', 'Alimentación Complementaria', 'Destete', 'Otro']} />
        <Input label="¿Cómo llegó a la consulta?" section="general" field="origen" options={['Recomendación', 'Redes Sociales', 'Búsqueda', 'Otro']} />
      </Section>
      <Section title="Datos de Contacto" icon="fa-address-card">
        <Input label="Teléfono" section="contacto" field="telefono" />
        <Input label="Dirección" section="contacto" field="direccion" />
        <Input label="Email" section="contacto" field="email" type="email" />
      </Section>
      <Section title="Datos de la Familia" icon="fa-users">
        <div className="col-span-full font-bold text-xs text-[#F28C8C] uppercase tracking-widest mt-2 border-b border-rose-50">Mamá</div>
        <Input label="Nombre y apellido" section="mama" field="nombre" />
        <Input label="Fecha de nacimiento" section="mama" field="nacimiento" type="date" />
        <Input label="Profesión / Ocupación" section="mama" field="profesion" />
        
        <div className="col-span-full font-bold text-xs text-[#F28C8C] uppercase tracking-widest mt-6 border-b border-rose-50">Compañero/a</div>
        <Input label="Nombre y apellido" section="companero" field="nombre" />
        <Input label="Edad" section="companero" field="edad" />
        <Input label="Profesión / Ocupación" section="companero" field="profesion" />

        <div className="col-span-full font-bold text-xs text-[#F28C8C] uppercase tracking-widest mt-6 border-b border-rose-50">Bebé</div>
        <Input label="Nombre" section="bebe" field="nombre" />
        <Input label="Fecha de nacimiento" section="bebe" field="nacimiento" type="date" />
        <Input label="Centro asistencial" section="bebe" field="centro" />
        <Input label="Emergencia móvil" section="bebe" field="emergencia" />
      </Section>
      {!isDestete && (
        <Section title="Control de Crecimiento" icon="fa-weight">
          <Input label="Peso al nacer" section="crecimiento" field="peso_nac" />
          <Input label="Peso al alta" section="crecimiento" field="peso_alta" />
          <Input label="Peso control post alta (Fecha)" section="crecimiento" field="post_alta_fecha" type="date" />
          <Input label="Peso control post alta (Peso)" section="crecimiento" field="post_alta_peso" />
          <WeightList />
        </Section>
      )}
      <Section title="Familia y Apoyo" icon="fa-hands-helping">
        <TextArea label="Otros hijos / convivientes" section="familia" field="otros_hijos" />
        <TextArea label="Red de apoyo" section="familia" field="red" />
      </Section>
      <Section title="Datos Perinatales" icon="fa-notes-medical">
        <TextArea label="Patologías previas / tratamientos" section="perinatal" field="patologias" />
        <Input label="Gestas previas" section="perinatal" field="gestas" type="number" />
        <TextArea label="Cirugías" section="perinatal" field="cirugias" />
        <Toggle label="¿Consumo de medicación?" section="perinatal" field="farmacos_bool" />
        <TextArea label="Detalle medicación" section="perinatal" field="farmacos_det" />
        <Toggle label="¿Consumo de alcohol / tabaco?" section="perinatal" field="consumos" />
        <Toggle label="¿Recibió información sobre crianza?" section="perinatal" field="info_prev" />
        <TextArea label="Otra información relevante" section="perinatal" field="adicional" />
      </Section>
      <Section title="Embarazo y Nacimiento" icon="fa-baby">
        <Input label="Lugar de nacimiento" section="nacimiento" field="lugar" options={['Domicilio', 'Institución Privada', 'Institución Pública']} />
        <Input label="Nombre institución" section="nacimiento" field="institucion" />
        <Input label="Tipo de parto" section="nacimiento" field="tipo" options={['Vaginal', 'Cesárea']} />
        <Input label="Anestesia" section="nacimiento" field="anestesia" options={['Peridural', 'Raquídea', 'General', 'Ninguna']} />
        <Input label="Semanas de gestación al nacer" section="nacimiento" field="sdg" />
        <Toggle label="¿Complicaciones parto/postparto?" section="nacimiento" field="complicaciones_bool" />
        <TextArea label="Detalle complicaciones" section="nacimiento" field="complicaciones_det" />
        <Toggle label="¿Condiciones o patologías del bebé?" section="nacimiento" field="bebe_pat_bool" />
        <TextArea label="Detalle patologías bebé" section="nacimiento" field="bebe_pat_det" />
        <TextArea label="Observaciones destacables" section="nacimiento" field="observaciones" />
      </Section>
      <Section title="Historia de Lactancia" icon="fa-hand-holding-heart">
        <Toggle label="¿Primera toma en primeras 2 horas?" section="lactancia" field="primera_toma" />
        <TextArea label="Detalle / Motivo primera toma" section="lactancia" field="primera_toma_det" />
        <Toggle label="¿Separación durante internación?" section="lactancia" field="separacion" />
        <TextArea label="Motivo separación" section="lactancia" field="separacion_det" />
        <Toggle label="¿PPL durante internación?" section="lactancia" field="ppl" />
        <TextArea label="Motivo PPL" section="lactancia" field="ppl_det" />
        <Input label="Alimentación al alta" section="lactancia" field="alta" options={['Pecho exclusivo', 'Fórmula', 'Mixta']} />
        <Input label="Alimentación actual" section="lactancia" field="actual" options={['Pecho exclusivo', 'Fórmula', 'Mixta', 'Complementaria']} />
        <TextArea label="Frecuencia y contexto de tomas" section="lactancia" field="tomas_desc" />
        <Toggle label="¿Uso de chupete?" section="lactancia" field="chupete" />
      </Section>
      <Section title="Consulta Específica" icon="fa-comment-dots">
        <TextArea label="Temas de interés" section="especifica" field="temas" />
        <TextArea label="Descripción del motivo de consulta" section="especifica" field="motivo" />
        <TextArea label="Expectativas de la consulta" section="especifica" field="expectativas" />
        <TextArea label="Otra información relevante" section="especifica" field="adicional" />
      </Section>
    </>
  );

  const renderLactancia = () => renderCrianzaDestete(false);

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-[#E8DDE2] mb-8 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-[#FFF0F0] text-[#F28C8C] rounded-2xl flex items-center justify-center text-xl">
             <i className={`fas ${
               type === 'prenatal' ? 'fa-calendar-check' :
               type === 'lactancia' ? 'fa-baby' :
               type === 'crianza' ? 'fa-hands-holding-child' : 'fa-leaf'
             }`}></i>
           </div>
           <div>
             <h4 className="text-lg font-black text-[#1F2933]">Registro de {type === 'prenatal' ? 'Prenatal Lactancia' : type.charAt(0).toUpperCase() + type.slice(1)}</h4>
             <p className="text-xs text-slate-400 font-medium">Información para un acompañamiento humano y profesional.</p>
           </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        {type === 'prenatal' && renderPrenatal()}
        {type === 'lactancia' && renderLactancia()}
        {type === 'crianza' && renderCrianzaDestete(false)}
        {type === 'destete' && renderCrianzaDestete(true)}
      </div>

      {!readOnly && (
        <div className="flex justify-end pt-4 sticky bottom-6 z-30">
          <button
            onClick={() => onSubmit(formData)}
            className="px-10 py-5 bg-[#F28C8C] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl transition-all shadow-lg active:scale-95"
          >
            Finalizar y Guardar Consulta
          </button>
        </div>
      )}
    </div>
  );
};

export default CaseForms;
