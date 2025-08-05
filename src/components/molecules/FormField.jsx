import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  id, 
  error, 
  className,
  required = false,
  ...inputProps 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="block">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        {...inputProps}
        className={cn(
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "",
          inputProps.className
        )}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormField;