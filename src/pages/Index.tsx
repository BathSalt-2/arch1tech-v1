import { useState, useEffect } from "react";
import { Splash } from "@/components/Splash";
import { Dashboard } from "@/components/Dashboard";
import { IdeaCapture } from "@/components/IdeaCapture";
import { VibeCodeAI } from "@/components/VibeCodeAI";
import { VisualLogicDesigner } from "@/components/VisualLogicDesigner";
import { AIMarketplace } from "@/components/AIMarketplace";
import { CustomLLMBuilder } from "@/components/CustomLLMBuilder";
import { Navigation } from "@/components/Navigation";
import { AIInitializer } from "@/components/AIInitializer";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'capture':
        return <IdeaCapture />;
      case 'vibe':
        return <VibeCodeAI />;
      case 'logic':
        return <VisualLogicDesigner />;
      case 'marketplace':
        return <AIMarketplace />;
      case 'custom-llm':
        return <CustomLLMBuilder />;
      case 'astrid':
        return <Dashboard onViewChange={setCurrentView} />; // Placeholder for now
      case 'settings':
        return <Dashboard onViewChange={setCurrentView} />; // Placeholder for now
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <AIInitializer>
      <div className="min-h-screen bg-background">
        {renderCurrentView()}
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
      </div>
    </AIInitializer>
  );
};

export default Index;
