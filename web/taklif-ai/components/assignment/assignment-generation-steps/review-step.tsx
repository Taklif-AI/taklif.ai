import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";

interface ReviewStepProps {
  data: {
    file: File | string | null;

    interest: string;
  };
  onBack: () => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function ReviewStep({ data, onBack, onSubmit, isPending }: ReviewStepProps) {


  const getContentPreview = () => {
    if (!data.file) return null;

    if (typeof data.file !== 'string' && 'type' in data.file) {
      return (
        <div className="text-sm">
          <p className="mb-1">{data.file.name}</p>
          <p className="text-muted-foreground">
            Size: {(data.file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      );
    }

    return (
      <div className="text-sm">
        <p className="mb-1">Text Content</p>
        <p className="text-muted-foreground line-clamp-3">
          {typeof data.file === 'string' ? data.file : ''}
        </p>
      </div>
    );
  };

  return (
    <Card className="p-8 max-w-xl mx-auto inset-0 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-background">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Review Your Assignment Setup</h1>
        <p className="text-muted-foreground">
          Please review your selections before generating the assignment
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-secondary/50 rounded-lg">
          <h2 className="font-semibold mb-2">Content</h2>
          {getContentPreview()}
        </div>

        <div className="p-4 bg-secondary/50 rounded-lg">
          <h2 className="font-semibold mb-2">Selected Topics</h2>
          <div className="flex flex-wrap gap-2">

            <span
              className="px-2 py-1 bg-primary/10 rounded-md text-sm"
            >
              {data.interest}
            </span>

          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button className="rounded-full" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Edit
        </Button>
        <Button disabled={isPending} className="rounded-full" onClick={onSubmit}>
          Personalize
          <Send className=" h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}