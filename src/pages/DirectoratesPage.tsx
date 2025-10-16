// src/pages/DirectoratesPage.tsx
import React, { useState } from "react";
import { useDirectorate } from "../hooks/useDirectorate";
import DirectorateCard from "../components/DirectorateCard";
import DirectorateForm from "../components/DirectorateForm";
import Sidebar from "../components/Sidebar";
import { createOrUpdateDirectorate } from "../api/directorate";

const DirectoratesPage: React.FC = () => {
  const { directorate, loading, fetchDirectorate } = useDirectorate();
  const [showForm, setShowForm] = useState(false);

  const handleEdit = () => setShowForm(true);

  const handleSubmit = async (data: any) => {
    await createOrUpdateDirectorate(data);
    setShowForm(false);
    fetchDirectorate();
  };

  if (loading) return <p>Loading...</p>;
  if (!directorate) return <p>No directorate found.</p>;

  return (
    <div className="flex h-screen">
      <Sidebar directorate={directorate} />
      <div className="flex-1 p-6 overflow-y-auto">
        <DirectorateCard
          directorate={directorate}
          onEdit={handleEdit}
          onDelete={() => {}}
        />

        {showForm && (
          <DirectorateForm
            initialData={directorate}
            onSubmit={handleSubmit}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DirectoratesPage;
