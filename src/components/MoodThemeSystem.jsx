import React, { useState, useEffect, useRef } from 'react';

const MoodThemeSystem = () => {
  const [currentView, setCurrentView] = useState('home'); // home, settings, psychology, visualization, patterns, accessibility, preview
  const [currentMood, setCurrentMood] = useState('balanced');
  const [dikengaStage, setDikengaStage] = useState('kala');
  const [sevenBodiesState, setSevenBodiesState] = useState({
    physical: 0.7, etheric: 0.6, astral: 0.8, mental: 0.5,
    causal: 0.4, buddhic: 0.3, atmic: 0.2
  });
  const [themeSettings, setThemeSettings] = useState({
    moodAdaptation: true,
    culturalIntegration: 'moderate',
    glassIntensity: 0.7,
    patternVisibility: 0.5,
    animationSpeed: 1.0,
    accessibilityMode: 'standard'
  });
  const [biometricData, setBiometricData] = useState({
    heartRate: 72,
    hrv: 45,
    stressLevel: 'low',
    energy: 0.6
  });
  const [culturalWisdom, setCulturalWisdom] = useState(null);
  const [apiCalls, setApiCalls] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const themeRef = useRef(null);

  const API_BASE = 'https://builder.empromptu.ai/api_tools';
  const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer c6303bcc8941b627ba1b32398f9cf214',
    'X-Generated-App-ID': 'ea635350-c7ed-4628-847a-4eb10ad33ffc',
    'X-Usage-Key': '75582975e7a6c43504f1962005902a95'
  };

  // Cultural Color Psychology System
  const culturalColors = {
    bantuKongo: {
      warmSand: { hex: '#ae8d72', meaning: 'Grounding and stability, earth connection', energy: 'calming' },
      clayTaupe: { hex: '#736757', meaning: 'Ancestral wisdom, traditional knowledge', energy: 'grounding' },
      deepTerracotta: { hex: '#624031', meaning: 'Sacred earth, ancestral connection', energy: 'protective' },
      tuaregIndigo: { hex: '#1e3a8a', meaning: 'Spiritual depth, divine mystery', energy: 'contemplative' },
      royalGold: { hex: '#fbbf24', meaning: 'Divine light, spiritual illumination', energy: 'uplifting' },
      jungleGreen: { hex: '#166534', meaning: 'Growth, healing, life force', energy: 'healing' }
    },
    sevenBodies: {
      physical: { hex: '#dc2626', frequency: '256Hz', note: 'C', meaning: 'Physical grounding and vitality' },
      etheric: { hex: '#ea580c', frequency: '288Hz', note: 'D', meaning: 'Life force and energy circulation' },
      astral: { hex: '#ca8a04', frequency: '320Hz', note: 'E', meaning: 'Emotional balance and creativity' },
      mental: { hex: '#16a34a', frequency: '341Hz', note: 'F', meaning: 'Mental clarity and focus' },
      causal: { hex: '#2563eb', frequency: '384Hz', note: 'G', meaning: 'Soul wisdom and karmic understanding' },
      buddhic: { hex: '#4f46e5', frequency: '426Hz', note: 'A', meaning: 'Intuitive wisdom and spiritual gifts' },
      atmic: { hex: '#7c3aed', frequency: '480Hz', note: 'B', meaning: 'Unity consciousness and divine connection' }
    },
    dikengaCycle: {
      kala: {
        primary: '#fbbf24', secondary: '#f59e0b', tertiary: '#d97706',
        meaning: 'Dawn colors representing new beginnings and hope',
        energy: 'inspiring', time: 'morning'
      },
      tukula: {
        primary: '#dc2626', secondary: '#ef4444', tertiary: '#f87171',
        meaning: 'Peak colors representing power and achievement',
        energy: 'energizing', time: 'noon'
      },
      luvemba: {
        primary: '#7c3aed', secondary: '#8b5cf6', tertiary: '#a78bfa',
        meaning: 'Sunset colors representing transformation and release',
        energy: 'transforming', time: 'evening'
      },
      musoni: {
        primary: '#1e3a8a', secondary: '#3730a3', tertiary: '#4338ca',
        meaning: 'Night colors representing renewal and deep wisdom',
        energy: 'contemplative', time: 'night'
      }
    }
  };

  // Mood-Based Theme Configurations
  const moodThemes = {
    calm: {
      name: 'Calm & Peaceful',
      glassOpacity: 0.15,
      blurIntensity: 25,
      saturation: 120,
      primaryColor: culturalColors.bantuKongo.warmSand.hex,
      secondaryColor: culturalColors.bantuKongo.clayTaupe.hex,
      patternIntensity: 0.3,
      animationSpeed: 0.7,
      description: 'Soft, gentle colors promoting peace and tranquility'
    },
    energetic: {
      name: 'Energetic & Vibrant',
      glassOpacity: 0.25,
      blurIntensity: 15,
      saturation: 180,
      primaryColor: culturalColors.dikengaCycle.tukula.primary,
      secondaryColor: culturalColors.sevenBodies.etheric.hex,
      patternIntensity: 0.7,
      animationSpeed: 1.5,
      description: 'Bright, dynamic colors that energize and motivate'
    },
    healing: {
      name: 'Healing & Restorative',
      glassOpacity: 0.2,
      blurIntensity: 20,
      saturation: 140,
      primaryColor: culturalColors.bantuKongo.jungleGreen.hex,
      secondaryColor: culturalColors.sevenBodies.astral.hex,
      patternIntensity: 0.4,
      animationSpeed: 0.8,
      description: 'Soothing colors that promote healing and restoration'
    },
    focused: {
      name: 'Focused & Clear',
      glassOpacity: 0.1,
      blurIntensity: 10,
      saturation: 110,
      primaryColor: culturalColors.sevenBodies.mental.hex,
      secondaryColor: culturalColors.bantuKongo.tuaregIndigo.hex,
      patternIntensity: 0.2,
      animationSpeed: 1.0,
      description: 'Clear, minimal colors that enhance concentration'
    },
    spiritual: {
      name: 'Spiritual & Sacred',
      glassOpacity: 0.3,
      blurIntensity: 30,
      saturation: 160,
      primaryColor: culturalColors.dikengaCycle.musoni.primary,
      secondaryColor: culturalColors.sevenBodies.atmic.hex,
      patternIntensity: 0.8,
      animationSpeed: 0.6,
      description: 'Ethereal colors connecting to higher consciousness'
    },
    balanced: {
      name: 'Balanced & Harmonious',
      glassOpacity: 0.2,
      blurIntensity: 20,
      saturation: 150,
      primaryColor: culturalColors.bantuKongo.warmSand.hex,
      secondaryColor: culturalColors.sevenBodies.mental.hex,
      patternIntensity: 0.5,
      animationSpeed: 1.0,
      description: 'Harmonious colors promoting overall balance'
    }
  };

  const logApiCall = (endpoint, method, payload, response) => {
    const call = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      endpoint,
      method,
      payload,
      response,
      status: response?.ok ? 'success' : 'error'
    };
    setApiCalls(prev => [call, ...prev]);
  };

  const apiCall = async (endpoint, method, payload) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: API_HEADERS,
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      logApiCall(endpoint, method, payload, { ok: response.ok, data });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${data.message || 'Unknown error'}`);
      }
      
      return data;
    } catch (error) {
      logApiCall(endpoint, method, payload, { ok: false, error: error.message });
      throw error;
    }
  };

  // Initialize system
  useEffect(() => {
    initializeThemeSystem();
    simulateBiometricData();
  }, []);

  // Apply theme changes
  useEffect(() => {
    applyTheme();
  }, [currentMood, dikengaStage, sevenBodiesState, themeSettings]);

  const initializeThemeSystem = async () => {
    setIsLoading(true);
    
    try {
      // Initialize cultural color psychology wisdom
      await apiCall('/input_data', 'POST', {
        created_object_name: "cultural_color_psychology",
        data_type: "strings",
        input_data: [
          `BANTU-KONGO COLOR PSYCHOLOGY AND SYMBOLISM:

          Traditional Color Meanings in Bantu-Kongo Culture:
          - Red (Nkisi): Life force, power, spiritual energy, ancestral connection
          - White (Mpemba): Purity, spiritual clarity, ancestral wisdom, divine connection
          - Black (Nkisi): Mystery, depth, fertile earth, ancestral realm
          - Yellow/Gold (Nzambi): Divine light, spiritual illumination, solar energy
          - Blue (Kalunga): Water, spiritual depth, cosmic consciousness, divine mystery
          - Green (Nkisi ya Nsi): Earth healing, growth, life force, natural medicine

          Color Psychology in Healing and Wellness:
          - Warm colors (reds, oranges, yellows) activate energy, stimulate circulation, promote vitality
          - Cool colors (blues, greens, purples) calm the mind, reduce stress, promote healing
          - Earth tones (browns, taupes, sands) provide grounding, stability, ancestral connection
          - Sacred colors (gold, indigo, violet) enhance spiritual connection and consciousness

          Dikenga Cycle Color Associations:
          Kala (Dawn): Warm yellows and golds representing new beginnings and hope
          Tukula (Noon): Bright reds and oranges representing peak power and achievement
          Luvemba (Sunset): Deep purples and blues representing transformation and release
          Musoni (Midnight): Dark indigos and blacks representing renewal and deep wisdom

          Seven Bodies Color Healing:
          Each body resonates with specific colors and frequencies for optimal healing and balance
          - Physical Body: Red (256Hz) for grounding and vitality
          - Etheric Body: Orange (288Hz) for energy circulation
          - Astral Body: Yellow (320Hz) for emotional balance
          - Mental Body: Green (341Hz) for mental clarity
          - Causal Body: Blue (384Hz) for soul wisdom
          - Buddhic Body: Indigo (426Hz) for intuitive development
          - Atmic Body: Violet (480Hz) for unity consciousness`,

          `EGYPTIAN COLOR SYMBOLISM AND THERAPEUTIC APPLICATIONS:

          Ancient Egyptian Color Psychology:
          - Red (Desher): Life, victory, power, protection from evil
          - Blue (Irtyu): Sky, water, creation, rebirth, fertility
          - Green (Wadj): Vegetation, rebirth, new life, resurrection
          - Yellow/Gold (Nebu): Eternal, indestructible, divine flesh of gods
          - White (Hedj): Sacred, pure, omnipotent, hallowed
          - Black (Kem): Fertile soil, rebirth, resurrection, afterlife

          Ma'at Color Principles:
          - Balance through complementary color harmony
          - Truth represented through clear, pure colors
          - Justice through balanced color distribution
          - Order through systematic color progression
          - Harmony through pleasing color combinations

          Therapeutic Color Applications:
          - Red for physical healing and energy activation
          - Blue for mental calm and spiritual connection
          - Green for emotional healing and heart opening
          - Yellow for mental clarity and cognitive enhancement
          - Purple for spiritual development and consciousness expansion
          - White for purification and spiritual cleansing

          Color and Frequency Healing:
          Integration of color therapy with sound healing frequencies
          - Each color vibrates at specific frequencies
          - Color-sound combinations enhance healing effectiveness
          - Visual and auditory harmony promotes holistic wellness
          - Cultural color meanings amplify therapeutic benefits`,

          `MOOD-RESPONSIVE DESIGN AND ACCESSIBILITY:

          Mood Detection and Color Adaptation:
          - Calm states benefit from soft, muted colors with gentle transitions
          - Energetic states respond to bright, saturated colors with dynamic effects
          - Healing states require warm, nurturing colors with soothing properties
          - Focused states need clear, minimal colors with reduced distractions
          - Spiritual states connect with ethereal, transcendent color palettes

          Cultural Sensitivity in Color Use:
          - Respectful integration of traditional color meanings
          - Appropriate use of sacred colors and symbols
          - Community validation of cultural color applications
          - Educational context for traditional color significance
          - Avoiding appropriation while honoring cultural wisdom

          Accessibility and Inclusive Design:
          - Color blind friendly palette alternatives
          - High contrast options for visual impairments
          - Reduced motion settings for sensitivity
          - Cultural preference controls for comfort levels
          - Screen reader compatible color descriptions

          Performance and Technical Considerations:
          - GPU-accelerated glass effects for smooth performance
          - Efficient color transition algorithms
          - Mobile-optimized visual effects
          - Battery-conscious animation settings
          - Cross-platform color consistency`
        ]
      });

      // Generate mood-responsive theming system
      await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["mood_theming_system"],
        prompt_string: `Based on this cultural color psychology: {cultural_color_psychology}, create a comprehensive mood-responsive theming system that includes:

