import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function CustomAlertDestructive({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto">
      <AlertCircle className="h-6 w-6" />
      <AlertTitle className="text-start">Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
