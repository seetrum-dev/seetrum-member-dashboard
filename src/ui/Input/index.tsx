import { FormMeta } from "@/types/models/inputMeta";
import { Select, TextInput } from "@mantine/core";
export * from "./RichTextEditorField";

export interface FormMetaProps {
  meta: FormMeta;
  value: string;
  error?: React.ReactNode;
  onChange(v: string): void;
}

export const InputFromMeta: React.FC<FormMetaProps> = ({
  meta,
  error,
  value,
  onChange,
}) => {
  const errorNode =
    error && meta.required && !value ? "This field is required" : undefined;

  const placeholder = `Enter your ${meta.label}`;
  if (meta.inputType === "input") {
    return (
      <TextInput
        label={meta.label}
        error={errorNode}
        onChange={(e) => onChange(e.currentTarget.value)}
        withAsterisk={meta.required}
        placeholder={placeholder}
      />
    );
  } else if (meta.inputType === "select") {
    return (
      <Select
        label={meta.label}
        data={meta.data}
        value={value}
        error={errorNode}
        onChange={onChange}
        withAsterisk={meta.required}
        placeholder={placeholder}
      />
    );
  } else {
    return null;
  }
};
