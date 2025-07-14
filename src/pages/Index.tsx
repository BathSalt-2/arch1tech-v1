import { useState, useEffect } from "react";
import { Splash } from "@/components/Splash";
import { Dashboard } from "@/components/Dashboard";
import { IdeaCapture } from "@/components/IdeaCapture";
import { VibeCodeAI } from "@/components/VibeCodeAI";
import { VisualLogicDesigner } from "@/components/VisualLogicDesigner";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'capture':
        return <IdeaCapture />;
      case 'vibe':
        return <VibeCodeAI />;
      case 'logic':
        return <VisualLogicDesigner />;
      default:
        return <Dashboard />;
    }
  };

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentView()}
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default Index;
