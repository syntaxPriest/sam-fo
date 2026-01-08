'use client';

import { useState, useCallback, useEffect } from 'react';
import { LocalNote, NoteFormData } from '@/types';
import { useNotes, useOnlineStatus, useServiceWorker } from '@/hooks';
import { NotesList, NoteForm, DeleteConfirmModal } from '@/components/notes';
import { Button, Modal, OnlineIndicator } from '@/components/ui';

export default function HomePage() {
  const { isOnline } = useOnlineStatus();
  const { isSupported, updateAvailable, skipWaiting } = useServiceWorker();
  const {
    notes,
    isLoading,
    error,
    pendingCount,
    isSyncing,
    createNote,
    updateNote,
    deleteNote,
    syncNotes,
  } = useNotes();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<LocalNote | null>(null);
  const [deletingNote, setDeletingNote] = useState<LocalNote | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Show notification helper
  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Handle PWA update
  useEffect(() => {
    if (updateAvailable) {
      showNotification('New version available! Click to update.');
    }
  }, [updateAvailable, showNotification]);

  // Open form for creating new note
  const handleCreateNew = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  // Open form for editing existing note
  const handleEdit = (note: LocalNote) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  // Close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingNote(null);
  };

  // Submit form (create or update)
  const handleSubmit = async (data: NoteFormData) => {
    setIsSubmitting(true);
    try {
      if (editingNote) {
        await updateNote(editingNote.localId, data);
        showNotification('Note updated successfully');
      } else {
        await createNote(data);
        showNotification('Note created successfully');
      }
      handleCloseForm();
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deletingNote) return;

    setIsSubmitting(true);
    try {
      await deleteNote(deletingNote.localId);
      showNotification('Note deleted successfully');
      setDeletingNote(null);
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Failed to delete note');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manual sync
  const handleSync = async () => {
    const result = await syncNotes();
    if (result.success) {
      showNotification(`Synced ${result.synced} notes`);
    } else {
      showNotification(result.error || 'Sync failed');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Notes
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Offline-First PWA
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <OnlineIndicator
                isOnline={isOnline}
                pendingCount={pendingCount}
                isSyncing={isSyncing}
              />

              {isOnline && pendingCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSync}
                  disabled={isSyncing}
                >
                  <svg
                    className={`w-4 h-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Sync
                </Button>
              )}

              <Button variant="primary" onClick={handleCreateNew}>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Note
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Offline banner */}
        {!isOnline && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                You&apos;re offline. Changes will sync when you&apos;re back online.
              </p>
            </div>
          </div>
        )}

        {/* Notes list */}
        <NotesList
          notes={notes}
          onNoteSelect={handleEdit}
          onNoteDelete={setDeletingNote}
          isLoading={isLoading}
        />
      </main>

      {/* Note form modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingNote ? 'Edit Note' : 'Create Note'}
        size="lg"
      >
        <NoteForm
          initialData={editingNote || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={!!deletingNote}
        note={deletingNote}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingNote(null)}
        isLoading={isSubmitting}
      />

      {/* Notification toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-3 rounded-lg shadow-lg">
            {notification}
          </div>
        </div>
      )}

      {/* PWA update prompt */}
      {updateAvailable && (
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={skipWaiting}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          >
            Update available - Click to refresh
          </button>
        </div>
      )}

      {/* Service Worker not supported warning */}
      {!isSupported && typeof window !== 'undefined' && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg">
            Offline mode not supported in this browser
          </div>
        </div>
      )}
    </div>
  );
}
