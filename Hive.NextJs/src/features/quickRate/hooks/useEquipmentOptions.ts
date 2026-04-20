import { SelectOption } from "@/components/modal/Select";
import { useEffect, useState } from "react";
import { fetchEquipmentOptions } from "../services/equipmentService";

export const useEquipmentOptions = (isOpen: boolean) => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      try {
        const data = await fetchEquipmentOptions();
        setOptions(data);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, [isOpen]);

  return options;
};