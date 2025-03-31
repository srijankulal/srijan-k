import type { Metadata } from "next";
import { VT323  } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";


// const poppins = Poppins({
//   weight: ["700"],
//   variable: "--font-poppins", 
// });

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vt323",
});



export const metadata: Metadata = {
  title: "Srijan K | Portfolio",
  description: "Welcome to my portfolio! I'm Srijan K, a passionate software developer with expertise in Python, Flutter, and Next.js. Explore my projects and skills to see what I can do.",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${vt323.className} antialiased bg-neutral-900 text-neutral-100`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}