1. MOOD DETECTION AND COLOR MAPPING:
   - Algorithms for detecting user emotional states from various inputs
   - Color palette recommendations for different moods and states
   - Cultural color psychology integration for authentic healing
   - Biometric data correlation with color therapy principles

2. DYNAMIC THEMING ALGORITHMS:
   - Real-time color adaptation based on user state changes
   - Smooth transition effects between different mood themes
   - Cultural pattern integration with appropriate intensity levels
   - Glass effect modifications based on emotional needs

3. ACCESSIBILITY AND CULTURAL SENSITIVITY:
   - Color blind friendly alternatives for all mood themes
   - High contrast options maintaining cultural authenticity
   - Cultural sensitivity controls for appropriate integration levels
   - Educational components explaining color meanings and significance

4. PERFORMANCE OPTIMIZATION:
   - Efficient color calculation and application methods
   - GPU-accelerated visual effects for smooth performance
   - Mobile-optimized theming with battery considerations
   - Cached theme variations for quick switching

5. THERAPEUTIC COLOR APPLICATIONS:
   - Seven bodies color healing integration
   - Dikenga cycle color progression systems
   - Ancestral color wisdom therapeutic applications
   - Community healing color themes and shared experiences

Format as JSON with clear algorithms and implementation guidelines.`,
        inputs: [
          {
            input_object_name: "cultural_color_psychology",
            mode: "combine_events"
          }
        ]
      });

      const wisdomResult = await apiCall('/return_data', 'POST', {
        object_name: "mood_theming_system",
        return_type: "json"
      });

      try {
        const parsedWisdom = JSON.parse(wisdomResult.value[0]);
        setCulturalWisdom(parsedWisdom);
      } catch (parseError) {
        console.error('Error parsing theme wisdom:', parseError);
        setCulturalWisdom(createFallbackWisdom());
      }

    } catch (error) {
      console.error('Error initializing theme system:', error);
      setCulturalWisdom(createFallbackWisdom());
    } finally {
      setIsLoading(false);
    }
  };

  const createFallbackWisdom = () => ({
    moodDetection: {
      algorithms: ['sentiment_analysis', 'biometric_correlation', 'interaction_patterns'],
      colorMapping: {
        calm: ['#ae8d72', '#736757'],
        energetic: ['#dc2626', '#ea580c'],
        healing: ['#166534', '#ca8a04'],
        focused: ['#16a34a', '#1e3a8a'],
        spiritual: ['#7c3aed', '#4f46e5']
      }
    },
    accessibility: {
      colorBlindSupport: true,
      highContrast: true,
      culturalSensitivity: true,
      reducedMotion: true
    },
    performance: {
      gpuAcceleration: true,
      caching: true,
      mobileOptimization: true,
      batteryConscious: true
    }
  });

  const simulateBiometricData = () => {
    const updateBiometrics = () => {
      setBiometricData(prev => {
        const newData = {
          heartRate: Math.max(50, Math.min(120, prev.heartRate + (Math.random() - 0.5) * 8)),
          hrv: Math.max(20, Math.min(80, prev.hrv + (Math.random() - 0.5) * 10)),
          stressLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          energy: Math.max(0, Math.min(1, prev.energy + (Math.random() - 0.5) * 0.2))
        };

        // Update mood based on biometric data
        updateMoodFromBiometrics(newData);
        
        return newData;
      });
    };

    const interval = setInterval(updateBiometrics, 5000);
    return () => clearInterval(interval);
  };

  const updateMoodFromBiometrics = (biometrics) => {
    if (!themeSettings.moodAdaptation) return;

    let newMood = 'balanced';
    
    if (biometrics.stressLevel === 'high' || biometrics.heartRate > 90) {
      newMood = 'calm';
    } else if (biometrics.energy > 0.8 && biometrics.heartRate > 75) {
      newMood = 'energetic';
    } else if (biometrics.stressLevel === 'medium') {
      newMood = 'healing';
    } else if (biometrics.hrv > 60 && biometrics.energy > 0.6) {
      newMood = 'focused';
    } else if (biometrics.heartRate < 60 && biometrics.energy < 0.4) {
      newMood = 'spiritual';
    }

    if (newMood !== currentMood) {
      setCurrentMood(newMood);
    }
  };

  const applyTheme = () => {
    const theme = moodThemes[currentMood];
    const dikengaColors = culturalColors.dikengaCycle[dikengaStage];
    
    if (!theme || !themeRef.current) return;

    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--mood-primary', theme.primaryColor);
    root.style.setProperty('--mood-secondary', theme.secondaryColor);
    root.style.setProperty('--dikenga-primary', dikengaColors.primary);
    root.style.setProperty('--dikenga-secondary', dikengaColors.secondary);
    root.style.setProperty('--glass-opacity', theme.glassOpacity.toString());
    root.style.setProperty('--glass-blur', `${theme.blurIntensity}px`);
    root.style.setProperty('--glass-saturation', `${theme.saturation}%`);
    root.style.setProperty('--pattern-intensity', theme.patternIntensity.toString());
    root.style.setProperty('--animation-speed', theme.animationSpeed.toString());

    // Apply seven bodies colors
    Object.entries(culturalColors.sevenBodies).forEach(([body, color]) => {
      root.style.setProperty(`--seven-bodies-${body}`, color.hex);
    });

    // Apply accessibility settings
    if (themeSettings.accessibilityMode === 'high-contrast') {
      root.style.setProperty('--glass-opacity', '0.9');
      root.style.setProperty('--glass-blur', '0px');
    } else if (themeSettings.accessibilityMode === 'reduced-motion') {
      root.style.setProperty('--animation-speed', '0.1');
    }
  };

  const generateSevenBodiesVisualization = () => {
    const maxRadius = 120;
    const centerX = 150;
    const centerY = 150;
    
    return Object.entries(sevenBodiesState).map(([body, value], index) => {
      const angle = (index * 2 * Math.PI) / 7 - Math.PI / 2;
      const radius = value * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const color = culturalColors.sevenBodies[body];
      
      return {
        body,
        x,
        y,
        value,
        color: color.hex,
        frequency: color.frequency,
        note: color.note
      };
    });
  };

  // Component Views
  const HomeView = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mood-glass-card p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Advanced UI/UX with Mood Theming
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Dynamic theming system with cultural color psychology and real-time adaptation
        </p>
      </div>

      {/* Current State Display */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="mood-glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Current Mood Theme
          </h3>
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-3 mood-theme-indicator"
              style={{ 
                background: `linear-gradient(135deg, ${moodThemes[currentMood].primaryColor}, ${moodThemes[currentMood].secondaryColor})`,
                boxShadow: `0 8px 32px ${moodThemes[currentMood].primaryColor}40`
              }}
            ></div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-2">
              {moodThemes[currentMood].name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {moodThemes[currentMood].description}
            </p>
          </div>
        </div>

        <div className="mood-glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Dikenga Stage
          </h3>
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-3 dikenga-indicator"
              style={{ 
                background: `linear-gradient(135deg, ${culturalColors.dikengaCycle[dikengaStage].primary}, ${culturalColors.dikengaCycle[dikengaStage].secondary})`,
                boxShadow: `0 8px 32px ${culturalColors.dikengaCycle[dikengaStage].primary}40`
              }}
            ></div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-2 capitalize">
              {dikengaStage}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {culturalColors.dikengaCycle[dikengaStage].meaning}
            </p>
          </div>
        </div>

        <div className="mood-glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Biometric State
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Heart Rate:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {Math.round(biometricData.heartRate)} BPM
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">HRV:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {Math.round(biometricData.hrv)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Stress:</span>
              <span className={`font-medium ${
                biometricData.stressLevel === 'low' ? 'text-green-600' :
                biometricData.stressLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {biometricData.stressLevel.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Energy:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {Math.round(biometricData.energy * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4">
        <button
          onClick={() => setCurrentView('settings')}
          className="mood-glass-card p-4 text-center hover:shadow-lg transition-all group"
        >
          <div className="text-2xl mb-2">âï¸</div>
          <div className="font-medium text-gray-800 dark:text-white">Theme Settings</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Customize theming</div>
        </button>
        
        <button
          onClick={() => setCurrentView('psychology')}
          className="mood-glass-card p-4 text-center hover:shadow-lg transition-all group"
        >
          <div className="text-2xl mb-2">ð¨</div>
          <div className="font-medium text-gray-800 dark:text-white">Color Psychology</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Learn meanings</div>
        </button>
        
        <button
          onClick={() => setCurrentView('visualization')}
          className="mood-glass-card p-4 text-center hover:shadow-lg transition-all group"
        >
          <div className="text-2xl mb-2">ð</div>
          <div className="font-medium text-gray-800 dark:text-white">Mood Visualization</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Real-time display</div>
        </button>
        
        <button
          onClick={() => setCurrentView('patterns')}
          className="mood-glass-card p-4 text-center hover:shadow-lg transition-all group"
        >
          <div className="text-2xl mb-2">ð®</div>
          <div className="font-medium text-gray-800 dark:text-white">Cultural Patterns</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Traditional designs</div>
        </button>
      </div>

      {/* Seven Bodies Harmony Wheel */}
      <div className="mood-glass-card p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
          Seven Bodies Color Harmony
        </h2>
        <div className="flex justify-center">
          <svg width="300" height="300" className="seven-bodies-wheel">
            {/* Background circles */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map(level => (
              <circle
                key={level}
                cx="150"
                cy="150"
                r={level * 120}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}
            
            {/* Seven bodies visualization */}
            {generateSevenBodiesVisualization().map((point, index) => (
              <g key={point.body}>
                <line
                  x1="150"
                  y1="150"
                  x2={point.x}
                  y2={point.y}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="12"
                  fill={point.color}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer hover:r-14 transition-all"
                />
                <text
                  x={point.x + (point.x > 150 ? 20 : -20)}
                  y={point.y}
                  textAnchor={point.x > 150 ? 'start' : 'end'}
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-current text-gray-700 dark:text-gray-300"
                >
                  {point.body} ({point.frequency})
                </text>
              </g>
            ))}
            
            {/* Center harmony indicator */}
            <circle
              cx="150"
              cy="150"
              r="25"
              fill="rgba(255,255,255,0.9)"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1"
            />
            <text
              x="150"
              y="145"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-bold fill-current text-gray-800"
            >
              {Math.round(Object.values(sevenBodiesState).reduce((a, b) => a + b, 0) / 7 * 100)}%
            </text>
            <text
              x="150"
              y="160"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-current text-gray-600"
            >
              Harmony
            </text>
          </svg>
        </div>
      </div>

      {/* Mood Theme Selector */}
      <div className="mood-glass-card p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Manual Mood Selection
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(moodThemes).map(([moodKey, theme]) => (
            <button
              key={moodKey}
              onClick={() => setCurrentMood(moodKey)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentMood === moodKey
                  ? 'border-white shadow-lg'
                  : 'border-transparent hover:border-white/50'
              }`}
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}40, ${theme.secondaryColor}40)`
              }}
            >
              <div className="text-center">
                <div 
                  className="w-8 h-8 rounded-full mx-auto mb-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                  }}
                ></div>
                <div className="font-medium text-gray-800 dark:text-white mb-1">
                  {theme.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {theme.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Theme Settings View
  const ThemeSettingsView = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mood-glass-card p-8">
        <button
          onClick={() => setCurrentView('home')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          â Back to Home
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Theme Settings
        </h1>

        <div className="space-y-6">
          {/* Mood Adaptation */}
          <div className="p-6 bg-white/10 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Automatic Mood Adaptation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically adjust theme based on biometric data and interaction patterns
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={themeSettings.moodAdaptation}
                  onChange={(e) => setThemeSettings(prev => ({
                    ...prev,
                    moodAdaptation: e.target.checked
                  }))}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          {/* Cultural Integration Level */}
          <div className="p-6 bg-white/10 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Cultural Integration Level</h3>
            <div className="space-y-3">
              {['minimal', 'moderate', 'full'].map(level => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="culturalIntegration"
                    value={level}
                    checked={themeSettings.culturalIntegration === level}
                    onChange={(e) => setThemeSettings(prev => ({
                      ...prev,
                      culturalIntegration: e.target.value
                    }))}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white capitalize">{level}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {level === 'minimal' && 'Focus on universal color principles'}
                      {level === 'moderate' && 'Balanced cultural integration'}
                      {level === 'full' && 'Deep cultural immersion with traditional elements'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Glass Effect Intensity */}
          <div className="p-6 bg-white/10 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Glass Effect Intensity</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Blur Intensity: {Math.round(themeSettings.glassIntensity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={themeSettings.glassIntensity}
                  onChange={(e) => setThemeSettings(prev => ({
                    ...prev,
                    glassIntensity: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Pattern Visibility: {Math.round(themeSettings.patternVisibility * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={themeSettings.patternVisibility}
                  onChange={(e) => setThemeSettings(prev => ({
                    ...prev,
                    patternVisibility: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Animation Speed: {Math.round(themeSettings.animationSpeed * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={themeSettings.animationSpeed}
                  onChange={(e) => setThemeSettings(prev => ({
                    ...prev,
                    animationSpeed: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Accessibility Mode */}
          <div className="p-6 bg-white/10 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Accessibility Mode</h3>
            <div className="space-y-3">
              {[
                { value: 'standard', label: 'Standard', description: 'Default visual effects and animations' },
                { value: 'high-contrast', label: 'High Contrast', description: 'Enhanced contrast for better visibility' },
                { value: 'reduced-motion', label: 'Reduced Motion', description: 'Minimal animations and transitions' },
                { value: 'color-blind', label: 'Color Blind Friendly', description: 'Alternative color palettes' }
              ].map(mode => (
                <label key={mode.value} className="flex items-center">
                  <input
                    type="radio"
                    name="accessibilityMode"
                    value={mode.value}
                    checked={themeSettings.accessibilityMode === mode.value}
                    onChange={(e) => setThemeSettings(prev => ({
                      ...prev,
                      accessibilityMode: e.target.value
                    }))}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">{mode.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{mode.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Color Psychology View
  const ColorPsychologyView = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mood-glass-card p-8">
        <button
          onClick={() => setCurrentView('home')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          â Back to Home
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Cultural Color Psychology
        </h1>

        {/* Bantu-Kongo Colors */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Bantu-Kongo Traditional Colors
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(culturalColors.bantuKongo).map(([colorKey, color]) => (
              <div key={colorKey} className="p-4 bg-white/10 rounded-lg">
                <div className="flex items-center mb-3">
                  <div 
                    className="w-8 h-8 rounded-full mr-3"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white capitalize">
                      {colorKey.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <div className="text-xs text-gray-500 dark:text-gray-500">{color.hex}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {color.meaning}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Energy: {color.energy}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seven Bodies Colors */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Seven Bodies Color Frequencies
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(culturalColors.sevenBodies).map(([body, color]) => (
              <div key={body} className="p-4 bg-white/10 rounded-lg">
                <div className="flex items-center mb-3">
                  <div 
                    className="w-8 h-8 rounded-full mr-3"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white capitalize">{body}</h4>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {color.frequency} â¢ {color.note}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {color.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dikenga Cycle Colors */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Dikenga Cycle Color Progression
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(culturalColors.dikengaCycle).map(([stage, colors]) => (
              <div key={stage} className="p-6 bg-white/10 rounded-lg">
                <div className="flex items-center mb-4">
                  <div 
                    className="w-12 h-12 rounded-full mr-4"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                    }}
                  ></div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white capitalize">{stage}</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{colors.time}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {colors.meaning}
                </p>
                <div className="flex space-x-2">
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: colors.primary }}
                    title="Primary"
                  ></div>
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: colors.secondary }}
                    title="Secondary"
                  ></div>
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: colors.tertiary }}
                    title="Tertiary"
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Energy: {colors.energy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // API Debugger
  const ApiDebugger = () => {
    const [selectedCall, setSelectedCall] = useState(null);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Theme System Debug Console
            </h2>
            <button
              onClick={() => setShowDebug(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex h-[calc(90vh-80px)]">
            <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Theme System Status
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Current Mood: {currentMood}</div>
                  <div>Dikenga Stage: {dikengaStage}</div>
                  <div>Heart Rate: {Math.round(biometricData.heartRate)} BPM</div>
                  <div>Stress Level: {biometricData.stressLevel}</div>
                  <div>Mood Adaptation: {themeSettings.moodAdaptation ? 'On' : 'Off'}</div>
                  <div>API Calls: {apiCalls.length}</div>
                </div>
              </div>
              
              <div className="space-y-2 p-4">
                {apiCalls.map((call) => (
                  <div
                    key={call.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedCall?.id === call.id
                        ? 'bg-primary-100 dark:bg-primary-900/20 border border-primary-300'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedCall(call)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-800 dark:text-white">
                        {call.method} {call.endpoint}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        call.status === 'success' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {call.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(call.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-1/2 overflow-y-auto">
              {selectedCall ? (
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Request Details
                    </h4>
                    <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs overflow-x-auto text-gray-800 dark:text-white">
                      {JSON.stringify(selectedCall.payload, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Response
                    </h4>
                    <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs overflow-x-auto text-gray-800 dark:text-white">
                      {JSON.stringify(selectedCall.response, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  Select an API call to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={themeRef}
      className="min-h-screen mood-theme-container"
      style={{
        background: `linear-gradient(135deg, ${moodThemes[currentMood]?.primaryColor}20, ${moodThemes[currentMood]?.secondaryColor}20, ${culturalColors.dikengaCycle[dikengaStage]?.primary}10)`
      }}
    >
      {/* Main Content */}
      {currentView === 'home' && <HomeView />}
      {currentView === 'settings' && <ThemeSettingsView />}
      {currentView === 'psychology' && <ColorPsychologyView />}

      {/* Debug Controls */}
      <div className="fixed bottom-4 left-4 z-40 space-x-2">
        <button
          className="success-button"
          onClick={() => setShowDebug(!showDebug)}
        >
          ð Debug
        </button>
        <button
          className="mood-glass-button"
          onClick={() => setDikengaStage(
            dikengaStage === 'kala' ? 'tukula' :
            dikengaStage === 'tukula' ? 'luvemba' :
            dikengaStage === 'luvemba' ? 'musoni' : 'kala'
          )}
        >
          ð Cycle
        </button>
      </div>

      {/* API Debugger */}
      {showDebug && <ApiDebugger />}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="mood-glass-card p-8 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white font-medium">Initializing mood theming system...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodThemeSystem;
</boltArtifact>

<boltAction type="file" filePath="src/index.css">
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Custom Properties for Dynamic Theming */
:root {
  /* Mood Theme Variables */
  --mood-primary: #ae8d72;
  --mood-secondary: #736757;
  --dikenga-primary: #fbbf24;
  --dikenga-secondary: #f59e0b;
  
  /* Glass Effect Variables */
  --glass-opacity: 0.2;
  --glass-blur: 20px;
  --glass-saturation: 150%;
  --pattern-intensity: 0.5;
  --animation-speed: 1.0;
  
  /* Seven Bodies Colors */
  --seven-bodies-physical: #dc2626;
  --seven-bodies-etheric: #ea580c;
  --seven-bodies-astral: #ca8a04;
  --seven-bodies-mental: #16a34a;
  --seven-bodies-causal: #2563eb;
  --seven-bodies-buddhic: #4f46e5;
  --seven-bodies-atmic: #7c3aed;
}

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  body {
    @apply bg-gradient-to-br from-primary-100 via-secondary-50 to-accent-100;
    @apply dark:from-primary-900 dark:via-secondary-900 dark:to-accent-900;
    @apply min-h-screen;
    transition: all 0.3s ease;
  }
}

@layer components {
  /* Enhanced Glass Card with Mood Theming */
  .mood-glass-card {
    background: rgba(255, 255, 255, var(--glass-opacity));
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
    position: relative;
    overflow: hidden;
    transition: all calc(0.3s * var(--animation-speed)) ease;
  }
  
  .mood-glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      var(--mood-primary)10,
      var(--mood-secondary)05,
      var(--dikenga-primary)08
    );
    opacity: calc(var(--pattern-intensity) * 0.3);
    pointer-events: none;
    z-index: -1;
  }
  
  .mood-glass-card:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }
  
  /* Mood Glass Button */
  .mood-glass-button {
    background: rgba(255, 255, 255, calc(var(--glass-opacity) * 0.8));
    backdrop-filter: blur(calc(var(--glass-blur) * 0.5)) saturate(var(--glass-saturation));
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    padding: 12px 24px;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    cursor: pointer;
    transition: all calc(0.3s * var(--animation-speed)) ease;
    position: relative;
    overflow: hidden;
  }
  
  .mood-glass-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, var(--mood-primary), var(--mood-secondary));
    opacity: 0;
    transition: opacity calc(0.3s * var(--animation-speed)) ease;
    z-index: -1;
  }
  
  .mood-glass-button:hover::before {
    opacity: 0.1;
  }
  
  .mood-glass-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.6);
  }
  
  /* Mood Theme Indicator */
  .mood-theme-indicator {
    position: relative;
    transition: all calc(0.5s * var(--animation-speed)) ease;
  }
  
  .mood-theme-indicator::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--mood-primary), var(--mood-secondary));
    opacity: 0.3;
    z-index: -1;
    animation: pulse calc(2s / var(--animation-speed)) infinite;
  }
  
  /* Dikenga Indicator */
  .dikenga-indicator {
    position: relative;
    transition: all calc(0.5s * var(--animation-speed)) ease;
  }
  
  .dikenga-indicator::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--dikenga-primary), var(--dikenga-secondary));
    opacity: 0.3;
    z-index: -1;
    animation: rotate calc(8s / var(--animation-speed)) linear infinite;
  }
  
  /* Seven Bodies Wheel */
  .seven-bodies-wheel {
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
    transition: all calc(0.3s * var(--animation-speed)) ease;
  }
  
  .seven-bodies-wheel circle[fill]:not([fill="none"]) {
    transition: all calc(0.3s * var(--animation-speed)) ease;
  }
  
  .seven-bodies-wheel circle[fill]:not([fill="none"]):hover {
    filter: brightness(1.2) saturate(1.3);
    transform-origin: center;
    animation: glow calc(1s / var(--animation-speed)) ease-in-out infinite alternate;
  }
  
  /* Cultural Pattern Overlays */
  .cultural-pattern-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: calc(var(--pattern-intensity) * 0.1);
    background-image: 
      radial-gradient(circle at 25% 25%, var(--mood-primary)20 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, var(--dikenga-primary)15 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    transition: opacity calc(0.5s * var(--animation-speed)) ease;
  }
  
  /* Accessibility Modes */
  .high-contrast .mood-glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: none;
    border: 2px solid #000;
    color: #000;
  }
  
  .reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .color-blind-friendly {
    filter: contrast(1.2) saturate(0.8);
  }
  
  /* Standard glass components (existing) */
  .glass-card {
    @apply bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl;
    @apply dark:bg-black/10 dark:border-white/10;
  }
  
  .glass-button {
    @apply bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3;
    @apply text-white font-medium transition-all duration-300;
    @apply hover:bg-white/25 hover:shadow-lg hover:-translate-y-0.5;
    @apply focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2;
    @apply dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/15;
  }
  
  .glass-input {
    @apply bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3;
    @apply text-white placeholder-white/60 transition-all duration-300;
    @apply focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400;
    @apply dark:bg-white/5 dark:border-white/10 dark:text-white;
  }
  
  .primary-button {
    @apply bg-primary-500 hover:bg-primary-600 text-white font-semibold;
    @apply px-8 py-3 rounded-xl transition-all duration-300;
    @apply focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2;
    @apply hover:shadow-lg hover:-translate-y-0.5;
  }
  
  .secondary-button {
    @apply bg-secondary-500 hover:bg-secondary-600 text-white font-semibold;
    @apply px-8 py-3 rounded-xl transition-all duration-300;
    @apply focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:ring-offset-2;
    @apply hover:shadow-lg hover:-translate-y-0.5;
  }
  
  .success-button {
    @apply bg-green-500 hover:bg-green-600 text-white font-semibold;
    @apply px-6 py-2 rounded-lg transition-all duration-300;
    @apply focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2;
  }
  
  .danger-button {
    @apply bg-red-500 hover:bg-red-600 text-white font-semibold;
    @apply px-6 py-2 rounded-lg transition-all duration-300;
    @apply focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2;
  }
  
  .upload-zone {
    @apply border-2 border-dashed border-primary-300 rounded-2xl p-8;
    @apply bg-white/5 hover:bg-white/10 transition-all duration-300;
    @apply dark:border-primary-600 dark:bg-white/5;
  }
  
  .progress-bar {
    @apply w-full bg-white/20 rounded-full h-2 overflow-hidden;
    @apply dark:bg-white/10;
  }
  
  .progress-fill {
    @apply h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full;
    @apply transition-all duration-500 ease-out;
  }
  
  .spinner {
    @apply animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500;
  }
  
  .fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  
  .slide-up {
    animation: slideUp 0.6s ease-out forwards;
  }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.6; 
    transform: scale(1.05); 
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes glow {
  from { 
    filter: brightness(1.2) saturate(1.3) drop-shadow(0 0 5px currentColor); 
  }
  to { 
    filter: brightness(1.4) saturate(1.5) drop-shadow(0 0 10px currentColor); 
  }
}

/* Dark mode toggle */
.dark-mode-toggle {
  @apply fixed top-4 right-4 z-50 p-2 rounded-full;
  @apply bg-white/20 backdrop-blur-sm border border-white/20;
  @apply hover:bg-white/30 transition-all duration-300;
  @apply focus:outline-none focus:ring-2 focus:ring-primary-400;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .mood-glass-card {
    @apply mx-4 p-6;
  }
  
  .upload-zone {
    @apply p-6;
  }
  
  :root {
    --glass-blur: 15px;
    --animation-speed: 0.8;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .mood-glass-card {
    @apply border-2 border-gray-800 bg-white;
    @apply dark:border-gray-200 dark:bg-gray-900;
  }
  
  .mood-glass-button {
    @apply border-2 border-gray-800 bg-white text-gray-900;
    @apply dark:border-gray-200 dark:bg-gray-900 dark:text-gray-100;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  :root {
    --animation-speed: 0.01;
  }
}

/* Color blind friendly adjustments */
@media (prefers-color-scheme: no-preference) {
  .color-blind-mode {
    filter: contrast(1.3) saturate(0.7) hue-rotate(15deg);
  }
}
