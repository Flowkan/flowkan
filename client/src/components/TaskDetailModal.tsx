import React, { useState, useEffect, useRef } from 'react';
import type { Task } from '../types';

interface TaskDetailModalProps {
  task: Task;
  columnId: string;
  onClose: () => void;
  onEditTask: (columnId: string, taskId: string, newContent: string, newDescription?: string) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  columnId,
  onClose,
  onEditTask,
  onDeleteTask,
}) => {
  const [editedContent, setEditedContent] = useState(task.content);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const modalRef = useRef<HTMLDivElement>(null);
  const contentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (contentInputRef.current) {
      contentInputRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    if (editedContent.trim() !== task.content.trim() || editedDescription.trim() !== (task.description || '').trim()) {
      onEditTask(columnId, task.id, editedContent.trim(), editedDescription.trim());
    }
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      onDeleteTask(columnId, task.id);
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleSave();
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleSave, onClose]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.currentTarget.tagName === 'INPUT') {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      if (e.currentTarget.id === 'content-input') {
        setEditedContent(task.content);
      } else if (e.currentTarget.id === 'description-textarea') {
        setEditedDescription(task.description || '');
      }
      e.currentTarget.blur();
      onClose();
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"> {/* Oscurecido más el fondo */}
      <div
        ref={modalRef}
        className="bg-background-card rounded-lg shadow-2xl p-6 w-full max-w-3xl relative flex gap-6" // Aumentado padding y sombra, añadido flex y gap
      >
        <button
          onClick={() => { handleSave(); onClose(); }}
          className="absolute top-3 right-3 text-text-placeholder hover:text-text-body text-4xl leading-none" // Icono más grande, ajuste de posición
          title="Cerrar y guardar"
        >
          &times;
        </button>

        <div className="flex-grow flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-text-placeholder text-2xl">📋</span>
            <input
              id="content-input"
              ref={contentInputRef}
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleInputKeyDown}
              className="text-2xl font-bold bg-transparent outline-none border-b border-border-medium focus:border-accent w-full resize-none" // resize-none para textarea simulado
            />
          </div>

          <div className="mb-6">
            <h4 className="text-text-placeholder text-sm font-semibold mb-2">Añadir a la tarjeta</h4>
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-1 bg-background-light-grey text-text-body px-3 py-2 rounded-md hover:bg-background-hover-column transition-colors duration-200 text-sm">
                <span className="text-lg">+</span> Añadir
              </button>
              <button className="flex items-center gap-1 bg-background-light-grey text-text-body px-3 py-2 rounded-md hover:bg-background-hover-column transition-colors duration-200 text-sm">
                <span className="text-lg">🏷️</span> Etiquetas
              </button>
              <button className="flex items-center gap-1 bg-background-light-grey text-text-body px-3 py-2 rounded-md hover:bg-background-hover-column transition-colors duration-200 text-sm">
                <span className="text-lg">🗓️</span> Fechas
              </button>
              <button className="flex items-center gap-1 bg-background-light-grey text-text-body px-3 py-2 rounded-md hover:bg-background-hover-column transition-colors duration-200 text-sm">
                <span className="text-lg">✔️</span> Checklist
              </button>
              <button className="flex items-center gap-1 bg-background-light-grey text-text-body px-3 py-2 rounded-md hover:bg-background-hover-column transition-colors duration-200 text-sm">
                <span className="text-lg">👥</span> Miembros
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-col">
            <h4 className="font-semibold text-text-heading mb-2 flex items-center gap-2">
              <span className="text-text-placeholder text-lg">📝</span> Descripción
            </h4>
            <textarea
              id="description-textarea"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleInputKeyDown}
              placeholder="Añade una descripción más detallada..."
              className="w-full p-3 rounded-md border border-border-medium focus:outline-none focus:ring-1 focus:ring-accent bg-background-input text-text-body min-h-[120px] resize-y placeholder-text-placeholder"
            />
          </div>

          <div>
            <h4 className="font-semibold text-text-heading mb-2 flex items-center gap-2">
              <span className="text-text-placeholder text-lg">💬</span> Comentarios y Actividad
            </h4>
            <textarea
              placeholder="Escribe un comentario..."
              className="w-full p-3 rounded-md border border-border-medium focus:outline-none focus:ring-1 focus:ring-accent bg-background-input text-text-body min-h-[60px] resize-y placeholder-text-placeholder"
            ></textarea>
            <div className="mt-4 bg-background-light-grey p-3 rounded-md">
              <p className="text-text-body text-sm">
                <span className="font-semibold">vocarcm</span> ha añadido esta tarjeta a Backlog
              </p>
              <p className="text-text-placeholder text-xs mt-1">21 nov 2022, 19:44</p>
            </div>            
          </div>
        </div>

        <div className="flex-shrink-0 w-64 pt-10">
            <h4 className="text-text-placeholder text-sm font-semibold mb-3">Opciones</h4>
            <div className="space-y-2">
                <button
                    onClick={() => alert('Mover (no implementado)')}
                    className="flex items-center gap-2 bg-background-light-grey text-text-body w-full justify-start px-3 py-2 rounded-md hover:bg-background-hover-column transition-colors duration-200 text-sm"
                >
                    <span className="text-lg">➡️</span> Mover
                </button>
                <button
                    onClick={() => alert('Copiar (no implementado)')}
                    className="flex items-center gap-2 bg-background-light-grey text-text-body w-full justify-start px-3 py-2 rounded-md hover:bg-background-hover-column transition-colors duration-200 text-sm"
                >
                    <span className="text-lg">📄</span> Copiar
                </button>
                <button
                    onClick={() => alert('Archivar (no implementado)')}
                    className="flex items-center gap-2 bg-background-light-grey text-text-body w-full justify-start px-3 py-2 rounded-md hover:bg-background-hover-column transition-colors duration-200 text-sm"
                >
                    <span className="text-lg">🗄️</span> Archivar
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2  bg-background-light-grey text-text-body w-full justify-start px-3 py-2 rounded-md hover:bg-danger-dark transition-colors duration-200 text-sm hover:bg-red-400 hover:text-background-card"
                >
                    <span className="text-lg">🗑️</span> Eliminar
                </button>                
            </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;