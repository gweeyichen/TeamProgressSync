import * as React from "react";
import { useToast, toast } from "../../hooks/use-toast";
import { X, CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

export interface ToastNotificationProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number;
  onClose?: () => void;
}

export function ToastNotification({
  message,
  type = "info",
  duration = 5000,
  onClose,
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  
  // Set colors based on type
  let bgColor = "bg-primary/10";
  let textColor = "text-primary";
  let borderColor = "border-l-primary";
  
  if (type === "success") {
    bgColor = "bg-primary/10";
    textColor = "text-primary";
    borderColor = "border-l-primary";
  } else if (type === "warning") {
    bgColor = "bg-secondary/10";
    textColor = "text-secondary";
    borderColor = "border-l-secondary";
  } else if (type === "error") {
    bgColor = "bg-destructive/10";
    textColor = "text-destructive";
    borderColor = "border-l-destructive";
  }
  
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300);
    }, duration);
    
    return () => clearTimeout(timeout);
  }, [duration, onClose]);
  
  return (
    <div 
      className={`bg-white shadow-lg rounded-lg px-4 py-3 flex items-start max-w-sm transform transition-all duration-300 
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
        ${bgColor} border-l-4 ${borderColor}`}
    >
      <div className={`flex-shrink-0 ${textColor} mr-3`}>
        {type === "error" ? (
          <XCircle className="h-5 w-5" />
        ) : type === "warning" ? (
          <AlertCircle className="h-5 w-5" />
        ) : type === "success" ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <Info className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm text-neutral-700">{message}</p>
      </div>
      <button 
        className="ml-4 text-neutral-400 hover:text-neutral-500"
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => {
            onClose?.();
          }, 300);
        }}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function showNotification(message: string, type: "info" | "success" | "warning" | "error" = "info") {
  toast({
    title: type.charAt(0).toUpperCase() + type.slice(1),
    description: message,
    variant: type === "error" ? "destructive" : "default"
  });
}
