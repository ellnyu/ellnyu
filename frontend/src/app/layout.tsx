import Providers from "./providers";
import "../styles/globals.scss"; // global variables & base styles
import Navbar from "@/components/navbar/Navbar";

export const metadata = { title: "Ellens søte app" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

