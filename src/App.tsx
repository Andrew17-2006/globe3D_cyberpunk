import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import GlobeComponent from './components/Globe';
import CountrySidebar from './components/CountrySidebar';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <LoadingScreen />

        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-cyan-900/20" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <Header />

        <div className="relative w-full h-full">
          <GlobeComponent />
        </div>

        <CountrySidebar />
      </div>
    </QueryClientProvider>
  );
}

export default App;
