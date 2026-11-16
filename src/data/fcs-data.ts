import { Article, TeamRanking, PlayoffProjection, PlayoffMatchup, ConferenceInfo } from '@/types';

export const ARTICLES_DATA: Article[] = [
  {
    id: '1',
    slug: 'fcs-championship-bracket-expansion-fallout-deep-dive',
    title: 'The Road to Frisco: How the Expanded 24-Team Field Shakes Up FCS Playoff Seeding',
    excerpt: 'With conference champions locking in automatic bids, the selection committee faces their most grueling bubble debate yet across the MVFC, Big Sky, and CAA.',
    content: `
      <p class="lead">The landscape of the NCAA Division I Football Championship Subdivision (FCS) postseason has reached a fever pitch. With conference titles coming down to wire-to-wire regular season finales, the selection committee is staring down an unprecedented scramble for the 16 at-large slots.</p>
      
      <h2>The Critical Top-8 Byes</h2>
      <p>In the FCS playoff format, securing a top-8 seed is paramount. Teams earning a first-round bye not only gain an indispensable week of rest and recovery after an 11 or 12-game grind, but also secure home-field advantage through the quarterfinal round.</p>
      
      <p>Perennial powerhouses from the Missouri Valley Football Conference and the Big Sky have long held a stranglehold on the upper seeds. However, the resurgence of teams across the Southern Conference and United Athletic Conference has injected chaos into the committee's traditional power metrics.</p>

      <blockquote>"You can't just rely on brand recognition anymore," remarked one regional committee member. "Strength of schedule, FCS quality wins, and true road resilience are driving every single debate in that room."</blockquote>

      <h2>Bubble Scenarios: Who Gets Left in the Cold?</h2>
      <p>Entering the final weeks of November, seven teams are tightly bunched between ranks 20 and 30, each boasting seven Division I victories. The differentiator will come down to non-conference FBS matchups and comparative common-opponent margins.</p>

      <p>Stay tuned to The FCS Guys as we track every selection scenario, computer model variance, and projection update leading up to the official NCAA Selection Show.</p>
    `,
    category: 'Playoffs',
    conference: 'National',
    author: {
      name: 'Garrett Vance',
      role: 'Senior FCS Postseason Analyst',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    publishedAt: 'November 13, 2026',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Action heats up under the stadium lights as playoff positioning tightens.',
    featured: true,
    trending: true,
    tags: ['Playoffs', 'FCS Bracket', 'Frisco', 'Top 8 Seeds']
  },
  {
    id: '2',
    slug: 'montana-state-vs-montana-brawl-of-the-wild-preview',
    title: 'Brawl of the Wild 2026: Championship Stakes and Big Sky Supremacy on the Line',
    excerpt: 'Montana State and Montana gear up for their 125th meeting with a potential first-round bye and Big Sky trophy hanging in the balance in Bozeman.',
    content: `
      <p>There is no rivalry in collegiate football that captures regional passion quite like the Brawl of the Wild. As the Montana Grizzlies travel to Bozeman to clash with Montana State, the atmosphere will be electric.</p>
      <h2>Defense Wins Bitter Rivalries</h2>
      <p>Both squads boast top-10 FCS total defenses, allowing under 18 points per game. Pressure on the quarterback will decide which side punches an automatic seed into the national bracket.</p>
    `,
    category: 'Breaking',
    conference: 'Big Sky',
    author: {
      name: 'Brett McAllister',
      role: 'Western Region Correspondent',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    publishedAt: 'November 13, 2026',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=1000',
    imageCaption: 'Players battle at the line of scrimmage in sub-zero rivalry conditions.',
    featured: false,
    trending: true,
    tags: ['Big Sky', 'Montana', 'Montana State', 'Rivalry']
  },
  {
    id: '3',
    slug: 'mvfc-power-rankings-bison-jackrabbits-heavyweight-tilt',
    title: 'MVFC Title Race: South Dakota State and North Dakota State Set For Dakota Marker Sequel',
    excerpt: 'The Missouri Valley remains the gold standard of subdivision football. Here is how the top contenders stack up in efficiency and defensive EPA.',
    content: `
      <p>Year after year, the road to the National Championship trophy navigates directly through Fargo, North Dakota and Brookings, South Dakota. The defensive trench play in this conference sets the physical baseline for all of FCS football.</p>
    `,
    category: 'Rankings',
    conference: 'MVFC',
    author: {
      name: 'Colton Bradley',
      role: 'Midwest Gridiron Analyst',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    },
    publishedAt: 'November 12, 2026',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000',
    imageCaption: 'The physical clash of trench warfare in the Missouri Valley.',
    featured: false,
    trending: false,
    tags: ['MVFC', 'SDSU', 'NDSU', 'Power Rankings']
  },
  {
    id: '4',
    slug: 'walter-payton-award-watch-quarterbacks-surging',
    title: 'Walter Payton Award Watch: Three Signal-Callers Taking Over the National Spotlight',
    excerpt: 'From dual-threat playmakers in the CAA to aerial gunslingers in the SoCon, evaluate the mid-November finalists for FCS Offensive Player of the Year.',
    content: `
      <p>Award voting is heating up as offenses put up jaw-dropping statistics in the homestretch. Efficiency metrics, fourth-quarter comebacks, and turnover margin highlight this week’s leaderboard.</p>
    `,
    category: 'Analysis',
    conference: 'National',
    author: {
      name: 'Derek Jenkins',
      role: 'Staff Writer & Film Room Host',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
    },
    publishedAt: 'November 11, 2026',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1000',
    imageCaption: 'Quarterback launching a deep pass down the sideline.',
    featured: false,
    trending: false,
    tags: ['Walter Payton Award', 'Awards', 'Quarterbacks']
  },
  {
    id: '5',
    slug: 'hbcu-celebration-bowl-picture-swac-meac-leaders',
    title: 'Celebration Bowl Radar: Jackson State, Florida A&M, and NC Central Battle for Atlanta',
    excerpt: 'The premier postseason destination for HBCU football is coming into crisp focus. We break down the SWAC title race and MEAC showdown scenarios.',
    content: `
      <p>Atlanta's Mercedes-Benz Stadium will host the Celebration Bowl in December, matching the champions of the MEAC and SWAC in front of a national broadcast audience.</p>
    `,
    category: 'Analysis',
    conference: 'SWAC / MEAC',
    author: {
      name: 'Marcus Williams',
      role: 'HBCU Sports Specialist',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
    },
    publishedAt: 'November 10, 2026',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1000',
    imageCaption: 'Stadium lights gleaming before kickoff.',
    featured: false,
    trending: false,
    tags: ['Celebration Bowl', 'SWAC', 'MEAC', 'HBCU']
  },
  {
    id: '6',
    slug: 'tarleton-state-uac-championship-surge',
    title: 'Tarleton State’s Rapid Rise to UAC Frontrunner Status in Full Division I Transition',
    excerpt: 'How the Texans established one of the subdivision’s most potent explosive rushing attacks while navigating the final hurdles of NCAA reclassification.',
    content: `
      <p>The transition to full postseason eligibility is a challenging climb, but Tarleton State has transformed into one of the country's most feared programs in record time.</p>
    `,
    category: 'Game Recap',
    conference: 'UAC',
    author: {
      name: 'Brett McAllister',
      role: 'Western Region Correspondent',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    publishedAt: 'November 9, 2026',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?auto=format&fit=crop&q=80&w=1000',
    imageCaption: 'Running back breaking tackles along the hash marks.',
    featured: false,
    trending: false,
    tags: ['UAC', 'Tarleton State', 'Reclassification']
  },
  {
    id: '7',
    slug: 'all-american-defensive-end-sack-clinic-film-breakdown',
    title: 'Film Room: How Elite Pass Rushers Are Dismantling FCS Pass Protections',
    excerpt: 'A frame-by-frame breakdown of dip-and-rip pass rush angles, inside stunts, and edge manipulation from the premier quarterback hunters in the country.',
    content: `
      <p>Dominant edge play dictates November college football. When defensive coordinators can generate natural four-man pressure without sacrificing coverage integrity on the backend, offenses stall quickly.</p>
      <h2>Attacking the Half-Man</h2>
      <p>The difference between a hurry and a strip-sack comes down to pad level and bend around the offensive tackle. We look at three game films highlighting textbook edge execution.</p>
    `,
    category: 'Analysis',
    conference: 'MVFC',
    author: {
      name: 'Derek Jenkins',
      role: 'Staff Writer & Film Room Host',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
    },
    publishedAt: 'November 8, 2026',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=1000',
    imageCaption: 'Defensive front aligning in tight formation ready to fire off the snap.',
    featured: false,
    trending: true,
    tags: ['Film Room', 'Defense', 'Pass Rush', 'MVFC']
  },
  {
    id: '8',
    slug: 'red-zone-rpo-schemes-unlocking-championship-offenses',
    title: 'X & O Breakdown: Red Zone Run-Pass Options That Unbalanced Defenses This Fall',
    excerpt: 'Examining the glance routes and third-level safety conflicts making high-scoring FCS offenses lethal inside the 20-yard line.',
    content: `
      <p>Space contracts in the red zone, but modern spread coordinators continue to stress defensive alignments with pre-snap motion and dynamic RPO reads.</p>
      <h2>Putting the Nickel in Conflict</h2>
      <p>By attaching quick slant tags to split-zone run concepts, quarterbacks consistently exploit vacated second-level space the second linebackers bite downhill against the run.</p>
    `,
    category: 'Analysis',
    conference: 'Big Sky',
    author: {
      name: 'Garrett Vance',
      role: 'Senior FCS Postseason Analyst',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    publishedAt: 'November 7, 2026',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&q=80&w=1000',
    imageCaption: 'Team huddling to install key schematic adjustments on the sideline.',
    featured: false,
    trending: false,
    tags: ['Film Room', 'Offense', 'RPO', 'Tactics']
  },
  {
    id: '9',
    slug: 'special-teams-field-position-hidden-game-changers',
    title: 'The Hidden Third: Game-Changing Special Teams Returns & Coverage Units',
    excerpt: 'Detailed video review of block schemes and gunner techniques sparking momentum swings and securing critical late-season victories.',
    content: `
      <p>Championship margins are razor thin. Often, the deciding factor in frigid November contests is a pinned punt inside the five-yard line or an explosive kickoff return.</p>
      <h2>Lane Discipline and Hang Time</h2>
      <p>Coverage units must stay in their allotted lanes while directional punting eliminates return lanes across the boundary.</p>
    `,
    category: 'Analysis',
    conference: 'CAA',
    author: {
      name: 'Colton Bradley',
      role: 'Midwest Gridiron Analyst',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    },
    publishedAt: 'November 6, 2026',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&q=80&w=1000',
    imageCaption: 'Kicker setting up for a high-pressure field goal attempt in the clutch.',
    featured: false,
    trending: false,
    tags: ['Special Teams', 'Film Room', 'CAA']
  }
];

export const TOP_25_RANKINGS: TeamRanking[] = [
  { rank: 1, previousRank: 1, team: 'North Dakota State', mascot: 'Bison', record: '10-1', conference: 'MVFC', points: 648, firstPlaceVotes: 24, trend: 'same', logoColor: '#005837' },
  { rank: 2, previousRank: 2, team: 'Montana State', mascot: 'Bobcats', record: '10-0', conference: 'Big Sky', points: 624, firstPlaceVotes: 2, trend: 'same', logoColor: '#00205B' },
  { rank: 3, previousRank: 4, team: 'South Dakota State', mascot: 'Jackrabbits', record: '9-2', conference: 'MVFC', points: 595, trend: 'up', logoColor: '#0033A0' },
  { rank: 4, previousRank: 3, team: 'South Dakota', mascot: 'Coyotes', record: '8-2', conference: 'MVFC', points: 566, trend: 'down', logoColor: '#AD0000' },
  { rank: 5, previousRank: 5, team: 'UC Davis', mascot: 'Aggies', record: '9-1', conference: 'Big Sky', points: 538, trend: 'same', logoColor: '#002855' },
  { rank: 6, previousRank: 7, team: 'Mercer', mascot: 'Bears', record: '9-1', conference: 'SoCon', points: 512, trend: 'up', logoColor: '#E05929' },
  { rank: 7, previousRank: 8, team: 'Idaho', mascot: 'Vandals', record: '8-3', conference: 'Big Sky', points: 489, trend: 'up', logoColor: '#B3995D' },
  { rank: 8, previousRank: 6, team: 'Montana', mascot: 'Grizzlies', record: '8-3', conference: 'Big Sky', points: 460, trend: 'down', logoColor: '#702082' },
  { rank: 9, previousRank: 9, team: 'Incarnate Word', mascot: 'Cardinals', record: '8-2', conference: 'Southland', points: 432, trend: 'same', logoColor: '#C41230' },
  { rank: 10, previousRank: 12, team: 'Richmond', mascot: 'Spiders', record: '8-2', conference: 'CAA', points: 405, trend: 'up', logoColor: '#9E0712' },
  { rank: 11, previousRank: 10, team: 'Villanova', mascot: 'Wildcats', record: '8-2', conference: 'CAA', points: 388, trend: 'down', logoColor: '#00205B' },
  { rank: 12, previousRank: 14, team: 'Rhode Island', mascot: 'Rams', record: '9-1', conference: 'CAA', points: 360, trend: 'up', logoColor: '#002147' },
  { rank: 13, previousRank: 11, team: 'Southeast Missouri State', mascot: 'Redhawks', record: '8-2', conference: 'Big South-OVC', points: 334, trend: 'down', logoColor: '#C41230' },
  { rank: 14, previousRank: 13, team: 'Tarleton State', mascot: 'Texans', record: '8-2', conference: 'UAC', points: 310, trend: 'down', logoColor: '#4F2683' },
  { rank: 15, previousRank: 16, team: 'Abilene Christian', mascot: 'Wildcats', record: '7-3', conference: 'UAC', points: 284, trend: 'up', logoColor: '#4A154B' },
  { rank: 16, previousRank: 17, team: 'Central Arkansas', mascot: 'Bears', record: '7-3', conference: 'UAC', points: 251, trend: 'up', logoColor: '#4F2683' },
  { rank: 17, previousRank: 15, team: 'Stony Brook', mascot: 'Seawolves', record: '8-2', conference: 'CAA', points: 232, trend: 'down', logoColor: '#990000' },
  { rank: 18, previousRank: 19, team: 'Chattanooga', mascot: 'Mocs', record: '6-4', conference: 'SoCon', points: 205, trend: 'up', logoColor: '#002D62' },
  { rank: 19, previousRank: 22, team: 'Harvard', mascot: 'Crimson', record: '7-1', conference: 'Ivy League', points: 178, trend: 'up', logoColor: '#A51C30' },
  { rank: 20, previousRank: 18, team: 'William & Mary', mascot: 'Tribe', record: '6-4', conference: 'CAA', points: 156, trend: 'down', logoColor: '#115740' },
  { rank: 21, previousRank: 23, team: 'Jackson State', mascot: 'Tigers', record: '8-2', conference: 'SWAC', points: 139, trend: 'up', logoColor: '#00205B' },
  { rank: 22, previousRank: 24, team: 'Western Carolina', mascot: 'Catamounts', record: '6-4', conference: 'SoCon', points: 114, trend: 'up', logoColor: '#592C88' },
  { rank: 23, previousRank: 20, team: 'North Dakota', mascot: 'Fighting Hawks', record: '5-5', conference: 'MVFC', points: 94, trend: 'down', logoColor: '#007A3D' },
  { rank: 24, previousRank: 25, team: 'Duquesne', mascot: 'Dukes', record: '7-2', conference: 'NEC', points: 72, trend: 'up', logoColor: '#BA0C2F' },
  { rank: 25, previousRank: 21, team: 'Northern Arizona', mascot: 'Lumberjacks', record: '6-4', conference: 'Big Sky', points: 51, trend: 'down', logoColor: '#002447' },
];

export const PLAYOFF_PROJECTIONS: PlayoffProjection[] = [
  { seed: 1, team: 'North Dakota State', record: '10-1', conference: 'MVFC', type: 'Auto Bid', status: 'Host First Round Bye', analystCommentary: 'Dominant resume with ranked victories over SDSU and South Dakota. Projected national #1 seed.' },
  { seed: 2, team: 'Montana State', record: '10-0', conference: 'Big Sky', type: 'Auto Bid', status: 'Host First Round Bye', analystCommentary: 'Unbeaten in FCS competition with an unstoppable ground assault behind Tommy Mellott.' },
  { seed: 3, team: 'South Dakota State', record: '9-2', conference: 'MVFC', type: 'At-Large', status: 'Host First Round Bye', analystCommentary: 'Two-time defending champions boast top efficiency in both offensive and defensive EPA.' },
  { seed: 4, team: 'UC Davis', record: '9-1', conference: 'Big Sky', type: 'At-Large', status: 'Host First Round Bye', analystCommentary: 'Sole FCS blemish came narrowly against Montana State; Lan Larison has carried the Aggies.' },
  { seed: 5, team: 'South Dakota', record: '8-2', conference: 'MVFC', type: 'At-Large', status: 'Host First Round Bye', analystCommentary: 'Physical defense and marquee home win over North Dakota State cements top-5 status.' },
  { seed: 6, team: 'Mercer', record: '9-1', conference: 'SoCon', type: 'Auto Bid', status: 'Host First Round Bye', analystCommentary: 'One of the surprise stories of 2026, Mercer holds the nation’s best turnover differential.' },
  { seed: 7, team: 'Idaho', record: '8-3', conference: 'Big Sky', type: 'At-Large', status: 'Host First Round Bye', analystCommentary: 'Brutal non-conference schedule including an FBS upset makes the Vandals battle-tested.' },
  { seed: 8, team: 'Incarnate Word', record: '8-2', conference: 'Southland', type: 'Auto Bid', status: 'Host First Round Bye', analystCommentary: 'High-octane passing offense averaging 42.4 PPG puts UIW in line for the final bye.' },
  { seed: 9, team: 'Richmond', record: '8-2', conference: 'CAA', type: 'Auto Bid', status: 'First Round Host', analystCommentary: 'Surging eight-game winning streak puts the Spiders in position to host round one in Virginia.' },
  { seed: 10, team: 'Montana', record: '8-3', conference: 'Big Sky', type: 'At-Large', status: 'First Round Host', analystCommentary: 'Washington-Grizzly Stadium is a premier host venue if the Grizzlies land in the 9-16 pod.' },
  { seed: 11, team: 'Rhode Island', record: '9-1', conference: 'CAA', type: 'At-Large', status: 'First Round Host', analystCommentary: 'Historic nine-win campaign has the Rams eyeing their first home playoff game in four decades.' },
  { seed: 12, team: 'Tarleton State', record: '8-2', conference: 'UAC', type: 'Auto Bid', status: 'First Round Host', analystCommentary: 'Stephenville will be rocking if the Texans host their historic first Division I playoff clash.' },
  { seed: 13, team: 'Villanova', record: '8-2', conference: 'CAA', type: 'At-Large', status: 'First Round Host', analystCommentary: 'Solid CAA metric profile with balanced ground-and-pound attack.' },
  { seed: 14, team: 'Southeast Missouri State', record: '8-2', conference: 'Big South-OVC', type: 'Auto Bid', status: 'First Round Host', analystCommentary: 'Paxton DeLaurent has steered SEMO to front-runner status in the Ohio Valley/Big South.' },
  { seed: 15, team: 'Abilene Christian', record: '7-3', conference: 'UAC', type: 'At-Large', status: 'First Round Host', analystCommentary: 'Marquee win over Texas Tech FBS makes ACU’s resume stand out in committee debates.' },
  { seed: 16, team: 'Chattanooga', record: '6-4', conference: 'SoCon', type: 'At-Large', status: 'First Round Host', analystCommentary: 'Strong strength-of-schedule rating edges out bubble candidates for the final hosting seed.' },
];

export const PLAYOFF_MATCHUPS: PlayoffMatchup[] = [
  {
    id: 'm1',
    round: 'First Round',
    location: 'Richmond, VA',
    date: 'Saturday, Nov 28',
    team1: { name: 'Richmond', seed: 9, record: '8-2', isProjectedWinner: true },
    team2: { name: 'Central Arkansas', record: '7-3', isProjectedWinner: false },
  },
  {
    id: 'm2',
    round: 'First Round',
    location: 'Missoula, MT',
    date: 'Saturday, Nov 28',
    team1: { name: 'Montana', seed: 10, record: '8-3', isProjectedWinner: true },
    team2: { name: 'Northern Arizona', record: '6-4', isProjectedWinner: false },
  },
  {
    id: 'm3',
    round: 'First Round',
    location: 'Kingston, RI',
    date: 'Saturday, Nov 28',
    team1: { name: 'Rhode Island', seed: 11, record: '9-1', isProjectedWinner: true },
    team2: { name: 'Stony Brook', record: '8-2', isProjectedWinner: false },
  },
  {
    id: 'm4',
    round: 'First Round',
    location: 'Stephenville, TX',
    date: 'Saturday, Nov 28',
    team1: { name: 'Tarleton State', seed: 12, record: '8-2', isProjectedWinner: true },
    team2: { name: 'Drake', record: '7-2', isProjectedWinner: false },
  },
  {
    id: 'm5',
    round: 'First Round',
    location: 'Villanova, PA',
    date: 'Saturday, Nov 28',
    team1: { name: 'Villanova', seed: 13, record: '8-2', isProjectedWinner: true },
    team2: { name: 'Harvard', record: '7-1', isProjectedWinner: false },
  },
  {
    id: 'm6',
    round: 'First Round',
    location: 'Cape Girardeau, MO',
    date: 'Saturday, Nov 28',
    team1: { name: 'Southeast Missouri State', seed: 14, record: '8-2', isProjectedWinner: false },
    team2: { name: 'William & Mary', record: '6-4', isProjectedWinner: true },
  },
  {
    id: 'm7',
    round: 'First Round',
    location: 'Abilene, TX',
    date: 'Saturday, Nov 28',
    team1: { name: 'Abilene Christian', seed: 15, record: '7-3', isProjectedWinner: true },
    team2: { name: 'Jackson State', record: '8-2', isProjectedWinner: false },
  },
  {
    id: 'm8',
    round: 'First Round',
    location: 'Chattanooga, TN',
    date: 'Saturday, Nov 28',
    team1: { name: 'Chattanooga', seed: 16, record: '6-4', isProjectedWinner: true },
    team2: { name: 'Duquesne', record: '7-2', isProjectedWinner: false },
  },
];

export const CONFERENCES_DATA: ConferenceInfo[] = [
  {
    id: 'mvfc',
    name: 'Missouri Valley Football Conference',
    shortName: 'MVFC',
    hq: 'St. Louis, MO',
    founded: '1985',
    teamsCount: 11,
    currentChampion: 'South Dakota State',
    bannerColor: '#005837',
    description: 'The standard of FCS championship dominance, boasting 17 national titles since 1997.',
    standings: [
      { team: 'North Dakota State', mascot: 'Bison', confRecord: '7-0', overallRecord: '10-1', streak: 'W8', homeRecord: '6-0', awayRecord: '4-1', isRanked: 1 },
      { team: 'South Dakota State', mascot: 'Jackrabbits', confRecord: '6-1', overallRecord: '9-2', streak: 'W3', homeRecord: '5-0', awayRecord: '4-2', isRanked: 3 },
      { team: 'South Dakota', mascot: 'Coyotes', confRecord: '6-1', overallRecord: '8-2', streak: 'W2', homeRecord: '5-1', awayRecord: '3-1', isRanked: 4 },
      { team: 'North Dakota', mascot: 'Fighting Hawks', confRecord: '3-4', overallRecord: '5-5', streak: 'L1', homeRecord: '4-1', awayRecord: '1-4', isRanked: 23 },
      { team: 'Illinois State', mascot: 'Redbirds', confRecord: '4-3', overallRecord: '7-3', streak: 'W3', homeRecord: '4-1', awayRecord: '3-2' },
      { team: 'Youngstown State', mascot: 'Penguins', confRecord: '2-5', overallRecord: '3-8', streak: 'L2', homeRecord: '2-3', awayRecord: '1-5' },
      { team: 'Southern Illinois', mascot: 'Salukis', confRecord: '1-6', overallRecord: '3-7', streak: 'L4', homeRecord: '2-3', awayRecord: '1-4' },
      { team: 'Northern Iowa', mascot: 'Panthers', confRecord: '0-7', overallRecord: '2-8', streak: 'L7', homeRecord: '2-3', awayRecord: '0-5' },
    ]
  },
  {
    id: 'big-sky',
    name: 'Big Sky Conference',
    shortName: 'Big Sky',
    hq: 'Farmington, UT',
    founded: '1963',
    teamsCount: 12,
    currentChampion: 'Montana',
    bannerColor: '#00205B',
    description: 'Vast western conference famous for fierce rivalries, hostile mountain venues, and explosive offenses.',
    standings: [
      { team: 'Montana State', mascot: 'Bobcats', confRecord: '7-0', overallRecord: '10-0', streak: 'W10', homeRecord: '5-0', awayRecord: '5-0', isRanked: 2 },
      { team: 'UC Davis', mascot: 'Aggies', confRecord: '6-1', overallRecord: '9-1', streak: 'W6', homeRecord: '5-0', awayRecord: '4-1', isRanked: 5 },
      { team: 'Idaho', mascot: 'Vandals', confRecord: '5-2', overallRecord: '8-3', streak: 'W2', homeRecord: '4-1', awayRecord: '4-2', isRanked: 7 },
      { team: 'Montana', mascot: 'Grizzlies', confRecord: '5-2', overallRecord: '8-3', streak: 'W1', homeRecord: '5-1', awayRecord: '3-2', isRanked: 8 },
      { team: 'Northern Arizona', mascot: 'Lumberjacks', confRecord: '5-2', overallRecord: '6-4', streak: 'W3', homeRecord: '4-1', awayRecord: '2-3', isRanked: 25 },
      { team: 'Eastern Washington', mascot: 'Eagles', confRecord: '3-4', overallRecord: '4-6', streak: 'L1', homeRecord: '2-3', awayRecord: '2-3' },
      { team: 'Weber State', mascot: 'Wildcats', confRecord: '2-5', overallRecord: '3-7', streak: 'L3', homeRecord: '1-4', awayRecord: '2-3' },
      { team: 'Idaho State', mascot: 'Bengals', confRecord: '3-4', overallRecord: '5-5', streak: 'W1', homeRecord: '3-2', awayRecord: '2-3' },
    ]
  },
  {
    id: 'caa',
    name: 'CAA Football (Coastal Athletic Association)',
    shortName: 'CAA',
    hq: 'Richmond, VA',
    founded: '2007',
    teamsCount: 16,
    currentChampion: 'Albany / Villanova / Richmond',
    bannerColor: '#9E0712',
    description: 'The premier East Coast gridiron conference stretching from Maine to North Carolina.',
    standings: [
      { team: 'Richmond', mascot: 'Spiders', confRecord: '6-0', overallRecord: '8-2', streak: 'W8', homeRecord: '4-1', awayRecord: '4-1', isRanked: 10 },
      { team: 'Rhode Island', mascot: 'Rams', confRecord: '6-1', overallRecord: '9-1', streak: 'W7', homeRecord: '5-0', awayRecord: '4-1', isRanked: 12 },
      { team: 'Villanova', mascot: 'Wildcats', confRecord: '5-1', overallRecord: '8-2', streak: 'W2', homeRecord: '5-0', awayRecord: '3-2', isRanked: 11 },
      { team: 'Stony Brook', mascot: 'Seawolves', confRecord: '5-2', overallRecord: '8-2', streak: 'W1', homeRecord: '5-1', awayRecord: '3-1', isRanked: 17 },
      { team: 'William & Mary', mascot: 'Tribe', confRecord: '4-2', overallRecord: '6-4', streak: 'L1', homeRecord: '4-1', awayRecord: '2-3', isRanked: 20 },
      { team: 'New Hampshire', mascot: 'Wildcats', confRecord: '4-3', overallRecord: '6-4', streak: 'W2', homeRecord: '3-1', awayRecord: '3-3' },
      { team: 'Delaware', mascot: 'Fightin Blue Hens', confRecord: '5-1', overallRecord: '8-1', streak: 'W3', homeRecord: '4-1', awayRecord: '4-0' },
      { team: 'Maine', mascot: 'Black Bears', confRecord: '3-4', overallRecord: '4-6', streak: 'L2', homeRecord: '3-2', awayRecord: '1-4' },
    ]
  },
  {
    id: 'socon',
    name: 'Southern Conference',
    shortName: 'SoCon',
    hq: 'Spartanburg, SC',
    founded: '1921',
    teamsCount: 9,
    currentChampion: 'Furman',
    bannerColor: '#E05929',
    description: 'One of college football’s oldest leagues, deeply rooted in historic southern pigskin tradition.',
    standings: [
      { team: 'Mercer', mascot: 'Bears', confRecord: '6-1', overallRecord: '9-1', streak: 'W3', homeRecord: '5-0', awayRecord: '4-1', isRanked: 6 },
      { team: 'Chattanooga', mascot: 'Mocs', confRecord: '5-2', overallRecord: '6-4', streak: 'W1', homeRecord: '4-1', awayRecord: '2-3', isRanked: 18 },
      { team: 'Western Carolina', mascot: 'Catamounts', confRecord: '5-2', overallRecord: '6-4', streak: 'W3', homeRecord: '3-1', awayRecord: '3-3', isRanked: 22 },
      { team: 'East Tennessee State', mascot: 'Buccaneers', confRecord: '4-3', overallRecord: '6-4', streak: 'W2', homeRecord: '3-2', awayRecord: '3-2' },
      { team: 'Samford', mascot: 'Bulldogs', confRecord: '3-3', overallRecord: '4-5', streak: 'L1', homeRecord: '3-1', awayRecord: '1-4' },
      { team: 'Furman', mascot: 'Paladins', confRecord: '2-4', overallRecord: '3-6', streak: 'L2', homeRecord: '2-2', awayRecord: '1-4' },
      { team: 'Wofford', mascot: 'Terriers', confRecord: '1-5', overallRecord: '3-6', streak: 'L3', homeRecord: '2-2', awayRecord: '1-4' },
      { team: 'VMI', mascot: 'Keydets', confRecord: '1-6', overallRecord: '1-9', streak: 'L1', homeRecord: '1-4', awayRecord: '0-5' },
    ]
  },
  {
    id: 'uac',
    name: 'United Athletic Conference',
    shortName: 'UAC',
    hq: 'Arlington, TX',
    founded: '2023',
    teamsCount: 9,
    currentChampion: 'Austin Peay',
    bannerColor: '#4F2683',
    description: 'The energetic multi-state alliance uniting emerging football powers across the South and Southwest.',
    standings: [
      { team: 'Tarleton State', mascot: 'Texans', confRecord: '5-1', overallRecord: '8-2', streak: 'L1', homeRecord: '4-1', awayRecord: '4-1', isRanked: 14 },
      { team: 'Abilene Christian', mascot: 'Wildcats', confRecord: '5-2', overallRecord: '7-3', streak: 'W2', homeRecord: '4-1', awayRecord: '3-2', isRanked: 15 },
      { team: 'Central Arkansas', mascot: 'Bears', confRecord: '4-2', overallRecord: '7-3', streak: 'W1', homeRecord: '4-1', awayRecord: '3-2', isRanked: 16 },
      { team: 'Eastern Kentucky', mascot: 'Colonels', confRecord: '4-2', overallRecord: '6-4', streak: 'W3', homeRecord: '3-1', awayRecord: '3-3' },
      { team: 'Southern Utah', mascot: 'Thunderbirds', confRecord: '3-3', overallRecord: '5-5', streak: 'W1', homeRecord: '2-2', awayRecord: '3-3' },
      { team: 'Austin Peay', mascot: 'Governors', confRecord: '3-4', overallRecord: '4-6', streak: 'L1', homeRecord: '3-2', awayRecord: '1-4' },
      { team: 'North Alabama', mascot: 'Lions', confRecord: '3-4', overallRecord: '3-8', streak: 'L2', homeRecord: '2-3', awayRecord: '1-5' },
      { team: 'Utah Tech', mascot: 'Trailblazers', confRecord: '1-5', overallRecord: '1-9', streak: 'L5', homeRecord: '1-3', awayRecord: '0-6' },
    ]
  },
  {
    id: 'southland',
    name: 'Southland Conference',
    shortName: 'Southland',
    hq: 'Frisco, TX',
    founded: '1963',
    teamsCount: 9,
    currentChampion: 'Nicholls',
    bannerColor: '#C41230',
    description: 'A Gulf Coast powerhouse conference whose champion always brings speed and offensive flair to the playoffs.',
    standings: [
      { team: 'Incarnate Word', mascot: 'Cardinals', confRecord: '5-0', overallRecord: '8-2', streak: 'W7', homeRecord: '4-1', awayRecord: '4-1', isRanked: 9 },
      { team: 'Southeastern Louisiana', mascot: 'Lions', confRecord: '5-1', overallRecord: '6-5', streak: 'W4', homeRecord: '3-1', awayRecord: '3-4' },
      { team: 'Stephen F. Austin', mascot: 'Lumberjacks', confRecord: '4-2', overallRecord: '6-4', streak: 'L1', homeRecord: '4-1', awayRecord: '2-3' },
      { team: 'Lamar', mascot: 'Cardinals', confRecord: '3-2', overallRecord: '6-4', streak: 'W1', homeRecord: '3-1', awayRecord: '3-3' },
      { team: 'McNeese', mascot: 'Cowboys', confRecord: '3-3', overallRecord: '6-5', streak: 'L1', homeRecord: '4-2', awayRecord: '2-3' },
      { team: 'Nicholls', mascot: 'Colonels', confRecord: '2-3', overallRecord: '4-6', streak: 'L1', homeRecord: '3-1', awayRecord: '1-5' },
      { team: 'Houston Christian', mascot: 'Huskies', confRecord: '2-4', overallRecord: '4-6', streak: 'W1', homeRecord: '2-3', awayRecord: '2-3' },
      { team: 'Northwestern State', mascot: 'Demons', confRecord: '0-6', overallRecord: '0-11', streak: 'L11', homeRecord: '0-5', awayRecord: '0-6' },
    ]
  },
  {
    id: 'swac',
    name: 'Southwestern Athletic Conference',
    shortName: 'SWAC',
    hq: 'Birmingham, AL',
    founded: '1920',
    teamsCount: 12,
    currentChampion: 'Florida A&M',
    bannerColor: '#00205B',
    description: 'Historic HBCU athletic conference known for electric game-day bands, celebrated gridiron legends, and rivalry classics.',
    standings: [
      { team: 'Jackson State', mascot: 'Tigers', confRecord: '6-0', overallRecord: '8-2', streak: 'W6', homeRecord: '4-1', awayRecord: '4-1', isRanked: 21 },
      { team: 'Southern', mascot: 'Jaguars', confRecord: '5-1', overallRecord: '6-4', streak: 'W2', homeRecord: '3-1', awayRecord: '3-3' },
      { team: 'Alabama State', mascot: 'Hornets', confRecord: '4-2', overallRecord: '5-4', streak: 'W2', homeRecord: '3-1', awayRecord: '2-3' },
      { team: 'Florida A&M', mascot: 'Rattlers', confRecord: '3-2', overallRecord: '5-4', streak: 'L1', homeRecord: '3-0', awayRecord: '2-4' },
      { team: 'Alcorn State', mascot: 'Braves', confRecord: '4-2', overallRecord: '5-5', streak: 'W1', homeRecord: '3-2', awayRecord: '2-3' },
      { team: 'Prairie View A&M', mascot: 'Panthers', confRecord: '3-4', overallRecord: '5-6', streak: 'L1', homeRecord: '3-2', awayRecord: '2-4' },
      { team: 'Grambling State', mascot: 'Tigers', confRecord: '2-4', overallRecord: '5-5', streak: 'L2', homeRecord: '3-1', awayRecord: '2-4' },
      { team: 'Bethune-Cookman', mascot: 'Wildcats', confRecord: '2-4', overallRecord: '2-8', streak: 'L1', homeRecord: '1-3', awayRecord: '1-5' },
    ]
  },
  {
    id: 'ivy-league',
    name: 'Ivy League Football',
    shortName: 'Ivy League',
    hq: 'Princeton, NJ',
    founded: '1954',
    teamsCount: 8,
    currentChampion: 'Harvard / Dartmouth / Yale',
    bannerColor: '#A51C30',
    description: 'Pioneers of American football history playing intense round-robin competition without postseason participation.',
    standings: [
      { team: 'Harvard', mascot: 'Crimson', confRecord: '5-1', overallRecord: '7-1', streak: 'W5', homeRecord: '4-0', awayRecord: '3-1', isRanked: 19 },
      { team: 'Dartmouth', mascot: 'Big Green', confRecord: '4-2', overallRecord: '7-2', streak: 'L1', homeRecord: '4-1', awayRecord: '3-1' },
      { team: 'Columbia', mascot: 'Lions', confRecord: '4-2', overallRecord: '6-2', streak: 'W2', homeRecord: '4-0', awayRecord: '2-2' },
      { team: 'Yale', mascot: 'Bulldogs', confRecord: '3-3', overallRecord: '5-3', streak: 'W1', homeRecord: '3-1', awayRecord: '2-2' },
      { team: 'Penn', mascot: 'Quakers', confRecord: '2-3', overallRecord: '4-4', streak: 'L1', homeRecord: '2-2', awayRecord: '2-2' },
      { team: 'Cornell', mascot: 'Big Red', confRecord: '2-3', overallRecord: '3-5', streak: 'L2', homeRecord: '2-2', awayRecord: '1-3' },
      { team: 'Brown', mascot: 'Bears', confRecord: '2-3', overallRecord: '3-5', streak: 'W1', homeRecord: '1-2', awayRecord: '2-3' },
      { team: 'Princeton', mascot: 'Tigers', confRecord: '1-4', overallRecord: '2-6', streak: 'L4', homeRecord: '1-3', awayRecord: '1-3' },
    ]
  }
];

