import React, { useState, useEffect, useRef } from 'react';
import ApiDebugger from './ApiDebugger';

const AsAManThinksAuth = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [culturalData, setCulturalData] = useState(null);
  const [sevenBodiesData, setSevenBodiesData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [apiCalls, setApiCalls] = useState([]);
  const [createdObjects, setCreatedObjects] = useState([]);
  const [showApiDebug, setShowApiDebug] = useState(false);
  
  // Refs for form inputs to avoid recreation
  const nameRef = useRef();
  const emailRef = useRef();
  const ageRef = useRef();
  const locationRef = useRef();
  const culturalBackgroundRef = useRef();

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

  // Step 1: File Upload (Cultural Data Initialization)
  const initializeCulturalData = async () => {
    setIsLoading(true);
    setUploadProgress(10);
    
    try {
      // Input cultural foundation data
      const culturalFoundations = await apiCall('/input_data', 'POST', {
        created_object_name: "cultural_foundations",
        data_type: "strings",
        input_data: [
          "Bantu-Kongo cosmology: Dikenga cycle with four moments - Kala (birth/dawn), Tukula (maturity/noon), Luvemba (death/sunset), Musoni (rebirth/midnight). The cosmogram represents life cycle and spiritual journey.",
          "Egyptian wisdom: Seven Bodies concept - Physical (Khat), Etheric (Ka), Astral (Ba), Mental (Ab), Causal (Khu), Buddhic (Sahu), Atmic (Ren). Each represents different levels of consciousness and spiritual development.",
          "African geometric patterns: Sacred symbols including Adinkra symbols, Kongo cosmograms, Egyptian hieroglyphs, and traditional textile patterns that represent spiritual concepts and life principles.",
          "Cultural integration principles: Respectful incorporation of wisdom traditions, avoiding appropriation, honoring source cultures, and creating inclusive representations for all racial groups."
        ]
      });
      
      setCreatedObjects(prev => [...prev, "cultural_foundations"]);
      setUploadProgress(40);

      // Process cultural data for app integration
      const culturalProcessing = await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["app_cultural_elements"],
        prompt_string: `Based on this cultural information: {cultural_foundations}, create a comprehensive guide for AsAManThinks app including:

1. SYMBOLIC AVATARS: Design 12 symbolic avatar concepts representing universal human archetypes that honor African wisdom while being inclusive of all racial groups. Each should incorporate geometric patterns and spiritual symbols.

2. DIKENGA CYCLE INTEGRATION: Explain how to track user's position in the four moments (Kala, Tukula, Luvemba, Musoni) based on their mental health journey and life circumstances.

3. SEVEN BODIES ASSESSMENT: Create detailed questionnaire items for each of the seven bodies that can be used for:
   - Initial onboarding assessment
   - Separate detailed assessment tool
   - Daily micro-assessments integrated into app experience

4. CULTURAL DESIGN ELEMENTS: Specify color palettes, geometric patterns, and visual motifs that authentically represent the wisdom traditions while maintaining modern app aesthetics.

5. ROLE PROGRESSION SYSTEM: Define criteria for advancing through user roles (Guest â User â Community Member â Wisdom Keeper â Nganga) based on subscription status, app usage time, and spiritual development indicators.

Format as JSON with clear sections for easy implementation.`,
        inputs: [
          {
            input_object_name: "cultural_foundations",
            mode: "combine_events"
          }
        ]
      });

      setCreatedObjects(prev => [...prev, "app_cultural_elements"]);
      setUploadProgress(70);

      // Get the processed cultural data
      const culturalResult = await apiCall('/return_data', 'POST', {
        object_name: "app_cultural_elements",
        return_type: "json"
      });

      try {
        const parsedData = JSON.parse(culturalResult.value[0]);
        setCulturalData(parsedData);
      } catch (parseError) {
        // Fallback data if parsing fails
        setCulturalData({
          symbolicAvatars: [
            { id: 'seeker', name: 'The Seeker', symbol: 'ð', description: 'One who seeks truth and wisdom' },
            { id: 'healer', name: 'The Healer', symbol: 'ð¿', description: 'One who brings healing and restoration' },
            { id: 'warrior', name: 'The Warrior', symbol: 'âï¸', description: 'One who faces challenges with courage' },
            { id: 'sage', name: 'The Sage', symbol: 'ð', description: 'One who holds and shares wisdom' },
            { id: 'creator', name: 'The Creator', symbol: 'ð¨', description: 'One who brings new things into being' },
            { id: 'guardian', name: 'The Guardian', symbol: 'ð¡ï¸', description: 'One who protects and preserves' }
          ]
        });
      }

      setUploadProgress(100);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error initializing cultural data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: User Data Processing
  const processUserData = async (formData) => {
    setIsLoading(true);
    setUploadProgress(20);
    
    try {
      // Create Seven Bodies assessment system
      const assessmentCreation = await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["seven_bodies_assessment"],
        prompt_string: `Create a comprehensive Seven Bodies assessment system with three tiers:

TIER 1 - ONBOARDING (7 questions, 1 per body):
Quick assessment for new users to establish baseline

TIER 2 - DETAILED ASSESSMENT (35 questions, 5 per body):
Comprehensive evaluation available as separate tool

TIER 3 - DAILY MICRO-ASSESSMENTS (1-2 questions):
Brief daily check-ins to track changes over time

For each question, provide:
- Question text
- 5-point scale with culturally appropriate descriptors
- Which body it assesses
- Scoring methodology
- Interpretation guidelines

Format as JSON with clear structure for implementation.`,
        inputs: [
          {
            input_object_name: "cultural_foundations",
            mode: "combine_events"
          }
        ]
      });

      setCreatedObjects(prev => [...prev, "seven_bodies_assessment"]);
      setUploadProgress(60);

      const assessmentResult = await apiCall('/return_data', 'POST', {
        object_name: "seven_bodies_assessment",
        return_type: "json"
      });

      try {
        const parsedAssessment = JSON.parse(assessmentResult.value[0]);
        setSevenBodiesData(parsedAssessment);
      } catch (parseError) {
        // Fallback assessment data
        setSevenBodiesData({
          onboardingQuestions: [
            { id: 'physical', body: 'Physical', question: 'How would you rate your overall physical health and energy levels?', scale: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'] },
            { id: 'etheric', body: 'Etheric', question: 'How connected do you feel to your life force and vitality?', scale: ['Disconnected', 'Slightly Connected', 'Moderately Connected', 'Well Connected', 'Deeply Connected'] },
            { id: 'astral', body: 'Astral', question: 'How balanced are your emotions and desires?', scale: ['Very Unbalanced', 'Unbalanced', 'Somewhat Balanced', 'Balanced', 'Very Balanced'] },
            { id: 'mental', body: 'Mental', question: 'How clear and focused is your thinking?', scale: ['Very Unclear', 'Unclear', 'Somewhat Clear', 'Clear', 'Very Clear'] },
            { id: 'causal', body: 'Causal', question: 'How aware are you of your life patterns and karma?', scale: ['Unaware', 'Slightly Aware', 'Moderately Aware', 'Aware', 'Highly Aware'] },
            { id: 'buddhic', body: 'Buddhic', question: 'How connected do you feel to universal wisdom and compassion?', scale: ['Disconnected', 'Slightly Connected', 'Moderately Connected', 'Connected', 'Deeply Connected'] },
            { id: 'atmic', body: 'Atmic', question: 'How aligned do you feel with your highest purpose and divine nature?', scale: ['Unaligned', 'Slightly Aligned', 'Moderately Aligned', 'Aligned', 'Fully Aligned'] }
          ]
        });
      }

      // Store user data
      const userProfile = {
        ...formData,
        role: 'guest',
        createdAt: new Date().toISOString(),
        culturalIntegrationLevel: formData.culturalPreference || 'moderate',
        dikengaPosition: 'kala',
        sevenBodiesBaseline: null
      };
      
      setUserData(userProfile);
      setUploadProgress(100);
      setCurrentStep(3);
    } catch (error) {
      console.error('User data processing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Assessment Results Processing
  const processAssessmentResults = async (responses) => {
    setIsLoading(true);
    setUploadProgress(30);
    
    try {
      const assessmentProcessing = await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["user_assessment_results"],
        prompt_string: `Analyze these Seven Bodies assessment responses and provide:

Assessment Responses: ${JSON.stringify(responses)}

1. INDIVIDUAL BODY SCORES: Calculate score for each of the seven bodies (1-5 scale)
2. OVERALL WELLNESS PROFILE: Identify strengths and areas for growth
3. DIKENGA POSITION: Determine current life cycle position based on responses
4. PERSONALIZED RECOMMENDATIONS: Suggest specific practices and focus areas
5. CULTURAL INTEGRATION SUGGESTIONS: Recommend appropriate level of cultural content

Format as JSON with clear sections for profile integration.`,
        inputs: [
          {
            input_object_name: "seven_bodies_assessment",
            mode: "combine_events"
          }
        ]
      });

      setCreatedObjects(prev => [...prev, "user_assessment_results"]);
      setUploadProgress(80);

      const resultsResponse = await apiCall('/return_data', 'POST', {
        object_name: "user_assessment_results",
        return_type: "json"
      });

      try {
        const assessmentResults = JSON.parse(resultsResponse.value[0]);
        
        setUserData(prev => ({
          ...prev,
          sevenBodiesBaseline: assessmentResults.bodyScores || responses,
          dikengaPosition: assessmentResults.dikengaPosition || 'kala',
          wellnessProfile: assessmentResults.wellnessProfile || 'Balanced seeker',
          recommendations: assessmentResults.recommendations || ['Continue your spiritual journey']
        }));
      } catch (parseError) {
        // Fallback processing
        setUserData(prev => ({
          ...prev,
          sevenBodiesBaseline: responses,
          dikengaPosition: 'kala',
          wellnessProfile: 'Balanced seeker',
          recommendations: ['Continue your spiritual journey']
        }));
      }

      setUploadProgress(100);
    } catch (error) {
      console.error('Assessment processing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllObjects = async () => {
    setIsLoading(true);
    try {
      for (const objectName of createdObjects) {
        await fetch(`${API_BASE}/objects/${objectName}`, {
          method: 'DELETE',
          headers: API_HEADERS
        });
      }
      setCreatedObjects([]);
      setCulturalData(null);
      setSevenBodiesData(null);
      setUserData({});
      setCurrentStep(1);
      setApiCalls([]);
    } catch (error) {
      console.error('Error deleting objects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Upload & Initialize Component
  const Step1Upload = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          AsAManThinks
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Ancient Wisdom â¢ Modern Wellness
        </p>
      </div>

      <div className="glass-card p-8 text-center">
        <div className="upload-zone cursor-pointer" onClick={initializeCulturalData}>
          <div className="text-center">
            <div className="text-6xl mb-4">ð</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Initialize Cultural Wisdom System
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Click to load Bantu-Kongo cosmology and Egyptian wisdom traditions
            </p>
            <button 
              className="primary-button"
              disabled={isLoading}
              aria-label="Initialize cultural data system"
            >
              {isLoading ? 'Loading...' : 'Begin Journey'}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="mt-6">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
                role="progressbar"
                aria-valuenow={uploadProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Loading cultural wisdom systems... {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Step 2: User Registration Form
  const Step2Registration = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      age: '',
      location: '',
      culturalBackground: '',
      culturalPreference: 'moderate',
      selectedAvatar: null
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      processUserData(formData);
    };

    const avatarOptions = culturalData?.symbolicAvatars || [
      { id: 'seeker', name: 'The Seeker', symbol: 'ð', description: 'One who seeks truth and wisdom' },
      { id: 'healer', name: 'The Healer', symbol: 'ð¿', description: 'One who brings healing and restoration' },
      { id: 'warrior', name: 'The Warrior', symbol: 'âï¸', description: 'One who faces challenges with courage' },
      { id: 'sage', name: 'The Sage', symbol: 'ð', description: 'One who holds and shares wisdom' },
      { id: 'creator', name: 'The Creator', symbol: 'ð¨', description: 'One who brings new things into being' },
      { id: 'guardian', name: 'The Guardian', symbol: 'ð¡ï¸', description: 'One who protects and preserves' }
    ];

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Create Your Spiritual Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  className="glass-input w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  aria-describedby="name-help"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  className="glass-input w-full"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  aria-describedby="email-help"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age
                </label>
                <input
                  ref={ageRef}
                  type="number"
                  className="glass-input w-full"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  aria-describedby="age-help"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  ref={locationRef}
                  type="text"
                  className="glass-input w-full"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  aria-describedby="location-help"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cultural Background (Optional)
              </label>
              <input
                ref={culturalBackgroundRef}
                type="text"
                className="glass-input w-full"
                placeholder="Share if you'd like culturally relevant content"
                value={formData.culturalBackground}
                onChange={(e) => setFormData({...formData, culturalBackground: e.target.value})}
                aria-describedby="cultural-help"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cultural Integration Preference
              </label>
              <select
                className="glass-input w-full"
                value={formData.culturalPreference}
                onChange={(e) => setFormData({...formData, culturalPreference: e.target.value})}
                aria-describedby="preference-help"
              >
                <option value="minimal">Minimal - Focus on universal principles</option>
                <option value="moderate">Moderate - Balanced cultural integration</option>
                <option value="full">Full - Deep cultural immersion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Choose Your Symbolic Avatar
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {avatarOptions.map(avatar => (
                  <div
                    key={avatar.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      formData.selectedAvatar === avatar.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }`}
                    onClick={() => setFormData({...formData, selectedAvatar: avatar.id})}
                    role="button"
                    tabIndex={0}
                    aria-pressed={formData.selectedAvatar === avatar.id}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setFormData({...formData, selectedAvatar: avatar.id});
                      }
                    }}
                  >
                    <div className="text-3xl text-center mb-2">{avatar.symbol}</div>
                    <div className="text-sm font-medium text-center text-gray-800 dark:text-white">
                      {avatar.name}
                    </div>
                    <div className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1">
                      {avatar.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="primary-button"
                disabled={isLoading}
                aria-label="Continue to assessment"
              >
                {isLoading ? 'Processing...' : 'Continue to Assessment'}
              </button>
            </div>

            {isLoading && (
              <div className="mt-4">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                    role="progressbar"
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center">
                  Creating your assessment... {uploadProgress}%
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

  // Step 3: Assessment & Results
  const Step3Assessment = () => {
    const [assessmentResponses, setAssessmentResponses] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const onboardingQuestions = sevenBodiesData?.onboardingQuestions || [
      { id: 'physical', body: 'Physical', question: 'How would you rate your overall physical health and energy levels?', scale: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'] },
      { id: 'etheric', body: 'Etheric', question: 'How connected do you feel to your life force and vitality?', scale: ['Disconnected', 'Slightly Connected', 'Moderately Connected', 'Well Connected', 'Deeply Connected'] },
      { id: 'astral', body: 'Astral', question: 'How balanced are your emotions and desires?', scale: ['Very Unbalanced', 'Unbalanced', 'Somewhat Balanced', 'Balanced', 'Very Balanced'] },
      { id: 'mental', body: 'Mental', question: 'How clear and focused is your thinking?', scale: ['Very Unclear', 'Unclear', 'Somewhat Clear', 'Clear', 'Very Clear'] },
      { id: 'causal', body: 'Causal', question: 'How aware are you of your life patterns and karma?', scale: ['Unaware', 'Slightly Aware', 'Moderately Aware', 'Aware', 'Highly Aware'] },
      { id: 'buddhic', body: 'Buddhic', question: 'How connected do you feel to universal wisdom and compassion?', scale: ['Disconnected', 'Slightly Connected', 'Moderately Connected', 'Connected', 'Deeply Connected'] },
      { id: 'atmic', body: 'Atmic', question: 'How aligned do you feel with your highest purpose and divine nature?', scale: ['Unaligned', 'Slightly Aligned', 'Moderately Aligned', 'Aligned', 'Fully Aligned'] }
    ];

    const handleAnswerSelect = async (value) => {
      const question = onboardingQuestions[currentQuestion];
      const newResponses = {
        ...assessmentResponses,
        [question.id]: { body: question.body, value: value + 1, question: question.question }
      };
      
      setAssessmentResponses(newResponses);

      if (currentQuestion < onboardingQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        await processAssessmentResults(newResponses);
        setShowResults(true);
      }
    };

    if (showResults) {
      return (
        <div className="max-w-6xl mx-auto p-6">
          <div className="glass-card p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Welcome, {userData.name}!
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Your spiritual wellness journey begins here.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6 text-center">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Current Role</h4>
                <p className="text-primary-600 dark:text-primary-400 font-medium">
                  {userData.role || 'Guest'}
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Dikenga Position</h4>
                <p className="text-primary-600 dark:text-primary-400 font-medium">
                  {userData.dikengaPosition || 'Kala'}
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Cultural Integration</h4>
                <p className="text-primary-600 dark:text-primary-400 font-medium">
                  {userData.culturalIntegrationLevel || 'Moderate'}
                </p>
              </div>
            </div>

            {userData.sevenBodiesBaseline && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                  Your Seven Bodies Profile
                </h3>
                <div className="overflow-x-auto">
                  <table className="table table-striped table-hover w-full">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">Body</th>
                        <th scope="col">Score</th>
                        <th scope="col">Level</th>
                        <th scope="col">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(userData.sevenBodiesBaseline).map(([body, data]) => {
                        const score = typeof data === 'object' ? data.value : data;
                        const percentage = (score / 5) * 100;
                        return (
                          <tr key={body}>
                            <td className="font-medium">{data.body || body}</td>
                            <td>{score}/5</td>
                            <td>
                              <span className={`badge ${
                                score >= 4 ? 'bg-success' : 
                                score >= 3 ? 'bg-warning' : 'bg-danger'
                              }`}>
                                {score >= 4 ? 'Strong' : score >= 3 ? 'Developing' : 'Needs Focus'}
                              </span>
                            </td>
                            <td>
                              <div className="progress" style={{ height: '8px' }}>
                                <div 
                                  className="progress-bar bg-primary" 
                                  role="progressbar" 
                                  style={{ width: `${percentage}%` }}
                                  aria-valuenow={percentage}
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="text-center">
              <button 
                className="success-button me-3"
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    "Body,Score,Level\n" +
                    Object.entries(userData.sevenBodiesBaseline || {}).map(([body, data]) => {
                      const score = typeof data === 'object' ? data.value : data;
                      const level = score >= 4 ? 'Strong' : score >= 3 ? 'Developing' : 'Needs Focus';
                      return `${body},${score}/5,${level}`;
                    }).join("\n");
                  
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "seven_bodies_assessment.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                aria-label="Download assessment results as CSV"
              >
                ð¥ Download CSV
              </button>
              
              <button 
                className="primary-button"
                onClick={() => setCurrentStep(1)}
                aria-label="Start new assessment"
              >
                Start New Journey
              </button>
            </div>

            {isLoading && (
              <div className="mt-6">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                    role="progressbar"
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center">
                  Processing results... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    const currentQ = onboardingQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / onboardingQuestions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="glass-card p-8">
          <div className="mb-6">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
              Question {currentQuestion + 1} of {onboardingQuestions.length} â¢ {currentQ?.body} Body
            </p>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {currentQ?.question}
            </h3>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            {currentQ?.scale.map((option, index) => (
              <button
                key={index}
                className="glass-button w-full text-left p-4 hover:bg-primary-100 dark:hover:bg-primary-900/20"
                onClick={() => handleAnswerSelect(index)}
                aria-label={`Select ${option}`}
              >
                <span className="font-medium">{index + 1}.</span> {option}
              </button>
            ))}
          </div>

          {currentQuestion > 0 && (
            <div className="text-center mt-6">
              <button
                className="secondary-button"
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                aria-label="Go to previous question"
              >
                â Previous Question
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8">
      {/* Debug Controls */}
      <div className="fixed bottom-4 left-4 z-50 space-x-2">
        <button
          className="success-button"
          onClick={() => setShowApiDebug(!showApiDebug)}
          aria-label="Toggle API debug information"
        >
          ð Debug
        </button>
        <button
          className="danger-button"
          onClick={deleteAllObjects}
          disabled={isLoading}
          aria-label="Delete all created objects"
        >
          ðï¸ Reset
        </button>
      </div>

      {/* Main Content */}
      {currentStep === 1 && <Step1Upload />}
      {currentStep === 2 && <Step2Registration />}
      {currentStep === 3 && <Step3Assessment />}

      {/* API Debugger */}
      {showApiDebug && (
        <ApiDebugger 
          apiCalls={apiCalls} 
          createdObjects={createdObjects}
          onClose={() => setShowApiDebug(false)}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="glass-card p-8 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white font-medium">Processing your spiritual data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsAManThinksAuth;
