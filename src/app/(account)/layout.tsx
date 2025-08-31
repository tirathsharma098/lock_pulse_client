import { VaultProvider } from "@/contexts/VaultContext";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VaultProvider>
        {children}
    </VaultProvider>
  );
}