import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Droppable } from "@hello-pangea/dnd";
import type { Column as ColumnType, Task } from "../types";
import TaskCard from "./TaskCard";
import DropdownMenu from './DropdownMenu';

interface Props {
  column: ColumnType;
  onAddTask: (columnId: string, content: string) => void;
  onEditTask: (columnId: string, taskId: string, newContent: string, newDescription?: string) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onEditColumnTitle: (columnId: string, newTitle: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onOpenTaskDetail: (task: Task, columnId: string) => void;
  isNewColumnInEditMode: boolean;
}

const Column = ({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onEditColumnTitle,
  onDeleteColumn,
  onOpenTaskDetail,
  isNewColumnInEditMode,
}: Props) => {
  const [newTaskContent, setNewTaskContent] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(isNewColumnInEditMode);
  const [editedTitle, setEditedTitle] = useState(column.title);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const addTaskInputRef = useRef<HTMLInputElement>(null);
  const addTaskButtonRef = useRef<HTMLButtonElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleAddTask = useCallback(() => {
    if (newTaskContent.trim()) {
      onAddTask(column.id, newTaskContent.trim());
      setNewTaskContent('');
      setIsAddingTask(false);
    }
  }, [column.id, newTaskContent, onAddTask]);

  const handleTitleDoubleClick = useCallback(() => {
    setIsEditingTitle(true);
  }, []);

  const handleTitleBlur = useCallback(() => {
    setIsEditingTitle(false);
    if (editedTitle.trim() === "") {
        if (isNewColumnInEditMode) {
            onDeleteColumn(column.id);
        } else {
            setEditedTitle(column.title);
        }
    } else if (editedTitle.trim() !== column.title) {
      onEditColumnTitle(column.id, editedTitle.trim());
    }
  }, [editedTitle, column.title, onEditColumnTitle, isNewColumnInEditMode, onDeleteColumn, column.id]);


  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
      if (editedTitle.trim() === "") {        
        e.currentTarget.blur();
      } else {
        onEditColumnTitle(column.id, editedTitle.trim());
      }
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      if (isNewColumnInEditMode) {
        onDeleteColumn(column.id);
      } else {
        setEditedTitle(column.title);
      }
    }
  }, [editedTitle, column.title, onEditColumnTitle, isNewColumnInEditMode, onDeleteColumn, column.id]);

  const handleDeleteColumnClick = useCallback(() => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la columna "${column.title}"? Todas las tareas dentro se perderán.`)) {
      onDeleteColumn(column.id);
    }
  }, [column.id, column.title, onDeleteColumn]);

  const handleStartAddingTask = useCallback(() => {
    setIsAddingTask(true);
  }, []);

  const handleCancelAddTask = useCallback(() => {
    setIsAddingTask(false);
    setNewTaskContent('');
  }, []);

  useEffect(() => {
    if (isAddingTask && addTaskInputRef.current) {
      addTaskInputRef.current.focus();
    }
  }, [isAddingTask]);

  useEffect(() => {
    if (isNewColumnInEditMode && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isNewColumnInEditMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedInsideInput = addTaskInputRef.current && addTaskInputRef.current.contains(event.target as Node);
      const clickedInsideButton = addTaskButtonRef.current && addTaskButtonRef.current.contains(event.target as Node);

      if (isAddingTask && !clickedInsideInput && !clickedInsideButton) {
        if (newTaskContent.trim()) {
          handleAddTask();
        } else {
          handleCancelAddTask();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAddingTask, newTaskContent, handleAddTask, handleCancelAddTask]);

  return (
    <div className="bg-background-column rounded-lg shadow-xl p-4 w-80 flex-shrink-0 flex flex-col h-full max-h-[calc(100vh-160px)]">
      <div className="flex justify-between items-center mb-4">
        <h3
          onDoubleClick={handleTitleDoubleClick}
          className="font-bold text-xl text-text-heading px-2 py-1 cursor-pointer select-none flex-grow mr-2"
        >
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="w-full bg-transparent outline-none border-b border-accent focus:border-accent-dark text-text-heading font-bold text-xl"
            />
          ) : (
            column.title || (isNewColumnInEditMode ? 'Haz doble clic para editar' : 'Título de la columna')
          )}
        </h3>
        <DropdownMenu buttonContent={<span className="text-3xl leading-none -mt-1">&#x22EE;</span>} title="Enumerar acciones" closeButton>
          <button
            onClick={() => { handleAddTask(); }}
            className="block w-full text-left px-4 py-2 text-sm text-background-card hover:bg-gray-700 rounded-md"
            role="menuitem"
          >
            Añadir tarjeta
          </button>
          <button
            onClick={() => alert('Copiar lista (no implementado)')}
            className="block w-full text-left px-4 py-2 text-sm text-background-card hover:bg-gray-700 rounded-md"
            role="menuitem"
          >
            Copiar lista
          </button>
          <button
            onClick={() => alert('Mover lista (no implementado)')}
            className="block w-full text-left px-4 py-2 text-sm text-background-card hover:bg-gray-700 rounded-md"
            role="menuitem"
          >
            Mover lista
          </button>
          <button
            onClick={() => alert('Mover todas las tarjetas (no implementado)')}
            className="block w-full text-left px-4 py-2 text-sm text-background-card hover:bg-gray-700 rounded-md"
            role="menuitem"
          >
            Mover todas las tarjetas de esta lista
          </button>
          <button
            onClick={() => alert('Ordenar por... (no implementado)')}
            className="block w-full text-left px-4 py-2 text-sm text-background-card hover:bg-gray-700 rounded-md"
            role="menuitem"
          >
            Ordenar por...
          </button>
          <button
            onClick={() => alert('Seguir (no implementado)')}
            className="block w-full text-left px-4 py-2 text-sm text-background-card hover:bg-gray-700 rounded-md"
            role="menuitem"
          >
            Seguir
          </button>

          <div className="my-2 border-t border-border-light"></div>

          <button
            onClick={() => alert('Cambiar color de lista (no implementado)')}
            className="block w-full text-left px-4 py-2 text-sm  text-background-card hover:bg-gray-700 rounded-md"
            role="menuitem"
          >
            Cambiar color de lista
          </button>
          <button
            onClick={() => alert('Automatización (no implementado)')}
            className="block w-full text-left px-4 py-2 text-sm text-background-card hover:bg-gray-700 rounded-md"
            role="menuitem"
          >
            Automatización
          </button>

          <div className="my-2 border-t border-border-light"></div>

          <button
            onClick={() => {
              if (window.confirm(`¿Estás seguro de que quieres archivar esta lista "${column.title}"?`)) {
                alert('Archivar esta lista (no implementado)');
              }
            }}
            className="block w-full text-left px-4 py-2 text-sm text-background-card hover:bg-gray-700 rounded-md"
            role="menuitem"
          >
            Archivar esta lista
          </button>
          <button
            onClick={() => {
              if (window.confirm(`¿Estás seguro de que quieres archivar todas las tarjetas de "${column.title}"?`)) {
                alert('Archivar todas las tarjetas (no implementado)');
              }
            }}
            className="block w-full text-left px-4 py-2 text-sm text-background-card hover:bg-gray-700 rounded-md"
            role="menuitem"
          >
            Archivar todas las tarjetas de esta lista
          </button>

          <div className="my-2 border-t border-border-light"></div>

          <button
            onClick={handleDeleteColumnClick}
            className="block w-full text-left px-4 py-2 text-sm text-danger-dark hover:bg-danger-light hover:bg-red-500"
            role="menuitem"
          >
            Eliminar Columna
          </button>
        </DropdownMenu>
      </div>

      <Droppable droppableId={column.id} type="task">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-grow min-h-[50px] p-2 rounded-md transition-colors duration-200
              ${snapshot.isDraggingOver ? 'bg-background-hover-column' : ''}
              overflow-y-auto custom-scrollbar`}
          >
            {column.items.map((item: Task, index: number) => (
              <TaskCard
                key={item.id}
                task={item}
                index={index}
                columnId={column.id}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onOpenTaskDetail={onOpenTaskDetail}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="mt-4 flex flex-col gap-2">
        {!isAddingTask ? (
          <button
            ref={addTaskButtonRef}
            onClick={handleStartAddingTask}
            className="bg-background-input text-text-placeholder py-2 rounded-md font-semibold hover:bg-background-hover-card transition-colors duration-200 flex items-center justify-center"
          >
            + Añadir tarjeta
          </button>
        ) : (
          <>
            <input
              ref={addTaskInputRef}
              type="text"
              placeholder="Título de la tarjeta..."
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              className="w-full p-3 rounded-md border border-border-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background-input text-text-body placeholder-text-placeholder"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                className="flex-grow bg-primary text-text-on-accent py-2 rounded-md font-semibold hover:bg-accent-dark transition-colors duration-200 hover:bg-primary-hover"
              >
                Añadir tarjeta
              </button>
              <button
                onClick={handleCancelAddTask}
                className="text-text-placeholder hover:text-danger-dark transition-colors duration-200 text-3xl leading-none px-2"
                title="Cancelar"
              >
                &times;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Column;