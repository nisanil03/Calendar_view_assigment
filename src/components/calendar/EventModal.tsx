import React from 'react';
import type { CalendarEvent } from '../../types/calendar.types';

export type EventModalProps = {
  open: boolean;
  initial?: Partial<CalendarEvent>;
  onClose: () => void;
  onSubmit: (data: Omit<CalendarEvent, 'id'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
};

export function EventModal({ open, initial, onClose, onSubmit, onDelete }: EventModalProps) {
  const [title, setTitle] = React.useState(initial?.title ?? '');
  const [description, setDescription] = React.useState(initial?.description ?? '');
  const [color, setColor] = React.useState(initial?.color ?? '#3b82f6');
  const [start, setStart] = React.useState(() =>
    initial?.startDate ? new Date(initial.startDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
  );
  const [end, setEnd] = React.useState(() =>
    initial?.endDate ? new Date(initial.endDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
  );

  React.useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? '');
      setDescription(initial?.description ?? '');
      setColor(initial?.color ?? '#3b82f6');
      setStart(initial?.startDate ? new Date(initial.startDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
      setEnd(initial?.endDate ? new Date(initial.endDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, initial]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initial?.id,
      title,
      description,
      startDate: new Date(start),
      endDate: new Date(end),
      color,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        className="relative w-full max-w-md rounded-xl bg-white dark:bg-gray-900 p-4 shadow-modal"
      >
        <h2 id="event-modal-title" className="text-lg font-semibold mb-3">{initial?.id ? 'Edit Event' : 'Create Event'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input className="w-full rounded border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea className="w-full rounded border px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm mb-1">Start</label>
              <input type="datetime-local" className="w-full rounded border px-3 py-2" value={start} onChange={(e) => setStart(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">End</label>
              <input type="datetime-local" className="w-full rounded border px-3 py-2" value={end} onChange={(e) => setEnd(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Color</label>
            <input type="color" className="h-10 w-16 rounded border" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <div className="flex justify-between pt-2">
            {initial?.id && onDelete ? (
              <button type="button" className="px-3 py-2 rounded border text-red-600" onClick={() => onDelete(initial.id!)}>
                Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button type="button" className="px-3 py-2 rounded border" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventModal;


