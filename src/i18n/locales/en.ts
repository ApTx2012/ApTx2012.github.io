import { LanguagePack } from '../types';

export const en: LanguagePack = {
  name: 'English',
  flag: '🇺🇸',
  translations: {
    // Navigation
    nav: {
      home: 'Home',
      blog: 'Blog',
      weather: 'Weather',
      game: 'Game',
      chemLab: 'Chemistry Lab',
      resources: 'Resources',
    },
    
    // Home
    home: {
      welcome: "Welcome to AxTps' Hut",
      title: 'A gentle universe of code, music, and light',
      subtitle: 'A personal space with blog, weather, and music atmosphere.',
      greeting: 'Welcome to my hut. Would you like to listen to music, check the weather, or chat?',
    },
    
    // Tags
    tags: {
      optimistic: 'Optimistic',
      gentle: 'Gentle',
      easygoing: 'Easygoing',
      quickWitted: 'Quick-witted',
      humorous: 'Humorous',
    },
    
    // Cards
    cards: {
      blog: {
        title: 'Blog',
        desc: 'Coming Soon',
      },
      weather: {
        title: 'Weather',
        desc: 'Real-time',
      },
      game2048: {
        title: '2048',
        desc: 'Game',
      },
      chemLab: {
        title: 'Chemistry Lab',
        desc: 'Simulation',
      },
      resources: {
        title: 'Resources',
        desc: 'Image Hosting',
      },
    },
    
    // Buttons
    buttons: {
      go: 'Go',
      reset: 'Reset Game',
      aiPlay: 'AI Auto Play',
      stopAi: 'Stop AI',
      back: 'Back to Home',
    },
    
    // Game
    game: {
      score: 'Score',
      gameOver: 'Game Over. Press reset to continue.',
      howToPlay: 'Use arrow keys / WASD to play.',
      aiPlaying: 'AI is playing...',
      aiStopped: 'Auto play stopped.',
      mobileTip: 'Swipe on mobile',
    },
    
    // Chemistry Lab
    chemLab: {
      title: 'Chemistry Lab',
      subtitle: 'Middle School Chemistry Simulation Platform',
      expList: 'Experiments',
      gasPrep: 'Gas Preparation',
      metalSolution: 'Metal & Solution',
      burnExplore: 'Combustion',
      equipmentLib: 'Equipment',
      reagentLib: 'Reagents',
      principle: 'Principle',
      safety: 'Safety Tips',
      equation: 'Chemical Equation',
      operation: 'Operations',
      gasProduced: 'Gas Produced',
    },
    
    // Footer
    footer: {
      about: 'About',
      aboutText: 'A warm personal homepage with simple info and fun interactions. Hope you find some joy here.',
    },
    
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
  },
};
