import "./App.css";
import {SnackbarProvider} from "notistack";
import CountryRevenueTable from "./compnents/CountryRevenueTable";

function App() {
  return (
    <>
      {" "}
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}/>
      <h1 className="text-4xl text-red-500 font-bold">Tailwind Working?</h1>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">📊 Dashlytics Dashboard</h1>
        <CountryRevenueTable />
      </div>
    </>
  );
}

export default App;
