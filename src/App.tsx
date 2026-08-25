import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  History,
  MessageCircle,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import type { ServiceData, VehicleData, YesNo } from './types'

const HISTORY_KEY = 'servicios-grua-historial-v1'

const upper = (value: string) => value.toLocaleUpperCase('es-ES')

const newVehicle = (): VehicleData => ({
  id: crypto.randomUUID(),
  vhc: '',
  mma: '',
  cargado: 'SI',
  matricula: '',
  averia: '',
  origen: '',
  destino: '',
  base: '',
})

const newService = (): ServiceData => ({
  id: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
  cia: '',
  expediente: '',
  cliente: '',
  telefono: '',
  vehicles: [newVehicle()],
  solicita: '',
  autorizado: '',
})

function formatWhatsApp(service: ServiceData) {
  const global = [
    `*CIA:* ${upper(service.cia)}`,
    `*EXP.:* ${upper(service.expediente)}`,
    `*CLIENTE:* ${upper(service.cliente)}`,
    `*TELÉFONO:* ${upper(service.telefono)}`,
  ]

  const vehicles = service.vehicles.map((vehicle, index) => [
    `*VHC ${index + 1}:* ${upper(vehicle.vhc)}`,
    `*MMA:* ${upper(vehicle.mma)}`,
    `*CARGADO:* ${vehicle.cargado}`,
    `*MATRÍCULA:* ${upper(vehicle.matricula)}`,
    `*AVERÍA:* ${upper(vehicle.averia)}`,
    `*ORIGEN:* ${upper(vehicle.origen)}`,
    `*DESTINO:* ${upper(vehicle.destino)}`,
    `*BASE:* ${upper(vehicle.base)}`,
  ].join('\n'))

  const footer = [
    `*SOLICITA:* ${upper(service.solicita)}`,
    `*AUTORIZADO:* ${upper(service.autorizado)}`,
  ]

  return [...global, '', ...vehicles.flatMap((block, index) => index === vehicles.length - 1 ? [block] : [block, '']), '', ...footer].join('\n')
}

