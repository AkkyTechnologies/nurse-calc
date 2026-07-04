/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface FavoriteNameFormProps {
  title: string;
  initialName?: string;
  placeholder: string;
  submitLabel: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

// Shared inline add/rename form for favorites — used by any calculator screen's Favorites carousel.
export default function FavoriteNameForm({
  title,
  initialName = '',
  placeholder,
  submitLabel,
  onSubmit,
  onCancel,
}: FavoriteNameFormProps) {
  const [name, setName] = useState(initialName);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit(name.trim());
      }}
      className="w-full space-y-3"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider"
        >
          Cancel
        </button>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          autoFocus
          placeholder={placeholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 px-4 py-2.5 text-xs font-semibold border-2 border-slate-200 rounded-xl bg-white focus:outline-teal-600"
        />
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
