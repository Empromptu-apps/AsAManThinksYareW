import React, { useState, useEffect, useRef } from 'react';

const LearningCenter = () => {
  const [currentView, setCurrentView] = useState('home'); // home, library, reader, audio, path, search, bookmarks, community
  const [selectedContent, setSelectedContent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [learningProgress, setLearningProgress] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [culturalLibrary, setCulturalLibrary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiCalls, setApiCalls] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    speed: 1.0,
    volume: 1.0
  });

  const audioRef = useRef(null);
  const pdfViewerRef = useRef(null);

  const API_BASE = 'https://builder.empromptu.ai/api_tools';
  const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer c6303bcc8941b627ba1b32398f9cf214',
    'X-Generated-App-ID': 'ea635350-c7ed-4628-847a-4eb10ad33ffc',
    'X-Usage-Key': '75582975e7a6c43504f1962005902a95'
  };

  // Learning Content Library Structure
  const learningLibrary = {
    dikengaPaths: {
      kala: {
        name: 'Kala - Foundation Path',
        description: 'Beginning practices and foundation knowledge for new spiritual journeys',
        color: '#FFD700',
        stage: 'Foundation & New Beginnings',
        content: [
          {
            id: 'kala-intro',
            title: 'Introduction to Dikenga Cosmology',
            type: 'pdf',
            author: 'Dr. Kimbwandende Kia Bunseki Fu-Kiau',
            description: 'Foundational understanding of the Bantu-Kongo cosmological framework',
            pages: 45,
            duration: '2h 30m',
            difficulty: 'Beginner',
            tags: ['cosmology', 'foundation', 'bantu-kongo'],
            culturalContext: 'Sacred knowledge of the four moments of existence'
          },
          {
            id: 'kala-breathing',
            title: 'Foundation Breathing Practices',
            type: 'audio',
            author: 'Nganga Kala',
            description: 'Guided breathing exercises for establishing spiritual foundation',
            duration: '45m',
            difficulty: 'Beginner',
            tags: ['breathing', 'practice', 'foundation'],
            culturalContext: 'Traditional breath work for new beginnings'
          },
          {
            id: 'kala-meditation',
            title: 'Dawn Meditation Practices',
            type: 'video',
            author: 'Mama Nzinga',
            description: 'Morning meditation practices aligned with Kala energy',
            duration: '30m',
            difficulty: 'Beginner',
            tags: ['meditation', 'morning', 'practice'],
            culturalContext: 'Traditional dawn practices for intention setting'
          }
        ]
      },
      tukula: {
        name: 'Tukula - Power Path',
        description: 'Advanced techniques and leadership development for peak spiritual power',
        color: '#FF4444',
        stage: 'Mastery & Leadership',
        content: [
          {
            id: 'tukula-leadership',
            title: 'Spiritual Leadership in Community',
            type: 'pdf',
            author: 'Dr. Malidoma Patrice SomÃ©',
            description: 'Developing authentic spiritual leadership rooted in African wisdom',
            pages: 78,
            duration: '4h 15m',
            difficulty: 'Advanced',
            tags: ['leadership', 'community', 'service'],
            culturalContext: 'Traditional models of spiritual authority and service'
          },
          {
            id: 'tukula-power',
            title: 'Harnessing Peak Spiritual Power',
            type: 'audio',
            author: 'Thoth-Ankh',
            description: 'Advanced practices for accessing and directing spiritual power',
            duration: '1h 20m',
            difficulty: 'Advanced',
            tags: ['power', 'energy', 'mastery'],
            culturalContext: 'Sacred techniques for spiritual empowerment'
          }
        ]
      },
      luvemba: {
        name: 'Luvemba - Release Path',
        description: 'Shadow work and healing practices for transformation and letting go',
        color: '#4444FF',
        stage: 'Healing & Transformation',
        content: [
          {
            id: 'luvemba-shadow',
            title: 'African Approaches to Shadow Work',
            type: 'pdf',
            author: 'Dr. Linda James Myers',
            description: 'Traditional African methods for confronting and integrating shadow aspects',
            pages: 92,
            duration: '5h 10m',
            difficulty: 'Intermediate',
            tags: ['shadow-work', 'healing', 'transformation'],
            culturalContext: 'Traditional practices for facing the dark night of the soul'
          },
          {
            id: 'luvemba-healing',
            title: 'Ancestral Healing Ceremonies',
            type: 'video',
            author: 'Nganga Kala',
            description: 'Traditional healing ceremonies for releasing ancestral trauma',
            duration: '2h 45m',
            difficulty: 'Intermediate',
            tags: ['healing', 'ancestors', 'ceremony'],
            culturalContext: 'Sacred rituals for intergenerational healing'
          }
        ]
      },
      musoni: {
        name: 'Musoni - Renewal Path',
        description: 'Integration and renewal practices for deep wisdom and regeneration',
        color: '#8844FF',
        stage: 'Wisdom & Integration',
        content: [
          {
            id: 'musoni-wisdom',
            title: 'Integrating Ancient Wisdom in Modern Life',
            type: 'pdf',
            author: 'Dr. Asa Hilliard III',
            description: 'Practical application of traditional African wisdom in contemporary contexts',
            pages: 156,
            duration: '8h 30m',
            difficulty: 'Advanced',
            tags: ['wisdom', 'integration', 'modern-application'],
            culturalContext: 'Bridging ancient wisdom with contemporary living'
          },
          {
            id: 'musoni-renewal',
            title: 'Deep Renewal Practices',
            type: 'audio',
            author: 'Mama Nzinga',
            description: 'Restorative practices for spiritual renewal and regeneration',
            duration: '1h 15m',
            difficulty: 'Intermediate',
            tags: ['renewal', 'restoration', 'regeneration'],
            culturalContext: 'Traditional practices for spiritual rebirth'
          }
        ]
      }
    },
    sevenBodiesTracks: {
      physical: {
        name: 'Physical Body Development',
        description: 'Health, nutrition, and movement practices for physical vitality',
        color: '#FF4444',
        frequency: '256Hz',
        content: [
          {
            id: 'physical-nutrition',
            title: 'Traditional African Nutrition Wisdom',
            type: 'pdf',
            author: 'Dr. Llaila Afrika',
            description: 'Ancient African approaches to nutrition and physical health',
            pages: 234,
            duration: '12h 45m',
            difficulty: 'Beginner',
            tags: ['nutrition', 'health', 'traditional-medicine'],
            culturalContext: 'Traditional African dietary wisdom and healing foods'
          },
          {
            id: 'physical-movement',
            title: 'Sacred Movement Practices',
            type: 'video',
            author: 'Kesi',
            description: 'Traditional African movement and dance for physical vitality',
            duration: '1h 30m',
            difficulty: 'Beginner',
            tags: ['movement', 'dance', 'vitality'],
            culturalContext: 'Sacred movement traditions for physical and spiritual health'
          }
        ]
      },
      etheric: {
        name: 'Etheric Body Development',
        description: 'Energy work, breathwork, and vitality practices',
        color: '#FF8844',
        frequency: '288Hz',
        content: [
          {
            id: 'etheric-energy',
            title: 'African Energy Work Traditions',
            type: 'pdf',
            author: 'Dr. Sobonfu SomÃ©',
            description: 'Traditional African approaches to energy work and vitality',
            pages: 167,
            duration: '9h 20m',
            difficulty: 'Intermediate',
            tags: ['energy-work', 'vitality', 'traditional-practices'],
            culturalContext: 'Sacred energy practices from African traditions'
          }
        ]
      },
      astral: {
        name: 'Astral Body Development',
        description: 'Emotional intelligence and healing practices',
        color: '#FFDD44',
        frequency: '320Hz',
        content: [
          {
            id: 'astral-emotions',
            title: 'Emotional Wisdom in African Traditions',
            type: 'pdf',
            author: 'Dr. Na\'im Akbar',
            description: 'Traditional African approaches to emotional intelligence and healing',
            pages: 198,
            duration: '10h 45m',
            difficulty: 'Intermediate',
            tags: ['emotions', 'healing', 'intelligence'],
            culturalContext: 'Traditional emotional healing and wisdom practices'
          }
        ]
      },
      mental: {
        name: 'Mental Body Development',
        description: 'Cognitive development and belief transformation',
        color: '#44FF44',
        frequency: '341Hz',
        content: [
          {
            id: 'mental-cognitive',
            title: 'African Models of Consciousness',
            type: 'pdf',
            author: 'Dr. Wade Nobles',
            description: 'Traditional African understanding of mind and consciousness',
            pages: 145,
            duration: '7h 50m',
            difficulty: 'Advanced',
            tags: ['consciousness', 'cognition', 'african-psychology'],
            culturalContext: 'Traditional African models of mental development'
          }
        ]
      },
      causal: {
        name: 'Causal Body Development',
        description: 'Ancestral wisdom and karma understanding',
        color: '#4488FF',
        frequency: '384Hz',
        content: [
          {
            id: 'causal-ancestors',
            title: 'Ancestral Wisdom and Guidance',
            type: 'pdf',
            author: 'Dr. John Henrik Clarke',
            description: 'Understanding and accessing ancestral wisdom for life guidance',
            pages: 189,
            duration: '10h 15m',
            difficulty: 'Advanced',
            tags: ['ancestors', 'wisdom', 'guidance'],
            culturalContext: 'Traditional practices for ancestral connection and guidance'
          }
        ]
      },
      buddhic: {
        name: 'Buddhic Body Development',
        description: 'Intuitive development and healing gifts',
        color: '#8844FF',
        frequency: '426Hz',
        content: [
          {
            id: 'buddhic-intuition',
            title: 'Developing Spiritual Gifts',
            type: 'pdf',
            author: 'Dr. Marimba Ani',
            description: 'Traditional African approaches to developing spiritual and healing gifts',
            pages: 223,
            duration: '12h 10m',
            difficulty: 'Advanced',
            tags: ['spiritual-gifts', 'intuition', 'healing'],
            culturalContext: 'Traditional development of spiritual and healing capacities'
          }
        ]
      },
      atmic: {
        name: 'Atmic Body Development',
        description: 'Unity consciousness and service practices',
        color: '#DD44FF',
        frequency: '480Hz',
        content: [
          {
            id: 'atmic-unity',
            title: 'Ubuntu and Unity Consciousness',
            type: 'pdf',
            author: 'Dr. Mogobe Ramose',
            description: 'Traditional African philosophy of interconnectedness and unity',
            pages: 134,
            duration: '7h 20m',
            difficulty: 'Advanced',
            tags: ['ubuntu', 'unity', 'philosophy'],
            culturalContext: 'Traditional African understanding of universal interconnectedness'
          }
        ]
      }
    },
    culturalCollections: {
      bantuKongo: {
        name: 'Bantu-Kongo Wisdom Collection',
        description: 'Traditional knowledge from Bantu-Kongo cultures',
        content: [
          {
            id: 'bantu-cosmology',
            title: 'The Bantu-Kongo Cosmology',
            type: 'pdf',
            author: 'Dr. Kimbwandende Kia Bunseki Fu-Kiau',
            description: 'Comprehensive study of Bantu-Kongo cosmological understanding',
            pages: 456,
            duration: '25h 30m',
            difficulty: 'Advanced',
            tags: ['cosmology', 'bantu-kongo', 'traditional-knowledge'],
            culturalContext: 'Sacred cosmological knowledge of the Bantu-Kongo peoples'
          }
        ]
      },
      egyptian: {
        name: 'Egyptian/Kemetic Wisdom Collection',
        description: 'Ancient Egyptian wisdom and Ma\'at principles',
        content: [
          {
            id: 'maat-principles',
            title: 'The 42 Principles of Ma\'at',
            type: 'pdf',
            author: 'Dr. Maulana Karenga',
            description: 'Ancient Egyptian ethical and spiritual principles for righteous living',
            pages: 178,
            duration: '9h 45m',
            difficulty: 'Intermediate',
            tags: ['maat', 'ethics', 'egyptian-wisdom'],
            culturalContext: 'Ancient Egyptian principles for ethical and spiritual living'
          }
        ]
      },
      sirach: {
        name: 'Sirach Practical Ethics',
        description: 'Practical wisdom for daily living',
        content: [
          {
            id: 'sirach-wisdom',
            title: 'The Wisdom of Sirach',
            type: 'pdf',
            author: 'Ben Sira',
            description: 'Ancient practical wisdom for ethical living and decision making',
            pages: 267,
            duration: '14h 20m',
            difficulty: 'Intermediate',
            tags: ['ethics', 'practical-wisdom', 'decision-making'],
            culturalContext: 'Ancient wisdom for practical ethical living'
          }
        ]
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
    initializeLearningCenter();
  }, []);

  const initializeLearningCenter = async () => {
    setIsLoading(true);
    
    try {
      // Initialize cultural learning wisdom
      await apiCall('/input_data', 'POST', {
        created_object_name: "cultural_learning_wisdom",
        data_type: "strings",
        input_data: [
          `BANTU-KONGO LEARNING PHILOSOPHY:

          Traditional Knowledge Transmission:
          - "Malongi ma kala" (Ancient teachings) - Knowledge passed down through generations
          - "Nkanda" (Initiation schools) - Structured learning through life stages
          - "Kimvuka" (Awakening) - The process of spiritual and intellectual awakening
          - "Longa ye longisa" (Learn and teach) - The reciprocal nature of knowledge sharing

          Dikenga Learning Cycle:
          Kala (Dawn/Beginning): Foundation learning, establishing basic understanding
          - Focus on fundamental concepts and principles
          - Building strong knowledge foundations
          - Developing learning discipline and habits
          - Connecting with traditional sources of wisdom

          Tukula (Noon/Power): Advanced learning, mastery development
          - Deep study of complex concepts
          - Practical application of knowledge
          - Leadership development through learning
          - Teaching and sharing knowledge with others

          Luvemba (Sunset/Release): Transformative learning, shadow integration
          - Confronting difficult or challenging knowledge
          - Integrating opposing viewpoints
          - Learning through struggle and difficulty
          - Releasing outdated beliefs and concepts

          Musoni (Midnight/Renewal): Integrative learning, wisdom synthesis
          - Synthesizing all previous learning
          - Developing personal wisdom and insight
          - Preparing to begin new learning cycles
          - Connecting individual learning to collective wisdom`,

          `SEVEN BODIES LEARNING INTEGRATION:

          Each body requires specific types of learning and knowledge development:

          Physical Body Learning: Practical knowledge about health, nutrition, movement, and physical practices
          - Traditional healing knowledge
          - Nutritional wisdom from African traditions
          - Movement and dance practices
          - Physical discipline and body awareness

          Etheric Body Learning: Energy work, breathwork, and vitality practices
          - Understanding life force and energy systems
          - Breathing techniques and practices
          - Energy healing modalities
          - Vitality and longevity practices

          Astral Body Learning: Emotional intelligence, creative expression, and healing
          - Emotional processing and healing techniques
          - Creative arts and expression
          - Dream work and vision practices
          - Relationship and community dynamics

          Mental Body Learning: Cognitive development, belief systems, and mental practices
          - Critical thinking and analysis
          - Belief system examination and transformation
          - Mental discipline and focus practices
          - Intellectual and philosophical study

          Causal Body Learning: Ancestral wisdom, soul development, and karmic understanding
          - Ancestral knowledge and traditions
          - Soul purpose and life mission understanding
          - Karmic patterns and life lessons
          - Intergenerational healing and wisdom

          Buddhic Body Learning: Intuitive development, spiritual gifts, and healing capacities
          - Intuitive development practices
          - Spiritual gift recognition and development
          - Healing arts and practices
          - Spiritual teaching and guidance skills

          Atmic Body Learning: Unity consciousness, divine connection, and service
          - Unity and interconnectedness understanding
          - Divine connection and spiritual practices
          - Service and contribution to collective good
          - Master-level spiritual teachings and practices`,

          `CULTURAL LEARNING PRINCIPLES:

          Respectful Knowledge Transmission:
          - Honoring the source and origin of traditional knowledge
          - Understanding cultural context and appropriate application
          - Avoiding appropriation while encouraging respectful learning
          - Supporting cultural preservation and continuation

          Community-Centered Learning:
          - Learning as a community activity and responsibility
          - Sharing knowledge for collective benefit
          - Supporting others in their learning journey
          - Creating inclusive learning environments

          Practical Application Focus:
          - Connecting all learning to practical life application
          - Emphasizing wisdom over mere information
          - Developing skills and capacities, not just knowledge
          - Integrating learning into daily life and practice

          Intergenerational Knowledge Sharing:
          - Learning from elders and traditional knowledge keepers
          - Sharing knowledge with younger generations
          - Bridging traditional and contemporary knowledge
          - Preserving cultural wisdom for future generations

          Holistic Learning Approach:
          - Integrating intellectual, emotional, spiritual, and practical learning
          - Understanding knowledge as interconnected and whole
          - Developing the whole person, not just the mind
          - Connecting individual learning to collective wisdom and healing`
        ]
      });

      // Generate personalized learning recommendations
      await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["learning_recommendations"],
        prompt_string: `Based on this cultural learning wisdom: {cultural_learning_wisdom}, create a comprehensive learning recommendation system that includes:

1. PERSONALIZED LEARNING PATHS:
   - Dikenga stage-appropriate content recommendations
   - Seven bodies development track suggestions
   - Cultural integration level-matched materials
   - Progress-based content unlocking system

2. CONTENT ORGANIZATION SYSTEM:
   - Difficulty progression from beginner to advanced
   - Cultural context explanations for all materials
   - Cross-references between related topics
   - Community discussion integration points

3. LEARNING PROGRESS TRACKING:
   - Completion tracking for different content types
   - Comprehension assessment methods
   - Cultural integration progress indicators
   - Community participation metrics

4. COMMUNITY LEARNING FEATURES:
   - Study group formation recommendations
   - Mentor-student matching system
   - Community annotation and discussion features
   - Elder wisdom sharing platforms

5. CULTURAL PRESERVATION ELEMENTS:
   - Traditional knowledge attribution systems
   - Cultural context preservation methods
   - Community validation processes
   - Revenue sharing with cultural institutions

Format as JSON with clear structures for implementation.`,
        inputs: [
          {
            input_object_name: "cultural_learning_wisdom",
            mode: "combine_events"
          }
        ]
      });

      const learningResult = await apiCall('/return_data', 'POST', {
        object_name: "learning_recommendations",
        return_type: "json"
      });

      try {
        const parsedWisdom = JSON.parse(learningResult.value[0]);
        setCulturalLibrary(parsedWisdom);
      } catch (parseError) {
        console.error('Error parsing learning wisdom:', parseError);
        setCulturalLibrary(createFallbackLibrary());
      }

      // Initialize user profile
      setUserProfile({
        id: 'demo_user',
        name: 'Seeker',
        currentDikengaStage: 'kala',
        sevenBodiesProgress: {
          physical: 0.3, etheric: 0.2, astral: 0.4, mental: 0.5,
          causal: 0.1, buddhic: 0.1, atmic: 0.05
        },
        culturalIntegrationLevel: 'moderate',
        learningPreferences: ['pdf', 'audio'],
        completedContent: [],
        bookmarks: [],
        notes: []
      });

    } catch (error) {
      console.error('Error initializing learning center:', error);
      setCulturalLibrary(createFallbackLibrary());
      setUserProfile({
        id: 'demo_user',
        name: 'Seeker',
        currentDikengaStage: 'kala',
        sevenBodiesProgress: { physical: 0.3, etheric: 0.2, astral: 0.4, mental: 0.5, causal: 0.1, buddhic: 0.1, atmic: 0.05 },
        culturalIntegrationLevel: 'moderate',
        learningPreferences: ['pdf', 'audio'],
        completedContent: [],
        bookmarks: [],
        notes: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createFallbackLibrary = () => ({
    recommendations: {
      kala: ['kala-intro', 'kala-breathing', 'physical-nutrition'],
      tukula: ['tukula-leadership', 'mental-cognitive'],
      luvemba: ['luvemba-shadow', 'astral-emotions'],
      musoni: ['musoni-wisdom', 'atmic-unity']
    },
    progressTracking: {
      completionThresholds: { pdf: 0.8, audio: 0.9, video: 0.85 },
      assessmentPoints: [0.25, 0.5, 0.75, 1.0],
      culturalIntegrationMetrics: ['understanding', 'application', 'sharing']
    },
    communityFeatures: {
      studyGroups: true,
      mentorship: true,
      discussions: true,
      elderWisdom: true
    }
  });

  // Content Management Functions
  const openContent = (content) => {
    setSelectedContent(content);
    if (content.type === 'pdf') {
      setCurrentView('reader');
    } else if (content.type === 'audio') {
      setCurrentView('audio');
    } else if (content.type === 'video') {
      setCurrentView('reader'); // Use reader for video as well
    }
  };

  const addBookmark = (content, page = null, timestamp = null) => {
    const bookmark = {
      id: Date.now(),
      content,
      page,
      timestamp,
      note: '',
      createdAt: new Date().toISOString()
    };
    setBookmarks(prev => [bookmark, ...prev]);
  };

  const addNote = (content, note, page = null, timestamp = null) => {
    const newNote = {
      id: Date.now(),
      content,
      note,
      page,
      timestamp,
      createdAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateProgress = (contentId, progress) => {
    setLearningProgress(prev => ({
      ...prev,
      [contentId]: {
        ...prev[contentId],
        progress,
        lastAccessed: new Date().toISOString()
      }
    }));
  };

  const searchContent = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate search across all content
      const allContent = [];
      
      // Collect all content from library
      Object.values(learningLibrary.dikengaPaths).forEach(path => {
        allContent.push(...path.content);
      });
      Object.values(learningLibrary.sevenBodiesTracks).forEach(track => {
        allContent.push(...track.content);
      });
      Object.values(learningLibrary.culturalCollections).forEach(collection => {
        allContent.push(...collection.content);
      });

      // Filter content based on search query
      const results = allContent.filter(content => 
        content.title.toLowerCase().includes(query.toLowerCase()) ||
        content.description.toLowerCase().includes(query.toLowerCase()) ||
        content.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        content.author.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(results);
      setCurrentView('search');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Audio Player Functions
  const playAudio = (content) => {
    setAudioPlayer(prev => ({
      ...prev,
      isPlaying: true,
      duration: content.duration ? parseFloat(content.duration) * 3600 : 3600 // Convert hours to seconds
    }));
    
    // Simulate audio playback
    const interval = setInterval(() => {
      setAudioPlayer(prev => {
        if (prev.currentTime >= prev.duration) {
          clearInterval(interval);
          return { ...prev, isPlaying: false, currentTime: 0 };
        }
        return { ...prev, currentTime: prev.currentTime + 1 };
      });
    }, 1000);
  };

  const pauseAudio = () => {
    setAudioPlayer(prev => ({ ...prev, isPlaying: false }));
  };

  const setAudioSpeed = (speed) => {
    setAudioPlayer(prev => ({ ...prev, speed }));
  };

  // Component Views
  const HomeView = () => {
    const getRecommendedContent = () => {
      const stage = userProfile?.currentDikengaStage || 'kala';
      const recommendations = culturalLibrary?.recommendations?.[stage] || [];
      
      const allContent = [];
      Object.values(learningLibrary.dikengaPaths).forEach(path => {
        allContent.push(...path.content);
      });
      Object.values(learningLibrary.sevenBodiesTracks).forEach(track => {
        allContent.push(...track.content);
      });

      return allContent.filter(content => 
        recommendations.includes(content.id) || 
        content.difficulty === 'Beginner'
      ).slice(0, 6);
    };

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="glass-card p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Learning Center & Digital Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ancient wisdom organized through Bantu-Kongo and Egyptian frameworks
          </p>
        </div>

        {/* Search Bar */}
        <div className="glass-card p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Search across all wisdom traditions..."
              className="glass-input flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchContent(searchQuery)}
            />
            <button
              onClick={() => searchContent(searchQuery)}
              className="primary-button px-6"
              disabled={isLoading}
            >
              ð Search
            </button>
          </div>
        </div>

        {/* Quick Access */}
        <div className="grid md:grid-cols-4 gap-4">
          <button
            onClick={() => setCurrentView('library')}
            className="glass-card p-4 text-center hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">ð</div>
            <div className="font-medium text-gray-800 dark:text-white">Browse Library</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Explore all collections
            </div>
          </button>
          
          <button
            onClick={() => setCurrentView('path')}
            className="glass-card p-4 text-center hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">ð¤ï¸</div>
            <div className="font-medium text-gray-800 dark:text-white">Learning Paths</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Structured courses
            </div>
          </button>
          
          <button
            onClick={() => setCurrentView('bookmarks')}
            className="glass-card p-4 text-center hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">ð</div>
            <div className="font-medium text-gray-800 dark:text-white">Bookmarks</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {bookmarks.length} saved items
            </div>
          </button>
          
          <button
            onClick={() => setCurrentView('community')}
            className="glass-card p-4 text-center hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">ð¥</div>
            <div className="font-medium text-gray-800 dark:text-white">Community</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Shared wisdom
            </div>
          </button>
        </div>

        {/* Recommended Content */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Recommended for Your Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Based on your current Dikenga stage: <strong>{userProfile?.currentDikengaStage || 'Kala'}</strong>
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getRecommendedContent().map((content) => (
              <ContentCard key={content.id} content={content} onOpen={openContent} />
            ))}
          </div>
        </div>

        {/* Featured Collections */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
              ð Dikenga Paths
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Learning organized by the four sacred moments
            </p>
            <div className="space-y-2">
              {Object.entries(learningLibrary.dikengaPaths).map(([key, path]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: path.color }}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{path.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
              ð Seven Bodies Tracks
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Development for each level of being
            </p>
            <div className="space-y-2">
              {Object.entries(learningLibrary.sevenBodiesTracks).slice(0, 4).map(([key, track]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: track.color }}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{track.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
              ðï¸ Cultural Collections
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Traditional wisdom from ancient cultures
            </p>
            <div className="space-y-2">
              {Object.entries(learningLibrary.culturalCollections).map(([key, collection]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{collection.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Content Card Component
  const ContentCard = ({ content, onOpen }) => {
    const progress = learningProgress[content.id]?.progress || 0;
    
    const getTypeIcon = (type) => {
      switch (type) {
        case 'pdf': return 'ð';
        case 'audio': return 'ð§';
        case 'video': return 'ð¥';
        default: return 'ð';
      }
    };

    const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
        case 'Beginner': return 'text-green-600 dark:text-green-400';
        case 'Intermediate': return 'text-yellow-600 dark:text-yellow-400';
        case 'Advanced': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    return (
      <div
        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group"
        onClick={() => onOpen(content)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{getTypeIcon(content.type)}</span>
            <span className={`text-xs font-medium ${getDifficultyColor(content.difficulty)}`}>
              {content.difficulty}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addBookmark(content);
            }}
            className="text-gray-400 hover:text-yellow-500 transition-colors"
          >
            ð
          </button>
        </div>

        <h4 className="font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-primary-600 line-clamp-2">
          {content.title}
        </h4>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {content.description}
        </p>

        <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
          <div>By {content.author}</div>
          <div className="flex items-center justify-between mt-1">
            <span>
              {content.pages ? `${content.pages} pages` : content.duration}
            </span>
            {progress > 0 && (
              <span className="text-primary-600 dark:text-primary-400">
                {Math.round(progress * 100)}% complete
              </span>
            )}
          </div>
        </div>

        {content.culturalContext && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-xs text-yellow-800 dark:text-yellow-200 mb-3">
            <strong>Cultural Context:</strong> {content.culturalContext}
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {content.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/20 rounded-full text-xs text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {progress > 0 && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div
                className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Library Browser View
  const LibraryBrowserView = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="glass-card p-8">
        <button
          onClick={() => setCurrentView('home')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          â Back to Home
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Browse Digital Library
        </h1>

        {/* Dikenga Paths */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Dikenga Cycle Learning Paths
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(learningLibrary.dikengaPaths).map(([key, path]) => (
              <div key={key} className="p-6 rounded-lg border-2" style={{ borderColor: `${path.color}40` }}>
                <div className="flex items-center mb-3">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: path.color }}
                  ></div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {path.name}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {path.description}
                </p>
                <div className="space-y-3">
                  {path.content.map((content) => (
                    <div
                      key={content.id}
                      className="p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                      onClick={() => openContent(content)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{content.type === 'pdf' ? 'ð' : content.type === 'audio' ? 'ð§' : 'ð¥'}</span>
                          <span className="font-medium text-gray-800 dark:text-white">{content.title}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {content.pages ? `${content.pages}p` : content.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seven Bodies Tracks */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Seven Bodies Development Tracks
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(learningLibrary.sevenBodiesTracks).map(([key, track]) => (
              <div key={key} className="p-4 rounded-lg border-2" style={{ borderColor: `${track.color}40` }}>
                <div className="flex items-center mb-2">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: track.color }}
                  ></div>
                  <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                    {track.name}
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {track.frequency}
                </p>
                <div className="space-y-2">
                  {track.content.map((content) => (
                    <div
                      key={content.id}
                      className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-primary-600"
                      onClick={() => openContent(content)}
                    >
                      {content.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Collections */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Cultural Wisdom Collections
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(learningLibrary.culturalCollections).map(([key, collection]) => (
              <div key={key} className="p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  {collection.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {collection.description}
                </p>
                <div className="space-y-2">
                  {collection.content.map((content) => (
                    <div
                      key={content.id}
                      className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                      onClick={() => openContent(content)}
                    >
                      <div className="text-sm font-medium text-gray-800 dark:text-white">
                        {content.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        By {content.author}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // PDF Reader View
  const PDFReaderView = () => {
    if (!selectedContent) return <HomeView />;

    const [currentPage, setCurrentPage] = useState(1);
    const [annotations, setAnnotations] = useState([]);
    const [showNoteDialog, setShowNoteDialog] = useState(false);
    const [noteText, setNoteText] = useState('');

    const addAnnotation = (page, text, color = 'yellow') => {
      const annotation = {
        id: Date.now(),
        page,
        text,
        color,
        createdAt: new Date().toISOString()
      };
      setAnnotations(prev => [...prev, annotation]);
    };

    const saveNote = () => {
      if (noteText.trim()) {
        addNote(selectedContent, noteText, currentPage);
        setNoteText('');
        setShowNoteDialog(false);
      }
    };

    return (
      <div className="max-w-6xl mx-auto p-4 h-screen flex flex-col">
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
              <div className="font-bold text-gray-800 dark:text-white">{selectedContent.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                By {selectedContent.author} â¢ Page {currentPage} of {selectedContent.pages || 100}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => addBookmark(selectedContent, currentPage)}
              className="glass-button p-2"
              title="Bookmark Page"
            >
              ð
            </button>
            <button
              onClick={() => setShowNoteDialog(true)}
              className="glass-button p-2"
              title="Add Note"
            >
              ð
            </button>
            <button
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(
                  `Reading ${selectedContent.title} by ${selectedContent.author}. ${selectedContent.description}`
                );
                speechSynthesis.speak(utterance);
              }}
              className="glass-button p-2"
              title="Read Aloud"
            >
              ð
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid lg:grid-cols-4 gap-4">
          {/* PDF Viewer */}
          <div className="lg:col-span-3 glass-card p-6">
            <div className="bg-white rounded-lg shadow-inner p-8 min-h-full">
              {/* Simulated PDF Content */}
              <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  {selectedContent.title}
                </h1>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    This is a simulated PDF reader showing the content of "{selectedContent.title}" 
                    by {selectedContent.author}. In a real implementation, this would display the 
                    actual PDF content with full text rendering, zoom controls, and annotation capabilities.
                  </p>
                  <p>
                    <strong>Cultural Context:</strong> {selectedContent.culturalContext}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedContent.description}
                  </p>
                  <p>
                    The content would be organized according to the {selectedContent.difficulty} difficulty level,
                    with appropriate cultural context and traditional knowledge attribution throughout.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                    <p className="text-yellow-800">
                      <strong>Traditional Knowledge:</strong> This content includes sacred knowledge 
                      from African traditions. Please approach with respect and understanding of 
                      cultural context.
                    </p>
                  </div>
                  <p>
                    Tags: {selectedContent.tags?.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="glass-button px-4 py-2 disabled:opacity-50"
              >
                â Previous
              </button>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {selectedContent.pages || 100}
                </span>
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentPage / (selectedContent.pages || 100)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(selectedContent.pages || 100, currentPage + 1))}
                disabled={currentPage === (selectedContent.pages || 100)}
                className="glass-button px-4 py-2 disabled:opacity-50"
              >
                Next â
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Table of Contents */}
            <div className="glass-card p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                Table of Contents
              </h3>
              <div className="space-y-2 text-sm">
                <div className="cursor-pointer hover:text-primary-600 p-2 hover:bg-white/10 rounded">
                  1. Introduction (p. 1)
                </div>
                <div className="cursor-pointer hover:text-primary-600 p-2 hover:bg-white/10 rounded">
                  2. Historical Context (p. 15)
                </div>
                <div className="cursor-pointer hover:text-primary-600 p-2 hover:bg-white/10 rounded">
                  3. Core Principles (p. 32)
                </div>
                <div className="cursor-pointer hover:text-primary-600 p-2 hover:bg-white/10 rounded">
                  4. Practical Applications (p. 58)
                </div>
                <div className="cursor-pointer hover:text-primary-600 p-2 hover:bg-white/10 rounded">
                  5. Integration (p. 78)
                </div>
              </div>
            </div>

            {/* Bookmarks */}
            <div className="glass-card p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                Bookmarks
              </h3>
              <div className="space-y-2 text-sm">
                {bookmarks
                  .filter(b => b.content.id === selectedContent.id)
                  .map(bookmark => (
                    <div
                      key={bookmark.id}
                      className="cursor-pointer hover:text-primary-600 p-2 hover:bg-white/10 rounded"
                      onClick={() => setCurrentPage(bookmark.page || 1)}
                    >
                      ð Page {bookmark.page || 1}
                    </div>
                  ))}
                {bookmarks.filter(b => b.content.id === selectedContent.id).length === 0 && (
                  <div className="text-gray-500 dark:text-gray-500 text-center py-4">
                    No bookmarks yet
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="glass-card p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                Notes
              </h3>
              <div className="space-y-2 text-sm">
                {notes
                  .filter(n => n.content.id === selectedContent.id)
                  .map(note => (
                    <div key={note.id} className="p-2 bg-white/10 rounded">
                      <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                        Page {note.page || 1}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        {note.note}
                      </div>
                    </div>
                  ))}
                {notes.filter(n => n.content.id === selectedContent.id).length === 0 && (
                  <div className="text-gray-500 dark:text-gray-500 text-center py-4">
                    No notes yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Note Dialog */}
        {showNoteDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Add Note - Page {currentPage}
              </h3>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
                placeholder="Enter your note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowNoteDialog(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveNote}
                  className="primary-button px-4 py-2"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Audio Player View
  const AudioPlayerView = () => {
    if (!selectedContent) return <HomeView />;

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="max-w-4xl mx-auto p-6 h-screen flex flex-col justify-center">
        <div className="glass-card p-8">
          <button
            onClick={() => setCurrentView('home')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
          >
            â Back to Library
          </button>
          
          {/* Audio Player Interface */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-4xl text-white mx-auto mb-6">
              ð§
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {selectedContent.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              By {selectedContent.author}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              {selectedContent.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{formatTime(audioPlayer.currentTime)}</span>
              <span>{formatTime(audioPlayer.duration)}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 cursor-pointer">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(audioPlayer.currentTime / audioPlayer.duration) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <button
              onClick={() => setAudioPlayer(prev => ({ ...prev, currentTime: Math.max(0, prev.currentTime - 30) }))}
              className="glass-button p-3"
              title="Rewind 30s"
            >
              âª
            </button>
            
            <button
              onClick={() => audioPlayer.isPlaying ? pauseAudio() : playAudio(selectedContent)}
              className="primary-button p-4 rounded-full text-2xl"
            >
              {audioPlayer.isPlaying ? 'â¸ï¸' : 'â¶ï¸'}
            </button>
            
            <button
              onClick={() => setAudioPlayer(prev => ({ ...prev, currentTime: Math.min(prev.duration, prev.currentTime + 30) }))}
              className="glass-button p-3"
              title="Forward 30s"
            >
              â©
            </button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center justify-center space-x-8 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
              <select
                className="glass-input text-sm"
                value={audioPlayer.speed}
                onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1.0}>1.0x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2.0}>2.0x</option>
              </select>
            </div>
            
            <button
              onClick={() => addBookmark(selectedContent, null, audioPlayer.currentTime)}
              className="glass-button px-4 py-2"
            >
              ð Bookmark
            </button>
            
            <button
              onClick={() => setShowNoteDialog(true)}
              className="glass-button px-4 py-2"
            >
              ð Note
            </button>
          </div>

          {/* Cultural Context */}
          {selectedContent.culturalContext && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Cultural Context
              </h4>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                {selectedContent.culturalContext}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Search Results View
  const SearchResultsView = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="glass-card p-8">
        <button
          onClick={() => setCurrentView('home')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          â Back to Home
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Search Results for "{searchQuery}"
        </h1>

        {searchResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">ð</div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try different keywords or browse our collections
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((content) => (
              <ContentCard key={content.id} content={content} onOpen={openContent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Bookmarks View
  const BookmarksView = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="glass-card p-8">
        <button
          onClick={() => setCurrentView('home')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          â Back to Home
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Bookmarks & Notes
        </h1>

        {/* Bookmarks */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Bookmarks ({bookmarks.length})
          </h2>
          
          {bookmarks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">ð</div>
              <p>No bookmarks yet. Start reading to save your favorite content!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="p-4 bg-white/10 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-white mb-1">
                        {bookmark.content.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        By {bookmark.content.author}
                      </p>
                      {bookmark.page && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Page {bookmark.page}
                        </p>
                      )}
                      {bookmark.timestamp && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Time: {formatTime(bookmark.timestamp)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => openContent(bookmark.content)}
                      className="glass-button px-3 py-1 text-sm"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Notes ({notes.length})
          </h2>
          
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">ð</div>
              <p>No notes yet. Add notes while reading to capture your insights!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="p-4 bg-white/10 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {note.content.title}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {note.page && `Page ${note.page} â¢ `}
                    {note.timestamp && `${formatTime(note.timestamp)} â¢ `}
                    By {note.content.author}
                  </p>
                  <div className="bg-white/10 p-3 rounded border-l-4 border-primary-500">
                    <p className="text-gray-700 dark:text-gray-300">{note.note}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              Learning Center Debug Console
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
                  <div>Current View: {currentView}</div>
                  <div>Selected Content: {selectedContent?.title || 'None'}</div>
                  <div>Bookmarks: {bookmarks.length}</div>
                  <div>Notes: {notes.length}</div>
                  <div>Search Results: {searchResults.length}</div>
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-primary-900 dark:via-secondary-900 dark:to-accent-900">
      {/* Main Content */}
      {currentView === 'home' && <HomeView />}
      {currentView === 'library' && <LibraryBrowserView />}
      {currentView === 'reader' && <PDFReaderView />}
      {currentView === 'audio' && <AudioPlayerView />}
      {currentView === 'search' && <SearchResultsView />}
      {currentView === 'bookmarks' && <BookmarksView />}

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
            <p className="text-white font-medium">Loading cultural wisdom...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningCenter;
</boltArtifact>

<boltAction type="file" filePath="src/App.jsx">
import React, { useState, useEffect } from 'react';
import AsAManThinksAuth from './components/AsAManThinksAuth';
import MaiiaM from './components/MaiiaM';
import SevenBodiesSystem from './components/SevenBodiesSystem';
import VoiceChatInterface from './components/VoiceChatInterface';
import BreathingExercises from './components/BreathingExercises';
import LearningCenter from './components/LearningCenter';
import DarkModeToggle from './components/DarkModeToggle';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('auth'); // 'auth', 'maiiam', 'seven-bodies', 'voice-chat', 'breathing', 'learning'

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
      </div>
    </div>
  );
}

export default App;
