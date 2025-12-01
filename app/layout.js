// app/layout.js
import "./globals.css";
import Footer from "./components/footer";
import Header from "./components/header";
import ProfileRedirect from "./components/ProfileRedirect";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  title: "Recipe Finder",
  description: "Your personal nutrition and recipe guide",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ProfileRedirect>
            <Header />
            <div className="mx-auto min-h-screen">
              {children}
            </div>
            <Footer />
          </ProfileRedirect>
        </AuthProvider>
      </body>
    </html>
  );
}
