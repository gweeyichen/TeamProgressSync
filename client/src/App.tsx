import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "./pages/Home";
import { UserProvider } from "@/contexts/UserContext";
import { DebtProvider } from "@/contexts/DebtContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <DebtProvider>
          <Router />
          <Toaster />
        </DebtProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
