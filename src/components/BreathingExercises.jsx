import React, { useState, useEffect, useRef } from 'react';

const BreathingExercises = () => {
  const [currentView, setCurrentView] = useState('home'); // home, active, custom, devices, history, settings
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold, exhale, pause
  const [cycleCount, setCycleCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [biometricData, setBiometricData] = useState({
    heartRate: 72,
    hrv: 45,
    breathingRate: 12,
    stressLevel: 'low'
  });
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [breathingHistory, setBreathingHistory] = useState([]);
  const [customPatterns, setCustomPatterns] = useState([]);
  const [apiCalls, setApiCalls] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const [culturalWisdom, setCulturalWisdom] = useState(null);
  
  const animationRef = useRef(null);
  const timerRef = useRef(null);
  const phaseTimerRef = useRef(null);

  const API_BASE = 'https://builder.empromptu.ai/api_tools';
  const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer c6303bcc8941b627ba1b32398f9cf214',
    'X-Generated-App-ID': 'ea635350-c7ed-4628-847a-4eb10ad33ffc',
    'X-Usage-Key': '75582975e7a6c43504f1962005902a95'
  };

  // Breathing Exercise Library
  const breathingExercises = {
    dikenga: {
      category: 'Dikenga Cycle Breathing',
      description: 'Sacred breathing patterns aligned with the four moments of existence',
      exercises: {
        kala: {
          id: 'kala',
          name: 'Kala Breath - Foundation',
          description: 'Foundation breathing for new beginnings and intention setting',
          pattern: [4, 4, 4, 4], // inhale, hold, exhale, pause
          color: '#FFD700',
          culturalContext: 'Kala represents dawn and new beginnings. This breath builds foundation energy.',
          benefits: ['Grounding', 'Intention setting', 'Foundation building', 'Morning energy'],
          instructions: [
            'Sit comfortably with spine straight',
            'Place one hand on chest, one on belly',
            'Breathe in for 4 counts through nose',
            'Hold breath for 4 counts',
            'Exhale for 4 counts through mouth',
            'Pause for 4 counts before next breath'
          ]
        },
        tukula: {
          id: 'tukula',
          name: 'Tukula Breath - Power',
          description: 'Power breathing for peak performance and leadership',
          pattern: [4, 7, 8, 0], // 4-7-8 breathing
          color: '#FF4444',
          culturalContext: 'Tukula represents noon and peak power. This breath activates strength.',
          benefits: ['Energy boost', 'Confidence', 'Leadership presence', 'Peak performance'],
          instructions: [
            'Exhale completely through mouth',
            'Close mouth, inhale through nose for 4 counts',
            'Hold breath for 7 counts',
            'Exhale through mouth for 8 counts',
            'Repeat cycle without pause'
          ]
        },
        luvemba: {
          id: 'luvemba',
          name: 'Luvemba Breath - Release',
          description: 'Release breathing for letting go and transformation',
          pattern: [6, 2, 6, 2], // gentle release pattern
          color: '#4444FF',
          culturalContext: 'Luvemba represents sunset and necessary release. This breath supports letting go.',
          benefits: ['Stress release', 'Emotional healing', 'Transformation', 'Evening calm'],
          instructions: [
            'Breathe in slowly for 6 counts',
            'Brief hold for 2 counts',
            'Long, slow exhale for 6 counts',
            'Short pause for 2 counts',
            'Focus on releasing tension with each exhale'
          ]
        },
        musoni: {
          id: 'musoni',
          name: 'Musoni Breath - Renewal',
          description: 'Renewal breathing for deep rest and regeneration',
          pattern: [3, 6, 3, 6], // restorative pattern
          color: '#8844FF',
          culturalContext: 'Musoni represents midnight and renewal. This breath prepares for regeneration.',
          benefits: ['Deep rest', 'Regeneration', 'Wisdom integration', 'Sleep preparation'],
          instructions: [
            'Short inhale for 3 counts',
            'Long hold for 6 counts',
            'Short exhale for 3 counts',
            'Long pause for 6 counts',
            'Allow deep rest between breaths'
          ]
        }
      }
    },
    sevenBodies: {
      category: 'Seven Bodies Breathing',
      description: 'Breathing practices for each level of human experience',
      exercises: {
        physical: {
          id: 'physical',
          name: 'Physical Body - Grounding Breath',
          description: 'Earth connection breathing for physical vitality',
          pattern: [4, 2, 6, 2],
          color: '#FF4444',
          frequency: '256Hz',
          culturalContext: 'Connect with ancestral body wisdom and earth energy',
          benefits: ['Physical grounding', 'Vitality boost', 'Body awareness', 'Earth connection'],
          instructions: [
            'Feel feet connected to earth',
            'Breathe in earth energy for 4 counts',
            'Hold in your body for 2 counts',
            'Exhale tension for 6 counts',
            'Rest in grounded state for 2 counts'
          ]
        },
        etheric: {
          id: 'etheric',
          name: 'Etheric Body - Energy Circulation',
          description: 'Life force circulation breathing',
          pattern: [5, 5, 5, 5],
          color: '#FF8844',
          frequency: '288Hz',
          culturalContext: 'Activate ngolo (life force) and energy circulation',
          benefits: ['Energy circulation', 'Vitality increase', 'Aura strengthening', 'Life force activation'],
          instructions: [
            'Visualize energy field around body',
            'Inhale energy up spine for 5 counts',
            'Hold energy at crown for 5 counts',
            'Exhale energy down front for 5 counts',
            'Rest in energy circulation for 5 counts'
          ]
        },
        astral: {
          id: 'astral',
          name: 'Astral Body - Emotional Release',
          description: 'Emotional transformation breathing',
          pattern: [4, 4, 8, 4],
          color: '#FFDD44',
          frequency: '320Hz',
          culturalContext: 'Luvemba domain emotional purification work',
          benefits: ['Emotional release', 'Creative flow', 'Emotional balance', 'Artistic inspiration'],
          instructions: [
            'Connect with current emotions',
            'Breathe in acceptance for 4 counts',
            'Hold with compassion for 4 counts',
            'Long release exhale for 8 counts',
            'Rest in emotional peace for 4 counts'
          ]
        },
        mental: {
          id: 'mental',
          name: 'Mental Body - Clarity Breath',
          description: 'Mental clarity and focus breathing',
          pattern: [6, 2, 6, 2],
          color: '#44FF44',
          frequency: '341Hz',
          culturalContext: 'Kanga ye Kutula - tying and untying mental patterns',
          benefits: ['Mental clarity', 'Focus enhancement', 'Cognitive flexibility', 'Wisdom integration'],
          instructions: [
            'Clear the mind of distractions',
            'Inhale clarity for 6 counts',
            'Brief hold for 2 counts',
            'Exhale confusion for 6 counts',
            'Rest in clear awareness for 2 counts'
          ]
        },
        causal: {
          id: 'causal',
          name: 'Causal Body - Ancestral Connection',
          description: 'Soul wisdom and ancestral breathing',
          pattern: [7, 7, 7, 7],
          color: '#4488FF',
          frequency: '384Hz',
          culturalContext: 'Connect with ancestral wisdom and soul lessons',
          benefits: ['Ancestral connection', 'Soul wisdom', 'Karmic healing', 'Life purpose clarity'],
          instructions: [
            'Connect with ancestral lineage',
            'Breathe in ancestral wisdom for 7 counts',
            'Hold wisdom in heart for 7 counts',
            'Exhale gratitude for 7 counts',
            'Rest in ancestral connection for 7 counts'
          ]
        },
        buddhic: {
          id: 'buddhic',
          name: 'Buddhic Body - Intuitive Opening',
          description: 'Intuitive development breathing',
          pattern: [3, 9, 3, 9],
          color: '#8844FF',
          frequency: '426Hz',
          culturalContext: 'Nganga development - healer preparation breathing',
          benefits: ['Intuitive opening', 'Healing capacity', 'Spiritual gifts', 'Service preparation'],
          instructions: [
            'Open to higher guidance',
            'Short inhale for 3 counts',
            'Long receptive hold for 9 counts',
            'Gentle exhale for 3 counts',
            'Long integration pause for 9 counts'
          ]
        },
        atmic: {
          id: 'atmic',
          name: 'Atmic Body - Unity Consciousness',
          description: 'Divine connection breathing',
          pattern: [1, 11, 1, 11],
          color: '#DD44FF',
          frequency: '480Hz',
          culturalContext: 'Kala nganga - master consciousness breathing',
          benefits: ['Unity consciousness', 'Divine connection', 'Universal love', 'Service to all'],
          instructions: [
            'Connect with universal consciousness',
            'Brief inhale for 1 count',
            'Long unity hold for 11 counts',
            'Brief exhale for 1 count',
            'Long divine connection for 11 counts'
          ]
        }
      }
    },
    cultural: {
      category: 'Cultural Breathing Practices',
      description: 'Traditional African breathing and sound practices',
      exercises: {
        ancestral: {
          id: 'ancestral',
          name: 'Ancestral Connection Breath',
          description: 'Connect with ancestral wisdom through breath',
          pattern: [8, 8, 8, 8],
          color: '#8B4513',
          culturalContext: 'Traditional practice for connecting with ancestral guidance',
          benefits: ['Ancestral connection', 'Wisdom access', 'Lineage healing', 'Cultural grounding'],
          instructions: [
            'Honor your ancestors before beginning',
            'Breathe in ancestral presence for 8 counts',
            'Hold connection for 8 counts',
            'Exhale gratitude for 8 counts',
            'Rest in ancestral love for 8 counts'
          ]
        },
        community: {
          id: 'community',
          name: 'Community Healing Breath',
          description: 'Breathing for collective healing and unity',
          pattern: [5, 5, 5, 5],
          color: '#228B22',
          culturalContext: 'Traditional group breathing for community healing',
          benefits: ['Community connection', 'Collective healing', 'Unity consciousness', 'Social harmony'],
          instructions: [
            'Connect with your community in spirit',
            'Breathe in community love for 5 counts',
            'Hold collective energy for 5 counts',
            'Exhale healing to all for 5 counts',
            'Rest in unity for 5 counts'
          ]
        },
        rhythm: {
          id: 'rhythm',
          name: 'Traditional Rhythm Breath',
          description: 'Breathing with traditional African rhythms',
          pattern: [3, 3, 3, 3],
          color: '#FF6347',
          culturalContext: 'Breathing synchronized with traditional drum rhythms',
          benefits: ['Rhythmic entrainment', 'Cultural connection', 'Energy activation', 'Celebration'],
          instructions: [
            'Feel the rhythm in your body',
            'Quick inhale for 3 counts',
            'Hold the beat for 3 counts',
            'Rhythmic exhale for 3 counts',
            'Pause with rhythm for 3 counts'
          ]
        }
      }
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
    initializeBreathingSystem();
    simulateDeviceConnection();
  }, []);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, []);

  const initializeBreathingSystem = async () => {
    try {
      // Initialize breathing wisdom and guidance
      await apiCall('/input_data', 'POST', {
        created_object_name: "breathing_cultural_wisdom",
        data_type: "strings",
        input_data: [
          `BANTU-KONGO BREATHING TRADITIONS:

          Sacred Breath Concepts:
          - "Mpeve ya bomoi" (Breath of life) - The sacred breath that connects all living beings
          - "Nguzu ya mpeve" (Power of breath) - Breath as the carrier of life force and spiritual energy
          - "Mpeve ya bakulu" (Breath of ancestors) - Breathing practices that connect with ancestral wisdom
          - "Kimosi na mpeve" (Unity through breath) - Community breathing for collective healing

          Dikenga Cycle Breathing Philosophy:
          Each stage of the Dikenga cycle has specific breathing qualities that support the spiritual work of that moment:
          
          Kala (Dawn/Birth): Foundation breathing that establishes new energy patterns and intentions
          Tukula (Noon/Power): Activating breathing that builds strength and leadership capacity
          Luvemba (Sunset/Death): Release breathing that supports letting go and transformation
          Musoni (Midnight/Rebirth): Restorative breathing that facilitates deep renewal and wisdom integration

          Traditional Breathing Practices:
          - Ancestral connection breathing with specific rhythms for different lineages
          - Community healing circles with synchronized breathing patterns
          - Seasonal breathing practices aligned with natural cycles
          - Sacred sound integration with breath (humming, chanting, vocal toning)
          - Healing breath work for physical, emotional, and spiritual ailments`,

          `SEVEN BODIES BREATHING INTEGRATION:

          Each body has specific breathing practices that support its development and healing:

          Physical Body (Khat): Grounding breaths that connect with earth energy and ancestral body wisdom
          Etheric Body (Ka): Energy circulation breaths that activate and strengthen the life force field
          Astral Body (Ba): Emotional transformation breaths that support feeling processing and creative expression
          Mental Body (Ab): Clarity breaths that enhance focus, cognitive flexibility, and wisdom integration
          Causal Body (Khu): Soul connection breaths that access karmic patterns and life purpose clarity
          Buddhic Body (Sahu): Intuitive opening breaths that develop healing gifts and spiritual capacities
          Atmic Body (Ren): Unity consciousness breaths that connect with divine source and universal service

          Frequency and Sound Integration:
          Each body resonates with specific frequencies that can be integrated with breathing:
          - Physical: 256Hz (C note) - Grounding and stability
          - Etheric: 288Hz (D note) - Energy and vitality
          - Astral: 320Hz (E note) - Emotional flow and creativity
          - Mental: 341Hz (F note) - Mental clarity and focus
          - Causal: 384Hz (G note) - Soul wisdom and purpose
          - Buddhic: 426Hz (A note) - Intuitive opening and healing
          - Atmic: 480Hz (B note) - Unity consciousness and divine connection`,

          `THERAPEUTIC BREATHING APPLICATIONS:

          Stress Management Protocols:
          - Immediate stress relief: 4-7-8 breathing (Tukula pattern)
          - Anxiety reduction: 6-2-6-2 breathing (Luvemba pattern)
          - Panic attack intervention: Box breathing (Kala pattern)
          - Chronic stress healing: Extended Musoni renewal breathing

          Sleep and Recovery:
          - Sleep preparation: Musoni renewal breathing with extended exhales
          - Insomnia support: Progressive relaxation with seven bodies breathing
          - Recovery enhancement: Ancestral connection breathing for deep rest
          - Dream work preparation: Buddhic intuitive opening breath

          Performance Enhancement:
          - Pre-performance activation: Tukula power breathing
          - Focus and concentration: Mental body clarity breathing
          - Creative flow states: Astral body emotional release breathing
          - Leadership presence: Community healing breath with confidence building

          Healing and Recovery:
          - Physical healing support: Grounding breath with earth connection
          - Emotional trauma processing: Luvemba release breathing with safety protocols
          - Spiritual crisis support: Ancestral connection breathing with cultural grounding
          - Addiction recovery: Seven bodies integration breathing for holistic healing`
        ]
      });

      // Generate personalized breathing recommendations
      await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["breathing_recommendations"],
        prompt_string: `Based on this breathing wisdom: {breathing_cultural_wisdom}, create personalized breathing recommendations and guidance system that includes:

1. ASSESSMENT-BASED RECOMMENDATIONS:
   - Breathing patterns based on current stress levels
   - Dikenga stage-appropriate breathing practices
   - Seven bodies imbalance-specific breathing exercises
   - Cultural integration level-appropriate practices

2. GUIDED PROGRAM STRUCTURES:
   - 7-day Dikenga cycle introduction program
   - 21-day seven bodies development program
   - Cultural breathing traditions course outline
   - Stress management breathing program
   - Sleep preparation breathing sequences

3. BIOMETRIC INTEGRATION GUIDANCE:
   - Heart rate variability optimization through breathing
   - Stress level reduction protocols
   - Recovery enhancement breathing patterns
   - Performance breathing for different activities

4. COMMUNITY AND CULTURAL FEATURES:
   - Group breathing session formats
   - Cultural breathing circle guidelines
   - Mentor-guided session structures
   - Progress sharing and community support

5. THERAPEUTIC APPLICATIONS:
   - Crisis intervention breathing protocols
   - Trauma-informed breathing practices
   - Addiction recovery breathing support
   - Chronic condition management breathing

Format as JSON with clear program structures, recommendations, and cultural context.`,
        inputs: [
          {
            input_object_name: "breathing_cultural_wisdom",
            mode: "combine_events"
          }
        ]
      });

      const wisdomResult = await apiCall('/return_data', 'POST', {
        object_name: "breathing_recommendations",
        return_type: "json"
      });

      try {
        const parsedWisdom = JSON.parse(wisdomResult.value[0]);
        setCulturalWisdom(parsedWisdom);
      } catch (parseError) {
        console.error('Error parsing breathing wisdom:', parseError);
        setCulturalWisdom(createFallbackWisdom());
      }

    } catch (error) {
      console.error('Error initializing breathing system:', error);
      setCulturalWisdom(createFallbackWisdom());
    }
  };

  const createFallbackWisdom = () => ({
    programs: {
      dikengaIntro: {
        name: "7-Day Dikenga Cycle Introduction",
        description: "Learn the four sacred breathing patterns",
        days: [
          { day: 1, focus: "Kala Foundation", exercise: "kala" },
          { day: 2, focus: "Kala Practice", exercise: "kala" },
          { day: 3, focus: "Tukula Power", exercise: "tukula" },
          { day: 4, focus: "Tukula Integration", exercise: "tukula" },
          { day: 5, focus: "Luvemba Release", exercise: "luvemba" },
          { day: 6, focus: "Musoni Renewal", exercise: "musoni" },
          { day: 7, focus: "Full Cycle Integration", exercise: "all" }
        ]
      },
      sevenBodies: {
        name: "21-Day Seven Bodies Development",
        description: "Develop each body through specific breathing practices",
        weeks: [
          { week: 1, focus: "Physical, Etheric, Astral", exercises: ["physical", "etheric", "astral"] },
          { week: 2, focus: "Mental, Causal", exercises: ["mental", "causal"] },
          { week: 3, focus: "Buddhic, Atmic, Integration", exercises: ["buddhic", "atmic", "all"] }
        ]
      }
    },
    recommendations: {
      stress: {
        high: ["tukula", "luvemba"],
        medium: ["kala", "physical"],
        low: ["musoni", "atmic"]
      },
      timeOfDay: {
        morning: ["kala", "physical", "tukula"],
        afternoon: ["mental", "etheric"],
        evening: ["luvemba", "astral"],
        night: ["musoni", "causal", "buddhic"]
      }
    }
  });

  const simulateDeviceConnection = () => {
    // Simulate device connections
    const devices = [
      { id: 'apple-watch', name: 'Apple Watch Series 9', type: 'watch', connected: true, battery: 85 },
      { id: 'phone', name: 'iPhone Sensors', type: 'phone', connected: true, battery: 100 }
    ];
    setConnectedDevices(devices);

    // Simulate biometric data updates
    const updateBiometrics = () => {
      setBiometricData(prev => ({
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
        hrv: Math.max(20, Math.min(80, prev.hrv + (Math.random() - 0.5) * 6)),
        breathingRate: Math.max(8, Math.min(20, prev.breathingRate + (Math.random() - 0.5) * 2)),
        stressLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
      }));
    };

    const biometricInterval = setInterval(updateBiometrics, 2000);
    return () => clearInterval(biometricInterval);
  };

  // Breathing session management
  const startBreathingSession = (exercise) => {
    setSelectedExercise(exercise);
    setCurrentView('active');
    setIsActive(true);
    setCycleCount(0);
    setSessionTime(0);
    setBreathingPhase('inhale');

    // Start session timer
    timerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    // Start breathing cycle
    startBreathingCycle(exercise);
  };

  const startBreathingCycle = (exercise) => {
    const pattern = exercise.pattern;
    let phaseIndex = 0;
    const phases = ['inhale', 'hold', 'exhale', 'pause'];

    const nextPhase = () => {
      if (!isActive) return;

      setBreathingPhase(phases[phaseIndex]);
      const duration = pattern[phaseIndex] * 1000; // Convert to milliseconds

      phaseTimerRef.current = setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % 4;
        if (phaseIndex === 0) {
          setCycleCount(prev => prev + 1);
        }
        nextPhase();
      }, duration);
    };

    nextPhase();
  };

  const stopBreathingSession = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);

    // Save session to history
    const session = {
      id: Date.now(),
      exercise: selectedExercise,
      duration: sessionTime,
      cycles: cycleCount,
      date: new Date().toISOString(),
      biometrics: { ...biometricData }
    };

    setBreathingHistory(prev => [session, ...prev]);
    
    // Reset state
    setTimeout(() => {
      setCurrentView('home');
      setSelectedExercise(null);
      setCycleCount(0);
      setSessionTime(0);
    }, 2000);
  };

  // Breathing Animation Component
  const BreathingAnimation = ({ exercise, phase, isActive }) => {
    const getAnimationScale = () => {
      if (!isActive) return 1;
      switch (phase) {
        case 'inhale': return 1.5;
        case 'hold': return 1.5;
        case 'exhale': return 0.8;
        case 'pause': return 0.8;
        default: return 1;
      }
    };

    const getPhaseText = () => {
      switch (phase) {
        case 'inhale': return 'Breathe In';
        case 'hold': return 'Hold';
        case 'exhale': return 'Breathe Out';
        case 'pause': return 'Pause';
        default: return 'Ready';
      }
    };

    return (
      <div className="breathing-animation-container flex flex-col items-center justify-center h-96">
        {/* Main breathing circle */}
        <div className="relative">
          <div
            className="w-64 h-64 rounded-full transition-all duration-1000 ease-in-out flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, ${exercise?.color}40, ${exercise?.color}20)`,
              border: `4px solid ${exercise?.color}`,
              transform: `scale(${getAnimationScale()})`,
              boxShadow: `0 0 40px ${exercise?.color}40`
            }}
          >
            {/* Cultural pattern overlay */}
            <div className="absolute inset-0 rounded-full opacity-20">
              <svg className="w-full h-full" viewBox="0 0 256 256">
                {/* Dikenga cosmogram pattern */}
                <circle cx="128" cy="128" r="100" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="28" y1="128" x2="228" y2="128" stroke="currentColor" strokeWidth="2" />
                <line x1="128" y1="28" x2="128" y2="228" stroke="currentColor" strokeWidth="2" />
                <circle cx="128" cy="128" r="20" fill="currentColor" />
              </svg>
            </div>
            
            {/* Phase indicator */}
            <div className="text-center z-10">
              <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {getPhaseText()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {exercise?.pattern?.join('-')} pattern
              </div>
            </div>
          </div>
        </div>

        {/* Cultural context */}
        <div className="mt-8 text-center max-w-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            {exercise?.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {exercise?.culturalContext}
          </p>
          {exercise?.frequency && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Resonance: {exercise.frequency}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Biometric Display Component
  const BiometricDisplay = ({ data, devices }) => (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Real-time Biometrics
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{Math.round(data.heartRate)}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Heart Rate (BPM)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">{Math.round(data.hrv)}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">HRV Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{Math.round(data.breathingRate)}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Breathing Rate</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            data.stressLevel === 'low' ? 'text-green-500' :
            data.stressLevel === 'medium' ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {data.stressLevel.toUpperCase()}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Stress Level</div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-2">Connected Devices</h4>
        {devices.map(device => (
          <div key={device.id} className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">{device.name}</span>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${device.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-gray-500 dark:text-gray-500">{device.battery}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Home View
  const HomeView = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="glass-card p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Sacred Breathing Practices
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ancient African breathing wisdom with modern biometric integration
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4">
        <button
          onClick={() => setCurrentView('devices')}
          className="glass-card p-4 text-center hover:shadow-lg transition-all"
        >
          <div className="text-2xl mb-2">â</div>
          <div className="font-medium text-gray-800 dark:text-white">Devices</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {connectedDevices.length} connected
          </div>
        </button>
        
        <button
          onClick={() => setCurrentView('history')}
          className="glass-card p-4 text-center hover:shadow-lg transition-all"
        >
          <div className="text-2xl mb-2">ð</div>
          <div className="font-medium text-gray-800 dark:text-white">History</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {breathingHistory.length} sessions
          </div>
        </button>
        
        <button
          onClick={() => setCurrentView('custom')}
          className="glass-card p-4 text-center hover:shadow-lg transition-all"
        >
          <div className="text-2xl mb-2">ðï¸</div>
          <div className="font-medium text-gray-800 dark:text-white">Custom</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Create patterns
          </div>
        </button>
        
        <button
          onClick={() => setCurrentView('settings')}
          className="glass-card p-4 text-center hover:shadow-lg transition-all"
        >
          <div className="text-2xl mb-2">âï¸</div>
          <div className="font-medium text-gray-800 dark:text-white">Settings</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Preferences
          </div>
        </button>
      </div>

      {/* Exercise Categories */}
      {Object.entries(breathingExercises).map(([categoryKey, category]) => (
        <div key={categoryKey} className="glass-card p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {category.category}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {category.description}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(category.exercises).map(([exerciseKey, exercise]) => (
              <div
                key={exerciseKey}
                className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group"
                style={{ borderColor: `${exercise.color}40` }}
                onClick={() => startBreathingSession(exercise)}
              >
                <div className="flex items-center mb-3">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: exercise.color }}
                  ></div>
                  <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-primary-600">
                    {exercise.name}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {exercise.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-3">
                  <span>Pattern: {exercise.pattern.join('-')}</span>
                  {exercise.frequency && <span>{exercise.frequency}</span>}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {exercise.benefits?.slice(0, 3).map((benefit, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/20 rounded-full text-xs text-gray-600 dark:text-gray-400"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Active Breathing View
  const ActiveBreathingView = () => {
    if (!selectedExercise) return <HomeView />;

    return (
      <div className="max-w-4xl mx-auto p-6 h-screen flex flex-col">
        {/* Header */}
        <div className="glass-card p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('home')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              â Back
            </button>
            <div>
              <div className="font-bold text-gray-800 dark:text-white">{selectedExercise.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')} â¢ {cycleCount} cycles
              </div>
            </div>
          </div>
          
          <button
            onClick={isActive ? stopBreathingSession : () => startBreathingSession(selectedExercise)}
            className={`px-6 py-2 rounded-lg font-medium ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isActive ? 'Stop' : 'Start'}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid lg:grid-cols-3 gap-6">
          {/* Breathing Animation */}
          <div className="lg:col-span-2 glass-card p-6 flex items-center justify-center">
            <BreathingAnimation 
              exercise={selectedExercise} 
              phase={breathingPhase} 
              isActive={isActive} 
            />
          </div>

          {/* Biometrics and Instructions */}
          <div className="space-y-6">
            <BiometricDisplay data={biometricData} devices={connectedDevices} />
            
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Instructions
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {selectedExercise.instructions?.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-500 mr-2">{index + 1}.</span>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Benefits
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedExercise.benefits?.map((benefit, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/20 rounded-full text-xs text-gray-600 dark:text-gray-400"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Device Integration View
  const DeviceIntegrationView = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="glass-card p-8">
        <button
          onClick={() => setCurrentView('home')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          â Back to Home
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Device Integration
        </h1>

        {/* Connected Devices */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Connected Devices
          </h2>
          <div className="space-y-4">
            {connectedDevices.map(device => (
              <div key={device.id} className="p-4 bg-white/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {device.type === 'watch' ? 'â' : 'ð±'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {device.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {device.type === 'watch' ? 'Wearable Device' : 'Mobile Device'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Battery: {device.battery}%
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      device.connected ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Integrations */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Available Integrations
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Apple Watch', icon: 'â', status: 'Connected', features: ['Heart Rate', 'HRV', 'Breathing Rate'] },
              { name: 'Fitbit', icon: 'â', status: 'Available', features: ['Stress Tracking', 'Guided Breathing'] },
              { name: 'Samsung Health', icon: 'ð±', status: 'Available', features: ['Health Data', 'Stress Management'] },
              { name: 'Google Fit', icon: 'ð±', status: 'Available', features: ['Activity Tracking', 'Wellness Data'] }
            ].map((integration, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{integration.icon}</div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {integration.name}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    integration.status === 'Connected' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {integration.status}
                  </span>
                </div>
                <div className="space-y-1">
                  {integration.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="text-sm text-gray-600 dark:text-gray-400">
                      â¢ {feature}
                    </div>
                  ))}
                </div>
                {integration.status === 'Available' && (
                  <button className="mt-3 w-full primary-button">
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Biometric Settings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Biometric Monitoring
          </h2>
          <div className="space-y-4">
            {[
              { name: 'Heart Rate Monitoring', description: 'Track heart rate during breathing exercises', enabled: true },
              { name: 'HRV Analysis', description: 'Monitor heart rate variability for stress assessment', enabled: true },
              { name: 'Breathing Rate Detection', description: 'Automatic breathing rate calculation', enabled: true },
              { name: 'Stress Level Tracking', description: 'Real-time stress level monitoring', enabled: false }
            ].map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    {setting.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {setting.description}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={setting.enabled}
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // History View
  const HistoryView = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="glass-card p-8">
        <button
          onClick={() => setCurrentView('home')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          â Back to Home
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Breathing History
        </h1>

        {breathingHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">ð«</div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              No breathing sessions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start your first breathing exercise to see your progress here
            </p>
            <button
              onClick={() => setCurrentView('home')}
              className="primary-button"
            >
              Start Breathing
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {breathingHistory.map((session) => (
              <div key={session.id} className="p-4 bg-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: session.exercise.color }}
                    ></div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {session.exercise.name}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Duration</div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Cycles</div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {session.cycles}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Avg Heart Rate</div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {Math.round(session.biometrics.heartRate)} BPM
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">HRV Score</div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {Math.round(session.biometrics.hrv)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
              Breathing System Debug Console
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
                  System Status
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Connected Devices: {connectedDevices.length}</div>
                  <div>Active Session: {isActive ? 'Yes' : 'No'}</div>
                  <div>Session History: {breathingHistory.length} sessions</div>
                  <div>Heart Rate: {Math.round(biometricData.heartRate)} BPM</div>
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-primary-900 dark:via-secondary-900 dark:to-accent-900">
      {/* Main Content */}
      {currentView === 'home' && <HomeView />}
      {currentView === 'active' && <ActiveBreathingView />}
      {currentView === 'devices' && <DeviceIntegrationView />}
      {currentView === 'history' && <HistoryView />}

      {/* Debug Controls */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          className="success-button"
          onClick={() => setShowDebug(!showDebug)}
        >
          ð Debug
        </button>
      </div>

      {/* API Debugger */}
      {showDebug && <ApiDebugger />}
    </div>
  );
};

export default BreathingExercises;
</boltArtifact>

<boltAction type="file" filePath="src/App.jsx">
import React, { useState, useEffect } from 'react';
import AsAManThinksAuth from './components/AsAManThinksAuth';
import MaiiaM from './components/MaiiaM';
import SevenBodiesSystem from './components/SevenBodiesSystem';
import VoiceChatInterface from './components/VoiceChatInterface';
import BreathingExercises from './components/BreathingExercises';
import DarkModeToggle from './components/DarkModeToggle';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('auth'); // 'auth', 'maiiam', 'seven-bodies', 'voice-chat', 'breathing'

  useEffect(() => {
    // Check for saved dark mode preference or system preference
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(systemPrefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <div className="min-h-screen relative">
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      
      {/* Navigation */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass-card px-3 py-2">
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentView('auth')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                currentView === 'auth'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'
              }`}
            >
              Auth
            </button>
            <button
              onClick={() => setCurrentView('maiiam')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                currentView === 'maiiam'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'
              }`}
            >
              MaiiaM
            </button>
            <button
              onClick={() => setCurrentView('seven-bodies')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                currentView === 'seven-bodies'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'
              }`}
            >
              Bodies
            </button>
            <button
              onClick={() => setCurrentView('voice-chat')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                currentView === 'voice-chat'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setCurrentView('breathing')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                currentView === 'breathing'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'
              }`}
            >
              Breathing
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20">
        {currentView === 'auth' && <AsAManThinksAuth />}
        {currentView === 'maiiam' && <MaiiaM />}
        {currentView === 'seven-bodies' && <SevenBodiesSystem />}
        {currentView === 'voice-chat' && <VoiceChatInterface />}
        {currentView === 'breathing' && <BreathingExercises />}
      </div>
    </div>
  );
}

export default App;
