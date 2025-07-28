import React, { useState, useRef, useEffect, useCallback } from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
  buttonContent: React.ReactNode;
  position?: 'left' | 'right';
  onClose?: () => void;
  title?: string;
  closeButton?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  buttonContent,
  position = 'right',
  onClose,
  title,
  closeButton = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClose]);

  const menuClasses = position === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="relative inline-block text-left z-20">
      <button
        ref={buttonRef}
        type="button"
        className="text-text-placeholder hover:text-text-body transition-colors duration-200 text-2xl leading-none px-2 py-0.5 rounded-full hover:bg-background-hover-card focus:outline-none focus:ring-2 focus:ring-accent"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Opciones"
      >
        {buttonContent}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className={`bg-background-dark-footer text-background-card origin-top-right absolute ${menuClasses} mt-2 w-72 rounded-md shadow-lg bg-background-card ring-1 ring-border-medium ring-opacity-5 focus:outline-none animate-fade-in-down`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          {title && (
            <div className="flex justify-between items-center p-3 border-b border-border-medium">
              <span className="text-background-card text-sm font-semibold">{title}</span>
              {closeButton && (
                <button
                  onClick={handleClose}
                  className="text-text-placeholder hover:text-danger-dark text-xl leading-none"
                  title="Cerrar menú"
                >
                  &times;
                </button>
              )}
            </div>
          )}
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;