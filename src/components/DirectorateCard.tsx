import React from "react";
import { Directorate } from "../types/directorate";

interface Props {
  directorate: Directorate;
  onEdit: () => void;
  onDelete?: () => void; // اختياري
}

const DirectorateCard: React.FC<Props> = ({
  directorate,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h2 className="text-xl font-bold">{directorate.name}</h2>
      {directorate.address && <p>Address: {directorate.address}</p>}
      {directorate.note && <p>Note: {directorate.note}</p>}

      {/* <div className="mt-2 flex gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onEdit}
        >
          Edit
        </button>
        {onDelete && (
          <button
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
      </div> */}
    </div>
  );
};

export default DirectorateCard;
