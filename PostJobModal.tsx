import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Wrench, ShoppingBag, Package, Sparkles, Zap, CheckSquare, Zap as ElecIcon, Droplets, Paintbrush, Hammer } from 'lucide-react'
import { JobsAPI } from '../utils/api'
import { getGPS } from '../utils/helpers'
import { Modal, Spinner } from './UI'

const CATS = [
  { id: 'maintenance', label: 'Maintenance', Icon: Wrench },
  { id: 'errands',     label: 'Errands',     Icon: ShoppingBag },
  { id: 'delivery',    label: 'Delivery',    Icon: Package },
  { id: 'cleaning',    label: 'Cleaning',    Icon: Sparkles },
  { id: 'quick_tasks', label: 'Quick Task',  Icon: Zap },
  { id: 'verification',label: 'Verify',      Icon: CheckSquare },
  { id: 'electrical',  label: 'Electrical',  Icon: ElecIcon },
  { id: 'plumbing',    label: 'Plumbing',    Icon: Droplets },
  { id: 'painting',    label: 'Painting',    Icon: Paintbrush },
  { id: 'carpentry',   label: 'Carpentry',   Icon: Hammer },
]

interface FormData { title: string; description: string; budget?: number; area: string; urgent: boolean }

export const PostJobModal: React.FC<{ open: boolean; onClose: () => void; onPosted?: () => void }> = ({ open, onClose, onPosted }) => {
  const [cat, setCat]     = useState('maintenance')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const coords = await getGPS()
    try {
      await JobsAPI.create({
        title: data.title, description: data.description,
        category: cat as never, budget: data.budget, isUrgent: data.urgent,
        targetRoles: ['worker', 'delivery', 'business'],
        location: { country: 'Nigeria', state: 'Imo State', city: 'Owerri', area: data.area, address: data.area, coordinates: coords },
      })
      toast.success(`"${data.title}" posted! Nearby workers notified 🎉`)
      reset(); onClose(); onPosted?.()
    } catch {} finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Post a New Job">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Category grid */}
        <div className="fg">
          <label className="fl">Category</label>
          <div className="cat-grid">
            {CATS.map(({ id, label, Icon }) => (
              <button type="button" key={id} onClick={() => setCat(id)}
                className={`cat-btn${cat === id ? ' sel' : ''}`}>
                <Icon size={18} className="cat-btn-icon" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="fg">
          <label className="fl">Job Title *</label>
          <input className="fi" placeholder="e.g. Fix leaking kitchen sink"
            {...register('title', { required: 'Title is required' })} />
          {errors.title && <span className="ferr">{errors.title.message}</span>}
        </div>

        <div className="fg">
          <label className="fl">Description *</label>
          <textarea className="fi" style={{ resize: 'none' }} rows={3}
            placeholder="Describe what needs to be done..."
            {...register('description', { required: 'Description is required' })} />
        </div>

        <div className="fr2">
          <div className="fg mb0">
            <label className="fl">Budget (₦) Optional</label>
            <input className="fi" type="number" placeholder="e.g. 5000" {...register('budget', { valueAsNumber: true })} />
          </div>
          <div className="fg mb0">
            <label className="fl">Area / Location *</label>
            <input className="fi" placeholder="e.g. Ikenegbu"
              {...register('area', { required: 'Location required' })} />
            {errors.area && <span className="ferr">{errors.area.message}</span>}
          </div>
        </div>

        <label className="fchk mt4 mb5">
          <input type="checkbox" {...register('urgent')} />
          <span className="bsm t2">Mark as <strong style={{ color: '#f87171' }}>Urgent</strong> — gets priority placement</span>
        </label>

        <div className="flex g3">
          <button type="button" className="btn btg" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btp" style={{ flex: 2 }} disabled={loading}>
            {loading ? <Spinner size={15} /> : 'Post Job'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
