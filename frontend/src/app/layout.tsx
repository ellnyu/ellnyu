import Providers from "./providers";
import "../styles/globals.scss"; // global variables & base styles
import Navbar from "@/components/navbar/Navbar";
import { AuthProvider } from "@/context/AuthContext";   

export const metadata = { title: "Ellens søte app" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Providers>
            <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}

