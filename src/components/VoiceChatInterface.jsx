import React, { useState, useEffect, useRef } from 'react';

const VoiceChatInterface = () => {
  const [currentView, setCurrentView] = useState('home'); // home, chat, voice, companion-profile, settings
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [culturalWisdom, setCulturalWisdom] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [apiCalls, setApiCalls] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const API_BASE = 'https://builder.empromptu.ai/api_tools';
  const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer c6303bcc8941b627ba1b32398f9cf214',
    'X-Generated-App-ID': 'ea635350-c7ed-4628-847a-4eb10ad33ffc',
    'X-Usage-Key': '75582975e7a6c43504f1962005902a95'
  };

  // AI Companion Personalities
  const companions = {
    nganga: {
      id: 'nganga',
      name: 'Nganga Kala',
      title: 'Traditional Healer & Wisdom Keeper',
      avatar: 'ð¿',
      color: 'from-green-600 to-emerald-600',
      description: 'Ancient wisdom keeper who guides through traditional healing and spiritual practices',
      personality: 'Wise, patient, deeply connected to ancestral knowledge',
      specialties: ['Traditional healing', 'Spiritual guidance', 'Ancestral wisdom', 'Ritual practices'],
      greeting: 'Mbote, mwana. I am Nganga Kala, keeper of the ancient ways. The ancestors whisper your name with love.',
      culturalElements: ['Bantu-Kongo healing traditions', 'Plant medicine wisdom', 'Ancestral communication'],
      language: 'Speaks with traditional proverbs and ancestral references'
    },
    elder: {
      id: 'elder',
      name: 'Mama Nzinga',
      title: 'Community Elder & Life Guide',
      avatar: 'ðµð¿',
      color: 'from-amber-600 to-orange-600',
      description: 'Experienced community elder who offers practical wisdom and life guidance',
      personality: 'Nurturing, practical, community-focused, storyteller',
      specialties: ['Life experience', 'Community wisdom', 'Practical guidance', 'Family dynamics'],
      greeting: 'Welcome, child. I am Mama Nzinga. Come, sit with me and share what weighs on your heart.',
      culturalElements: ['Community storytelling', 'Practical life wisdom', 'Intergenerational knowledge'],
      language: 'Uses storytelling and community-centered language'
    },
    peer: {
      id: 'peer',
      name: 'Kesi',
      title: 'Peer Companion & Journey Friend',
      avatar: 'ð¤',
      color: 'from-blue-600 to-cyan-600',
      description: 'Supportive peer companion walking a similar path of growth and healing',
      personality: 'Empathetic, relatable, encouraging, contemporary',
      specialties: ['Peer support', 'Shared experiences', 'Modern challenges', 'Emotional support'],
      greeting: 'Hey there! I\'m Kesi, and I\'m walking this journey too. What\'s on your mind today?',
      culturalElements: ['Contemporary African experience', 'Peer-to-peer support', 'Modern cultural navigation'],
      language: 'Contemporary, relatable, with cultural awareness'
    },
    guide: {
      id: 'guide',
      name: 'Thoth-Ankh',
      title: 'Cultural Guide & Knowledge Keeper',
      avatar: 'ð',
      color: 'from-purple-600 to-indigo-600',
      description: 'Cultural guide specializing in traditional knowledge and ancestral wisdom',
      personality: 'Scholarly, reverent, educational, bridge-builder',
      specialties: ['Cultural education', 'Traditional knowledge', 'Ancestral practices', 'Wisdom integration'],
      greeting: 'Greetings, seeker of wisdom. I am Thoth-Ankh, guardian of cultural knowledge. How may I illuminate your path?',
      culturalElements: ['Egyptian wisdom traditions', 'Cultural preservation', 'Knowledge transmission'],
      language: 'Educational, reverent, with deep cultural context'
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

  // Initialize the system
  useEffect(() => {
    initializeVoiceChatSystem();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation]);

  const initializeVoiceChatSystem = async () => {
    try {
      // Initialize cultural conversation patterns
      await apiCall('/input_data', 'POST', {
        created_object_name: "cultural_conversation_patterns",
        data_type: "strings",
        input_data: [
          `BANTU-KONGO CONVERSATION PROTOCOLS:

          Traditional Greetings and Openings:
          - "Mbote" (Hello/Peace) - Universal greeting expressing peace and goodwill
          - "Mbote na yo" (Peace to you) - Formal respectful greeting
          - "Sango nini?" (What news?) - Inquiry about wellbeing and community
          - Ancestral acknowledgment: "Bakulu ba longa" (The ancestors are watching)
          - Community connection: "Beto moko" (We are one) - Unity expression

          Conversation Flow Patterns:
          1. Opening: Greet with peace, acknowledge ancestors, inquire about wellbeing
          2. Listening: "Yoka malamu" (Listen well) - Deep, respectful listening
          3. Wisdom Sharing: Reference traditional proverbs and ancestral knowledge
          4. Community Integration: Connect individual experience to community healing
          5. Closing: Offer blessings, encourage continued growth, maintain connection

          Cultural Expression Recognition:
          - Emotional expressions through traditional metaphors
          - Community-centered language patterns
          - Ancestral reference integration
          - Spiritual and practical wisdom balance
          - Respectful inquiry about cultural background`,

          `THERAPEUTIC CONVERSATION INTEGRATION:

          Dikenga Stage-Appropriate Responses:
          Kala (Dawn/Beginning): Focus on hope, new possibilities, intention setting
          - Language: "Ntangu ya sika" (New time), "Luzolo lua sika" (New love/beginning)
          - Approach: Gentle encouragement, vision clarification, foundation building

          Tukula (Noon/Power): Emphasize strength, leadership, community contribution
          - Language: "Nguzu ya yo" (Your strength), "Sala malamu" (Do good work)
          - Approach: Empowerment, responsibility, service orientation

          Luvemba (Sunset/Release): Support through difficulty, transformation, letting go
          - Language: "Kufa ye buzinga" (Death and resurrection), "Bika bilumbu" (Release the past)
          - Approach: Compassionate support, courage building, transformation guidance

          Musoni (Midnight/Renewal): Deep wisdom, ancestral connection, preparation
          - Language: "Bakulu ba yebisa" (Ancestors teach), "Mayele ma kala" (Ancient wisdom)
          - Approach: Contemplative guidance, wisdom integration, renewal preparation

          Seven Bodies Integration in Dialogue:
          - Physical: "Nitu ya yo ezali ndenge nini?" (How is your body?)
          - Etheric: "Nguzu ya bomoi" (Life force energy)
          - Astral: "Mayoki ma yo" (Your feelings/emotions)
          - Mental: "Makanisi ma yo" (Your thoughts)
          - Causal: "Nzela ya bomoi" (Life path/soul journey)
          - Buddhic: "Mayele ma nkisi" (Sacred wisdom)
          - Atmic: "Kimosi na Nzambi" (Unity with Divine)`,

          `CRISIS INTERVENTION AND CULTURAL SENSITIVITY:

          Crisis Recognition Patterns:
          - Direct expressions of distress in cultural context
          - Traditional metaphors for emotional pain
          - Community disconnection indicators
          - Spiritual crisis expressions
          - Ancestral disconnection concerns

          Cultural Sensitivity Protocols:
          - Respect for traditional healing practices
          - Integration of modern and traditional approaches
          - Community-centered support suggestions
          - Ancestral wisdom integration
          - Cultural identity affirmation

          Therapeutic Response Patterns:
          - Validate cultural experience and expression
          - Integrate traditional wisdom with modern support
          - Emphasize community connection and support
          - Honor ancestral guidance and wisdom
          - Provide culturally appropriate resources and practices`
        ]
      });

      // Generate companion conversation capabilities
      await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["companion_conversation_system"],
        prompt_string: `Based on these cultural conversation patterns: {cultural_conversation_patterns}, create a comprehensive conversation system for the AI companions:

1. COMPANION-SPECIFIC CONVERSATION STYLES:
   - Nganga Kala: Traditional healer approach with ancestral wisdom
   - Mama Nzinga: Community elder with practical life guidance
   - Kesi: Peer companion with contemporary cultural awareness
   - Thoth-Ankh: Cultural guide with educational focus

2. CONVERSATION FLOW TEMPLATES:
   - Opening protocols for each companion type
   - Assessment techniques appropriate to each personality
   - Guidance delivery methods matching companion style
   - Action recommendation approaches
   - Closing rituals and encouragement

3. CULTURAL EXPRESSION RECOGNITION:
   - Traditional metaphors and their meanings
   - Emotional expressions in cultural context
   - Community-centered language patterns
   - Spiritual and ancestral references
   - Crisis indicators in cultural expressions

4. RESPONSE GENERATION FRAMEWORKS:
   - Culturally appropriate language patterns
   - Wisdom integration techniques
   - Community connection suggestions
   - Therapeutic intervention approaches
   - Progress tracking integration

Format as JSON with clear templates and examples for each companion type.`,
        inputs: [
          {
            input_object_name: "cultural_conversation_patterns",
            mode: "combine_events"
          }
        ]
      });

      const conversationResult = await apiCall('/return_data', 'POST', {
        object_name: "companion_conversation_system",
        return_type: "json"
      });

      try {
        const parsedWisdom = JSON.parse(conversationResult.value[0]);
        setCulturalWisdom(parsedWisdom);
      } catch (parseError) {
        console.error('Error parsing conversation data:', parseError);
        setCulturalWisdom(createFallbackConversationData());
      }

      // Initialize user profile
      setUserProfile({
        id: 'demo_user',
        name: 'Seeker',
        preferredCompanion: 'nganga',
        culturalBackground: 'exploring',
        conversationHistory: [],
        currentDikengaStage: 'kala',
        sevenBodiesState: {
          physical: 3, etheric: 3, astral: 3, mental: 3,
          causal: 2, buddhic: 2, atmic: 1
        }
      });

    } catch (error) {
      console.error('Error initializing voice chat system:', error);
      setCulturalWisdom(createFallbackConversationData());
      setUserProfile({
        id: 'demo_user',
        name: 'Seeker',
        preferredCompanion: 'nganga',
        culturalBackground: 'exploring',
        conversationHistory: [],
        currentDikengaStage: 'kala',
        sevenBodiesState: { physical: 3, etheric: 3, astral: 3, mental: 3, causal: 2, buddhic: 2, atmic: 1 }
      });
    }
  };

  const createFallbackConversationData = () => ({
    companionStyles: {
      nganga: {
        openingTemplates: [
          "Mbote, mwana. The ancestors whisper your name with love. What brings you to seek wisdom today?",
          "Peace be with you, child. I feel the spirits stirring around you. Share what weighs on your heart."
        ],
        responsePatterns: [
          "The ancient ones say...",
          "In the old ways, we understand...",
          "The spirits guide us to see..."
        ]
      },
      elder: {
        openingTemplates: [
          "Welcome, child. Come sit with me and share what's on your mind.",
          "I see you carry something heavy today. Let Mama Nzinga help you with this burden."
        ],
        responsePatterns: [
          "In my years, I have learned...",
          "The community teaches us...",
          "Let me share a story..."
        ]
      },
      peer: {
        openingTemplates: [
          "Hey there! I'm walking this journey too. What's going on with you today?",
          "Good to see you again! How are you feeling about everything?"
        ],
        responsePatterns: [
          "I totally get that...",
          "I've been there too...",
          "We're in this together..."
        ]
      },
      guide: {
        openingTemplates: [
          "Greetings, seeker of wisdom. How may I illuminate your path today?",
          "Welcome to the space of learning. What knowledge do you seek?"
        ],
        responsePatterns: [
          "The traditions teach us...",
          "Ancient wisdom shows...",
          "Cultural understanding reveals..."
        ]
      }
    }
  });

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Simulate voice level animation
      const levelInterval = setInterval(() => {
        setVoiceLevel(Math.random() * 100);
      }, 100);

      setTimeout(() => {
        clearInterval(levelInterval);
      }, 5000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access required for voice input');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setVoiceLevel(0);
    }
  };

  const processVoiceInput = async (audioBlob) => {
    setIsProcessing(true);
    
    try {
      // Simulate voice-to-text processing
      // In a real implementation, this would use a speech recognition API
      const simulatedTranscription = "I'm feeling overwhelmed with everything going on in my life right now.";
      
      // Process the transcribed text as a regular message
      await handleSendMessage(simulatedTranscription);
      
    } catch (error) {
      console.error('Error processing voice input:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Message Handling
  const handleSendMessage = async (messageText = inputText) => {
    if (!messageText.trim() || isProcessing) return;
    if (!selectedCompanion) {
      alert('Please select a companion first');
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setCurrentConversation(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      // Generate companion response
      const companionResponse = await generateCompanionResponse(messageText, selectedCompanion);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'companion',
        companion: selectedCompanion,
        content: companionResponse,
        timestamp: new Date().toISOString()
      };

      setCurrentConversation(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback response
      const fallbackMessage = {
        id: Date.now() + 1,
        type: 'companion',
        companion: selectedCompanion,
        content: {
          primary_message: "I hear you, and I'm here with you. Even when technology falters, the wisdom of our ancestors remains strong.",
          cultural_wisdom: "In times of difficulty, we remember: 'Kala muntu ka kufa te' - The human spirit never dies.",
          practical_guidance: ["Take a deep breath", "Remember you are not alone", "Trust in your inner strength"],
          blessing: "May the ancestors guide your steps forward."
        },
        timestamp: new Date().toISOString()
      };

      setCurrentConversation(prev => [...prev, fallbackMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCompanionResponse = async (userInput, companionId) => {
    const companion = companions[companionId];
    
    try {
      const responseGeneration = await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["companion_response"],
        prompt_string: `As ${companion.name}, the ${companion.title}, respond to this user message with your unique personality and cultural approach:

USER MESSAGE: "${userInput}"

COMPANION PROFILE:
- Name: ${companion.name}
- Personality: ${companion.personality}
- Specialties: ${companion.specialties.join(', ')}
- Cultural Elements: ${companion.culturalElements.join(', ')}
- Language Style: ${companion.language}

USER CONTEXT:
- Current Dikenga Stage: ${userProfile?.currentDikengaStage || 'kala'}
- Cultural Background: ${userProfile?.culturalBackground || 'exploring'}

Generate a response that includes:

1. PRIMARY_MESSAGE: Main response in your companion's voice and style (2-3 sentences)

2. CULTURAL_WISDOM: Relevant traditional wisdom, proverb, or ancestral guidance appropriate to your companion type

3. PRACTICAL_GUIDANCE: 2-3 specific, actionable suggestions that align with your companion's approach

4. EMOTIONAL_SUPPORT: Empathetic acknowledgment and encouragement in your companion's style

5. COMMUNITY_CONNECTION: Suggestion for community support or connection if appropriate

6. BLESSING: Traditional blessing or encouragement to close the interaction

Respond authentically as ${companion.name} would, using appropriate cultural expressions and maintaining your unique personality throughout.

Format as JSON with these exact keys: primary_message, cultural_wisdom, practical_guidance, emotional_support, community_connection, blessing`,
        inputs: [
          {
            input_object_name: "cultural_conversation_patterns",
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
        return generateFallbackResponse(userInput, companion);
      }

    } catch (error) {
      return generateFallbackResponse(userInput, companion);
    }
  };

  const generateFallbackResponse = (userInput, companion) => {
    const responses = culturalWisdom?.companionStyles?.[companion.id] || {};
    const openingTemplate = responses.openingTemplates?.[0] || companion.greeting;
    
    return {
      primary_message: `${openingTemplate} I hear the wisdom in your words and feel the strength of your spirit.`,
      cultural_wisdom: "As our ancestors say: 'Muntu moko te' - No person stands alone. We are all connected in the great circle of life.",
      practical_guidance: [
        "Take time to breathe deeply and center yourself",
        "Remember your connection to the community of ancestors and descendants",
        "Trust in your inner wisdom and strength"
      ],
      emotional_support: "Your feelings are valid and your journey is sacred. I walk with you in spirit.",
      community_connection: "Consider reaching out to trusted friends or community members who can support you.",
      blessing: "May the ancestors guide your path and fill your heart with peace. Beto moko - We are one."
    };
  };

  const startConversation = (companionId) => {
    setSelectedCompanion(companionId);
    setCurrentView('chat');
    
    // Add greeting message
    const companion = companions[companionId];
    const greetingMessage = {
      id: Date.now(),
      type: 'companion',
      companion: companionId,
      content: {
        primary_message: companion.greeting,
        cultural_wisdom: "Welcome to this sacred space of healing and growth.",
        practical_guidance: ["Share what brings you here today", "Speak from your heart", "Know that you are heard and valued"],
        blessing: "May our conversation bring you peace and clarity."
      },
      timestamp: new Date().toISOString()
    };

    setCurrentConversation([greetingMessage]);
  };

  // Component Views
  const ChatHomeView = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="glass-card p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Voice & Chat Companions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose your AI companion for culturally-aware therapeutic conversations
        </p>
      </div>

      {/* Companion Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(companions).map(([id, companion]) => (
          <div
            key={id}
            className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all group"
            onClick={() => startConversation(id)}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${companion.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {companion.avatar}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                  {companion.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {companion.title}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {companion.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {companion.specialties.slice(0, 3).map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/20 rounded-full text-xs text-gray-600 dark:text-gray-400"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <button className="primary-button w-full group-hover:bg-primary-600">
                  Start Conversation
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Conversations */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Recent Conversations
        </h2>
        
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">ð¬</div>
            <p>No conversations yet. Choose a companion above to begin your journey.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv, index) => (
              <div
                key={index}
                className="p-4 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${companions[conv.companion]?.color} flex items-center justify-center text-sm`}>
                      {companions[conv.companion]?.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {companions[conv.companion]?.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {conv.lastMessage}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(conv.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const ActiveChatView = () => {
    if (!selectedCompanion) return <ChatHomeView />;
    
    const companion = companions[selectedCompanion];

    return (
      <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
        {/* Chat Header */}
        <div className="glass-card p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('home')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              â Back
            </button>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${companion.color} flex items-center justify-center text-lg`}>
              {companion.avatar}
            </div>
            <div>
              <div className="font-bold text-gray-800 dark:text-white">{companion.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{companion.title}</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('voice')}
              className="glass-button p-2"
              title="Voice Input"
            >
              ð¤
            </button>
            <button
              onClick={() => setCurrentView('companion-profile')}
              className="glass-button p-2"
              title="Companion Info"
            >
              â¹ï¸
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {currentConversation.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md">
                <div className="flex items-center mb-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${companion.color} flex items-center justify-center text-sm mr-2`}>
                    {companion.avatar}
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{companion.name}</span>
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
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="glass-card p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Share what's on your heart..."
              className="glass-input flex-1"
              disabled={isProcessing}
            />
            <button
              type="button"
              onClick={() => setCurrentView('voice')}
              className="secondary-button px-4"
              disabled={isProcessing}
            >
              ð¤
            </button>
            <button
              type="submit"
              disabled={isProcessing || !inputText.trim()}
              className="primary-button px-6"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    );
  };

  const VoiceInputView = () => {
    const companion = companions[selectedCompanion];

    return (
      <div className="max-w-2xl mx-auto p-6 h-screen flex flex-col justify-center">
        <div className="glass-card p-8 text-center">
          <div className="mb-6">
            <button
              onClick={() => setCurrentView('chat')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
            >
              â Back to Chat
            </button>
            
            <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${companion?.color} flex items-center justify-center text-3xl mx-auto mb-4`}>
              {companion?.avatar}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Voice Input
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Speak naturally - {companion?.name} understands cultural expressions
            </p>
          </div>

          {/* Voice Visualization */}
          <div className="mb-8">
            <div className="relative w-64 h-32 mx-auto mb-4">
              <svg className="w-full h-full" viewBox="0 0 256 128">
                {/* Voice waveform visualization */}
                {Array.from({ length: 32 }, (_, i) => (
                  <rect
                    key={i}
                    x={i * 8}
                    y={64 - (isRecording ? Math.random() * voiceLevel * 0.6 : 0)}
                    width="6"
                    height={isRecording ? Math.random() * voiceLevel * 0.6 * 2 : 2}
                    fill={isRecording ? companion?.color.split(' ')[1] : '#ccc'}
                    className="transition-all duration-100"
                  />
                ))}
              </svg>
            </div>
            
            {isRecording && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Listening... Speak clearly and from your heart
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="space-y-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={isProcessing}
                className="primary-button w-full py-4 text-lg"
              >
                {isProcessing ? 'Processing...' : 'ð¤ Start Recording'}
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="danger-button w-full py-4 text-lg"
              >
                â¹ï¸ Stop Recording
              </button>
            )}
            
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Your voice is processed with cultural sensitivity and respect
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CompanionProfileView = () => {
    if (!selectedCompanion) return <ChatHomeView />;
    
    const companion = companions[selectedCompanion];

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="glass-card p-8">
          <button
            onClick={() => setCurrentView('chat')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
          >
            â Back to Chat
          </button>
          
          <div className="text-center mb-8">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${companion.color} flex items-center justify-center text-4xl mx-auto mb-4`}>
              {companion.avatar}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {companion.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {companion.title}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {companion.description}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Personality</h3>
              <p className="text-gray-700 dark:text-gray-300">{companion.personality}</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {companion.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/20 rounded-full text-sm text-gray-700 dark:text-gray-300"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Cultural Elements</h3>
              <ul className="space-y-1">
                {companion.culturalElements.map((element, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-500 mr-2">â¢</span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{element}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Communication Style</h3>
              <p className="text-gray-700 dark:text-gray-300">{companion.language}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MessageBubble = ({ message }) => {
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

    const companion = companions[message.companion];
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
            {content.primary_message && (
              <p className="text-gray-800 dark:text-white leading-relaxed">
                {content.primary_message}
              </p>
            )}

            {content.cultural_wisdom && (
              <div className="border-l-4 border-yellow-400 pl-3">
                <h5 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
                  ð Cultural Wisdom
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{content.cultural_wisdom}</p>
              </div>
            )}

            {content.practical_guidance && content.practical_guidance.length > 0 && (
              <div className="border-l-4 border-green-400 pl-3">
                <h5 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">
                  â¨ Practical Guidance
                </h5>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {content.practical_guidance.map((guidance, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">â¢</span>
                      {guidance}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {content.emotional_support && (
              <div className="border-l-4 border-blue-400 pl-3">
                <h5 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  ð Emotional Support
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{content.emotional_support}</p>
              </div>
            )}

            {content.community_connection && (
              <div className="border-l-4 border-purple-400 pl-3">
                <h5 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
                  ð¤ Community Connection
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{content.community_connection}</p>
              </div>
            )}

            {content.blessing && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-800 dark:text-white italic">
                  {content.blessing}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // API Debugger
  const ApiDebugger = () => {
    const [selectedCall, setSelectedCall] = useState(null);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Voice Chat Debug Console
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
                  API Calls ({apiCalls.length})
                </h3>
                {selectedCompanion && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Active Companion: {companions[selectedCompanion]?.name} | 
                    Messages: {currentConversation.length}
                  </div>
                )}
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
      {currentView === 'home' && <ChatHomeView />}
      {currentView === 'chat' && <ActiveChatView />}
      {currentView === 'voice' && <VoiceInputView />}
      {currentView === 'companion-profile' && <CompanionProfileView />}

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

export default VoiceChatInterface;
