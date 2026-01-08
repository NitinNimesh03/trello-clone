import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import List from './List.jsx';
import { listsAPI, cardsAPI } from '../services/api.js';

export default function Board() {
  const [lists, setLists] = useState([]);
  const [cardsByList, setCardsByList] = useState({});
  const [newListTitle, setNewListTitle] = useState('');
  const [showAddList, setShowAddList] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    // Load cards for all lists when lists change
    if (lists.length > 0) {
      lists.forEach((list) => {
        loadCardsForList(list.id);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists.length]);

  const loadLists = async () => {
    const allLists = await listsAPI.getAll();
    setLists(allLists);
  };

  const loadCardsForList = async (listId) => {
    const cards = await cardsAPI.getByList(listId);
    setCardsByList((prev) => ({ ...prev, [listId]: cards }));
  };

  const handleListDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Check if dragging a list (starts with 'list-')
    if (typeof active.id === 'string' && active.id.startsWith('list-')) {
      const activeListId = parseInt(active.id.replace('list-', ''));
      const overIdStr = over.id.toString();
      const overListId = overIdStr.startsWith('list-') 
        ? parseInt(overIdStr.replace('list-', ''))
        : null;

      if (!overListId) return;

      const oldIndex = lists.findIndex((list) => list.id === activeListId);
      const newIndex = lists.findIndex((list) => list.id === overListId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newLists = arrayMove(lists, oldIndex, newIndex);
        setLists(newLists);

        // Persist reordering to backend
        try {
          const listIds = newLists.map((list) => list.id);
          await listsAPI.reorder(listIds);
          // Reload lists to ensure sync
          await loadLists();
        } catch (error) {
          console.error('Failed to reorder lists:', error);
          // Revert on error
          await loadLists();
        }
      }
    }
  };

  const handleCardDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    // Check if dragging a card (numeric ID or string number)
    const cardId = typeof active.id === 'number' ? active.id : parseInt(active.id);
    if (isNaN(cardId)) return;

    const overId = over.id;
    const overIdStr = overId.toString();

    // Check if dropped on a list droppable area
    if (overIdStr.startsWith('droppable-list-')) {
      const targetListId = parseInt(overIdStr.replace('droppable-list-', ''));
      if (!isNaN(targetListId)) {
        try {
          await moveCardToList(cardId, targetListId);
        } catch (error) {
          console.error('Failed to move card to list:', error);
          // Reload to revert
          for (const list of lists) {
            await loadCardsForList(list.id);
          }
        }
      }
      return;
    }

    // Check if dropped on another card (reordering within or across lists)
    const targetCardId = typeof overId === 'number' ? overId : parseInt(overIdStr);
    if (isNaN(targetCardId)) return;

    // Find which list contains the target card
    let targetListId = null;
    for (const [listId, cards] of Object.entries(cardsByList)) {
      if (cards.some((card) => card.id === targetCardId)) {
        targetListId = parseInt(listId);
        break;
      }
    }

    if (!targetListId) return;

    // Find source list
    let sourceListId = null;
    for (const [listId, cards] of Object.entries(cardsByList)) {
      if (cards.some((card) => card.id === cardId)) {
        sourceListId = parseInt(listId);
        break;
      }
    }

    if (!sourceListId) return;

    try {
      if (sourceListId === targetListId) {
        // Reordering within same list
        const cards = cardsByList[targetListId] || [];
        const oldIndex = cards.findIndex((c) => c.id === cardId);
        const newIndex = cards.findIndex((c) => c.id === targetCardId);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const newCards = arrayMove(cards, oldIndex, newIndex);
          const cardIds = newCards.map((c) => c.id);
          await cardsAPI.reorder(cardIds, targetListId);
          await loadCardsForList(targetListId);
        }
      } else {
        // Moving to different list
        await moveCardToList(cardId, targetListId, targetCardId);
      }
    } catch (error) {
      console.error('Failed to reorder cards:', error);
      // Reload to revert
      for (const list of lists) {
        await loadCardsForList(list.id);
      }
    }
  };

  const moveCardToList = async (cardId, targetListId, insertBeforeCardId = null) => {
    const targetCards = cardsByList[targetListId] || [];
    
    let newCardIds;
    if (insertBeforeCardId) {
      // Insert before specific card
      const insertIndex = targetCards.findIndex((c) => c.id === insertBeforeCardId);
      const cardsWithoutMoved = targetCards.filter((c) => c.id !== cardId);
      newCardIds = [
        ...cardsWithoutMoved.slice(0, insertIndex),
        cardId,
        ...cardsWithoutMoved.slice(insertIndex)
      ].map((c) => c.id);
    } else {
      // Append to end
      const cardsWithoutMoved = targetCards.filter((c) => c.id !== cardId);
      newCardIds = [...cardsWithoutMoved.map((c) => c.id), cardId];
    }

    await cardsAPI.reorder(newCardIds, targetListId);
    
    // Reload cards for all lists to ensure sync
    for (const list of lists) {
      await loadCardsForList(list.id);
    }
  };

  const handleAddList = async () => {
    if (newListTitle.trim()) {
      try {
        await listsAPI.create(newListTitle);
        setNewListTitle('');
        setShowAddList(false);
        await loadLists();
      } catch (error) {
        console.error('Failed to create list:', error);
        alert('Failed to create list. Please try again.');
      }
    }
  };

  return (
    <>
      <div className="board">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            // Handle both list and card drags
            handleCardDragEnd(event);
            handleListDragEnd(event);
          }}
        >
          <SortableContext
            items={lists.map((list) => `list-${list.id}`)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="lists-container">
              {lists.map((list) => (
                <List
                  key={list.id}
                  list={list}
                  cards={cardsByList[list.id] || []}
                  onUpdate={loadLists}
                  onDelete={loadLists}
                  onCardUpdate={() => loadCardsForList(list.id)}
                  onCardDelete={() => loadCardsForList(list.id)}
                  onCardReorder={() => {
                    loadCardsForList(list.id);
                  }}
                />
              ))}
              {showAddList ? (
                <div className="add-list-form">
                  <input
                    type="text"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Enter list title"
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleAddList();
                    }}
                  />
                  <div>
                    <button onClick={handleAddList}>Add List</button>
                    <button onClick={() => setShowAddList(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button
                  className="add-list-btn"
                  onClick={() => setShowAddList(true)}
                >
                  <span style={{ fontSize: '16px', marginRight: '8px' }}>+</span> Add another list
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}
