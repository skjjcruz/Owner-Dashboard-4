// Player data structure
const player = {
  // Core Identity
  id: "uuid-or-integer",
  name: "Cameron Ward",
  position: "QB",
  school: "Miami",
  
  // Physical Attributes
  physical: {
    height: '6\'2"',
    weight: 223,
    armLength: 32.5, // inches
    handSize: 10.25, // inches
    wingspan: 77, // inches
    speed40: 4.58, // seconds
    speed3Cone: 7.12,
    verticalJump: 32.5, // inches
    broadJump: 118, // inches
    benchPress: 15, // reps at 225lbs
    shuttle: 4.25
  },
  
  // Draft Profile
  classYear: "Senior", // or "Junior", "Redshirt Sophomore", etc.
  eligibility: 2026,
  earlyDeclaration: false,
  
  // Consensus Rankings
  consensus: {
    overallRank: 1,
    positionRank: 1,
    tier: 1, // 1-5 scale
    averageRank: 1.2, // average across all sources
    standardDeviation: 0.8, // how much variance in rankings
    trending: "up" // "up", "down", "stable"
  },
  
  // Individual Source Rankings
  rankings: {
    // Major Sites
    pff: { overall: 1, position: 1, grade: 94.5, tier: 1, url: "https://..." },
    theAthletic: { overall: 2, position: 1, grade: null, tier: 1, url: "https://..." },
    espn: { overall: 1, position: 1, grade: 92, tier: 1, url: "https://..." },
    nflDotCom: { overall: 3, position: 1, grade: 89, tier: 1, url: "https://..." },
    pfn: { overall: 1, position: 1, grade: 95, tier: 1, url: "https://..." },
    cbs: { overall: 2, position: 1, grade: null, tier: 1, url: "https://..." },
    si: { overall: 1, position: 1, grade: null, tier: 1, url: "https://..." },
    usaToday: { overall: 4, position: 1, grade: null, tier: 1, url: "https://..." },
    bleacherReport: { overall: 2, position: 1, grade: null, tier: 1, url: "https://..." },
    fantasyPros: { overall: 1, position: 1, grade: null, tier: 1, url: "https://..." },
    
    // Individual Analysts
    melKiper: { overall: 1, position: 1, grade: null, tier: 1, url: "https://..." },
    danielJeremiah: { overall: 2, position: 1, grade: null, tier: 1, url: "https://..." },
    mattMiller: { overall: 1, position: 1, grade: null, tier: 1, url: "https://..." },
    daneBrugler: { overall: 1, position: 1, grade: 93, tier: 1, url: "https://..." },
    jordanReid: { overall: 3, position: 1, grade: null, tier: 1, url: "https://..." },
    trevorSikkema: { overall: 1, position: 1, grade: 94, tier: 1, url: "https://..." },
    fieldYates: { overall: 2, position: 1, grade: null, tier: 1, url: "https://..." },
    charlieCampbell: { overall: 1, position: 1, grade: null, tier: 1, url: "https://..." },
    lanceZierlein: { overall: 2, position: 1, grade: 90, tier: 1, url: "https://..." },
    chadReuter: { overall: 1, position: 1, grade: null, tier: 1, url: "https://..." },
    buckyBrooks: { overall: 3, position: 1, grade: null, tier: 1, url: "https://..." },
    chrisTrapasso: { overall: 2, position: 1, grade: null, tier: 1, url: "https://..." },
    ericEdholm: { overall: 1, position: 1, grade: null, tier: 1, url: "https://..." },
  },
  
  // Scouting Report Summary
  scouting: {
    strengths: [
      "Elite arm strength",
      "Advanced pocket presence",
      "High football IQ"
    ],
    weaknesses: [
      "Occasional accuracy issues",
      "Needs to improve decision-making under pressure"
    ],
    comparison: "Matthew Stafford",
    ceiling: "Pro Bowl starter",
    floor: "Quality backup",
    bestFit: ["Air Raid", "West Coast"]
  },
  
  // College Stats (can be multiple seasons)
  stats: [
    {
      season: 2025,
      games: 13,
      // Position-specific stats
      qb: {
        completions: 325,
        attempts: 480,
        completionPct: 67.7,
        passingYards: 4250,
        touchdowns: 38,
        interceptions: 8,
        qbr: 89.5,
        yardsPerAttempt: 8.9,
        rushingYards: 285,
        rushingTDs: 5
      }
    },
    {
      season: 2024,
      games: 12,
      qb: {
        completions: 298,
        attempts: 445,
        completionPct: 67.0,
        passingYards: 3850,
        touchdowns: 32,
        interceptions: 10,
        qbr: 85.2,
        yardsPerAttempt: 8.7,
        rushingYards: 210,
        rushingTDs: 3
      }
    }
  ],
  
  // Media & Links
  media: {
    headshot: "url-to-image",
    actionShots: ["url1", "url2", "url3"],
    highlightVideo: "youtube-url",
    interviewVideo: "youtube-url",
    socialMedia: {
      twitter: "@camward",
      instagram: "@camward"
    }
  },
  
  // Draft Projection
  projection: {
    projectedRound: 1,
    projectedPick: 1,
    projectedTeams: ["Raiders", "Jets", "Browns"],
    draftRange: { min: 1, max: 5 }
  },
  
  // Metadata
  metadata: {
    lastUpdated: "2026-01-19T10:00:00Z",
    dataCompleteness: 95, // percentage
    viewCount: 15234,
    bookmarked: false // user-specific
  }
};

