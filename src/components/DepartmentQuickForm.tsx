import React, { useState } from "react";

type Props = {
  onSave: (name: string, note?: string) => Promise<void> | void;
  onClose: () => void;
};

const DepartmentQuickForm: React.FC<Props> = ({ onSave, onClose }) => {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-bold mb-3">إضافة دائرة جديدة</h3>

        <label className="block text-sm mb-2">
          اسم الدائرة
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: الشؤون الإدارية"
            required
          />
        </label>

        <label className="block text-sm mb-4">
          ملاحظة (اختياري)
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="أي تفاصيل إضافية"
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
            onClick={onClose}
          >
            إلغاء
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={async () => {
              if (!name.trim()) return;
              await onSave(name.trim(), note.trim() || undefined);
              onClose();
            }}
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentQuickForm;
