import "./globals.css";

export const metadata = { title: 'SAME Dash', description: 'Gestão simples para MEI' };
export default function RootLayout({ children }){
  return (
    <html lang="pt-BR"><body className="min-h-screen">{children}</body></html>
  );
}

