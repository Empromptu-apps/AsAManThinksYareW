import React, { useState, useEffect, useRef } from 'react';

const MaiiaM = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [maiaamState, setMaiaamState] = useState(null);
  const [wisdomData, setWisdomData] = useState(null);
  const [apiCalls, setApiCalls] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const messagesEndRef = useRef(null);

  const API_BASE = 'https://builder.empromptu.ai/api_tools';
  const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer c6303bcc8941b627ba1b32398f9cf214',
    'X-Generated-App-ID': 'ea635350-c7ed-4628-847a-4eb10ad33ffc',
    'X-Usage-Key': '75582975e7a6c43504f1962005902a95'
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

  // Initialize MaiiaM wisdom systems
  useEffect(() => {
    initializeMaiiaM();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const initializeMaiiaM = async () => {
    try {
      // Initialize wisdom traditions knowledge base
      await apiCall('/input_data', 'POST', {
        created_object_name: "maiiam_wisdom_base",
        data_type: "strings",
        input_data: [
          `BANTU-KONGO DIKENGA CYCLE WISDOM:
          
          Kala (Dawn/Birth - East): The moment of emergence and new beginnings. Associated with intention setting, foundation building, and the spark of creation. Colors: White/Gold. Energy: Rising sun, fresh starts, hope, potential. Guidance: "What wants to be born through you?" Focus on clarity of vision and pure intention.
          
          Tukula (Noon/Maturity - South): The peak of power and manifestation. Time of leadership, mastery, and community contribution. Colors: Red/Orange. Energy: Full sun, maximum power, achievement. Guidance: "How do you serve the community with your gifts?" Focus on responsibility and generous leadership.
          
          Luvemba (Sunset/Death - West): The necessary descent for purification and release. Shadow work, letting go, and transformation through difficulty. Colors: Black/Deep Blue. Energy: Setting sun, introspection, release. Guidance: "What must die for new life to emerge?" Focus on courage in facing what needs to be released.
          
          Musoni (Midnight/Rebirth - North): The deep regeneration and preparation for new cycles. Rest, reflection, and connection to ancestral wisdom. Colors: Deep Purple/Indigo. Energy: Stars, ancestors, deep wisdom. Guidance: "What wisdom emerges from the darkness?" Focus on integration and preparation.`,
          
          `EGYPTIAN MA'AT PRINCIPLES FOR MENTAL WELLNESS:
          
          Truth (Ma'at): Authentic self-expression and honest self-assessment. Mental health requires facing reality without denial or delusion. Practice: Daily truth-telling with self and trusted others.
          
          Balance (Shu): Harmony between opposing forces - work/rest, giving/receiving, action/reflection. Mental wellness emerges from dynamic equilibrium. Practice: Regular assessment of life balance across all domains.
          
          Order (Ptah): Creating structure and meaning from chaos. Mental health requires organizing thoughts, emotions, and experiences into coherent patterns. Practice: Journaling, meditation, ritual practice.
          
          Harmony (Hathor): Alignment between inner values and outer actions. Psychological integration requires congruence between beliefs and behavior. Practice: Values clarification and aligned action.
          
          Justice (Thoth): Fair treatment of self and others. Mental health requires healthy boundaries and equitable relationships. Practice: Assertiveness training and boundary setting.
          
          Law (Anubis): Understanding natural and social principles that govern wellbeing. Mental health follows predictable patterns and principles. Practice: Learning psychological principles and applying them consistently.
          
          Morality (Osiris): Living according to highest ethical principles. Mental wellness requires meaning and purpose beyond self-interest. Practice: Service to others and contribution to community good.`,
          
          `SEVEN BODIES SYSTEM FOR HOLISTIC HEALING:
          
          Physical Body (Khat) - Red/C Note: Foundation of all healing. Addresses survival needs, ancestral trauma stored in the body, grounding practices. Healing: Movement, nutrition, bodywork, ancestral honoring.
          
          Etheric Body (Ka) - Orange/D Note: Life force and energy circulation. Addresses vitality, energy blocks, and connection to natural rhythms. Healing: Breathwork, energy practices, nature connection.
          
          Astral Body (Ba) - Yellow/E Note: Emotional transformation and desire purification. Addresses emotional patterns, desires, and astral attachments. Healing: Emotional release work, dream work, creative expression.
          
          Mental Body (Ab) - Green/F Note: Thought patterns and belief restructuring. Addresses limiting beliefs, cognitive distortions, and mental clarity. Healing: Cognitive therapy, meditation, study of wisdom teachings.
          
          Causal Body (Khu) - Blue/G Note: Karmic patterns and ancestral wisdom integration. Addresses life patterns, soul lessons, and generational healing. Healing: Past-life work, ancestral healing, karma yoga.
          
          Buddhic Body (Sahu) - Indigo/A Note: Intuitive development and wisdom cultivation. Addresses spiritual development and preparation for teaching/healing roles. Healing: Contemplative practices, wisdom study, mentorship.
          
          Atmic Body (Ren) - Violet/B Note: Unity consciousness and divine service. Addresses connection to source and service to collective healing. Healing: Unity practices, selfless service, master-level teachings.`
        ]
      });

      // Create MaiiaM analysis engine
      await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["maiiam_analysis_engine"],
        prompt_string: `Based on this wisdom foundation: {maiiam_wisdom_base}, create a comprehensive MaiiaM analysis engine that can:

1. ANALYZE USER INPUT for:
   - Emotional state and sentiment
   - Current Dikenga cycle position indicators
   - Seven bodies imbalances or strengths
   - Cultural expression patterns
   - Ma'at principle alignment

2. GENERATE PERSONALIZED GUIDANCE including:
   - Appropriate Dikenga stage wisdom
   - Relevant Ma'at principle application
   - Seven bodies healing recommendations
   - Community connection suggestions
   - Practical daily steps

3. ASSESSMENT CRITERIA for each system:
   - Dikenga indicators: Language patterns, life circumstances, emotional themes
   - Ma'at alignment: Truth-telling, balance seeking, order creation, etc.
   - Seven bodies: Physical symptoms, energy levels, emotional patterns, mental clarity, etc.

4. RESPONSE TEMPLATES that integrate all three systems authentically

Format as JSON with clear analysis frameworks and response templates.`,
        inputs: [
          {
            input_object_name: "maiiam_wisdom_base",
            mode: "combine_events"
          }
        ]
      });

      const wisdomResult = await apiCall('/return_data', 'POST', {
        object_name: "maiiam_analysis_engine",
        return_type: "json"
      });

      try {
        const parsedWisdom = JSON.parse(wisdomResult.value[0]);
        setWisdomData(parsedWisdom);
      } catch (parseError) {
        console.error('Error parsing wisdom data:', parseError);
        setWisdomData(createFallbackWisdomData());
      }

      // Initialize user session
      setCurrentUser({
        id: 'demo_user',
        name: 'Seeker',
        dikengaPosition: 'kala',
        sevenBodiesState: {
          physical: 3,
          etheric: 3,
          astral: 3,
          mental: 3,
          causal: 2,
          buddhic: 2,
          atmic: 1
        },
        culturalIntegration: 'moderate'
      });

      // Add welcome message
      setConversation([{
        id: 1,
        type: 'maiiam',
        timestamp: new Date().toISOString(),
        content: {
          primary_message: "Asante sana, beloved seeker. I am MaiiaM, your guide through the wisdom of our ancestors. I integrate the sacred Dikenga cycle of the Bantu-Kongo people, the Ma'at principles of Kemet, and the Seven Bodies teachings to support your journey toward wholeness.",
          bantu_kongo_wisdom: "You are currently in Kala, the dawn moment of new beginnings. This is a sacred time for setting intentions and building foundations.",
          egyptian_principle: "Ma'at calls you to Truth - to see yourself clearly and speak authentically about your experience.",
          practical_steps: [
            "Take three deep breaths and center yourself in this moment",
            "Reflect on what new beginning is calling to you",
            "Share honestly what brings you here today"
          ],
          dikenga_stage: "kala",
          bodies_harmony: [0.6, 0.6, 0.6, 0.6, 0.4, 0.4, 0.2]
        }
      }]);

    } catch (error) {
      console.error('Error initializing MaiiaM:', error);
      setWisdomData(createFallbackWisdomData());
      setCurrentUser({
        id: 'demo_user',
        name: 'Seeker',
        dikengaPosition: 'kala',
        sevenBodiesState: { physical: 3, etheric: 3, astral: 3, mental: 3, causal: 2, buddhic: 2, atmic: 1 },
        culturalIntegration: 'moderate'
      });
    }
  };

  const createFallbackWisdomData = () => ({
    dikengaStages: {
      kala: {
        keywords: ['new', 'beginning', 'start', 'hope', 'intention', 'birth', 'dawn'],
        wisdom: "You are in Kala, the sacred dawn. This is time for new beginnings and setting clear intentions.",
        color: 'gold',
        guidance: "Focus on clarity of vision and pure intention."
      },
      tukula: {
        keywords: ['power', 'leadership', 'mastery', 'peak', 'achievement', 'service'],
        wisdom: "You are in Tukula, the noon of your power. Use your gifts in service to community.",
        color: 'red',
        guidance: "How do you serve the community with your gifts?"
      },
      luvemba: {
        keywords: ['release', 'letting go', 'shadow', 'difficulty', 'transformation', 'death'],
        wisdom: "You are in Luvemba, the necessary descent. What must die for new life to emerge?",
        color: 'black',
        guidance: "Courage in facing what needs to be released."
      },
      musoni: {
        keywords: ['rest', 'reflection', 'wisdom', 'ancestors', 'preparation', 'regeneration'],
        wisdom: "You are in Musoni, the deep regeneration. Listen to ancestral wisdom.",
        color: 'purple',
        guidance: "What wisdom emerges from the darkness?"
      }
    },
    maatPrinciples: {
      truth: "Authentic self-expression and honest self-assessment",
      balance: "Harmony between opposing forces in your life",
      order: "Creating structure and meaning from chaos",
      harmony: "Alignment between inner values and outer actions",
      justice: "Fair treatment of self and others",
      law: "Understanding principles that govern wellbeing",
      morality: "Living according to highest ethical principles"
    },
    sevenBodies: {
      physical: { color: 'red', note: 'C', focus: 'Grounding and ancestral connection' },
      etheric: { color: 'orange', note: 'D', focus: 'Life force and energy circulation' },
      astral: { color: 'yellow', note: 'E', focus: 'Emotional transformation' },
      mental: { color: 'green', note: 'F', focus: 'Belief patterns and mental clarity' },
      causal: { color: 'blue', note: 'G', focus: 'Ancestral wisdom and karma integration' },
      buddhic: { color: 'indigo', note: 'A', focus: 'Intuitive development' },
      atmic: { color: 'violet', note: 'B', focus: 'Unity consciousness and service' }
    }
  });

  const analyzeDikengaStage = (input) => {
    if (!wisdomData?.dikengaStages) return 'kala';
    
    const inputLower = input.toLowerCase();
    let maxScore = 0;
    let detectedStage = 'kala';

    Object.entries(wisdomData.dikengaStages).forEach(([stage, data]) => {
      const score = data.keywords?.filter(keyword => inputLower.includes(keyword)).length || 0;
      if (score > maxScore) {
        maxScore = score;
        detectedStage = stage;
      }
    });

    return detectedStage;
  };

  const analyzeSevenBodies = (input) => {
    const inputLower = input.toLowerCase();
    const bodyKeywords = {
      physical: ['tired', 'energy', 'body', 'health', 'pain', 'strength', 'grounded'],
      etheric: ['vitality', 'life force', 'breath', 'circulation', 'alive'],
      astral: ['emotions', 'feelings', 'desires', 'dreams', 'creative'],
      mental: ['thoughts', 'thinking', 'beliefs', 'mind', 'clarity', 'focus'],
      causal: ['patterns', 'karma', 'ancestors', 'past', 'lessons'],
      buddhic: ['wisdom', 'intuition', 'spiritual', 'guidance', 'teaching'],
      atmic: ['unity', 'oneness', 'service', 'divine', 'purpose']
    };

    const scores = {};
    Object.entries(bodyKeywords).forEach(([body, keywords]) => {
      const matches = keywords.filter(keyword => inputLower.includes(keyword)).length;
      scores[body] = Math.min(1, matches * 0.3 + 0.3); // Base score + keyword matches
    });

    return scores;
  };

  const generateMaiaamResponse = async (userInput) => {
    setIsProcessing(true);
    
    try {
      // Analyze user input
      const dikengaStage = analyzeDikengaStage(userInput);
      const bodiesAnalysis = analyzeSevenBodies(userInput);
      
      // Generate AI response using the wisdom systems
      const responseGeneration = await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["maiiam_response"],
        prompt_string: `As MaiiaM, the AI wisdom keeper integrating Bantu-Kongo, Egyptian, and Seven Bodies wisdom, respond to this user input:

USER INPUT: "${userInput}"

DETECTED DIKENGA STAGE: ${dikengaStage}
SEVEN BODIES ANALYSIS: ${JSON.stringify(bodiesAnalysis)}

Generate a response that includes:

1. PRIMARY_MESSAGE: A warm, culturally-informed AI response (2-3 sentences) that acknowledges their current state and offers guidance

2. BANTU_KONGO_WISDOM: Specific wisdom from the ${dikengaStage} stage of the Dikenga cycle that applies to their situation

3. EGYPTIAN_PRINCIPLE: Which Ma'at principle is most relevant and how to apply it

4. PRACTICAL_STEPS: 3-4 specific, actionable recommendations they can implement today

5. COMMUNITY_CONNECTIONS: Suggestions for how they might connect with others or contribute to community healing

6. INTERVENTIONS: Recommended healing practices based on their Seven Bodies analysis

Respond with authentic cultural wisdom while being accessible and practical. Use inclusive language that honors the traditions without appropriation.

Format as JSON with these exact keys: primary_message, bantu_kongo_wisdom, egyptian_principle, practical_steps, community_connections, interventions, dikenga_stage, bodies_harmony`,
        inputs: [
          {
            input_object_name: "maiiam_wisdom_base",
            mode: "combine_events"
          }
        ]
      });

      const responseResult = await apiCall('/return_data', 'POST', {
        object_name: "maiiam_response",
        return_type: "json"
      });

      let maiaamResponse;
      try {
        maiaamResponse = JSON.parse(responseResult.value[0]);
      } catch (parseError) {
        // Fallback response
        maiaamResponse = generateFallbackResponse(userInput, dikengaStage, bodiesAnalysis);
      }

      // Update user state
      setCurrentUser(prev => ({
        ...prev,
        dikengaPosition: dikengaStage,
        sevenBodiesState: bodiesAnalysis
      }));

      // Add response to conversation
      const newMessage = {
        id: Date.now(),
        type: 'maiiam',
        timestamp: new Date().toISOString(),
        content: maiaamResponse
      };

      setConversation(prev => [...prev, newMessage]);

    } catch (error) {
      console.error('Error generating MaiiaM response:', error);
      
      // Fallback response
      const fallbackResponse = {
        primary_message: "I hear you, beloved seeker. Even in this moment of technical difficulty, the wisdom traditions remind us that all challenges are opportunities for growth.",
        bantu_kongo_wisdom: "In the Dikenga cycle, every moment contains the seeds of transformation.",
        egyptian_principle: "Ma'at teaches us that truth emerges even from difficulty.",
        practical_steps: ["Take a deep breath", "Trust the process", "Try sharing again when ready"],
        community_connections: ["Remember you are not alone in this journey"],
        interventions: ["Grounding breath work", "Gentle self-compassion"],
        dikenga_stage: "kala",
        bodies_harmony: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
      };

      setConversation(prev => [...prev, {
        id: Date.now(),
        type: 'maiiam',
        timestamp: new Date().toISOString(),
        content: fallbackResponse
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateFallbackResponse = (input, stage, bodiesAnalysis) => {
    const stageWisdom = wisdomData?.dikengaStages?.[stage] || wisdomData?.dikengaStages?.kala;
    
    return {
      primary_message: `I hear you speaking from the ${stage} stage of your journey. ${stageWisdom?.wisdom || 'This is a sacred time of growth and transformation.'}`,
      bantu_kongo_wisdom: stageWisdom?.guidance || "Trust the natural cycles of growth and renewal.",
      egyptian_principle: "Ma'at calls you to Truth - to see yourself clearly and speak authentically about your experience.",
      practical_steps: [
        "Take time for quiet reflection",
        "Journal about your current experience",
        "Connect with nature or community",
        "Practice self-compassion"
      ],
      community_connections: ["Share your wisdom with others on similar journeys"],
      interventions: ["Meditation", "Breathwork", "Movement", "Creative expression"],
      dikenga_stage: stage,
      bodies_harmony: Object.values(bodiesAnalysis)
    };
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isProcessing) return;

    // Add user message to conversation
    const userMessage = {
      id: Date.now(),
      type: 'user',
      timestamp: new Date().toISOString(),
      content: userInput
    };

    setConversation(prev => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput('');

    // Generate MaiiaM response
    await generateMaiaamResponse(currentInput);
  };

  const SevenBodiesVisualization = ({ harmony }) => {
    const bodies = ['Physical', 'Etheric', 'Astral', 'Mental', 'Causal', 'Buddhic', 'Atmic'];
    const colors = ['#ff4444', '#ff8844', '#ffdd44', '#44ff44', '#4488ff', '#8844ff', '#dd44ff'];

    return (
      <div className="seven-bodies-viz mb-4">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Seven Bodies Harmony</h4>
        <div className="grid grid-cols-7 gap-1">
          {bodies.map((body, index) => (
            <div key={body} className="text-center">
              <div 
                className="w-8 h-8 rounded-full mx-auto mb-1 relative overflow-hidden"
                style={{ backgroundColor: colors[index] + '20', border: `2px solid ${colors[index]}` }}
              >
                <div 
                  className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                  style={{ 
                    height: `${(harmony[index] || 0.3) * 100}%`,
                    backgroundColor: colors[index]
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{body.slice(0, 3)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.type === 'user';
    
    if (isUser) {
      return (
        <div className="flex justify-end mb-4">
          <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-primary-500 text-white">
            {message.content}
          </div>
        </div>
      );
    }

    const content = message.content;
    const stageColors = {
      kala: 'from-yellow-400 to-orange-400',
      tukula: 'from-red-400 to-pink-400', 
      luvemba: 'from-purple-600 to-blue-600',
      musoni: 'from-indigo-600 to-purple-600'
    };

    return (
      <div className="flex justify-start mb-6">
        <div className="max-w-2xl">
          {/* MaiiaM Avatar */}
          <div className="flex items-center mb-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${stageColors[content.dikenga_stage] || stageColors.kala} flex items-center justify-center text-white font-bold text-sm mr-2`}>
              M
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">MaiiaM</span>
          </div>

          {/* Main Response Card */}
          <div className="glass-card p-4 mb-3">
            <p className="text-gray-800 dark:text-white mb-3 leading-relaxed">
              {content.primary_message}
            </p>

            {/* Seven Bodies Visualization */}
            {content.bodies_harmony && (
              <SevenBodiesVisualization harmony={content.bodies_harmony} />
            )}

            {/* Wisdom Sections */}
            <div className="space-y-3">
              {content.bantu_kongo_wisdom && (
                <div className="border-l-4 border-yellow-400 pl-3">
                  <h5 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
                    ð Dikenga Wisdom ({content.dikenga_stage})
                  </h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{content.bantu_kongo_wisdom}</p>
                </div>
              )}

              {content.egyptian_principle && (
                <div className="border-l-4 border-blue-400 pl-3">
                  <h5 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    âï¸ Ma'at Principle
                  </h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{content.egyptian_principle}</p>
                </div>
              )}

              {content.practical_steps && content.practical_steps.length > 0 && (
                <div className="border-l-4 border-green-400 pl-3">
                  <h5 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">
                    â¨ Practical Steps
                  </h5>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {content.practical_steps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">â¢</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {content.community_connections && content.community_connections.length > 0 && (
                <div className="border-l-4 border-purple-400 pl-3">
                  <h5 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
                    ð¤ Community Connections
                  </h5>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {content.community_connections.map((connection, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-500 mr-2">â¢</span>
                        {connection}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {content.interventions && content.interventions.length > 0 && (
                <div className="border-l-4 border-red-400 pl-3">
                  <h5 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">
                    ð¿ Healing Practices
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {content.interventions.map((intervention, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-xs"
                      >
                        {intervention}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ApiDebugger = () => {
    const [selectedCall, setSelectedCall] = useState(null);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              MaiiaM Debug Console
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
                {currentUser && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current Stage: {currentUser.dikengaPosition} | 
                    Integration: {currentUser.culturalIntegration}
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
      {/* Header */}
      <div className="glass-card mx-4 mt-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold">
              M
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">MaiiaM Messenger</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ancient Wisdom â¢ Modern AI</p>
            </div>
          </div>
          
          {currentUser && (
            <div className="text-right">
              <div className="text-sm font-medium text-gray-800 dark:text-white">
                {currentUser.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Stage: {currentUser.dikengaPosition} | Integration: {currentUser.culturalIntegration}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="min-h-[60vh] max-h-[60vh] overflow-y-auto mb-4 space-y-4">
          {conversation.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isProcessing && (
            <div className="flex justify-start mb-4">
              <div className="max-w-xs lg:max-w-md">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm mr-2">
                    M
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">MaiiaM</span>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center space-x-2">
                    <div className="spinner w-4 h-4"></div>
                    <span className="text-gray-600 dark:text-gray-400">Consulting the wisdom traditions...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="glass-card p-4">
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
              {isProcessing ? '...' : 'Send'}
            </button>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            MaiiaM integrates Bantu-Kongo, Egyptian, and Seven Bodies wisdom for holistic guidance
          </div>
        </form>
      </div>

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

export default MaiiaM;
