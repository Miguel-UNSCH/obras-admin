"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/buttons/button";
import { Input } from "@/components/ui/input";
import ObraCard from "../obra-card";

interface obra {
  id: string;
  state: string;
  propietario_id: string;
  resident: string;
  projectType: string;
  cui: string;
  name: string;
  areaOrLength: string;
  points: [number, number][];
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface obrasProsp {
  totalObras: obra[];
  setDefaultLocation: (location: UserLocation) => void;
};

function SideDashboard({ totalObras, setDefaultLocation }: obrasProsp) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredObras, setFilteredObras] = useState<obra[]>(totalObras);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const searchTerm = searchValue.toLowerCase();

    const filtered = totalObras.filter((obra) => {
      const matchesSearch =
        obra.name.toLowerCase().includes(searchTerm) ||
        obra.state.toLowerCase().includes(searchTerm) ||
        obra.projectType.toLowerCase().includes(searchTerm) ||
        obra.cui.toLowerCase().includes(searchTerm) ||
        obra.resident.toLowerCase().includes(searchTerm);
      return matchesSearch;
    });

    setFilteredObras(filtered);
  };

  useEffect(() => {
    setFilteredObras(totalObras);
  }, [totalObras]);

  return (
    <div className="flex flex-col gap-4 h-full w-full max-w-[500px]">
      <div className="text-center text-red-500 dark:text-white bg-clip-text font-extrabold text-xl sm:text-xl md:text-2xl lg:text-4xl">
        <span>Obras por </span>
        <span className="sm:text-lg md:text-xl lg:text-4xl">
          administración{" "}
        </span>
        <span>directa</span>
      </div>
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <Input
          placeholder="Buscar por código CUI, descripción o residente"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <Button type="submit">Buscar</Button>
      </form>
      <div className="flex md:flex-col gap-4 overflow-y-auto">
        <div className="space-y-4">
          {filteredObras.length > 0 ? (
            filteredObras.map((obra, index) => (
              <ObraCard
                key={index}
                obra={obra}
                setDefaultLocation={setDefaultLocation}
              />
            ))
          ) : (
            <p>No se encontraron resultados para tu búsqueda.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SideDashboard;
