import React, { useState, useEffect, useRef } from 'react';

const MaiiaMMuse = () => {
  const [currentView, setCurrentView] = useState('home'); // home, player, therapy, community, discovery, settings
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showFloatingPlayer, setShowFloatingPlayer] = useState(false);
  const [playlistQueue, setPlaylistQueue] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [biometricData, setBiometricData] = useState({
    heartRate: 72,
    hrv: 45,
    stressLevel: 'low',
    breathingRate: 12
  });
  const [musicLibrary, setMusicLibrary] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [communityMusic, setCommunityMusic] = useState([]);
  const [therapySession, setTherapySession] = useState(null);
  const [audioSettings, setAudioSettings] = useState({
    eq: { bass: 0, mid: 0, treble: 0 },
    binauralBeats: false,
    frequencyHealing: false,
    adaptivePlayback: true
  });
  const [apiCalls, setApiCalls] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef(null);
  const floatingPlayerRef = useRef(null);

  const API_BASE = 'https://builder.empromptu.ai/api_tools';
  const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer c6303bcc8941b627ba1b32398f9cf214',
    'X-Generated-App-ID': 'ea635350-c7ed-4628-847a-4eb10ad33ffc',
    'X-Usage-Key': '75582975e7a6c43504f1962005902a95'
  };

  // Music Library Structure
  const musicCollections = {
    dikengaCycle: {
      kala: {
        name: 'Kala - Foundation Music',
        description: 'Grounding music for new beginnings and intention setting',
        color: '#FFD700',
        frequency: '256Hz',
        mood: 'grounding',
        tracks: [
          {
            id: 'kala-dawn',
            title: 'Dawn of New Beginnings',
            artist: 'Nganga Kala',
            duration: 480, // 8 minutes
            frequency: '256Hz',
            description: 'Traditional Bantu-Kongo foundation music for morning intention setting',
            culturalContext: 'Sacred music for the Kala moment of emergence',
            therapeuticBenefits: ['Grounding', 'Intention setting', 'Foundation building'],
            instruments: ['Kalimba', 'Earth drums', 'Ancestral chants'],
            biometricOptimal: { heartRate: [60, 75], stressLevel: 'low' }
          },
          {
            id: 'kala-roots',
            title: 'Ancestral Roots Connection',
            artist: 'Mama Nzinga',
            duration: 360,
            frequency: '256Hz',
            description: 'Deep grounding music connecting with ancestral wisdom',
            culturalContext: 'Traditional grounding ceremony music',
            therapeuticBenefits: ['Ancestral connection', 'Stability', 'Root chakra healing'],
            instruments: ['Djembe', 'Talking drum', 'Traditional vocals'],
            biometricOptimal: { heartRate: [55, 70], stressLevel: 'low' }
          }
        ]
      },
      tukula: {
        name: 'Tukula - Power Music',
        description: 'Energizing music for peak performance and leadership',
        color: '#FF4444',
        frequency: '341Hz',
        mood: 'empowering',
        tracks: [
          {
            id: 'tukula-power',
            title: 'Peak Power Activation',
            artist: 'Thoth-Ankh',
            duration: 420,
            frequency: '341Hz',
            description: 'High-energy music for accessing peak spiritual power',
            culturalContext: 'Traditional power ceremony music',
            therapeuticBenefits: ['Energy boost', 'Confidence', 'Leadership activation'],
            instruments: ['War drums', 'Horns', 'Power chants'],
            biometricOptimal: { heartRate: [80, 100], stressLevel: 'medium' }
          },
          {
            id: 'tukula-leadership',
            title: 'Sacred Leadership',
            artist: 'Kesi',
            duration: 540,
            frequency: '341Hz',
            description: 'Music for developing authentic spiritual leadership',
            culturalContext: 'Traditional leadership initiation music',
            therapeuticBenefits: ['Leadership development', 'Confidence', 'Authority'],
            instruments: ['Royal drums', 'Ceremonial bells', 'Leadership chants'],
            biometricOptimal: { heartRate: [75, 95], stressLevel: 'medium' }
          }
        ]
      },
      luvemba: {
        name: 'Luvemba - Release Music',
        description: 'Healing music for emotional release and transformation',
        color: '#4444FF',
        frequency: '320Hz',
        mood: 'healing',
        tracks: [
          {
            id: 'luvemba-release',
            title: 'Sacred Release Ceremony',
            artist: 'Nganga Kala',
            duration: 600,
            frequency: '320Hz',
            description: 'Deep healing music for emotional and spiritual release',
            culturalContext: 'Traditional purification ceremony music',
            therapeuticBenefits: ['Emotional release', 'Trauma healing', 'Purification'],
            instruments: ['Healing drums', 'Flutes', 'Cleansing chants'],
            biometricOptimal: { heartRate: [65, 80], stressLevel: 'high' }
          },
          {
            id: 'luvemba-transformation',
            title: 'Transformation Waters',
            artist: 'Mama Nzinga',
            duration: 720,
            frequency: '320Hz',
            description: 'Gentle music supporting deep personal transformation',
            culturalContext: 'Traditional transformation ritual music',
            therapeuticBenefits: ['Transformation', 'Healing', 'Renewal'],
            instruments: ['Water drums', 'Healing bells', 'Transformation vocals'],
            biometricOptimal: { heartRate: [60, 75], stressLevel: 'medium' }
          }
        ]
      },
      musoni: {
        name: 'Musoni - Renewal Music',
        description: 'Restorative music for deep rest and regeneration',
        color: '#8844FF',
        frequency: '480Hz',
        mood: 'restorative',
        tracks: [
          {
            id: 'musoni-renewal',
            title: 'Deep Renewal Meditation',
            artist: 'Thoth-Ankh',
            duration: 900,
            frequency: '480Hz',
            description: 'Deeply restorative music for spiritual renewal',
            culturalContext: 'Traditional renewal ceremony music',
            therapeuticBenefits: ['Deep rest', 'Regeneration', 'Spiritual renewal'],
            instruments: ['Singing bowls', 'Soft drums', 'Renewal chants'],
            biometricOptimal: { heartRate: [50, 65], stressLevel: 'low' }
          },
          {
            id: 'musoni-wisdom',
            title: 'Ancestral Wisdom Integration',
            artist: 'Kesi',
            duration: 660,
            frequency: '480Hz',
            description: 'Music for integrating wisdom and preparing for new cycles',
            culturalContext: 'Traditional wisdom integration music',
            therapeuticBenefits: ['Wisdom integration', 'Preparation', 'Renewal'],
            instruments: ['Wisdom bells', 'Ancestral drums', 'Integration vocals'],
            biometricOptimal: { heartRate: [55, 70], stressLevel: 'low' }
          }
        ]
      }
    },
    sevenBodies: {
      physical: {
        name: 'Physical Body Healing',
        frequency: '256Hz',
        color: '#FF4444',
        note: 'C',
        tracks: [
          {
            id: 'physical-grounding',
            title: 'Earth Connection Healing',
            artist: 'Nganga Kala',
            duration: 480,
            frequency: '256Hz',
            description: 'Grounding music for physical body healing and earth connection',
            therapeuticBenefits: ['Physical grounding', 'Body healing', 'Earth connection'],
            instruments: ['Earth drums', 'Grounding bowls', 'Body healing chants']
          }
        ]
      },
      etheric: {
        name: 'Etheric Body Activation',
        frequency: '288Hz',
        color: '#FF8844',
        note: 'D',
        tracks: [
          {
            id: 'etheric-energy',
            title: 'Life Force Activation',
            artist: 'Mama Nzinga',
            duration: 420,
            frequency: '288Hz',
            description: 'Energy circulation music for etheric body activation',
            therapeuticBenefits: ['Energy circulation', 'Vitality boost', 'Life force activation'],
            instruments: ['Energy drums', 'Vitality bells', 'Life force chants']
          }
        ]
      },
      astral: {
        name: 'Astral Body Healing',
        frequency: '320Hz',
        color: '#FFDD44',
        note: 'E',
        tracks: [
          {
            id: 'astral-emotional',
            title: 'Emotional Heart Opening',
            artist: 'Thoth-Ankh',
            duration: 540,
            frequency: '320Hz',
            description: 'Heart-opening music for emotional healing and astral body work',
            therapeuticBenefits: ['Emotional healing', 'Heart opening', 'Astral cleansing'],
            instruments: ['Heart drums', 'Emotional flutes', 'Heart opening vocals']
          }
        ]
      },
      mental: {
        name: 'Mental Body Clarity',
        frequency: '341Hz',
        color: '#44FF44',
        note: 'F',
        tracks: [
          {
            id: 'mental-clarity',
            title: 'Mind Clarity Enhancement',
            artist: 'Kesi',
            duration: 360,
            frequency: '341Hz',
            description: 'Focus-enhancing music for mental clarity and cognitive function',
            therapeuticBenefits: ['Mental clarity', 'Focus enhancement', 'Cognitive boost'],
            instruments: ['Clarity bells', 'Focus drums', 'Mental enhancement tones']
          }
        ]
      },
      causal: {
        name: 'Causal Body Connection',
        frequency: '384Hz',
        color: '#4488FF',
        note: 'G',
        tracks: [
          {
            id: 'causal-ancestral',
            title: 'Ancestral Soul Connection',
            artist: 'Nganga Kala',
            duration: 720,
            frequency: '384Hz',
            description: 'Deep ancestral connection music for causal body healing',
            therapeuticBenefits: ['Ancestral connection', 'Soul healing', 'Karmic clearing'],
            instruments: ['Ancestral drums', 'Soul bells', 'Ancestral chants']
          }
        ]
      },
      buddhic: {
        name: 'Buddhic Body Opening',
        frequency: '426Hz',
        color: '#8844FF',
        note: 'A',
        tracks: [
          {
            id: 'buddhic-intuition',
            title: 'Intuitive Awakening',
            artist: 'Mama Nzinga',
            duration: 600,
            frequency: '426Hz',
            description: 'Intuition-opening music for buddhic body development',
            therapeuticBenefits: ['Intuitive opening', 'Spiritual awakening', 'Healing gifts'],
            instruments: ['Intuition bells', 'Awakening drums', 'Spiritual vocals']
          }
        ]
      },
      atmic: {
        name: 'Atmic Body Unity',
        frequency: '480Hz',
        color: '#DD44FF',
        note: 'B',
        tracks: [
          {
            id: 'atmic-unity',
            title: 'Divine Unity Consciousness',
            artist: 'Thoth-Ankh',
            duration: 900,
            frequency: '480Hz',
            description: 'Unity consciousness music for atmic body connection',
            therapeuticBenefits: ['Unity consciousness', 'Divine connection', 'Universal love'],
            instruments: ['Unity bowls', 'Divine bells', 'Unity consciousness tones']
          }
        ]
      }
    },
    culturalCollections: {
      traditional: {
        name: 'Traditional African Healing Music',
        description: 'Authentic traditional healing music from various African cultures',
        tracks: [
          {
            id: 'traditional-healing',
            title: 'Ancient Healing Ceremony',
            artist: 'Elder Musicians Collective',
            duration: 1200,
            description: 'Traditional African healing ceremony music',
            culturalContext: 'Sacred healing music from multiple African traditions',
            therapeuticBenefits: ['Traditional healing', 'Cultural connection', 'Ancestral wisdom'],
            instruments: ['Traditional drums', 'Healing rattles', 'Ceremonial vocals']
          }
        ]
      },
      egyptian: {
        name: 'Egyptian/Kemetic Sacred Sounds',
        description: 'Ancient Egyptian sacred music and sound healing',
        tracks: [
          {
            id: 'egyptian-sacred',
            title: 'Temple of Ma\'at Harmonics',
            artist: 'Kemetic Sound Healers',
            duration: 840,
            description: 'Sacred Egyptian temple music for spiritual alignment',
            culturalContext: 'Ancient Egyptian temple music for Ma\'at alignment',
            therapeuticBenefits: ['Spiritual alignment', 'Ma\'at principles', 'Sacred geometry'],
            instruments: ['Sistrum', 'Temple bells', 'Sacred chants']
          }
        ]
      },
      modern: {
        name: 'Modern Therapeutic Compositions',
        description: 'Contemporary music designed for therapeutic healing',
        tracks: [
          {
            id: 'modern-therapy',
            title: 'Binaural Healing Journey',
            artist: 'Modern Healing Collective',
            duration: 600,
            description: 'Modern therapeutic music with binaural beats',
            therapeuticBenefits: ['Stress reduction', 'Brainwave entrainment', 'Deep relaxation'],
            instruments: ['Synthesized tones', 'Binaural beats', 'Therapeutic frequencies']
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
    initializeMusicSystem();
    simulateBiometricData();
  }, []);

  // Audio playback simulation
  useEffect(() => {
    let interval;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            playNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, duration]);

  const initializeMusicSystem = async () => {
    setIsLoading(true);
    
    try {
      // Initialize music therapy wisdom
      await apiCall('/input_data', 'POST', {
        created_object_name: "music_therapy_wisdom",
        data_type: "strings",
        input_data: [
          `AFRICAN MUSIC HEALING TRADITIONS:

          Traditional African Music Therapy:
          - "Ngoma" (Healing drums) - Therapeutic drumming for physical and spiritual healing
          - "Mbira" (Thumb piano) - Ancestral communication and spiritual healing music
          - "Kalimba" - Meditation and grounding music for mental clarity
          - "Djembe" - Community healing and energy circulation music
          - "Talking drums" - Communication with spirits and emotional expression

          Bantu-Kongo Music Healing Philosophy:
          Music as "Nkisi" (Sacred medicine) - Sound as a healing force that can:
          - Restore balance between the physical and spiritual worlds
          - Connect individuals with ancestral wisdom and guidance
          - Facilitate community healing and collective transformation
          - Support individual healing through vibrational medicine
          - Create sacred space for spiritual work and transformation

          Dikenga Cycle Music Applications:
          Kala Music: Foundation and grounding music using earth tones and steady rhythms
          - Frequencies around 256Hz for physical grounding
          - Slow, steady rhythms matching resting heart rate
          - Instruments: Earth drums, kalimba, grounding chants

          Tukula Music: Power and activation music using dynamic rhythms and higher frequencies
          - Frequencies around 341Hz for mental activation
          - Energizing rhythms matching active heart rate
          - Instruments: War drums, horns, power chants

          Luvemba Music: Release and healing music using flowing, cleansing sounds
          - Frequencies around 320Hz for emotional healing
          - Gentle, flowing rhythms for emotional release
          - Instruments: Water drums, flutes, healing vocals

          Musoni Music: Renewal and integration music using deep, restorative tones
          - Frequencies around 480Hz for spiritual connection
          - Very slow, meditative rhythms for deep rest
          - Instruments: Singing bowls, soft drums, renewal chants`,

          `SEVEN BODIES MUSIC HEALING SYSTEM:

          Each body resonates with specific frequencies and musical elements:

          Physical Body (256Hz - C Note):
          - Grounding drums and earth-based instruments
          - Rhythms that match and regulate heart rate
          - Music for physical healing and body awareness
          - Traditional healing songs for specific ailments

          Etheric Body (288Hz - D Note):
          - Energy circulation music with flowing rhythms
          - Breathwork-synchronized musical patterns
          - Vitality-boosting frequencies and tones
          - Life force activation through sound

          Astral Body (320Hz - E Note):
          - Emotional healing music with heart-opening qualities
          - Music for processing and releasing emotions
          - Creative expression through musical participation
          - Heart chakra healing frequencies

          Mental Body (341Hz - F Note):
          - Focus-enhancing music for concentration
          - Cognitive clarity through specific frequencies
          - Music for studying and mental work
          - Brainwave entrainment for optimal mental states

          Causal Body (384Hz - G Note):
          - Ancestral connection music for soul healing
          - Music for accessing past-life and karmic information
          - Deep soul healing through traditional chants
          - Ancestral communication through musical meditation

          Buddhic Body (426Hz - A Note):
          - Intuitive opening music for spiritual development
          - Music for developing healing and psychic abilities
          - Spiritual awakening through sacred sound
          - Music for preparing spiritual teachers and healers

          Atmic Body (480Hz - B Note):
          - Unity consciousness music for divine connection
          - Music for experiencing oneness and universal love
          - Highest spiritual frequencies for transcendence
          - Music for advanced spiritual practitioners and masters`,

          `THERAPEUTIC MUSIC APPLICATIONS:

          Biometric-Responsive Music Therapy:
          - Heart Rate Variability (HRV) synchronized music for coherence training
          - Stress-level responsive playlists that adapt to current emotional state
          - Breathing-synchronized music for respiratory therapy
          - Sleep-stage appropriate music for optimal rest and recovery

          Community Music Healing:
          - Group drumming circles for collective healing
          - Community singing for social bonding and emotional release
          - Collaborative music creation for creative therapy
          - Intergenerational music sharing for cultural preservation

          Personalized Music Medicine:
          - Individual frequency profiles based on seven bodies assessment
          - Customized healing playlists for specific conditions
          - Progressive music therapy programs for long-term healing
          - Integration with other healing modalities (breathing, meditation, movement)

          Cultural Music Preservation and Healing:
          - Recording and preserving traditional healing music
          - Training new generations in traditional music healing
          - Respectful integration of traditional and modern therapeutic music
          - Supporting traditional musicians and cultural preservation efforts`
        ]
      });

      // Generate personalized music recommendations
      await apiCall('/apply_prompt', 'POST', {
        created_object_names: ["music_recommendations"],
        prompt_string: `Based on this music therapy wisdom: {music_therapy_wisdom}, create a comprehensive music recommendation and therapy system that includes:

1. PERSONALIZED MUSIC THERAPY:
   - Biometric-responsive music selection algorithms
   - Seven bodies-based healing music recommendations
   - Dikenga stage-appropriate musical experiences
   - Stress and mood-adaptive playlist generation

2. THERAPEUTIC SESSION STRUCTURES:
   - Guided music therapy sessions for different conditions
   - Progressive healing music programs
   - Integration with breathing and meditation practices
   - Community music healing circle formats

3. CULTURAL MUSIC INTEGRATION:
   - Respectful use of traditional African healing music
   - Educational content about cultural music traditions
   - Community validation and elder approval processes
   - Revenue sharing with traditional musicians and communities

4. COMMUNITY MUSIC FEATURES:
   - User-generated healing music sharing
   - Collaborative music creation tools
   - Community playlist building and sharing
   - Cultural music preservation initiatives

5. ADVANCED THERAPEUTIC FEATURES:
   - Binaural beat generation for brainwave entrainment
   - Frequency healing with seven bodies alignment
   - Real-time music adaptation based on biometric feedback
   - Integration with other healing modalities

Format as JSON with clear therapeutic protocols and cultural guidelines.`,
        inputs: [
          {
            input_object_name: "music_therapy_wisdom",
            mode: "combine_events"
          }
        ]
      });

      const musicResult = await apiCall('/return_data', 'POST', {
        object_name: "music_recommendations",
        return_type: "json"
      });

      try {
        const parsedWisdom = JSON.parse(musicResult.value[0]);
        setMusicLibrary(parsedWisdom);
      } catch (parseError) {
        console.error('Error parsing music wisdom:', parseError);
        setMusicLibrary(createFallbackMusicLibrary());
      }

    } catch (error) {
      console.error('Error initializing music system:', error);
      setMusicLibrary(createFallbackMusicLibrary());
    } finally {
      setIsLoading(false);
    }
  };

  const createFallbackMusicLibrary = () => ({
    therapeuticProtocols: {
      stressReduction: {
        lowStress: ['musoni-renewal', 'atmic-unity'],
        mediumStress: ['luvemba-release', 'astral-emotional'],
        highStress: ['luvemba-transformation', 'physical-grounding']
      },
      sleepSupport: ['musoni-renewal', 'atmic-unity', 'causal-ancestral'],
      focusEnhancement: ['mental-clarity', 'tukula-power'],
      emotionalHealing: ['luvemba-release', 'astral-emotional', 'luvemba-transformation']
    },
    communityFeatures: {
      musicSharing: true,
      collaborativeCreation: true,
      culturalPreservation: true,
      elderValidation: true
    },
    biometricIntegration: {
      heartRateSync: true,
      hrvCoherence: true,
      stressAdaptive: true,
      breathingSync: true
    }
  });

  const simulateBiometricData = () => {
    const updateBiometrics = () => {
      setBiometricData(prev => ({
        heartRate: Math.max(50, Math.min(120, prev.heartRate + (Math.random() - 0.5) * 6)),
        hrv: Math.max(20, Math.min(80, prev.hrv + (Math.random() - 0.5) * 8)),
        stressLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        breathingRate: Math.max(8, Math.min(20, prev.breathingRate + (Math.random() - 0.5) * 2))
      }));
    };

    const interval = setInterval(updateBiometrics, 3000);
    return () => clearInterval(interval);
  };

  // Music Player Functions
  const playTrack = (track, playlist = null) => {
    setCurrentTrack(track);
    setCurrentPlaylist(playlist);
    setDuration(track.duration);
    setCurrentTime(0);
    setIsPlaying(true);
    setShowFloatingPlayer(true);

    // Simulate biometric adaptation
    if (audioSettings.adaptivePlayback && track.biometricOptimal) {
      adaptMusicToBiometrics(track);
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    setIsPlaying(true);
  };

  const stopTrack = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setShowFloatingPlayer(false);
  };

  const playNextTrack = () => {
    if (playlistQueue.length > 0) {
      const nextTrack = playlistQueue[0];
      setPlaylistQueue(prev => prev.slice(1));
      playTrack(nextTrack, currentPlaylist);
    } else {
      stopTrack();
    }
  };

  const playPreviousTrack = () => {
    if (currentTime > 10) {
      setCurrentTime(0);
    } else {
      // In a real implementation, this would play the previous track
      setCurrentTime(0);
    }
  };

  const seekTo = (time) => {
    setCurrentTime(Math.max(0, Math.min(duration, time)));
  };

  const adaptMusicToBiometrics = (track) => {
    const { heartRate, stressLevel } = biometricData;
    const optimal = track.biometricOptimal;

    if (optimal && optimal.heartRate) {
      const [minHR, maxHR] = optimal.heartRate;
      if (heartRate < minHR || heartRate > maxHR) {
        // In a real implementation, this would adjust tempo/frequency
        console.log(`Adapting music for heart rate: ${heartRate} (optimal: ${minHR}-${maxHR})`);
      }
    }
  };

  const createTherapySession = (type, duration = 1800) => {
    const sessionTracks = musicLibrary?.therapeuticProtocols?.[type] || [];
    const tracks = [];
    
    // Get tracks from collections
    Object.values(musicCollections.dikengaCycle).forEach(cycle => {
      cycle.tracks.forEach(track => {
        if (sessionTracks.includes(track.id)) {
          tracks.push(track);
        }
      });
    });

    Object.values(musicCollections.sevenBodies).forEach(body => {
      body.tracks.forEach(track => {
        if (sessionTracks.includes(track.id)) {
          tracks.push(track);
        }
      });
    });

    const session = {
      id: Date.now(),
      type,
      duration,
      tracks,
      createdAt: new Date().toISOString()
    };

    setTherapySession(session);
    return session;
  };

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Component Views
  const HomeView = () => {
    const getRecommendedTracks = () => {
      const { stressLevel, heartRate } = biometricData;
      let recommendations = [];

      // Add stress-appropriate tracks
      if (stressLevel === 'high') {
        recommendations.push(...musicCollections.dikengaCycle.luvemba.tracks);
      } else if (stressLevel === 'medium') {
        recommendations.push(...musicCollections.dikengaCycle.kala.tracks);
      } else {
        recommendations.push(...musicCollections.dikengaCycle.musoni.tracks);
      }

      // Add heart rate appropriate tracks
      if (heartRate > 80) {
        recommendations.push(...musicCollections.sevenBodies.physical.tracks);
      } else if (heartRate < 60) {
        recommendations.push(...musicCollections.sevenBodies.atmic.tracks);
      }

      return recommendations.slice(0, 6);
    };

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="glass-card p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            MaiiaM Muse Music Therapy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Therapeutic music with cultural healing traditions and biometric integration
          </p>
        </div>

        {/* Biometric Status */}
        <div className="glass-card p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Current Biometric State
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{Math.round(biometricData.heartRate)}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Heart Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{Math.round(biometricData.hrv)}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">HRV Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{Math.round(biometricData.breathingRate)}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Breathing Rate</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                biometricData.stressLevel === 'low' ? 'text-green-500' :
                biometricData.stressLevel === 'medium' ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {biometricData.stressLevel.toUpperCase()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Stress Level</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4">
          <button
            onClick={() => setCurrentView('therapy')}
            className="glass-card p-4 text-center hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">ðµ</div>
            <div className="font-medium text-gray-800 dark:text-white">Music Therapy</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Guided sessions</div>
          </button>
          
          <button
            onClick={() => setCurrentView('discovery')}
            className="glass-card p-4 text-center hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">ð</div>
            <div className="font-medium text-gray-800 dark:text-white">Discover</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Explore music</div>
          </button>
          
          <button
            onClick={() => setCurrentView('community')}
            className="glass-card p-4 text-center hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">ð¥</div>
            <div className="font-medium text-gray-800 dark:text-white">Community</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Shared music</div>
          </button>
          
          <button
            onClick={() => setCurrentView('settings')}
            className="glass-card p-4 text-center hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-2">âï¸</div>
            <div className="font-medium text-gray-800 dark:text-white">Settings</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Audio preferences</div>
          </button>
        </div>

        {/* Recommended Music */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Recommended for Your Current State
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Based on your biometrics: {Math.round(biometricData.heartRate)} BPM, {biometricData.stressLevel} stress
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getRecommendedTracks().map((track) => (
              <TrackCard key={track.id} track={track} onPlay={playTrack} />
            ))}
          </div>
        </div>

        {/* Featured Collections */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              ð Dikenga Cycle Music
            </h3>
            <div className="space-y-3">
              {Object.entries(musicCollections.dikengaCycle).map(([key, cycle]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() => playTrack(cycle.tracks[0], cycle)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cycle.color }}
                    ></div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">{cycle.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {cycle.tracks.length} tracks â¢ {cycle.frequency}
                      </div>
                    </div>
                  </div>
                  <button className="text-primary-500 hover:text-primary-600">â¶ï¸</button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              ð Seven Bodies Healing
            </h3>
            <div className="space-y-2">
              {Object.entries(musicCollections.sevenBodies).slice(0, 4).map(([key, body]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2 bg-white/10 rounded cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() => playTrack(body.tracks[0], body)}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: body.color }}
                    ></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{body.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">{body.frequency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Track Card Component
  const TrackCard = ({ track, onPlay }) => (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-1 group-hover:text-primary-600">
            {track.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            By {track.artist}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
            {formatTime(track.duration)} â¢ {track.frequency}
          </p>
        </div>
        <button
          onClick={() => onPlay(track)}
          className="text-2xl text-primary-500 hover:text-primary-600 transition-colors"
        >
          â¶ï¸
        </button>
      </div>

      {track.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {track.description}
        </p>
      )}

      {track.culturalContext && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-xs text-yellow-800 dark:text-yellow-200 mb-3">
          <strong>Cultural Context:</strong> {track.culturalContext}
        </div>
      )}

      {track.therapeuticBenefits && (
        <div className="flex flex-wrap gap-1 mb-3">
          {track.therapeuticBenefits.slice(0, 3).map((benefit, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs"
            >
              {benefit}
            </span>
          ))}
        </div>
      )}

      {track.instruments && (
        <div className="text-xs text-gray-500 dark:text-gray-500">
          <strong>Instruments:</strong> {track.instruments.join(', ')}
        </div>
      )}
    </div>
  );

  // Full Player View
  const FullPlayerView = () => {
    if (!currentTrack) return <HomeView />;

    return (
      <div className="max-w-4xl mx-auto p-6 h-screen flex flex-col justify-center">
        <div className="glass-card p-8">
          <button
            onClick={() => setCurrentView('home')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
          >
            â Back to Home
          </button>
          
          {/* Album Art / Visualization */}
          <div className="text-center mb-8">
            <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-6xl text-white mx-auto mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">ðµ</div>
              {/* Animated visualization */}
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 bg-white/30 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 100 + 20}px`,
                        left: `${(i * 8) + 20}%`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.8s'
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {currentTrack.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              By {currentTrack.artist}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              {currentTrack.frequency} â¢ {formatTime(currentTrack.duration)}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div 
              className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                seekTo(percentage * duration);
              }}
            >
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <button
              onClick={playPreviousTrack}
              className="glass-button p-3 text-xl"
            >
              â®ï¸
            </button>
            
            <button
              onClick={() => seekTo(Math.max(0, currentTime - 30))}
              className="glass-button p-3"
              title="Rewind 30s"
            >
              âª
            </button>
            
            <button
              onClick={() => isPlaying ? pauseTrack() : resumeTrack()}
              className="primary-button p-4 rounded-full text-3xl"
            >
              {isPlaying ? 'â¸ï¸' : 'â¶ï¸'}
            </button>
            
            <button
              onClick={() => seekTo(Math.min(duration, currentTime + 30))}
              className="glass-button p-3"
              title="Forward 30s"
            >
              â©
            </button>
            
            <button
              onClick={playNextTrack}
              className="glass-button p-3 text-xl"
            >
              â­ï¸
            </button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center justify-center space-x-8 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Volume:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20"
              />
            </div>
            
            <button
              onClick={() => setAudioSettings(prev => ({ ...prev, binauralBeats: !prev.binauralBeats }))}
              className={`glass-button px-4 py-2 ${audioSettings.binauralBeats ? 'bg-primary-500 text-white' : ''}`}
            >
              ð§  Binaural
            </button>
            
            <button
              onClick={() => setAudioSettings(prev => ({ ...prev, frequencyHealing: !prev.frequencyHealing }))}
              className={`glass-button px-4 py-2 ${audioSettings.frequencyHealing ? 'bg-primary-500 text-white' : ''}`}
            >
              ð¯ Frequency
            </button>
          </div>

          {/* Track Info */}
          <div className="space-y-4">
            {currentTrack.description && (
              <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300">{currentTrack.description}</p>
              </div>
            )}

            {currentTrack.culturalContext && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Cultural Context
                </h4>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  {currentTrack.culturalContext}
                </p>
              </div>
            )}

            {currentTrack.therapeuticBenefits && (
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 rounded">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Therapeutic Benefits
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentTrack.therapeuticBenefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Floating Player Component
  const FloatingPlayer = () => {
    if (!showFloatingPlayer || !currentTrack) return null;

    return (
      <div
        ref={floatingPlayerRef}
        className="fixed bottom-4 right-4 z-50 glass-card p-4 w-80 shadow-2xl"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
            ðµ
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-800 dark:text-white truncate">
              {currentTrack.title}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {currentTrack.artist}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
              <div
                className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => isPlaying ? pauseTrack() : resumeTrack()}
              className="text-xl text-gray-700 dark:text-gray-300 hover:text-primary-500"
            >
              {isPlaying ? 'â¸ï¸' : 'â¶ï¸'}
            </button>
            <button
              onClick={() => setCurrentView('player')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500"
            >
              â¬ï¸
            </button>
            <button
              onClick={() => setShowFloatingPlayer(false)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-500"
            >
              â
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Music Therapy View
  const MusicTherapyView = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="glass-card p-8">
        <button
          onClick={() => setCurrentView('home')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          â Back to Home
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Music Therapy Sessions
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              type: 'stressReduction',
              name: 'Stress Reduction',
              description: 'Calming music therapy for stress relief and relaxation',
              duration: 30,
              icon: 'ð',
              color: 'blue'
            },
            {
              type: 'sleepSupport',
              name: 'Sleep Support',
              description: 'Gentle music to prepare for restful sleep',
              duration: 45,
              icon: 'ð´',
              color: 'purple'
            },
            {
              type: 'focusEnhancement',
              name: 'Focus Enhancement',
              description: 'Concentration-boosting music for mental clarity',
              duration: 25,
              icon: 'ð¯',
              color: 'green'
            },
            {
              type: 'emotionalHealing',
              name: 'Emotional Healing',
              description: 'Therapeutic music for emotional processing and healing',
              duration: 40,
              icon: 'ð',
              color: 'pink'
            }
          ].map((session) => (
            <div
              key={session.type}
              className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => {
                const therapySession = createTherapySession(session.type, session.duration * 60);
                if (therapySession.tracks.length > 0) {
                  playTrack(therapySession.tracks[0]);
                  setPlaylistQueue(therapySession.tracks.slice(1));
                }
              }}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{session.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {session.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {session.description}
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  Duration: {session.duration} minutes
                </div>
              </div>
              
              <button className="w-full primary-button">
                Start Session
              </button>
            </div>
          ))}
        </div>

        {/* Current Biometric Recommendations */}
        <div className="mt-8 glass-card p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Personalized Recommendations
          </h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Based on Your Current State
            </h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
              Heart Rate: {Math.round(biometricData.heartRate)} BPM â¢ 
              Stress Level: {biometricData.stressLevel} â¢ 
              HRV: {Math.round(biometricData.hrv)}
            </p>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              {biometricData.stressLevel === 'high' 
                ? 'We recommend starting with stress reduction therapy to help lower your stress levels.'
                : biometricData.stressLevel === 'medium'
                ? 'Consider focus enhancement or emotional healing sessions for balanced wellness.'
                : 'Your stress levels are low - perfect for sleep support or deeper healing work.'
              }
            </p>
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
              Music System Debug Console
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
                  <div>Current Track: {currentTrack?.title || 'None'}</div>
                  <div>Playing: {isPlaying ? 'Yes' : 'No'}</div>
                  <div>Heart Rate: {Math.round(biometricData.heartRate)} BPM</div>
                  <div>Stress Level: {biometricData.stressLevel}</div>
                  <div>Floating Player: {showFloatingPlayer ? 'Visible' : 'Hidden'}</div>
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
      {currentView === 'player' && <FullPlayerView />}
      {currentView === 'therapy' && <MusicTherapyView />}

      {/* Floating Player */}
      <FloatingPlayer />

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
            <p className="text-white font-medium">Loading music therapy system...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaiiaMMuse;
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
import DarkModeToggle from './components/DarkModeToggle';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('auth'); // 'auth', 'maiiam', 'seven-bodies', 'voice-chat', 'breathing', 'learning', 'music'

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
      </div>
    </div>
  );
}

export default App;
