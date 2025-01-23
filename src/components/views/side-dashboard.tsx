"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/buttons/button";
import { Input } from "@/components/ui/input";
import ObraCard from "../obra-card";

interface Obras {
  id: string;
  state: string;
  cui: string;
  name: string;
  points: [number, number][];
  areaOrLength: string | null;
  resident: string;
  projectType: string;
  propietario_id: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

type obrasProsp = {
  obrasT: Obras[]
  setDefaultLocation: (location: UserLocation) => void
};

function SideDashboard({ obrasT, setDefaultLocation }: obrasProsp) {
  const [searchValue, setSearchValue] = useState("");
  const [filteredObras, setFilteredObras] = useState<Obras[]>(obrasT);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const searchTerm = searchValue.toLowerCase();

    const filtered = obrasT.filter((obra) => {
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
    setFilteredObras(obrasT);
  }, [obrasT]);

  return (
    <div className="flex flex-col gap-4 h-full w-full max-w-[500px]">
      <div className="text-center text-red-500 dark:text-white bg-clip-text font-extrabold text-xl sm:text-xl md:text-2xl lg:text-4xl">
        <span>Obras por </span>
        <span className="sm:text-lg md:text-xl lg:text-4xl">administración </span>
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
              <ObraCard key={index} obra={obra} setDefaultLocation={setDefaultLocation} />
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
