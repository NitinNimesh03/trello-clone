import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cardsAPI } from '../services/api.js';

export default function Card({ card, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [completed, setCompleted] = useState(card.completed || false);

  // Sync state when card prop changes
  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || '');
    setCompleted(card.completed || false);
  }, [card.title, card.description, card.completed]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: card.id,
    data: {
      type: 'card',
      card
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleSave = async () => {
    try {
      await cardsAPI.update(card.id, { title, description, completed });
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update card:', error);
      alert('Failed to update card. Please try again.');
    }
  };

  const handleToggleComplete = async () => {
    try {
      const newCompleted = !completed;
      await cardsAPI.update(card.id, { completed: newCompleted });
      setCompleted(newCompleted);
      onUpdate();
    } catch (error) {
      console.error('Failed to toggle completion:', error);
      alert('Failed to update card. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this card?')) {
      try {
        await cardsAPI.delete(card.id);
        onDelete();
      } catch (error) {
        console.error('Failed to delete card:', error);
        alert('Failed to delete card. Please try again.');
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card"
      {...attributes}
    >
      {isEditing ? (
        <div className="card-edit" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
            autoFocus
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <div className="card-checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
              Completed
            </label>
          </div>
          <div className="card-actions">
            <button onClick={handleSave} onMouseDown={(e) => e.stopPropagation()}>Save</button>
            <button onClick={() => setIsEditing(false)} onMouseDown={(e) => e.stopPropagation()}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="card-content" style={{ cursor: 'grab' }}>
          <div className="card-title-row">
            <button
              className="card-checkbox"
              data-completed={completed}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleComplete();
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {completed ? '✓' : ''}
            </button>
            <div className={`card-title ${completed ? 'completed' : ''}`} {...listeners} {...attributes}>
              {card.title}
            </div>
          </div>
          {card.description && (
            <div className="card-description">{card.description}</div>
          )}
          <div className="card-actions">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              Edit
            </button>
            <button 
              onClick={(e) => {
                console.log('Delete button onClick triggered');
                e.stopPropagation();
                handleDelete();
              }}
              onMouseDown={(e) => {
                console.log('Delete button onMouseDown triggered');
                e.stopPropagation();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
