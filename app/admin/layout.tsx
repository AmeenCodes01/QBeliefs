import Header from "@/components/Header";
import Provider from "./components/Provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex  w-full min-h-full  flex-col overflow-hidden">
    <Provider> 
    <div className="flex flex-1 overflow-hidden justify-center">
            <div className="flex flex-1 flex-col p-2 max-w-7xl  overflow-hidden">
              {children}
            </div>
          </div>
    </Provider>
  </div>
  );
}
