"use client";

import { useActionState } from "react";
import { addInventoryItem, type AddItemState } from "./actions";

export function AddItemForm({ availableNames }: { availableNames: string[] }) {
  const [state, formAction, pending] = useActionState<AddItemState, FormData>(
    addInventoryItem,
    {}
  );

  const inputClass =
    "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600";
  const labelClass = "mb-1 block text-xs font-medium text-stone-600";

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label htmlFor="add-name" className={labelClass}>
          Item name
        </label>

        <input
          id="add-name"
          name="name"
          type="text"
          required
          autoComplete="off"
          list="catalog-items"
          defaultValue={state.name}
          placeholder="e.g. Whole Milk"
          className={inputClass}
        />

        <datalist id="catalog-items">
          {availableNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="add-quantity" className={labelClass}>
            Quantity
          </label>
          <input
            id="add-quantity"
            name="quantity"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="10"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="add-threshold" className={labelClass}>
            Reorder threshold
          </label>
          <input
            id="add-threshold"
            name="reorder_threshold"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="5"
            className={inputClass}
          />
        </div>
      </div>

      {state.error && (
        <p
          className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"
          role="alert"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save item"}
      </button>
    </form>
  );
}