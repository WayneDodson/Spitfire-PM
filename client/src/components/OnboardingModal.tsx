import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const [displayName, setDisplayName] = useState("");
  const updateProfile = trpc.profile.updateDisplayName.useMutation({
    onSuccess: () => {
      toast.success("Welcome! Your profile has been set up.");
      onComplete();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Please enter your preferred name");
      return;
    }
    updateProfile.mutate({ displayName: displayName.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Project Pro!</DialogTitle>
          <DialogDescription>
            Let's personalize your learning experience. What should we call you?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Your Preferred Name</Label>
            <Input
              id="displayName"
              placeholder="e.g., John Smith"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={100}
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              This name will be displayed throughout the site instead of your email address.
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={updateProfile.isPending || !displayName.trim()}
          >
            {updateProfile.isPending ? "Setting up..." : "Get Started"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
