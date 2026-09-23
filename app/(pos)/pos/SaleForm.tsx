"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { recordSale, type SaleFormState } from "./actions";

type MenuItem = {
  id: string;
  name: string;
  price: number;
};

const initialState: SaleFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-amber-700 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Completing sale..." : "Complete sale"}
    </button>
  );
}

export function SaleForm({ menuItems }: { menuItems: MenuItem[] }) {
  const [state, formAction] = useFormState(recordSale, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the quantity inputs after a successful sale.
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <div className="rounded-xl border border-stone-200 bg-white p-4">
        {menuItems.length ? (
          menuItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-stone-100 py-3 last:border-0"
            >
              <div>
                <p className="text-sm text-stone-800">{item.name}</p>
                <p className="text-xs text-stone-500">₱{item.price}</p>
              </div>
              <input
                type="number"
                name={`qty_${item.id}`}
                min={0}
                defaultValue={0}
                className="w-16 rounded-lg border border-stone-300 px-2 py-1 text-right text-sm"
              />
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-sm text-stone-400">
            No menu items yet — add some in the database to start selling.
          </p>
        )}
      </div>

      {state.status === "error" && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}