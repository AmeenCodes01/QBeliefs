import Header from "@/components/Header";
import Provider from "./components/Provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen flex-col">
    <Provider> 
      <div className="flex flex-1 w-full p-4 overflow-hidden">
        {children}
      </div>
    </Provider>
  </div>
  );
}
