import React from 'react';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
}) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

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

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const titleId = title ? `modal-title-${Math.random().toString(36).slice(2)}` : undefined;
  const descId = description ? `modal-desc-${Math.random().toString(36).slice(2)}` : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={`relative w-full ${sizeClasses[size]} rounded-xl bg-white dark:bg-gray-900 p-4 shadow-modal`}
      >
        {title && (
          <h2 id={titleId} className="text-lg font-semibold mb-3">
            {title}
          </h2>
        )}
        {description && (
          <div id={descId} className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {description}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;

