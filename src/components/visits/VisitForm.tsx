'use client'

import { useActionState, useEffect, useState } from 'react'
import { createVisit } from '@/app/(dashboard)/visits/actions'
import { getClients } from '@/app/(dashboard)/clients/actions'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { FormField } from '@/components/ui/FormField'

interface VisitFormProps {
    defaultDate: Date
    onSuccess: () => void
}

export function VisitForm({ defaultDate, onSuccess }: VisitFormProps) {
    const router = useRouter()
    const [clients, setClients] = useState<any[]>([])
    const [selectedClientId, setSelectedClientId] = useState<string>('')

    // Load clients on mount 
    useEffect(() => {
        getClients('').then(data => {
            if (data) setClients(data)
        })
    }, [])

    const selectedClient = clients.find(c => c.id === selectedClientId)
    const clientProperties = selectedClient?.properties || []

    // Intercept action to override timezone offsets safely
    const formAction = async (prevState: any, formData: FormData) => {
        const dateInput = formData.get('date_day') as string
        const timeInput = formData.get('time') as string

        if (dateInput) {
             // Send as local string 'YYYY-MM-DD' dynamically parsing the day at Noon to ensure safe parsing
            const fullDateStr = format(new Date(`${dateInput}T12:00:00`), 'yyyy-MM-dd')
            formData.set('date', fullDateStr)
        }
        
        // Pass original time down as start_time to prevent it from dropping
        if (timeInput) {
            formData.set('start_time', timeInput)
        }
        
        return createVisit(prevState, formData)
    }

    const [state, action, isPending] = useActionState(formAction, {
        success: false,
        message: '',
        fieldErrors: {}
    })

    useEffect(() => {
        if (state.success) {
            toast.success('Visita agendada exitosamente')
            router.refresh()
            onSuccess()
            setSelectedClientId('')
        } else if (!state.success && state.message) {
            toast.error(state.message)
        }
    }, [state.success, state.message, onSuccess, router])

    return (
        <form action={action} className="flex flex-col gap-5">
            {!state.success && state.message && (
                <div className="p-3.5 text-sm font-bold text-red-800 bg-red-50 rounded-xl border border-red-200/60 shadow-sm animate-in fade-in">
                    {state.message}
                </div>
            )}

            {/* 1. Client Select */}
            <div className="w-full">
                <label htmlFor="client" className="block text-sm font-medium text-emerald-900 mb-1.5 ml-0.5">Cliente</label>
                <select
                    id="client"
                    className="block w-full rounded-lg border-slate-200 bg-white shadow-sm ring-emerald-500/20 transition-all duration-200 sm:text-sm px-3 py-2 border outline-none hover:border-slate-300 focus:border-emerald-500 focus:ring-2 h-[42px]"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    required
                >
                    <option value="">Seleccionar Cliente...</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                </select>
            </div>

            {/* 2. Property Select */}
            <div className="w-full">
                <label htmlFor="property_id" className="block text-sm font-medium text-emerald-900 mb-1.5 ml-0.5">Propiedad</label>
                <select
                    name="property_id"
                    id="property_id"
                    className={`block w-full rounded-lg border-slate-200 bg-white shadow-sm ring-emerald-500/20 transition-all duration-200 sm:text-sm px-3 py-2 border outline-none hover:border-slate-300 focus:border-emerald-500 focus:ring-2 h-[42px] ${state.fieldErrors?.property_id ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                    required
                    disabled={!selectedClientId}
                >
                    <option value="">Seleccionar Propiedad...</option>
                    {clientProperties.map((prop: any) => (
                        <option key={prop.id} value={prop.id}>{prop.address}</option>
                    ))}
                </select>
                {state.fieldErrors?.property_id && (
                    <div className="mt-1.5 text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1 px-0.5">
                        {state.fieldErrors.property_id.map((err: string) => <p key={err}>{err}</p>)}
                    </div>
                )}
            </div>

            {/* 3. Date & Time */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    label="Fecha"
                    name="date_day"
                    type="date"
                    defaultValue={format(defaultDate, 'yyyy-MM-dd')}
                    error={state.fieldErrors?.date}
                />
                
                <FormField
                    label="Hora"
                    name="time"
                    type="time"
                    lang="en-GB"
                    defaultValue="09:00"
                    error={state.fieldErrors?.time}
                />
            </div>

            {/* 3.1 Estimations */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    label="Precio Estimado ($)"
                    name="estimated_income"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    icon={<span className="font-bold text-emerald-600/50">$</span>}
                    error={state.fieldErrors?.estimated_income}
                />
                
                <div className="w-full">
                    <label htmlFor="estimated_duration_mins" className="block text-sm font-medium text-emerald-900 mb-1.5 ml-0.5">Duración (min)</label>
                    <select
                        name="estimated_duration_mins"
                        id="estimated_duration_mins"
                        defaultValue="60"
                        className={`block w-full rounded-lg border-slate-200 bg-white shadow-sm ring-emerald-500/20 transition-all duration-200 sm:text-sm px-3 py-2 border outline-none hover:border-slate-300 focus:border-emerald-500 focus:ring-2 h-[42px] ${state.fieldErrors?.estimated_duration_mins ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                    >
                        <option value="15">15 min (Visita Corta)</option>
                        <option value="30">30 min (Media Hora)</option>
                        <option value="45">45 min</option>
                        <option value="60">1 hora (Estándar)</option>
                        <option value="90">1.5 horas</option>
                        <option value="120">2 horas</option>
                        <option value="180">3 horas</option>
                        <option value="240">4 horas (Medio Día)</option>
                    </select>
                </div>
            </div>

            {/* 4. Notes */}
            <FormField
                label="Notas"
                name="notes"
                isTextArea
                rows={3}
                placeholder="Podar arbustos, fertilizar césped..."
                error={state.fieldErrors?.notes}
            />

            <button
                type="submit"
                disabled={isPending}
                className="mt-3 w-full rounded-xl bg-blue-600 px-5 py-4 text-center text-base font-black text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {isPending ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Agendando...
                    </>
                ) : (
                    'Agendar Visita'
                )}
            </button>
        </form>
    )
}
