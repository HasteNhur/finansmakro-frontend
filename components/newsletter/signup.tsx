import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", "/api/newsletter/subscribe", { email });
    },
    onSuccess: () => {
      toast({
        title: "Vellykket abonnement!",
        description: "Takk for at du abonnerer på vårt nyhetsbrev.",
      });
      setEmail("");
    },
    onError: () => {
      toast({
        title: "Feil ved abonnement",
        description: "Kunne ikke abonnere på nyhetsbrev. Prøv igjen senere.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      subscribeMutation.mutate(email);
    } else {
      toast({
        title: "Ugyldig e-postadresse",
        description: "Vennligst oppgi en gyldig e-postadresse.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-finance-blue to-blue-700 rounded-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-3">Få vårt daglige nyhetsbrev</h3>
      <p className="text-sm opacity-90 mb-4">
        Hold deg oppdatert på norske finansmarkeder med vårt daglige sammendrag.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Din e-postadresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-gray-900"
          required
        />
        <Button
          type="submit"
          className="w-full bg-white text-finance-blue hover:bg-gray-100"
          disabled={subscribeMutation.isPending}
        >
          {subscribeMutation.isPending ? "Abonnerer..." : "Abonner gratis"}
        </Button>
      </form>
      <p className="text-xs opacity-75 mt-3">Ingen spam. Avmeld når som helst.</p>
    </div>
  );
}
