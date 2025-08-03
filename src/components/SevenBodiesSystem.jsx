import React, { useState, useEffect, useRef } from 'react';

const SevenBodiesSystem = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, assessment, daily-checkin, body-detail
  const [selectedBody, setSelectedBody] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [assessmentData, setAssessmentData] = useState({});
  const [dailyCheckins, setDailyCheckins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiCalls, setApiCalls] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const [culturalWisdom, setCulturalWisdom] = useState(null);

  const API_BASE = 'https://builder.empromptu.ai/api_tools';
  const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer c6303bcc8941b627ba1b32398f9cf214',
    'X-Generated-App-ID': 'ea635350-c7ed-4628-847a-4eb10ad33ffc',
    'X-Usage-Key': '75582975e7a6c43504f1962005902a95'
  };

  // Seven Bodies Configuration with Bantu-Kongo Integration
  const sevenBodies = {
    physical: {
      name: 'Physical Body',
      bantuKongo: 'Kala muntu (being human foundation)',
      color: '#ff4444',
      note: 'C',
      frequency: '256Hz',
      description: 'Foundation of human experience, ancestral connection through the body',
      focus: 'Physical health, energy levels, body awareness, ancestral embodiment',
      practices: ['Movement', 'Nutrition', 'Sleep', 'Ancestral honoring', 'Grounding'],
      culturalElements: ['Ancestral body wisdom', 'Traditional healing', 'Sacred movement']
    },
    etheric: {
      name: 'Etheric Body',
      bantuKongo: 'Ngolo ye minika (forces and vibrations)',
      color: '#ff8844',
      note: 'D',
      frequency: '288Hz',
      description: 'Energy field and vital force circulation',
      focus: 'Energy field strength, vitality, environmental sensitivity',
      practices: ['Breathwork', 'Energy practices', 'Nature connection', 'Rhythm work'],
      culturalElements: ['Vital force cultivation', 'Environmental harmony', 'Sacred breath']
    },
    astral: {
      name: 'Astral Body',
      bantuKongo: 'Luvemba domain (emotional purification)',
      color: '#ffdd44',
      note: 'E',
      frequency: '320Hz',
      description: 'Emotional transformation and purification realm',
      focus: 'Emotional patterns, processing capacity, ancestral emotions',
      practices: ['Emotional release', 'Dream work', 'Creative expression', 'Community healing'],
      culturalElements: ['Ancestral emotional healing', 'Community emotional work', 'Sacred expression']
    },
    mental: {
      name: 'Mental Body',
      bantuKongo: 'Kanga ye Kutula (tying/untying codes)',
      color: '#44ff44',
      note: 'F',
      frequency: '341Hz',
      description: 'Thought patterns and belief restructuring',
      focus: 'Thought patterns, beliefs, cultural programming',
      practices: ['Meditation', 'Study', 'Cognitive work', 'Cultural learning'],
      culturalElements: ['Ancestral wisdom study', 'Cultural deprogramming', 'Sacred knowledge']
    },
    causal: {
      name: 'Causal Body',
      bantuKongo: 'Ancestral realm connection',
      color: '#4488ff',
      note: 'G',
      frequency: '384Hz',
      description: 'Soul lessons and ancestral wisdom integration',
      focus: 'Soul lessons, karmic patterns, lineage healing',
      practices: ['Ancestral work', 'Soul retrieval', 'Lineage healing', 'Karma yoga'],
      culturalElements: ['Ancestral communication', 'Lineage healing', 'Soul purpose work']
    },
    buddhic: {
      name: 'Buddhic Body',
      bantuKongo: 'Nganga development (healer/master preparation)',
      color: '#8844ff',
      note: 'A',
      frequency: '426Hz',
      description: 'Intuitive development and healing capacity',
      focus: 'Intuitive abilities, spiritual gifts, healing capacity',
      practices: ['Intuitive development', 'Healing practice', 'Spiritual study', 'Service'],
      culturalElements: ['Nganga preparation', 'Healing gift development', 'Community service']
    },
    atmic: {
      name: 'Atmic Body',
      bantuKongo: 'Kala nganga (master consciousness)',
      color: '#dd44ff',
      note: 'B',
      frequency: '480Hz',
      description: 'Unity consciousness and divine service',
      focus: 'Unity awareness, divine connection, service capacity',
      practices: ['Unity practices', 'Divine connection', 'Master teaching', 'Collective service'],
      culturalElements: ['Master consciousness', 'Divine service', 'Collective healing']
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
    initializeSevenBodiesSystem();
  }, []);

  const initializeSevenBodiesSystem = async () => {
    setIsLoading(true);
    
    try {
      // Create comprehensive assessment questions
      await apiCall('/input_data', 'POST', {
        created_object_name: "seven_bodies_wisdom",
        data_type: "strings",
        input_data: [
          `SEVEN BODIES BANTU-KONGO INTEGRATION:

          Physical Body (Kala muntu - Red/C/256Hz):
          Foundation of human experience. In Bantu-Kongo tradition, the physical body is the vessel for ancestral wisdom and the foundation of spiritual development. Assessment focuses on: Physical health and vitality, ancestral body wisdom connection, grounding and earth connection, traditional healing practices integration, sacred movement and dance.

          Etheric Body (Ngolo ye minika - Orange/D/288Hz):
          The vital force and energy circulation system. Represents the life force (ngolo) and vibrational patterns (minika) that animate the physical form. Assessment focuses on: Energy field strength and clarity, vital force circulation, environmental sensitivity and harmony, breath and rhythm practices, connection to natural forces.

          Astral Body (Luvemba domain - Yellow/E/320Hz):
          The emotional purification realm associated with the Luvemba stage of the Dikenga cycle. This is where emotional transformation and ancestral emotional healing occurs. Assessment focuses on: Emotional processing capacity, ancestral emotional patterns, creative expression abilities, dream work and vision, community emotional healing participation.

          Mental Body (Kanga ye Kutula - Green/F/341Hz):
          The realm of tying and untying mental codes and patterns. Represents the ability to restructure thought patterns and beliefs, especially cultural programming. Assessment focuses on: Thought pattern awareness, belief system flexibility, cultural programming recognition, wisdom tradition study, mental clarity and focus.

          Causal Body (Ancestral realm - Blue/G/384Hz):
          Direct connection to ancestral wisdom and soul lessons. This body holds karmic patterns and lineage information that guides soul development. Assessment focuses on: Ancestral connection strength, soul lesson awareness, karmic pattern recognition, lineage healing capacity, intergenerational wisdom access.

          Buddhic Body (Nganga development - Indigo/A/426Hz):
          The preparation realm for becoming a healer/master (Nganga). Develops intuitive abilities and healing capacity for community service. Assessment focuses on: Intuitive development level, healing gift recognition, spiritual teaching capacity, community service orientation, wisdom integration ability.

          Atmic Body (Kala nganga - Violet/B/480Hz):
          Master consciousness and unity awareness. Represents the fully developed spiritual master who serves the collective healing and evolution. Assessment focuses on: Unity consciousness experiences, divine connection strength, collective service capacity, master teaching ability, universal love expression.`,

          `ASSESSMENT QUESTION FRAMEWORKS:

          COMPREHENSIVE ASSESSMENT (20-30 questions per body):
          Each body requires deep evaluation across multiple dimensions including current state, developmental history, cultural integration, practice engagement, and growth potential.

          DAILY CHECK-IN QUESTIONS (3-5 key questions):
          Quick pulse-check questions that track daily fluctuations and provide ongoing monitoring of each body's state and needs.

          WEEKLY PROGRESS REVIEWS:
          Integration questions that assess how the seven bodies are working together and what adjustments are needed in practice and focus.

          MONTHLY COMPREHENSIVE RE-ASSESSMENT:
          Full re-evaluation that tracks long-term development and adjusts the overall development plan.

          CULTURAL INTEGRATION TRACKING:
          Specific questions that assess how well the user is integrating Bantu-Kongo wisdom principles into their seven bodies development.`
        ]
      });

      // Generate comprehensive assessment questions
      await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["seven_bodies_assessment_questions"],
        prompt_string: `Based on this Seven Bodies wisdom: {seven_bodies_wisdom}, create a comprehensive assessment system with:

1. INITIAL COMPREHENSIVE ASSESSMENT:
   - 25 questions per body (175 total)
   - Each question should assess current state, cultural integration, and development potential
   - Include Bantu-Kongo cultural elements appropriately
   - Use 5-point scales with culturally relevant descriptors

2. DAILY CHECK-IN QUESTIONS:
   - 4 key questions per body (28 total)
   - Quick assessment of current state and needs
   - Focus on practical daily experience

3. WEEKLY PROGRESS QUESTIONS:
   - Integration questions that assess harmony between bodies
   - Cultural wisdom integration assessment
   - Practice effectiveness evaluation

4. MONTHLY RE-ASSESSMENT:
   - Abbreviated version of comprehensive assessment
   - Focus on growth and development tracking
   - Adjustment recommendations

Format as JSON with clear structure for each assessment type, including question text, scale descriptors, cultural context, and scoring methodology.`,
        inputs: [
          {
            input_object_name: "seven_bodies_wisdom",
            mode: "combine_events"
          }
        ]
      });

      const assessmentResult = await apiCall('/return_data', 'POST', {
        object_name: "seven_bodies_assessment_questions",
        return_type: "json"
      });

      try {
        const parsedAssessment = JSON.parse(assessmentResult.value[0]);
        setCulturalWisdom(parsedAssessment);
      } catch (parseError) {
        console.error('Error parsing assessment data:', parseError);
        setCulturalWisdom(createFallbackAssessmentData());
      }

      // Initialize user profile
      setUserProfile({
        id: 'demo_user',
        name: 'Seeker',
        assessmentHistory: [],
        currentScores: generateInitialScores(),
        culturalIntegration: 'moderate',
        lastAssessment: null,
        dailyCheckinStreak: 0
      });

    } catch (error) {
      console.error('Error initializing Seven Bodies system:', error);
      setCulturalWisdom(createFallbackAssessmentData());
      setUserProfile({
        id: 'demo_user',
        name: 'Seeker',
        assessmentHistory: [],
        currentScores: generateInitialScores(),
        culturalIntegration: 'moderate',
        lastAssessment: null,
        dailyCheckinStreak: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createFallbackAssessmentData = () => ({
    comprehensiveAssessment: {
      physical: [
        { question: "How would you rate your overall physical health and vitality?", scale: ["Very Poor", "Poor", "Fair", "Good", "Excellent"], cultural: "Connection to ancestral body wisdom" },
        { question: "How connected do you feel to your ancestral lineage through your physical body?", scale: ["Not at all", "Slightly", "Moderately", "Strongly", "Deeply"], cultural: "Kala muntu foundation" },
        { question: "How often do you engage in movement practices that honor your body?", scale: ["Never", "Rarely", "Sometimes", "Often", "Daily"], cultural: "Sacred movement integration" }
      ],
      etheric: [
        { question: "How aware are you of your energy field and vital force?", scale: ["Unaware", "Slightly aware", "Moderately aware", "Very aware", "Highly sensitive"], cultural: "Ngolo ye minika awareness" },
        { question: "How well do you maintain your energy boundaries?", scale: ["Very poorly", "Poorly", "Adequately", "Well", "Excellently"], cultural: "Energy field protection" },
        { question: "How connected do you feel to natural rhythms and cycles?", scale: ["Disconnected", "Slightly connected", "Moderately connected", "Well connected", "Deeply attuned"], cultural: "Natural force harmony" }
      ],
      astral: [
        { question: "How effectively do you process and transform emotions?", scale: ["Very poorly", "Poorly", "Adequately", "Well", "Excellently"], cultural: "Luvemba purification work" },
        { question: "How connected are you to your creative expression?", scale: ["Not at all", "Slightly", "Moderately", "Strongly", "Deeply"], cultural: "Sacred creative expression" },
        { question: "How well do you work with dreams and visions?", scale: ["Not at all", "Rarely", "Sometimes", "Often", "Regularly"], cultural: "Visionary capacity development" }
      ],
      mental: [
        { question: "How aware are you of your thought patterns and beliefs?", scale: ["Unaware", "Slightly aware", "Moderately aware", "Very aware", "Highly conscious"], cultural: "Kanga ye Kutula awareness" },
        { question: "How effectively can you restructure limiting beliefs?", scale: ["Cannot", "With great difficulty", "With some effort", "Relatively easily", "Effortlessly"], cultural: "Mental code transformation" },
        { question: "How well do you integrate wisdom teachings into daily life?", scale: ["Not at all", "Minimally", "Moderately", "Well", "Excellently"], cultural: "Wisdom integration capacity" }
      ],
      causal: [
        { question: "How connected do you feel to your ancestral wisdom?", scale: ["Disconnected", "Slightly connected", "Moderately connected", "Well connected", "Deeply connected"], cultural: "Ancestral realm access" },
        { question: "How aware are you of your soul lessons and patterns?", scale: ["Unaware", "Slightly aware", "Moderately aware", "Very aware", "Highly conscious"], cultural: "Soul development awareness" },
        { question: "How actively do you engage in lineage healing work?", scale: ["Not at all", "Rarely", "Sometimes", "Often", "Regularly"], cultural: "Intergenerational healing" }
      ],
      buddhic: [
        { question: "How developed are your intuitive abilities?", scale: ["Undeveloped", "Slightly developed", "Moderately developed", "Well developed", "Highly developed"], cultural: "Nganga preparation" },
        { question: "How strong is your capacity for healing others?", scale: ["No capacity", "Minimal", "Moderate", "Strong", "Very strong"], cultural: "Healing gift development" },
        { question: "How prepared do you feel for spiritual teaching or guidance roles?", scale: ["Not prepared", "Slightly prepared", "Moderately prepared", "Well prepared", "Fully prepared"], cultural: "Spiritual leadership readiness" }
      ],
      atmic: [
        { question: "How often do you experience unity consciousness?", scale: ["Never", "Rarely", "Sometimes", "Often", "Regularly"], cultural: "Kala nganga consciousness" },
        { question: "How strong is your connection to divine source?", scale: ["No connection", "Weak", "Moderate", "Strong", "Profound"], cultural: "Divine connection strength" },
        { question: "How actively do you serve collective healing and evolution?", scale: ["Not at all", "Minimally", "Moderately", "Actively", "Completely dedicated"], cultural: "Master service orientation" }
      ]
    },
    dailyCheckins: {
      physical: [
        { question: "How is your physical energy today?", scale: ["Very low", "Low", "Moderate", "High", "Very high"] },
        { question: "How grounded do you feel?", scale: ["Ungrounded", "Slightly grounded", "Moderately grounded", "Well grounded", "Deeply rooted"] },
        { question: "How connected to your body do you feel?", scale: ["Disconnected", "Slightly connected", "Moderately connected", "Well connected", "Deeply embodied"] }
      ],
      etheric: [
        { question: "How is your energy field today?", scale: ["Depleted", "Low", "Balanced", "Strong", "Radiant"] },
        { question: "How sensitive are you to environmental energies?", scale: ["Overwhelmed", "Overly sensitive", "Balanced", "Protected", "Harmonious"] },
        { question: "How is your breath and life force?", scale: ["Restricted", "Shallow", "Normal", "Deep", "Flowing freely"] }
      ],
      astral: [
        { question: "How are you processing emotions today?", scale: ["Stuck", "Struggling", "Managing", "Flowing", "Transforming"] },
        { question: "How creative do you feel?", scale: ["Blocked", "Limited", "Moderate", "Inspired", "Highly creative"] },
        { question: "How connected to your desires are you?", scale: ["Disconnected", "Confused", "Aware", "Clear", "Aligned"] }
      ],
      mental: [
        { question: "How clear is your thinking today?", scale: ["Very foggy", "Foggy", "Moderate", "Clear", "Crystal clear"] },
        { question: "How focused can you be?", scale: ["Cannot focus", "Distracted", "Moderate focus", "Focused", "Laser focused"] },
        { question: "How aligned are your thoughts with your values?", scale: ["Misaligned", "Somewhat aligned", "Moderately aligned", "Well aligned", "Perfectly aligned"] }
      ],
      causal: [
        { question: "How connected to your life purpose do you feel?", scale: ["Lost", "Searching", "Somewhat clear", "Clear", "Deeply aligned"] },
        { question: "How aware are you of patterns in your life?", scale: ["Unaware", "Slightly aware", "Moderately aware", "Very aware", "Highly conscious"] },
        { question: "How connected to ancestral wisdom do you feel?", scale: ["Disconnected", "Slightly connected", "Moderately connected", "Well connected", "Deeply connected"] }
      ],
      buddhic: [
        { question: "How strong is your intuition today?", scale: ["Blocked", "Weak", "Moderate", "Strong", "Very strong"] },
        { question: "How much wisdom do you feel you have to share?", scale: ["None", "Little", "Some", "Much", "Abundant"] },
        { question: "How prepared do you feel to help others?", scale: ["Unprepared", "Slightly prepared", "Moderately prepared", "Well prepared", "Fully ready"] }
      ],
      atmic: [
        { question: "How connected to universal love do you feel?", scale: ["Disconnected", "Slightly connected", "Moderately connected", "Well connected", "Deeply connected"] },
        { question: "How much do you feel part of the greater whole?", scale: ["Isolated", "Slightly connected", "Moderately connected", "Well connected", "Unified"] },
        { question: "How motivated are you to serve others?", scale: ["Not motivated", "Slightly motivated", "Moderately motivated", "Highly motivated", "Completely dedicated"] }
      ]
    }
  });

  const generateInitialScores = () => {
    const scores = {};
    Object.keys(sevenBodies).forEach(body => {
      scores[body] = Math.random() * 2 + 2; // Random score between 2-4
    });
    return scores;
  };

  const calculateHarmonyScore = (scores) => {
    const values = Object.values(scores);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
    return Math.max(0, 1 - variance / 2); // Lower variance = higher harmony
  };

  // Harmony Wheel Component
  const HarmonyWheel = ({ scores, size = 300 }) => {
    const center = size / 2;
    const radius = size * 0.35;
    const bodies = Object.keys(sevenBodies);
    
    const points = bodies.map((body, index) => {
      const angle = (index * 2 * Math.PI) / bodies.length - Math.PI / 2;
      const score = scores[body] || 0;
      const distance = (score / 5) * radius;
      
      return {
        x: center + Math.cos(angle) * distance,
        y: center + Math.sin(angle) * distance,
        labelX: center + Math.cos(angle) * (radius + 30),
        labelY: center + Math.sin(angle) * (radius + 30),
        body,
        score,
        color: sevenBodies[body].color
      };
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    return (
      <div className="harmony-wheel-container">
        <svg width={size} height={size} className="harmony-wheel">
          {/* Background circles */}
          {[1, 2, 3, 4, 5].map(level => (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={(level / 5) * radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          ))}
          
          {/* Axis lines */}
          {bodies.map((body, index) => {
            const angle = (index * 2 * Math.PI) / bodies.length - Math.PI / 2;
            const endX = center + Math.cos(angle) * radius;
            const endY = center + Math.sin(angle) * radius;
            
            return (
              <line
                key={body}
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Harmony polygon */}
          <path
            d={pathData}
            fill="rgba(255,255,255,0.1)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
          
          {/* Body points */}
          {points.map(point => (
            <g key={point.body}>
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill={point.color}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:r-10 transition-all"
                onClick={() => setSelectedBody(point.body)}
              />
              <text
                x={point.labelX}
                y={point.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-current text-gray-700 dark:text-gray-300"
              >
                {sevenBodies[point.body].name.split(' ')[0]}
              </text>
            </g>
          ))}
          
          {/* Center harmony score */}
          <circle
            cx={center}
            cy={center}
            r="25"
            fill="rgba(255,255,255,0.9)"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="1"
          />
          <text
            x={center}
            y={center - 5}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-bold fill-current text-gray-800"
          >
            {(calculateHarmonyScore(scores) * 100).toFixed(0)}%
          </text>
          <text
            x={center}
            y={center + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-current text-gray-600"
          >
            Harmony
          </text>
        </svg>
      </div>
    );
  };

  // Dashboard View
  const DashboardView = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Seven Bodies Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Bantu-Kongo wisdom integration â¢ Holistic development tracking</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">Daily Check-in Streak</div>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {userProfile?.dailyCheckinStreak || 0} days
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setCurrentView('assessment')}
            className="primary-button text-left p-4"
          >
            <div className="text-lg font-semibold">ð Full Assessment</div>
            <div className="text-sm opacity-80">Comprehensive seven bodies evaluation</div>
          </button>
          <button
            onClick={() => setCurrentView('daily-checkin')}
            className="secondary-button text-left p-4"
          >
            <div className="text-lg font-semibold">âï¸ Daily Check-in</div>
            <div className="text-sm opacity-80">Quick daily state assessment</div>
          </button>
          <button
            onClick={() => setCurrentView('progress')}
            className="glass-button text-left p-4"
          >
            <div className="text-lg font-semibold">ð Progress Tracking</div>
            <div className="text-sm opacity-80">View development over time</div>
          </button>
        </div>
      </div>

      {/* Harmony Wheel */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
          Seven Bodies Harmony Wheel
        </h2>
        <div className="flex justify-center">
          <HarmonyWheel scores={userProfile?.currentScores || {}} />
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click on any body point to explore detailed information and practices
          </p>
        </div>
      </div>

      {/* Bodies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(sevenBodies).map(([key, body]) => {
          const score = userProfile?.currentScores?.[key] || 0;
          const percentage = (score / 5) * 100;
          
          return (
            <div
              key={key}
              className="glass-card p-4 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => {
                setSelectedBody(key);
                setCurrentView('body-detail');
              }}
            >
              <div className="flex items-center mb-3">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: body.color }}
                ></div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{body.name}</h3>
              </div>
              
              <div className="mb-2">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {body.bantuKongo}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {body.note} â¢ {body.frequency}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Current State</span>
                  <span className="font-medium text-gray-800 dark:text-white">{score.toFixed(1)}/5</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: body.color 
                    }}
                  ></div>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {body.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Assessment View
  const AssessmentView = () => {
    const [currentBodyIndex, setCurrentBodyIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState({});
    
    const bodyKeys = Object.keys(sevenBodies);
    const currentBodyKey = bodyKeys[currentBodyIndex];
    const currentBody = sevenBodies[currentBodyKey];
    const questions = culturalWisdom?.comprehensiveAssessment?.[currentBodyKey] || [];
    const currentQuestion = questions[currentQuestionIndex];
    
    const totalQuestions = bodyKeys.reduce((sum, key) => 
      sum + (culturalWisdom?.comprehensiveAssessment?.[key]?.length || 3), 0
    );
    const completedQuestions = Object.keys(responses).length;
    const progress = (completedQuestions / totalQuestions) * 100;

    const handleResponse = (value) => {
      const responseKey = `${currentBodyKey}_${currentQuestionIndex}`;
      setResponses(prev => ({
        ...prev,
        [responseKey]: {
          body: currentBodyKey,
          questionIndex: currentQuestionIndex,
          question: currentQuestion?.question,
          value: value + 1,
          scale: currentQuestion?.scale
        }
      }));

      // Move to next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (currentBodyIndex < bodyKeys.length - 1) {
        setCurrentBodyIndex(currentBodyIndex + 1);
        setCurrentQuestionIndex(0);
      } else {
        // Assessment complete
        processAssessmentResults(responses);
      }
    };

    const processAssessmentResults = async (responses) => {
      setIsLoading(true);
      
      try {
        // Calculate scores for each body
        const bodyScores = {};
        bodyKeys.forEach(bodyKey => {
          const bodyResponses = Object.values(responses).filter(r => r.body === bodyKey);
          const average = bodyResponses.reduce((sum, r) => sum + r.value, 0) / bodyResponses.length;
          bodyScores[bodyKey] = average;
        });

        // Update user profile
        setUserProfile(prev => ({
          ...prev,
          currentScores: bodyScores,
          lastAssessment: new Date().toISOString(),
          assessmentHistory: [...(prev.assessmentHistory || []), {
            date: new Date().toISOString(),
            scores: bodyScores,
            responses: responses
          }]
        }));

        setCurrentView('dashboard');
      } catch (error) {
        console.error('Error processing assessment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!currentQuestion) {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="glass-card p-8 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p>Loading assessment questions...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="glass-card p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Assessment Progress</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {completedQuestions} / {totalQuestions}
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Current Body */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div
                className="w-6 h-6 rounded-full mr-3"
                style={{ backgroundColor: currentBody.color }}
              ></div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {currentBody.name}
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {currentBody.bantuKongo}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {currentBody.note} â¢ {currentBody.frequency}
            </p>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              {currentQuestion.question}
            </h3>
            
            {currentQuestion.cultural && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Cultural Context:</strong> {currentQuestion.cultural}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {currentQuestion.scale?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleResponse(index)}
                  className="glass-button w-full text-left p-4 hover:bg-primary-100 dark:hover:bg-primary-900/20"
                >
                  <span className="font-medium">{index + 1}.</span> {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="secondary-button"
            >
              â Back to Dashboard
            </button>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length} â¢ {currentBody.name}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Daily Check-in View
  const DailyCheckinView = () => {
    const [responses, setResponses] = useState({});
    const [currentBodyIndex, setCurrentBodyIndex] = useState(0);
    
    const bodyKeys = Object.keys(sevenBodies);
    const currentBodyKey = bodyKeys[currentBodyIndex];
    const currentBody = sevenBodies[currentBodyKey];
    const questions = culturalWisdom?.dailyCheckins?.[currentBodyKey] || [];
    
    const handleResponse = (questionIndex, value) => {
      const responseKey = `${currentBodyKey}_${questionIndex}`;
      setResponses(prev => ({
        ...prev,
        [responseKey]: {
          body: currentBodyKey,
          questionIndex,
          value: value + 1
        }
      }));
    };

    const completeCheckin = async () => {
      setIsLoading(true);
      
      try {
        // Calculate daily scores
        const dailyScores = {};
        bodyKeys.forEach(bodyKey => {
          const bodyResponses = Object.values(responses).filter(r => r.body === bodyKey);
          if (bodyResponses.length > 0) {
            const average = bodyResponses.reduce((sum, r) => sum + r.value, 0) / bodyResponses.length;
            dailyScores[bodyKey] = average;
          }
        });

        // Update user profile
        setUserProfile(prev => ({
          ...prev,
          dailyCheckinStreak: (prev.dailyCheckinStreak || 0) + 1,
          currentScores: { ...prev.currentScores, ...dailyScores }
        }));

        // Add to daily checkins history
        setDailyCheckins(prev => [...prev, {
          date: new Date().toISOString(),
          scores: dailyScores,
          responses
        }]);

        setCurrentView('dashboard');
      } catch (error) {
        console.error('Error completing daily checkin:', error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Daily Check-in
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Quick assessment of your seven bodies state today
            </p>
          </div>

          {/* Body Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {bodyKeys.map((bodyKey, index) => (
              <button
                key={bodyKey}
                onClick={() => setCurrentBodyIndex(index)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentBodyIndex === index
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'
                }`}
                style={{
                  backgroundColor: currentBodyIndex === index ? sevenBodies[bodyKey].color : 'transparent'
                }}
              >
                {sevenBodies[bodyKey].name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Current Body Questions */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div
                className="w-6 h-6 rounded-full mr-3"
                style={{ backgroundColor: currentBody.color }}
              ></div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {currentBody.name}
              </h3>
            </div>

            <div className="space-y-6">
              {questions.map((question, questionIndex) => (
                <div key={questionIndex}>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-3">
                    {question.question}
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {question.scale?.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleResponse(questionIndex, optionIndex)}
                        className={`p-2 rounded-lg text-xs font-medium transition-all ${
                          responses[`${currentBodyKey}_${questionIndex}`]?.value === optionIndex + 1
                            ? 'text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'
                        }`}
                        style={{
                          backgroundColor: responses[`${currentBodyKey}_${questionIndex}`]?.value === optionIndex + 1 
                            ? currentBody.color 
                            : 'rgba(255,255,255,0.1)'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="secondary-button"
            >
              â Back to Dashboard
            </button>
            
            <div className="flex space-x-3">
              {currentBodyIndex > 0 && (
                <button
                  onClick={() => setCurrentBodyIndex(currentBodyIndex - 1)}
                  className="glass-button"
                >
                  Previous Body
                </button>
              )}
              
              {currentBodyIndex < bodyKeys.length - 1 ? (
                <button
                  onClick={() => setCurrentBodyIndex(currentBodyIndex + 1)}
                  className="primary-button"
                >
                  Next Body
                </button>
              ) : (
                <button
                  onClick={completeCheckin}
                  disabled={isLoading}
                  className="success-button"
                >
                  {isLoading ? 'Saving...' : 'Complete Check-in'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Body Detail View
  const BodyDetailView = () => {
    if (!selectedBody) return null;
    
    const body = sevenBodies[selectedBody];
    const score = userProfile?.currentScores?.[selectedBody] || 0;
    const percentage = (score / 5) * 100;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="glass-card p-8">
          {/* Header */}
          <div className="flex items-center mb-6">
            <div
              className="w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: body.color }}
            >
              {body.note}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{body.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{body.bantuKongo}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">{body.frequency}</p>
            </div>
          </div>

          {/* Current State */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Current State</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Development Level</span>
                  <span className="font-medium text-gray-800 dark:text-white">{score.toFixed(1)}/5</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: body.color 
                    }}
                  >
                    <span className="text-xs text-white font-medium">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {body.description}
              </p>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Focus Areas:</strong> {body.focus}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Cultural Elements</h3>
              <ul className="space-y-2">
                {body.culturalElements?.map((element, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-500 mr-2">â¢</span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{element}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Practices */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recommended Practices</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {body.practices?.map((practice, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-current transition-all cursor-pointer"
                  style={{ borderColor: `${body.color}20`, backgroundColor: `${body.color}10` }}
                >
                  <div className="font-medium text-gray-800 dark:text-white">{practice}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="secondary-button"
            >
              â Back to Dashboard
            </button>
            
            <div className="space-x-3">
              <button
                onClick={() => setCurrentView('daily-checkin')}
                className="glass-button"
              >
                Daily Check-in
              </button>
              <button
                onClick={() => setCurrentView('assessment')}
                className="primary-button"
              >
                Full Assessment
              </button>
            </div>
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
              Seven Bodies Debug Console
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
                {userProfile && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Harmony Score: {(calculateHarmonyScore(userProfile.currentScores) * 100).toFixed(0)}% | 
                    Streak: {userProfile.dailyCheckinStreak} days
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
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'assessment' && <AssessmentView />}
      {currentView === 'daily-checkin' && <DailyCheckinView />}
      {currentView === 'body-detail' && <BodyDetailView />}

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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="glass-card p-8 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white font-medium">Processing seven bodies wisdom...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SevenBodiesSystem;
