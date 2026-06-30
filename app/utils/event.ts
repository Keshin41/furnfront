import type { FurmeetActivityType } from "~/types/furmeet";
import { EventPartType } from "~/types/logicConstants";

export const mapEventPartTypeToLabel = (type: EventPartType): string => {
  switch (type) {
    case EventPartType.ACTIVITY:
      return "Activité";
    case EventPartType.RESTAURANT:
      return "Restaurant";
    case EventPartType.BAR:
      return "Bar";
    case EventPartType.OTHER:
      return "Autre";
    default:
      return "Inconnu";
  }
};

export const createOptionFromEnum = <T extends Record<string, string>>(
  enumObj: T,
  mapToLabel: (value: T[keyof T]) => string,
): { label: string; value: string }[] => {
  return Object.values(enumObj).map((value) => ({
    label: mapToLabel(value),
    value,
  }));
};

const FieldType = {
  TEXT: "TEXT",
  NUMBER: "NUMBER",
  SELECT: "SELECT",
  CHECKBOX: "CHECKBOX",
  RADIO: "RADIO",
} as const;

type FieldTypeType = (typeof FieldType)[keyof typeof FieldType];

export const createEmptyQuestion = () => ({
  label: "",
  order: 0,
  type: FieldType.TEXT as FieldTypeType,
  required: false,
});

export const createEmptyActivity = () => ({
  title: "",
  description: "",
  date: "",
  time: "12:00",
  order: 0,
  type: "OTHER" as FurmeetActivityType,
});
