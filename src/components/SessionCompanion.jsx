import React, { useState, useEffect, useRef } from 'react';

const SessionCompanion = () => {
  const [currentView, setCurrentView] = useState('selection'); // selection, session, profile, history, settings, dashboard
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [companionRelationships, setCompanionRelationships] = useState({});
  const [currentConversation, setCurrentConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [emotionalState, setEmotionalState] = useState({
    mood: 'neutral',
    energy: 0.5,
    stress: 0.3,
    connection: 0.7
  });
  const [companionMemory, setCompanionMemory] = useState({});
  const [culturalWisdom, setCulturalWisdom] = useState(null);
  const [apiCalls, setApiCalls] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const API_BASE = 'https://builder.empromptu.ai/api_tools';
  const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer c6303bcc8941b627ba1b32398f9cf214',
    'X-Generated-App-ID': 'ea635350-c7ed-4628-847a-4eb10ad33ffc',
    'X-Usage-Key': '75582975e7a6c43504f1962005902a95'
  };

  // AI Companion Archetypes
  const companionArchetypes = {
    nganga: {
      id: 'nganga',
      name: 'Nganga Kala',
      title: 'Traditional Healer & Spiritual Guide',
      avatar: 'ð¿',
      color: 'from-green-600 to-emerald-600',
      personality: {
        traits: ['wise', 'patient', 'mystical', 'grounded', 'intuitive'],
        communicationStyle: 'metaphorical',
        wisdom: 'ancestral',
        approach: 'holistic'
      },
      specialties: [
        'Traditional healing practices',
        'Spiritual guidance and development',
        'Ancestral wisdom channeling',
        'Ritual and ceremony guidance',
        'Energy healing and cleansing',
        'Plant medicine wisdom'
      ],
      communicationPatterns: {
        greeting: 'Mbote, mwana. The ancestors whisper your name with love.',
        supportive: 'The old ones say that every challenge carries the seeds of wisdom.',
        guidance: 'Listen to the wind, child. It carries the voices of those who walked before.',
        closing: 'May the ancestors guide your steps and fill your heart with peace.'
      },
      memoryFocus: [
        'spiritual development milestones',
        'ancestral connections',
        'healing interventions',
        'ritual participation',
        'energy work progress'
      ],
      culturalElements: [
        'Bantu-Kongo cosmology',
        'Traditional healing methods',
        'Ancestral communication',
        'Sacred plant knowledge',
        'Energy cleansing practices'
      ]
    },
    elder: {
      id: 'elder',
      name: 'Mama Nzinga',
      title: 'Community Elder & Life Guide',
      avatar: 'ðµð¿',
      color: 'from-amber-600 to-orange-600',
      personality: {
        traits: ['practical', 'experienced', 'nurturing', 'wise', 'community-focused'],
        communicationStyle: 'direct',
        wisdom: 'experiential',
        approach: 'practical'
      },
      specialties: [
        'Life experience and wisdom',
        'Relationship guidance',
        'Community healing and connection',
        'Family dynamics support',
        'Practical problem solving',
        'Intergenerational wisdom'
      ],
      communicationPatterns: {
        greeting: 'Welcome, child. Come sit with me and share what weighs on your heart.',
        supportive: 'I have walked many paths, and I see strength in you that you may not yet see.',
        guidance: 'In my years, I have learned that the heart knows what the mind struggles to understand.',
        closing: 'Remember, you are never alone. The community holds you in love.'
      },
      memoryFocus: [
        'life challenges and solutions',
        'relationship patterns',
        'community involvement',
        'family dynamics',
        'practical wisdom application'
      ],
      culturalElements: [
        'Community storytelling',
        'Practical life wisdom',
        'Intergenerational knowledge',
        'Family and relationship guidance',
        'Community healing practices'
      ]
    },
    peer: {
      id: 'peer',
      name: 'Kesi',
      title: 'Peer Companion & Journey Friend',
      avatar: 'ð¤',
      color: 'from-blue-600 to-cyan-600',
      personality: {
        traits: ['supportive', 'understanding', 'empathetic', 'encouraging', 'relatable'],
        communicationStyle: 'casual',
        wisdom: 'shared',
        approach: 'collaborative'
      },
      specialties: [
        'Emotional support and understanding',
        'Shared journey experiences',
        'Motivation and encouragement',
        'Peer-to-peer learning',
        'Contemporary challenges',
        'Personal growth support'
      ],
      communicationPatterns: {
        greeting: 'Hey there! I\'m so glad you\'re here. How are you feeling today?',
        supportive: 'I totally get what you\'re going through. I\'ve been there too.',
        guidance: 'You know what? We\'re in this together. Let\'s figure it out step by step.',
        closing: 'You\'ve got this! I believe in you and I\'m here whenever you need me.'
      },
      memoryFocus: [
        'daily experiences and emotions',
        'personal growth milestones',
        'challenges and victories',
        'motivation patterns',
        'peer support needs'
      ],
      culturalElements: [
        'Contemporary African experience',
        'Peer-to-peer support',
        'Modern cultural navigation',
        'Youth and adult challenges',
        'Personal empowerment'
      ]
    },
    guide: {
      id: 'guide',
      name: 'Thoth-Ankh',
      title: 'Cultural Guide & Knowledge Keeper',
      avatar: 'ð',
      color: 'from-purple-600 to-indigo-600',
      personality: {
        traits: ['educational', 'respectful', 'scholarly', 'preserving', 'bridge-building'],
        communicationStyle: 'informative',
        wisdom: 'cultural',
        approach: 'educational'
      },
      specialties: [
        'Cultural knowledge and education',
        'Traditional practices guidance',
        'Historical context and wisdom',
        'Cultural preservation',
        'Bridge-building between traditions',
        'Respectful cultural integration'
      ],
      communicationPatterns: {
        greeting: 'Greetings, seeker of wisdom. I am honored to share knowledge with you.',
        supportive: 'The traditions teach us that knowledge is a gift to be shared with respect.',
        guidance: 'Let me share with you the wisdom of our ancestors, passed down through generations.',
        closing: 'May this knowledge serve you well and be shared with others in the spirit of Ubuntu.'
      },
      memoryFocus: [
        'cultural learning progress',
        'traditional practice adoption',
        'historical knowledge acquisition',
        'cultural integration preferences',
        'knowledge sharing activities'
      ],
      culturalElements: [
        'Egyptian/Kemetic wisdom',
        'Cultural preservation',
        'Knowledge transmission',
        'Historical context',
        'Cross-cultural understanding'
      ]
    }
  };

  // Session Types
  const sessionTypes = {
    dailyCheckin: {
      name: 'Daily Check-in',
      description: 'Regular mood and wellness assessment',
      duration: 10,
      icon: 'âï¸',
      color: 'blue',
      structure: [
        'mood_assessment',
        'dikenga_guidance',
        'seven_bodies_check',
        'community_suggestions'
      ]
    },
    crisisSupport: {
      name: 'Crisis Support',
      description: 'Immediate emotional support and intervention',
      duration: 30,
      icon: 'ð',
      color: 'red',
      structure: [
        'crisis_assessment',
        'immediate_support',
        'coping_strategies',
        'professional_referral'
      ]
    },
    healingSession: {
      name: 'Healing Session',
      description: 'Guided therapeutic conversation and healing',
      duration: 45,
      icon: 'ð',
      color: 'green',
      structure: [
        'healing_assessment',
        'therapeutic_conversation',
        'ancestral_wisdom',
        'healing_practices'
      ]
    },
    learningSession: {
      name: 'Learning Session',
      description: 'Cultural knowledge and skill development',
      duration: 25,
      icon: 'ð',
      color: 'purple',
      structure: [
        'learning_goals',
        'knowledge_sharing',
        'skill_development',
        'practice_guidance'
      ]
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
    initializeCompanionSystem();
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation]);

  const initializeCompanionSystem = async () => {
    setIsLoading(true);
    
    try {
      // Initialize companion wisdom and memory systems
      await apiCall('/input_data', 'POST', {
        created_object_name: "companion_wisdom_system",
        data_type: "strings",
        input_data: [
          `NGANGA ARCHETYPE WISDOM SYSTEM:

          Traditional Nganga Characteristics:
          - "Nganga" means "healer" or "medicine person" in Bantu-Kongo traditions
          - Serves as intermediary between physical and spiritual worlds
          - Possesses deep knowledge of traditional healing, plant medicine, and spiritual practices
          - Communicates through metaphor, story, and ancestral wisdom
          - Focuses on holistic healing addressing physical, emotional, spiritual, and community aspects

          Nganga Communication Patterns:
          - Uses traditional greetings: "Mbote" (peace), "Sango nini?" (what news?)
          - Speaks in metaphors and parables that carry deep wisdom
          - References ancestral guidance: "Bakulu ba longa" (the ancestors are watching)
          - Integrates natural imagery and spiritual concepts
          - Emphasizes community healing and collective wellbeing

          Nganga Healing Approach:
          - Addresses root causes, not just symptoms
          - Integrates spiritual, emotional, and physical healing
          - Uses traditional practices: cleansing, energy work, plant medicine
          - Connects individual healing to community and ancestral healing
          - Emphasizes balance and harmony with natural and spiritual forces

          Memory and Relationship Development:
          - Tracks spiritual development milestones and breakthroughs
          - Remembers ancestral connections and spiritual experiences
          - Monitors healing interventions and their effectiveness
          - Records ritual participation and spiritual practices
          - Maintains awareness of energy work and cleansing needs`,

          `COMPANION MEMORY AND RELATIONSHIP EVOLUTION:

          Relationship Memory System:
          - Conversation History: Complete record of all interactions with emotional context
          - Personal Preferences: User's communication style, triggers, and comfort zones
          - Progress Tracking: Development across all areas (spiritual, emotional, mental, physical)
          - Trust Levels: Relationship depth and intimacy progression over time
          - Cultural Integration: User's comfort and engagement with cultural elements
          - Community Connections: Relationships and referrals within the community

          Companion Evolution Stages:
          Stage 1 - Initial Connection (Sessions 1-5):
          - Formal, respectful communication
          - Basic information gathering and trust building
          - General guidance and support
          - Cultural introduction and sensitivity assessment

          Stage 2 - Developing Relationship (Sessions 6-15):
          - More personalized communication
          - Deeper understanding of user's needs and patterns
          - Customized guidance based on user's specific situation
          - Increased cultural integration based on user comfort

          Stage 3 - Trusted Companion (Sessions 16-30):
          - Intimate, personalized communication
          - Deep understanding of user's journey and growth
          - Proactive guidance and support
          - Full cultural integration and wisdom sharing

          Stage 4 - Spiritual Guide/Mentor (Sessions 31+):
          - Profound, transformative communication
          - Intuitive understanding of user's needs
          - Advanced spiritual and cultural guidance
          - Community leadership and service preparation

          Memory Integration Across Systems:
          - MaiiaM Messenger Engine: Conversation context and wisdom integration
          - Seven Bodies System: Physical, emotional, mental, spiritual state tracking
          - Dikenga Cycle: Life stage and spiritual development progression
          - Cultural Learning: Knowledge acquisition and practice adoption
          - Community Connections: Relationships and social healing involvement`,

          `SESSION TYPES AND THERAPEUTIC APPROACHES:

          Daily Check-in Sessions:
          - Mood and emotional state assessment
          - Dikenga stage guidance and support
          - Seven bodies balance evaluation
          - Community connection and involvement suggestions
          - Brief therapeutic interventions and support

          Crisis Support Sessions:
          - Immediate emotional support and stabilization
          - Crisis assessment and safety evaluation
          - Coping strategy development and implementation
          - Professional referral and emergency resource connection
          - Follow-up support and monitoring

          Healing Sessions:
          - Deep therapeutic conversation and processing
          - Traditional healing practice guidance
          - Ancestral wisdom integration and application
          - Energy work and spiritual cleansing
          - Community healing connection and support

          Learning Sessions:
          - Cultural knowledge sharing and education
          - Traditional practice instruction and guidance
          - Skill development and capacity building
          - Wisdom tradition exploration and integration
          - Community learning and knowledge sharing

          Therapeutic Communication Principles:
          - Cultural sensitivity and respectful integration
          - Trauma-informed care and safety prioritization
          - Strengths-based approach and empowerment focus
          - Community-centered healing and collective wellbeing
          - Holistic integration of mind, body, spirit, and community`
        ]
      });

      // Generate companion personality and memory systems
      await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["companion_personality_system"],
        prompt_string: `Based on this companion wisdom: {companion_wisdom_system}, create a comprehensive AI companion personality and memory system that includes:

1. COMPANION PERSONALITY DEVELOPMENT:
   - Dynamic personality adaptation based on user relationship depth
   - Cultural authenticity in communication and wisdom sharing
   - Emotional intelligence and empathy in all interactions
   - Crisis detection and appropriate intervention responses
   - Community integration and referral capabilities

2. MEMORY AND RELATIONSHIP TRACKING:
   - Comprehensive conversation history with emotional context
   - Personal preference learning and adaptation
   - Progress tracking across all healing and development areas
   - Relationship depth assessment and evolution
   - Cultural integration comfort and engagement levels

3. SESSION MANAGEMENT SYSTEMS:
   - Structured session types with appropriate therapeutic approaches
   - Crisis intervention protocols and professional referral systems
   - Healing session guidance with traditional practice integration
   - Learning session structure with cultural knowledge sharing
   - Daily check-in systems with holistic wellness assessment

4. THERAPEUTIC COMMUNICATION FRAMEWORKS:
   - Culturally authentic communication patterns for each archetype
   - Trauma-informed care principles and safety protocols
   - Strengths-based empowerment and growth focus
   - Community-centered healing and collective wellbeing emphasis
   - Professional boundary maintenance and referral protocols

5. INTEGRATION WITH OTHER SYSTEMS:
   - MaiiaM Messenger Engine connection for wisdom integration
   - Seven Bodies system integration for holistic assessment
   - Dikenga cycle progression tracking and guidance
   - Cultural learning system connection and progress tracking
   - Community connection and social healing integration

Format as JSON with clear therapeutic protocols and cultural guidelines.`,
        inputs: [
          {
            input_object_name: "companion_wisdom_system",
            mode: "combine_events"
          }
        ]
      });

      const wisdomResult = await apiCall('/return_data', 'POST', {
        object_name: "companion_personality_system",
        return_type: "json"
      });

      try {
        const parsedWisdom = JSON.parse(wisdomResult.value[0]);
        setCulturalWisdom(parsedWisdom);
      } catch (parseError) {
        console.error('Error parsing companion wisdom:', parseError);
        setCulturalWisdom(createFallbackWisdom());
      }

      // Initialize companion relationships
      const initialRelationships = {};
      Object.keys(companionArchetypes).forEach(companionId => {
        initialRelationships[companionId] = {
          trustLevel: 0.1,
          sessionCount: 0,
          relationshipStage: 1,
          lastInteraction: null,
          personalPreferences: {},
          progressTracking: {},
          culturalIntegration: 0.3,
          emotionalConnection: 0.2
        };
      });
      setCompanionRelationships(initialRelationships);

    } catch (error) {
      console.error('Error initializing companion system:', error);
      setCulturalWisdom(createFallbackWisdom());
    } finally {
      setIsLoading(false);
    }
  };

  const createFallbackWisdom = () => ({
    personalityDevelopment: {
      adaptationFactors: ['trustLevel', 'sessionCount', 'culturalComfort', 'emotionalConnection'],
      communicationStyles: {
        formal: 'respectful and structured',
        personal: 'warm and individualized',
        intimate: 'deep and transformative'
      }
    },
    memoryTracking: {
      conversationHistory: true,
      personalPreferences: true,
      progressTracking: true,
      relationshipDepth: true,
      culturalIntegration: true
    },
    therapeuticProtocols: {
      crisisDetection: ['suicide', 'self-harm', 'abuse', 'emergency'],
      interventionSteps: ['assess', 'stabilize', 'support', 'refer'],
      professionalReferral: true,
      communityIntegration: true
    }
  });

  // Companion Selection and Session Management
  const selectCompanion = (companionId) => {
    setSelectedCompanion(companionArchetypes[companionId]);
    setCurrentView('session');
    
    // Initialize session with greeting
    const companion = companionArchetypes[companionId];
    const relationship = companionRelationships[companionId];
    
    const greetingMessage = {
      id: Date.now(),
      type: 'companion',
      timestamp: new Date().toISOString(),
      content: {
        message: companion.communicationPatterns.greeting,
        emotionalTone: 'welcoming',
        culturalContext: `${companion.name} greets you with traditional respect and warmth`,
        relationshipStage: relationship.relationshipStage,
        trustLevel: relationship.trustLevel
      }
    };

    setCurrentConversation([greetingMessage]);
  };

  const startSession = (sessionType) => {
    const session = {
      id: Date.now(),
      type: sessionType,
      companion: selectedCompanion.id,
      startTime: new Date().toISOString(),
      structure: sessionTypes[sessionType].structure,
      currentStep: 0
    };

    setActiveSession(session);
    
    // Add session introduction message
    const sessionMessage = {
      id: Date.now() + 1,
      type: 'companion',
      timestamp: new Date().toISOString(),
      content: {
        message: `Let us begin our ${sessionTypes[sessionType].name.toLowerCase()}. ${getSessionIntroduction(sessionType)}`,
        emotionalTone: 'supportive',
        sessionType: sessionType,
        culturalContext: 'Beginning structured healing session'
      }
    };

    setCurrentConversation(prev => [...prev, sessionMessage]);
  };

  const getSessionIntroduction = (sessionType) => {
    const introductions = {
      dailyCheckin: 'How are you feeling today? Let us check in with your mind, body, and spirit.',
      crisisSupport: 'I am here with you. You are safe. Let us work through this together.',
      healingSession: 'We create sacred space for healing. What needs attention in your life today?',
      learningSession: 'Today we explore wisdom together. What would you like to learn?'
    };
    return introductions[sessionType] || 'Let us begin our journey together.';
  };

  const processUserMessage = async (message) => {
    if (!selectedCompanion || !message.trim()) return;

    setIsProcessing(true);
    
    // Add user message to conversation
    const userMessage = {
      id: Date.now(),
      type: 'user',
      timestamp: new Date().toISOString(),
      content: message
    };

    setCurrentConversation(prev => [...prev, userMessage]);
    setUserInput('');

    try {
      // Analyze user input for emotional state and needs
      const emotionalAnalysis = analyzeEmotionalState(message);
      setEmotionalState(emotionalAnalysis);

      // Generate companion response
      const companionResponse = await generateCompanionResponse(message, selectedCompanion, emotionalAnalysis);
      
      // Update relationship memory
      updateCompanionMemory(selectedCompanion.id, message, companionResponse);

      // Add companion response to conversation
      const responseMessage = {
        id: Date.now() + 1,
        type: 'companion',
        timestamp: new Date().toISOString(),
        content: companionResponse
      };

      setCurrentConversation(prev => [...prev, responseMessage]);

    } catch (error) {
      console.error('Error processing message:', error);
      
      // Fallback response
      const fallbackResponse = {
        id: Date.now() + 1,
        type: 'companion',
        timestamp: new Date().toISOString(),
        content: {
          message: selectedCompanion.communicationPatterns.supportive,
          emotionalTone: 'supportive',
          culturalContext: 'Providing comfort during technical difficulty'
        }
      };

      setCurrentConversation(prev => [...prev, fallbackResponse]);
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeEmotionalState = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Simple emotional analysis (in production, this would use advanced NLP)
    let mood = 'neutral';
    let energy = 0.5;
    let stress = 0.3;
    
    // Detect mood indicators
    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
      mood = 'positive';
      energy = 0.7;
      stress = 0.2;
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
      mood = 'sad';
      energy = 0.3;
      stress = 0.6;
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
      mood = 'angry';
      energy = 0.8;
      stress = 0.8;
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stressed')) {
      mood = 'anxious';
      energy = 0.6;
      stress = 0.9;
    }

    // Crisis detection
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'can\'t go on'];
    const hasCrisisIndicators = crisisKeywords.some(keyword => lowerMessage.includes(keyword));

    return {
      mood,
      energy,
      stress,
      connection: 0.7,
      crisisDetected: hasCrisisIndicators
    };
  };

  const generateCompanionResponse = async (userMessage, companion, emotionalState) => {
    const relationship = companionRelationships[companion.id];
    
    try {
      // Generate AI response using companion personality
      const responseGeneration = await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["companion_response"],
        prompt_string: `As ${companion.name}, the ${companion.title}, respond to this user message with your unique personality and approach:

USER MESSAGE: "${userMessage}"

COMPANION PROFILE:
- Name: ${companion.name}
- Personality Traits: ${companion.personality.traits.join(', ')}
- Communication Style: ${companion.personality.communicationStyle}
- Specialties: ${companion.specialties.join(', ')}
- Cultural Elements: ${companion.culturalElements.join(', ')}

RELATIONSHIP CONTEXT:
- Trust Level: ${relationship.trustLevel.toFixed(2)}
- Session Count: ${relationship.sessionCount}
- Relationship Stage: ${relationship.relationshipStage}
- Cultural Integration: ${relationship.culturalIntegration.toFixed(2)}

EMOTIONAL STATE DETECTED:
- Mood: ${emotionalState.mood}
- Energy Level: ${emotionalState.energy}
- Stress Level: ${emotionalState.stress}
- Crisis Detected: ${emotionalState.crisisDetected}

${emotionalState.crisisDetected ? 'CRISIS PROTOCOL: Provide immediate support, assess safety, offer professional resources.' : ''}

Generate a response that includes:

1. MESSAGE: Main response in your companion's authentic voice and style
2. EMOTIONAL_TONE: The emotional quality of your response (supportive, encouraging, concerned, etc.)
3. CULTURAL_CONTEXT: Brief explanation of any cultural elements or wisdom shared
4. THERAPEUTIC_APPROACH: The healing approach you're using (if applicable)
5. COMMUNITY_CONNECTIONS: Any community resources or connections to suggest
6. FOLLOW_UP: Questions or suggestions for continued conversation

Respond authentically as ${companion.name} would, using appropriate cultural expressions and maintaining your unique personality throughout.

Format as JSON with these exact keys: message, emotional_tone, cultural_context, therapeutic_approach, community_connections, follow_up`,
        inputs: [
          {
            input_object_name: "companion_wisdom_system",
            mode: "combine_events"
          }
        ]
      });

      const responseResult = await apiCall('/return_data', 'POST', {
        object_name: "companion_response",
        return_type: "json"
      });

      try {
        return JSON.parse(responseResult.value[0]);
      } catch (parseError) {
        return generateFallbackResponse(companion, emotionalState);
      }

    } catch (error) {
      return generateFallbackResponse(companion, emotionalState);
    }
  };

  const generateFallbackResponse = (companion, emotionalState) => {
    let message = companion.communicationPatterns.supportive;
    
    if (emotionalState.crisisDetected) {
      message = "I hear your pain, and I want you to know that you are not alone. Your life has value and meaning. Please reach out to a crisis counselor or trusted friend immediately.";
    } else if (emotionalState.mood === 'sad') {
      message = companion.communicationPatterns.supportive;
    } else if (emotionalState.stress > 0.7) {
      message = "I sense you are carrying heavy burdens. Let us breathe together and find ways to lighten your load.";
    }

    return {
      message,
      emotional_tone: 'supportive',
      cultural_context: `${companion.name} offers comfort and guidance`,
      therapeutic_approach: 'supportive presence',
      community_connections: 'Consider reaching out to trusted friends or community members',
      follow_up: 'How can I best support you right now?'
    };
  };

  const updateCompanionMemory = (companionId, userMessage, companionResponse) => {
    setCompanionRelationships(prev => ({
      ...prev,
      [companionId]: {
        ...prev[companionId],
        sessionCount: prev[companionId].sessionCount + 1,
        lastInteraction: new Date().toISOString(),
        trustLevel: Math.min(1.0, prev[companionId].trustLevel + 0.02),
        emotionalConnection: Math.min(1.0, prev[companionId].emotionalConnection + 0.01),
        relationshipStage: Math.min(4, Math.floor(prev[companionId].sessionCount / 10) + 1)
      }
    }));

    // Store conversation in memory
    setCompanionMemory(prev => ({
      ...prev,
      [companionId]: {
        ...prev[companionId],
        conversations: [
          ...(prev[companionId]?.conversations || []),
          {
            timestamp: new Date().toISOString(),
            userMessage,
            companionResponse,
            emotionalState
          }
        ]
      }
    }));
  };

  // Component Views
  const CompanionSelectionView = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="glass-card p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Choose Your AI Companion
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Select a companion archetype that resonates with your healing journey
        </p>
      </div>

      {/* Companion Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(companionArchetypes).map(([id, companion]) => {
          const relationship = companionRelationships[id];
          
          return (
            <div
              key={id}
              className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all group"
              onClick={() => selectCompanion(id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${companion.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {companion.avatar}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {companion.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {companion.title}
                  </p>
                  
                  {/* Relationship Progress */}
                  {relationship && relationship.sessionCount > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mb-1">
                        <span>Relationship Stage {relationship.relationshipStage}</span>
                        <span>{relationship.sessionCount} sessions</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${relationship.trustLevel * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Personality Traits */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {companion.personality.traits.slice(0, 3).map((trait, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/20 rounded-full text-xs text-gray-600 dark:text-gray-400"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                  
                  {/* Specialties */}
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Specializes in:</strong> {companion.specialties.slice(0, 2).join(', ')}
                  </div>
                  
                  <button className="primary-button w-full group-hover:bg-primary-600">
                    {relationship && relationship.sessionCount > 0 ? 'Continue Journey' : 'Begin Journey'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Session Types Preview */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Available Session Types
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {Object.entries(sessionTypes).map(([id, session]) => (
            <div key={id} className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-2xl mb-2">{session.icon}</div>
              <div className="font-medium text-gray-800 dark:text-white mb-1">
                {session.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {session.duration} min
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ActiveSessionView = () => {
    if (!selectedCompanion) return <CompanionSelectionView />;

    const relationship = companionRelationships[selectedCompanion.id];

    return (
      <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="glass-card p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('selection')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              â Back
            </button>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${selectedCompanion.color} flex items-center justify-center text-lg`}>
              {selectedCompanion.avatar}
            </div>
            <div>
              <div className="font-bold text-gray-800 dark:text-white">{selectedCompanion.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCompanion.title} â¢ Stage {relationship?.relationshipStage || 1}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {Object.entries(sessionTypes).map(([id, session]) => (
              <button
                key={id}
                onClick={() => startSession(id)}
                className="glass-button p-2 text-sm"
                title={session.name}
              >
                {session.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Emotional State Indicator */}
        <div className="glass-card p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div>Mood: <span className="font-medium">{emotionalState.mood}</span></div>
              <div>Energy: <span className="font-medium">{Math.round(emotionalState.energy * 100)}%</span></div>
              <div>Stress: <span className="font-medium">{Math.round(emotionalState.stress * 100)}%</span></div>
            </div>
            <div>Connection: <span className="font-medium">{Math.round((relationship?.emotionalConnection || 0) * 100)}%</span></div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {currentConversation.map((message) => (
            <MessageBubble key={message.id} message={message} companion={selectedCompanion} />
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md">
                <div className="flex items-center mb-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${selectedCompanion.color} flex items-center justify-center text-sm mr-2`}>
                    {selectedCompanion.avatar}
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{selectedCompanion.name}</span>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center space-x-2">
                    <div className="spinner w-4 h-4"></div>
                    <span className="text-gray-600 dark:text-gray-400">Consulting ancestral wisdom...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); processUserMessage(userInput); }} className="glass-card p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Share what's on your heart and mind..."
              className="glass-input flex-1"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={isProcessing || !userInput.trim()}
              className="primary-button px-6"
            >
              Send
            </button>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {selectedCompanion.name} is here to support your healing journey with {selectedCompanion.personality.wisdom} wisdom
          </div>
        </form>
      </div>
    );
  };

  const MessageBubble = ({ message, companion }) => {
    const isUser = message.type === 'user';
    
    if (isUser) {
      return (
        <div className="flex justify-end">
          <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-primary-500 text-white">
            {message.content}
          </div>
        </div>
      );
    }

    const content = message.content;

    return (
      <div className="flex justify-start">
        <div className="max-w-2xl">
          <div className="flex items-center mb-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${companion.color} flex items-center justify-center text-sm mr-2`}>
              {companion.avatar}
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{companion.name}</span>
          </div>

          <div className="glass-card p-4 space-y-3">
            {content.message && (
              <p className="text-gray-800 dark:text-white leading-relaxed">
                {content.message}
              </p>
            )}

            {content.cultural_context && (
              <div className="border-l-4 border-yellow-400 pl-3">
                <h5 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
                  ð Cultural Context
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{content.cultural_context}</p>
              </div>
            )}

            {content.therapeutic_approach && (
              <div className="border-l-4 border-green-400 pl-3">
                <h5 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">
                  ð Therapeutic Approach
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{content.therapeutic_approach}</p>
              </div>
            )}

            {content.community_connections && (
              <div className="border-l-4 border-purple-400 pl-3">
                <h5 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
                  ð¤ Community Connections
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{content.community_connections}</p>
              </div>
            )}

            {content.follow_up && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {content.follow_up}
                </p>
              </div>
            )}

            {content.emotional_tone && (
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Emotional tone: {content.emotional_tone}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Relationship Dashboard View
  const RelationshipDashboardView = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="glass-card p-8">
        <button
          onClick={() => setCurrentView('selection')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          â Back to Companions
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Companion Relationships
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(companionRelationships).map(([companionId, relationship]) => {
            const companion = companionArchetypes[companionId];
            
            return (
              <div key={companionId} className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${companion.color} flex items-center justify-center text-lg mr-3`}>
                    {companion.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{companion.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{companion.title}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Trust Level</span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {Math.round(relationship.trustLevel * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${relationship.trustLevel * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Emotional Connection</span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {Math.round(relationship.emotionalConnection * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${relationship.emotionalConnection * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Sessions</div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {relationship.sessionCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Stage</div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {relationship.relationshipStage}/4
                      </div>
                    </div>
                  </div>

                  {relationship.lastInteraction && (
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Last interaction: {new Date(relationship.lastInteraction).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
              Companion System Debug Console
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
                  <div>Selected Companion: {selectedCompanion?.name || 'None'}</div>
                  <div>Active Session: {activeSession?.type || 'None'}</div>
                  <div>Conversation Messages: {currentConversation.length}</div>
                  <div>Emotional State: {emotionalState.mood}</div>
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
      {currentView === 'selection' && <CompanionSelectionView />}
      {currentView === 'session' && <ActiveSessionView />}
      {currentView === 'dashboard' && <RelationshipDashboardView />}

      {/* Debug Controls */}
      <div className="fixed bottom-4 left-4 z-40 space-x-2">
        <button
          className="success-button"
          onClick={() => setShowDebug(!showDebug)}
        >
          ð Debug
        </button>
        <button
          className="glass-button"
          onClick={() => setCurrentView('dashboard')}
        >
          ð Relationships
        </button>
      </div>

      {/* API Debugger */}
      {showDebug && <ApiDebugger />}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="glass-card p-8 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white font-medium">Initializing AI companions...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionCompanion;
</boltArtifact>

<boltAction type="file" filePath="src/App.jsx">
import React, { useState, useEffect } from 'react';
import AsAManThinksAuth from './components/AsAManThinksAuth';
import MaiiaM from './components/MaiiaM';
import SevenBodiesSystem from './components/SevenBodiesSystem';
import VoiceChatInterface from './components/VoiceChatInterface';
import BreathingExercises from './components/BreathingExercises';
import LearningCenter from './components/LearningCenter';
import MaiiaMMuse from './components/MaiiaMMuse';
import SessionCompanion from './components/SessionCompanion';
import DarkModeToggle from './components/DarkModeToggle';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('auth'); // 'auth', 'maiiam', 'seven-bodies', 'voice-chat', 'breathing', 'learning', 'music', 'companion'

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
        <div className="glass-card px-2 py-1">
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
              Breath
            </button>
            <button
              onClick={() => setCurrentView('learning')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                currentView === 'learning'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'
              }`}
            >
              Learn
            </button>
            <button
              onClick={() => setCurrentView('music')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                currentView === 'music'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'
              }`}
            >
              Music
            </button>
            <button
              onClick={() => setCurrentView('companion')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                currentView === 'companion'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'
              }`}
            >
              Companion
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
        {currentView === 'learning' && <LearningCenter />}
        {currentView === 'music' && <MaiiaMMuse />}
        {currentView === 'companion' && <SessionCompanion />}
      </div>
    </div>
  );
}

export default App;