function App() {
  const [service, setService] = useState<ServiceData>(newService)
  const [screen, setScreen] = useState<'form' | 'preview' | 'history'>('form')
  const [history, setHistory] = useState<ServiceData[]>([])
  const [savedNotice, setSavedNotice] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {
      setHistory([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history])

  const message = useMemo(() => formatWhatsApp(service), [service])

  const updateGlobal = (key: keyof Pick<ServiceData, 'cia' | 'expediente' | 'cliente' | 'telefono' | 'solicita' | 'autorizado'>, value: string) => {
    setService(prev => ({ ...prev, [key]: value }))
  }

  const updateVehicle = (id: string, key: keyof Omit<VehicleData, 'id'>, value: string) => {
    setService(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(vehicle => vehicle.id === id ? { ...vehicle, [key]: value } : vehicle),
    }))
  }

  const addVehicle = () => {
    setService(prev => ({ ...prev, vehicles: [...prev.vehicles, newVehicle()] }))
  }

  const removeVehicle = (id: string) => {
    setService(prev => {
      if (prev.vehicles.length === 1) return prev
      return { ...prev, vehicles: prev.vehicles.filter(vehicle => vehicle.id !== id) }
    })
  }

  const saveService = () => {
    const snapshot = { ...service, createdAt: new Date().toISOString() }
    setHistory(prev => [snapshot, ...prev.filter(item => item.id !== snapshot.id)].slice(0, 100))
    setSavedNotice(true)
    window.setTimeout(() => setSavedNotice(false), 1800)
  }

  const openWhatsApp = () => {
    saveService()
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const resetService = () => {
    setService(newService())
    setScreen('form')
  }

  const loadHistory = (item: ServiceData) => {
    setService({ ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() })
    setScreen('form')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        {screen !== 'form' ? (
          <button className="icon-btn" onClick={() => setScreen('form')} aria-label="Volver">
            <ArrowLeft size={23} />
          </button>
        ) : <div className="logo-box"><ClipboardList size={21} /></div>}
        <div>
          <h1>{screen === 'form' ? 'NUEVO SERVICIO' : screen === 'preview' ? 'VISTA PREVIA' : 'HISTORIAL'}</h1>
          <p>GRÚAS TORRE DEL ORO</p>
        </div>
        {screen === 'form' ? (
          <button className="icon-btn" onClick={saveService} aria-label="Guardar">
            <Save size={22} />
          </button>
        ) : <span className="top-spacer" />}
      </header>

      <main className="content">
        {screen === 'form' && (
          <>
            <section className="card compact-card">
              <Field label="CIA>" value={service.cia} onChange={v => updateGlobal('cia', v)} placeholder="COMPAÑÍA" />
              <Field label="EXP.>" value={service.expediente} onChange={v => updateGlobal('expediente', v)} placeholder="EXPEDIENTE" />
              <Field label="CLIENTE>" value={service.cliente} onChange={v => updateGlobal('cliente', v)} placeholder="CLIENTE" />
              <Field label="TELÉFONO>" value={service.telefono} onChange={v => updateGlobal('telefono', v)} placeholder="TELÉFONO" inputMode="tel" />
            </section>

            <button className="add-vhc" onClick={addVehicle}>
              <Plus size={21} /> AÑADIR VHC
            </button>

            <div className="vehicles-stack">
              {service.vehicles.map((vehicle, index) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  index={index}
                  canDelete={service.vehicles.length > 1}
                  onDelete={() => removeVehicle(vehicle.id)}
                  onChange={(key, value) => updateVehicle(vehicle.id, key, value)}
                />
              ))}
            </div>

            <section className="card compact-card footer-fields">
              <Field label="SOLICITA>" value={service.solicita} onChange={v => updateGlobal('solicita', v)} placeholder="QUIÉN SOLICITA" />
              <Field label="AUTORIZADO>" value={service.autorizado} onChange={v => updateGlobal('autorizado', v)} placeholder="QUIÉN AUTORIZA" />
            </section>

            <div className="actions-grid">
              <button className="secondary-btn" onClick={() => setScreen('preview')}>
                <ClipboardList size={20} /> VISTA PREVIA
              </button>
              <button className="whatsapp-btn" onClick={openWhatsApp}>
                <MessageCircle size={20} /> ENVIAR POR WHATSAPP
              </button>
            </div>
          </>
        )}

        {screen === 'preview' && (
          <Preview service={service} onEdit={() => setScreen('form')} onSend={openWhatsApp} />
        )}

        {screen === 'history' && (
          <HistoryView history={history} onLoad={loadHistory} onDelete={id => setHistory(prev => prev.filter(item => item.id !== id))} />
        )}
      </main>

      <nav className="bottom-nav">
        <button className={screen !== 'history' ? 'active' : ''} onClick={resetService}>
          <Plus size={21} />
          <span>NUEVO SERVICIO</span>
        </button>
        <button className={screen === 'history' ? 'active' : ''} onClick={() => setScreen('history')}>
          <History size={21} />
          <span>HISTORIAL</span>
        </button>
      </nav>

      {savedNotice && (
        <div className="toast"><CheckCircle2 size={18} /> SERVICIO GUARDADO</div>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}) {
  return (
    <label className="field-row">
      <span>{label}</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete="off"
      />
    </label>
  )
}

function VehicleCard({
  vehicle,
  index,
  canDelete,
  onDelete,
  onChange,
}: {
  vehicle: VehicleData
  index: number
  canDelete: boolean
  onDelete: () => void
  onChange: (key: keyof Omit<VehicleData, 'id'>, value: string) => void
}) {
  return (
    <section className="vehicle-card">
      <div className="vehicle-title">
        <strong>DATOS VHC {index + 1}</strong>
        {canDelete && (
          <button className="delete-btn" onClick={onDelete} aria-label={`Eliminar VHC ${index + 1}`}>
            <Trash2 size={18} />
          </button>
        )}
      </div>
      <div className="vehicle-body">
        <Field label="VHC>" value={vehicle.vhc} onChange={v => onChange('vhc', v)} placeholder="TRACTORA / REMOLQUE" />
        <Field label="MMA>" value={vehicle.mma} onChange={v => onChange('mma', v)} placeholder="EJ. 18.000 KG" />
        <div className="field-row radio-row">
          <span>CARGADO&gt;</span>
          <div className="segmented">
            {(['SI', 'NO'] as YesNo[]).map(option => (
              <button
                type="button"
                key={option}
                className={vehicle.cargado === option ? 'selected' : ''}
                onClick={() => onChange('cargado', option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <Field label="MATRÍCULA>" value={vehicle.matricula} onChange={v => onChange('matricula', v)} placeholder="MATRÍCULA" />
        <Field label="AVERÍA>" value={vehicle.averia} onChange={v => onChange('averia', v)} placeholder="AVERÍA" />
        <Field label="ORIGEN>" value={vehicle.origen} onChange={v => onChange('origen', v)} placeholder="ORIGEN" />
        <Field label="DESTINO>" value={vehicle.destino} onChange={v => onChange('destino', v)} placeholder="DESTINO" />
        <Field label="BASE>" value={vehicle.base} onChange={v => onChange('base', v)} placeholder="BASE" />
      </div>
    </section>
  )
}

function Preview({ service, onEdit, onSend }: { service: ServiceData; onEdit: () => void; onSend: () => void }) {
  return (
    <div className="preview-wrap">
      <section className="preview-card global-preview">
        <PreviewRow label="CIA:" value={service.cia} />
        <PreviewRow label="EXP.:" value={service.expediente} />
        <PreviewRow label="CLIENTE:" value={service.cliente} />
        <PreviewRow label="TELÉFONO:" value={service.telefono} />
      </section>

      {service.vehicles.map((vehicle, index) => (
        <section className="preview-card" key={vehicle.id}>
          <div className="preview-title">VHC {index + 1}</div>
          <PreviewRow label="VHC:" value={vehicle.vhc} />
          <PreviewRow label="MMA:" value={vehicle.mma} />
          <PreviewRow label="CARGADO:" value={vehicle.cargado} />
          <PreviewRow label="MATRÍCULA:" value={vehicle.matricula} />
          <PreviewRow label="AVERÍA:" value={vehicle.averia} />
          <PreviewRow label="ORIGEN:" value={vehicle.origen} />
          <PreviewRow label="DESTINO:" value={vehicle.destino} />
          <PreviewRow label="BASE:" value={vehicle.base} />
        </section>
      ))}

      <section className="preview-card">
        <PreviewRow label="SOLICITA:" value={service.solicita} />
        <PreviewRow label="AUTORIZADO:" value={service.autorizado} />
      </section>

      <div className="message-preview">
        <div className="message-preview-title">ASÍ SE ENVIARÁ POR WHATSAPP</div>
        <pre>{formatWhatsApp(service).replaceAll('*', '')}</pre>
      </div>

      <div className="actions-grid sticky-actions">
        <button className="secondary-btn" onClick={onEdit}>EDITAR</button>
        <button className="whatsapp-btn" onClick={onSend}><MessageCircle size={20} /> ENVIAR POR WHATSAPP</button>
      </div>
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="preview-row">
      <strong>{label}</strong>
      <span>{upper(value)}</span>
    </div>
  )
}

function HistoryView({
  history,
  onLoad,
  onDelete,
}: {
  history: ServiceData[]
  onLoad: (item: ServiceData) => void
  onDelete: (id: string) => void
}) {
  if (history.length === 0) {
    return (
      <div className="empty-state">
        <History size={42} />
        <h2>NO HAY SERVICIOS GUARDADOS</h2>
        <p>LOS SERVICIOS ENVIADOS O GUARDADOS APARECERÁN AQUÍ.</p>
      </div>
    )
  }

  return (
    <div className="history-list">
      {history.map(item => (
        <article className="history-card" key={`${item.id}-${item.createdAt}`}>
          <button className="history-main" onClick={() => onLoad(item)}>
            <strong>{upper(item.cia || 'SIN CIA')} · {upper(item.expediente || 'SIN EXP.')}</strong>
            <span>{upper(item.cliente || 'SIN CLIENTE')}</span>
            <small>{item.vehicles.length} VHC · {new Date(item.createdAt).toLocaleString('es-ES')}</small>
          </button>
          <button className="history-delete" onClick={() => onDelete(item.id)} aria-label="Eliminar del historial">
            <X size={20} />
          </button>
        </article>
      ))}
    </div>
  )
}

export default App
