import Sidebar from "./components/layout/Sidebar";
import Planner from "./components/layout/Planner";
import Totals from "./components/layout/Totals";
import ProgressChart from "./components/layout/ProgressChart";

import { useState } from "react";

export default function App() {
  const [giorno, setGiorno] = useState(0);
  const [pasto, setPasto] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-[1200px] mx-auto space-y-6">
        <ProgressChart />
        <div className="grid grid-cols-12 gap-4">
          <Sidebar giorno={giorno} pasto={pasto} />
          <Planner
            giorno={giorno}
            pasto={pasto}
            setGiorno={setGiorno}
            setPasto={setPasto}
          />
          <Totals giorno={giorno} pasto={pasto} />
        </div>
      </div>
    </div>
  );
}
