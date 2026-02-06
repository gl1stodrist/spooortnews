import { Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const EmptyState = ({
  title = "Новостей пока нет",
  description = "Попробуйте обновить страницу или загрузить новости",
  onRetry,
  isRetrying = false,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-lg bg-card p-12 text-center">
    <Inbox className="mb-4 h-16 w-16 text-muted-foreground" />
    <h3 className="mb-2 font-display text-xl font-bold text-foreground">
      {title}
    </h3>
    <p className="mb-6 text-sm text-muted-foreground">{description}</p>
    {onRetry && (
      <Button
        onClick={onRetry}
        disabled={isRetrying}
        variant="outline"
        className="gap-2"
        aria-label="Попробовать загрузить новости снова"
      >
        <RefreshCw
          className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
        />
        {isRetrying ? "Загрузка..." : "Попробовать снова"}
      </Button>
    )}
  </div>
);
