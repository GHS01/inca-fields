import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Tienda from "@/pages/Tienda";
import StaticChatBubble from "@/components/StaticChatBubble";
import { useEffect } from "react";
import { initEmailJS } from "@/services/emailService";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tienda" component={Tienda} />
      <Route path="/nosotros" component={() => <Home section="about" />} />
      <Route path="/productos" component={() => <Home section="products" />} />
      <Route path="/beneficios" component={() => <Home section="benefits" />} />
      <Route path="/galeria" component={() => <Home section="gallery" />} />
      <Route path="/contacto" component={() => <Home section="contact" />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Inicializar EmailJS cuando la aplicación se carga
  useEffect(() => {
    initEmailJS();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <StaticChatBubble />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
