import React, { useState } from "react";
import { Directorate } from "../types/directorate";

interface Props {
  initialData?: Directorate;
  onSubmit: (data: Partial<Directorate>) => void;
  onClose: () => void;
}

const DirectorateForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  onClose,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [note, setNote] = useState(initialData?.note || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, address, note });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <form
        className="bg-white p-6 rounded shadow w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Directorate" : "Add Directorate"}
        </h2>

        <label className="block mb-2">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </label>

        <label className="block mb-4">
          Note:
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default DirectorateForm;
