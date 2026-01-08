import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import Card from './Card.jsx';
import { cardsAPI, listsAPI } from '../services/api.js';

export default function List({ list, cards, onUpdate, onDelete, onCardUpdate, onCardDelete, onCardReorder }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);

  // Sync title state when list prop changes
  useEffect(() => {
    setTitle(list.title);
  }, [list.title]);

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: `list-${list.id}`,
    data: {
      type: 'list',
      list
    }
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `droppable-list-${list.id}`,
    data: {
      type: 'list',
      listId: list.id
    }
  });

  // Combine refs for list container
  const setNodeRef = (node) => {
    setSortableRef(node);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isOver ? '#dfe1e6' : '#ebecf0'
  };

  const handleSave = async () => {
    try {
      await listsAPI.update(list.id, title);
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update list:', error);
      alert('Failed to update list. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this list and all its cards?')) {
      try {
        await listsAPI.delete(list.id);
        onDelete();
      } catch (error) {
        console.error('Failed to delete list:', error);
        alert('Failed to delete list. Please try again.');
      }
    }
  };

  const handleAddCard = async () => {
    if (newCardTitle.trim()) {
      try {
        await cardsAPI.create(list.id, newCardTitle);
        setNewCardTitle('');
        setShowAddCard(false);
        onCardReorder();
      } catch (error) {
        console.error('Failed to create card:', error);
        alert('Failed to create card. Please try again.');
      }
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="list">
      <div className="list-header">
        {isEditing ? (
          <div className="list-edit">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div className="list-title-row">
            <div className="list-title">{list.title}</div>
            <div className="list-header-icons">
              <div className="list-drag-handle" {...attributes} {...listeners} title="Drag to reorder">
                ↔
              </div>
              <div className="list-menu-icon" title="Menu">⋯</div>
            </div>
          </div>
        )}
        <div className="list-actions">
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
              e.stopPropagation();
              handleDelete();
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            Delete
          </button>
        </div>
      </div>

      <div ref={setDroppableRef} className="cards-container-wrapper">
        <SortableContext
          items={cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="cards-container">
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onUpdate={onCardUpdate}
                onDelete={onCardDelete}
              />
            ))}
          </div>
        </SortableContext>
      </div>

      {showAddCard ? (
        <div className="add-card-form">
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Enter a title or paste a link"
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAddCard();
            }}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <div className="add-card-form-actions">
            <button 
              className="add-card-submit-btn"
              onClick={handleAddCard} 
              onMouseDown={(e) => e.stopPropagation()}
            >
              Add card
            </button>
            <button 
              className="add-card-cancel-btn"
              onClick={() => setShowAddCard(false)} 
              onMouseDown={(e) => e.stopPropagation()}
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        <button
          className="add-card-btn"
          onClick={() => setShowAddCard(true)}
        >
          <span>+</span> Add a card
        </button>
      )}
    </div>
  );
}
