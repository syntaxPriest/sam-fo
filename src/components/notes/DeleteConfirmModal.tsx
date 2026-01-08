'use client';

import { LocalNote } from '@/types';
import { Modal, Button } from '@/components/ui';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  note: LocalNote | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmModal = ({
  isOpen,
  note,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete Note" size="sm">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete{' '}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            &quot;{note?.title || 'this note'}&quot;
          </span>
          ? This action cannot be undone.
        </p>

        {note?.syncStatus === 'pending' && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This note has unsynchronized changes. Deleting it will also remove
              pending changes.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export { DeleteConfirmModal };
export default DeleteConfirmModal;
