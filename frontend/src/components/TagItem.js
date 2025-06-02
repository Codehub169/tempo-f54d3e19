import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

function TagItem({ tag, onEdit, onDelete }) {
  return (
    <li className="flex items-center justify-between p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="flex-grow">
        <span className="text-lg font-medium text-neutral-darkGray">{tag.name}</span>
        {tag.post_count !== undefined && (
          <span className="ml-2 text-sm text-neutral-mediumGray">({tag.post_count} {tag.post_count === 1 ? 'post' : 'posts'})</span>
        )}
      </div>
      <div className="flex-shrink-0 space-x-2">
        <button
          onClick={() => onEdit(tag)}
          className="p-2 text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-md transition-colors"
          aria-label={`Edit tag ${tag.name}`}
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(tag.id)}
          className="p-2 text-error hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-error focus:ring-opacity-50 rounded-md transition-colors"
          aria-label={`Delete tag ${tag.name}`}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
}

export default TagItem;
