import "@styles/globals.css";
import Nav from "./components/Nav";
export const metadata = {
  title: "Jobfit",
  description: "A natural language processing job recomendation system.",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="main">
          <div className="gradient" />
        </div>
        <main className="app relative">
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
