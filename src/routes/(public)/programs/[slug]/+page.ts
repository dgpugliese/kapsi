import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

interface ProgramObjective {
  num: string;
  title: string;
  text: string;
}

interface ProgramPhase {
  phase: string;
  title: string;
  text: string;
}

interface ProgramStep {
  step: string;
  title: string;
  text: string;
}

interface ProgramCohort {
  icon: string;
  label: string;
}

interface ProgramGain {
  icon: string;
  title: string;
  text: string;
}

interface ProgramSkill {
  icon: string;
  title: string;
  text: string;
}

interface ProgramCurriculum {
  icon: string;
  title: string;
  text: string;
}

interface ProgramPledge {
  letter: string;
  title: string;
  text: string;
}

interface ProgramArea {
  icon: string;
  title: string;
  text: string;
}

interface ProgramCommitment {
  text: string;
}

interface ProgramIgradFeature {
  title: string;
  text: string;
}

interface ProgramContext {
  icon: string;
  title: string;
  desc: string;
  bg: string;
  color: string;
  titleColor?: string;
  descColor?: string;
  border?: string;
}

interface ProgramData {
  title: string;
  subtitle: string;
  slug: string;
  [key: string]: unknown;
}

const programs: Record<string, ProgramData> = {
  'guide-right': {
    title: 'Guide Right',
    subtitle: 'National Service Initiative \u2014 Mentoring Youth Toward Achievement',
    slug: 'guide-right',
    overview: 'Guide Right is our National Service Initiative and includes all youth oriented programs. The Flagship Initiative is the Kappa Leadership Development League, more commonly known as Kappa League.',
    stats: [
      { number: '199', label: 'Active Chapters' },
      { number: '10,053', label: 'Students Enrolled' },
      { number: '500,000+', label: 'Young People Mentored' },
    ],
    history: [
      'The Guide Right program was conceived in 1922 by Brother Leon W. Stewart, who believed that the fraternity had a responsibility not just to its members, but to the young men who would one day seek to follow in their footsteps. Stewart\'s vision was that fraternity members \u2014 college-educated and professionally established \u2014 were uniquely positioned to guide the next generation.',
      'The program was formally adopted at the 12th Grand Chapter meeting, establishing it as an official fraternity-wide initiative. Since then, Guide Right has grown from a local mentoring concept into a comprehensive national service infrastructure that touches hundreds of thousands of young lives each year.',
      'The program\'s purpose is educational and occupational guidance of youth \u2014 primarily inspirational and informative in nature, connecting young men with the tools, knowledge, and mentors they need to achieve.',
    ],
    objectives: [
      { num: '1', title: 'Inspire Academic Excellence', text: 'Motivate young men to pursue academic achievement and understand the connection between education and life success.' },
      { num: '2', title: 'Develop Leadership Skills', text: 'Provide structured opportunities for young men to develop and practice leadership skills in their schools, communities, and families.' },
      { num: '3', title: 'Provide Career Guidance', text: 'Connect youth with professional mentors and expose them to a wide range of career paths across every field of human endeavor.' },
      { num: '4', title: 'Foster Community Responsibility', text: 'Cultivate a sense of responsibility and civic engagement, encouraging young men to give back to their communities.' },
      { num: '5', title: 'Build Character and Integrity', text: 'Instill values of honesty, respect, personal integrity, and ethical conduct that will guide participants throughout their lives.' },
    ] as ProgramObjective[],
    hasInquiryForm: true,
  },
  'kappa-league': {
    title: 'Kappa League',
    subtitle: 'Kappa Leadership Development League \u2014 Grades 6\u201312',
    slug: 'kappa-league',
    overview: 'Kappa League is the premier subset of the Guide Right program, designed specifically for male students in grades 6 through 12. It provides a structured, year-round mentoring experience that develops young men into leaders equipped to excel in academics, their communities, and professional life.',
    externalLink: { url: 'https://natlkappaleague.org', label: 'Visit natlkappaleague.org' },
    foundingStats: [
      { number: '1969', label: 'Year Founded' },
      { number: 'Feb 12', label: 'Founding Date' },
      { number: 'LA', label: 'Los Angeles, CA' },
    ],
    foundingText: [
      'Kappa League was founded on February 12, 1969 in Los Angeles, California by brothers Mel L. Davis and Edgar H. Bishop. The program was originally known as the Kappa Instructional Leadership League before being renamed to reflect its growth and the broader leadership development mission at its core.',
      'What began as a local initiative in Los Angeles has since expanded to chapters across the United States, becoming one of the most recognized youth mentoring programs associated with any Greek-letter organization.',
    ],
    founders: [
      { initials: 'MD', name: 'Mel L. Davis', desc: 'Co-founder of Kappa League in Los Angeles, 1969. His vision for structured, year-round mentoring of young Black males laid the foundation for what would become a nationally recognized program.' },
      { initials: 'EB', name: 'Edgar H. Bishop', desc: 'Co-founder of Kappa League in Los Angeles, 1969. Bishop\'s organizational expertise and commitment to youth helped shape the program\'s structure and ensure its growth beyond Southern California.' },
    ],
    phases: [
      { phase: 'Phase I', title: 'Orientation & Introduction', text: 'Participants are introduced to the Kappa League program, its history, goals, and expectations. This phase establishes the foundation of brotherhood, respect, and commitment.' },
      { phase: 'Phase II', title: 'Personal Development', text: 'Focus on self-awareness, personal responsibility, and the development of positive habits and attitudes that contribute to academic and personal success.' },
      { phase: 'Phase III', title: 'Academic Excellence', text: 'Workshops, tutoring, and mentoring designed to strengthen academic performance and develop study skills, time management, and a love of learning.' },
      { phase: 'Phase IV', title: 'Career Awareness', text: 'Career day events, professional site visits, and mentoring sessions with Kappa brothers across diverse professions expose participants to the full range of career possibilities.' },
      { phase: 'Phase V', title: 'Leadership Development', text: 'Structured opportunities to serve in leadership roles within the Kappa League chapter, developing skills in decision-making, public speaking, and team leadership.' },
      { phase: 'Phase VI', title: 'Community Service', text: 'Organized community service projects that instill civic responsibility and allow participants to see themselves as agents of positive change in their communities.' },
      { phase: 'Phase VII', title: 'College Preparation & Transition', text: 'College tours, application assistance, financial aid guidance, and transitional support to help participants successfully navigate the path from high school to higher education.' },
    ] as ProgramPhase[],
    ctaLinks: [
      { url: 'https://natlkappaleague.org', label: 'Visit National Kappa League', external: true },
      { url: '/contact/need-assistance', label: 'Contact IHQ' },
    ],
  },
  'achievement-academy': {
    title: 'Achievement Academy',
    subtitle: 'Enhancing collegiate member experiences through structured professional development',
    slug: 'achievement-academy',
    overview: 'The Achievement Academy is Kappa Alpha Psi\'s premier program for enhancing the collegiate member experience. It creates structured pathways for undergraduate brothers to connect their academic pursuits with real-world professional development, guided by accomplished alumni mentors in their field of study.',
    overviewExtra: 'Through the Academy, undergraduate brothers gain access to a network of accomplished alumni mentors, career resources, and professional development workshops \u2014 all organized around their chosen cohort area. Alumni members also benefit by serving in mentorship roles and contributing to the next generation of Kappa achievement.',
    externalLink: { url: 'https://kappaachievementacademy.org', label: 'Visit kappaachievementacademy.org' },
    cohorts: [
      { icon: '\u{1F4BC}', label: 'Business' },
      { icon: '\u{1F393}', label: 'Education' },
      { icon: '\u{1F3DB}\u{FE0F}', label: 'Government' },
      { icon: '\u{2696}\u{FE0F}', label: 'Law' },
      { icon: '\u{1F3E5}', label: 'Health' },
      { icon: '\u{1F52C}', label: 'STEM' },
      { icon: '\u{1F310}', label: 'Social Science' },
      { icon: '\u{1F396}\u{FE0F}', label: 'Military Science' },
    ] as ProgramCohort[],
    undergradBenefits: [
      'Access to a national network of professional alumni mentors',
      'Industry-specific workshops and panel discussions',
      'Internship and career placement connections',
      'Resume and interview preparation support',
      'Leadership development opportunities within cohort',
      'Annual Achievement Academy conference participation',
    ],
    alumniBenefits: [
      'Opportunity to invest in the next generation of Kappa achievement',
      'Structured mentoring framework with clear expectations',
      'Access to talented, motivated undergraduate brothers',
      'Continuing education and professional development content',
      'Reconnection with the brotherhood through meaningful service',
      'Recognition for mentoring contributions at Grand Chapter',
    ],
    steps: [
      { step: 'Step 1', title: 'Select Your Cohort', text: 'Undergraduate brothers select the cohort area that best aligns with their academic major and career aspirations from the eight available areas.' },
      { step: 'Step 2', title: 'Get Matched with a Mentor', text: 'The Achievement Academy matches each undergraduate participant with an accomplished alumni mentor who is active in the participant\'s chosen field.' },
      { step: 'Step 3', title: 'Engage in the Program', text: 'Participants attend cohort-specific workshops, complete structured mentoring sessions, and participate in professional development activities throughout the academic year.' },
      { step: 'Step 4', title: 'Annual Conference', text: 'The program culminates in an annual Achievement Academy conference bringing together participants, mentors, and distinguished Kappa professionals for a capstone experience.' },
    ] as ProgramStep[],
  },
  'room-to-read': {
    title: 'Room To Read',
    subtitle: 'Building a World-Class Library in Every Child\'s Mind',
    slug: 'room-to-read',
    overview: 'Kappa Alpha Psi\u00AE has partnered with Room to Read, a global nonprofit that transforms the lives of millions of children in low-income communities by focusing on literacy and gender equality in education. Through this partnership, the fraternity\'s members across the United States donate books to children who lack access to quality reading materials.',
    overviewExtra: 'The program targets students in 2nd through 4th grade \u2014 a critical window in a child\'s reading development \u2014 providing books in 42 languages to serve diverse communities across the globe.',
    chairman: { initials: 'EJ', name: 'Evan Jackson', role: 'National Chairman, Room To Read Program' },
    stats: [
      { number: '150,000+', label: 'Members Participating' },
      { number: '12', label: 'Provinces' },
      { number: '32,000+', label: 'Books Donated' },
      { number: '42', label: 'Languages Available' },
    ],
    timeline: [
      { date: 'November 15, 2019', title: 'Soft Launch \u2014 Milwaukee, WI', text: 'The Room To Read partnership was soft-launched at a fraternity event in Milwaukee, Wisconsin, marking the beginning of the organizational rollout.' },
      { date: 'January 2, 2020', title: 'Official National Launch \u2014 Las Vegas, NV', text: 'The program was officially launched on January 2, 2020 in Las Vegas, Nevada.' },
      { date: 'Present', title: '32,000+ Books Donated', text: 'Through the combined efforts of participating chapters across all 12 provinces, Kappa Alpha Psi\u00AE members have donated more than 32,000 books to children in need.' },
    ],
    literacyMessage: 'Research shows that children who cannot read proficiently by the end of 3rd grade are four times more likely to drop out of high school. By targeting 2nd through 4th graders \u2014 the critical transition from \u201Clearning to read\u201D to \u201Creading to learn\u201D \u2014 the Room To Read program addresses one of the most consequential gaps in early education.',
  },
  'learn-2-live': {
    title: 'Learn 2 Live',
    subtitle: 'Bridging the gap between communities of color and law enforcement',
    slug: 'learn-2-live',
    chairman: { initials: 'DC', name: 'Dominique D. Calhoun, Esq.', role: 'National Chairman, Learn 2 Live', phone: '(682) 556-6592', email: 'dominique.calhoun@kappaalphapsi.com' },
    missionQuote: 'Learn 2 Live is a decade-long initiative addressing the tension between communities of color and law enforcement \u2014 equipping young people with the knowledge and skills to navigate police encounters safely while advocating for systemic accountability.',
    missionText: [
      'Recognizing that interactions between Black youth and law enforcement can be life-altering \u2014 and too often life-ending \u2014 Kappa Alpha Psi\u00AE launched the Learn 2 Live initiative to empower young people of color with practical knowledge about their legal rights and how to conduct themselves during police encounters.',
      'The program targets youth ages 14\u201324 and is delivered through a combination of educational workshops, interactive simulations, and community forums. It does not place the burden of change solely on young people \u2014 it also engages law enforcement in dialogue, holding both parties accountable for better outcomes.',
    ],
    externalLink: { url: 'https://learn2livemovement.com', label: 'learn2livemovement.com' },
    stats: [
      { number: '140+', label: 'Forums Conducted' },
      { number: '70,000+', label: 'Students Trained' },
      { number: '14\u201324', label: 'Target Age Range' },
      { number: '200', label: 'Forum Goal' },
    ],
    curriculum: [
      { icon: '\u{2696}\u{FE0F}', title: 'Part 1: Understanding the Law & Your Rights', text: 'A foundational module covering the Fourth Amendment \u2014 protection against unreasonable searches and seizures \u2014 and related constitutional rights that govern police-citizen interactions.' },
      { icon: '\u{1F3AD}', title: 'Part 2: Interactive Workshops', text: 'Scenario-based learning through simulated police encounters allows participants to practice de-escalation techniques, asserting their rights respectfully, and making safe decisions in high-pressure situations.' },
      { icon: '\u{1F91D}', title: 'Part 3: Panel Discussions with Law Enforcement', text: 'Structured dialogues between youth participants and law enforcement officers create space for honest conversation, mutual understanding, and the building of community trust.' },
    ] as ProgramCurriculum[],
    pledge: [
      { letter: 'A', title: 'Accountability', text: 'Law enforcement agencies will establish and maintain transparent accountability mechanisms that hold officers responsible for misconduct without exception.' },
      { letter: 'B', title: 'Bias Recognition & Training', text: 'Officers will receive ongoing training in implicit bias recognition and cultural competency to ensure equitable treatment of all community members.' },
      { letter: 'C', title: 'Community Engagement', text: 'Law enforcement agencies will actively participate in community events, youth programs, and dialogue initiatives.' },
      { letter: 'D', title: 'De-escalation Priority', text: 'De-escalation techniques will be prioritized as the primary strategy in all non-lethal situations.' },
      { letter: 'E', title: 'Equity in Enforcement', text: 'Agencies will track, review, and publicly report enforcement data disaggregated by race and demographics.' },
    ] as ProgramPledge[],
  },
  'undergraduate-leadership-institute': {
    title: 'Undergraduate Leadership Institute',
    subtitle: 'Developing the next generation of Kappa Alpha Psi\u00AE leaders',
    slug: 'undergraduate-leadership-institute',
    chairman: { initials: 'KS', name: 'Kristerpher J. Smith', role: 'Chairman, Undergraduate Leadership Institute' },
    aboutText: [
      'The Undergraduate Leadership Institute (ULI) is Kappa Alpha Psi\'s premier leadership development program for undergraduate chapter members. It is designed to cultivate the skills, knowledge, and character required to lead effectively \u2014 not just within the fraternity, but in every arena of life.',
      'The ULI brings together some of the fraternity\'s most promising undergraduate leaders for an intensive, multi-day experience that combines leadership theory with practical application.',
      'Through the ULI, Kappa Alpha Psi\u00AE invests in the men who will carry the fraternity\'s legacy forward \u2014 ensuring that the next generation of chapter presidents, Grand Board members, and community leaders are prepared to lead with vision, integrity, and excellence.',
    ],
    gains: [
      { icon: '\u{1F3AF}', title: 'Leadership Frameworks', text: 'Evidence-based leadership models and frameworks that participants can apply immediately within their chapters and campus communities.' },
      { icon: '\u{1F91D}', title: 'Brotherhood Network', text: 'Connections with outstanding undergraduate brothers from chapters across the country \u2014 a network that will serve participants for a lifetime.' },
      { icon: '\u{1F4CB}', title: 'Personal Development Plan', text: 'A concrete, actionable personal development plan crafted with guidance from experienced alumni mentors and facilitators.' },
      { icon: '\u{1F5E3}\u{FE0F}', title: 'Communication Skills', text: 'Public speaking, conflict resolution, and persuasive communication training to help participants lead and inspire others effectively.' },
      { icon: '\u{1F31F}', title: 'Alumni Mentorship', text: 'Direct access to accomplished Kappa alumni who serve as mentors and guest speakers throughout the ULI experience.' },
      { icon: '\u{1F4DC}', title: 'Official Recognition', text: 'ULI completion is recognized by the Grand Chapter and reflects positively on both the participant and their chapter\'s standing.' },
    ] as ProgramGain[],
    eligibilityText: [
      'The Undergraduate Leadership Institute is open to initiated, undergraduate members in good standing with their chapter and the Grand Chapter. Applicants should demonstrate academic achievement, active chapter participation, and a genuine commitment to personal and professional development.',
      'Selection for the ULI is competitive. Chapters are encouraged to nominate their most promising members, and nominees must complete a formal application process.',
    ],
  },
  'lead-kappa': {
    title: 'Lead Kappa',
    subtitle: 'Intensive Leadership Development at the Highest Level',
    slug: 'lead-kappa',
    overviewQuote: '\u201CLEAD Kappa is a highly-structured and intense leadership experience held during the year of a conclave. It is designed to train participants with capacity building skills to lead in multiple contexts \u2013 in the fraternity, on college/university campus, in the community and in Corporate America.\u201D',
    overviewText: 'Lead Kappa represents the highest tier of leadership development programming offered by Kappa Alpha Psi\u00AE Fraternity, Inc. Unlike other programs, Lead Kappa is synchronized with the conclave cycle \u2014 occurring in the year that the Grand Chapter convenes \u2014 creating a unique convergence of organizational energy, alumni presence, and leadership focus.',
    contexts: [
      { icon: '\u039A\u0391\u03A8', title: 'In the Fraternity', desc: 'Chapter leadership, Grand Board service, province roles, and contributions to the international fraternity\'s mission.', bg: 'var(--crimson)', color: '#FFF8E1', titleColor: '#FFF8E1', descColor: 'rgba(255,248,225,0.8)' },
      { icon: '\u{1F393}', title: 'On Campus', desc: 'Student government, academic organizations, multicultural leadership, and visible representation of Kappa excellence.', bg: 'var(--gold)', color: 'var(--crimson)', titleColor: 'var(--crimson)', descColor: 'rgba(139,0,0,0.8)' },
      { icon: '\u{1F3D8}\u{FE0F}', title: 'In the Community', desc: 'Civic engagement, nonprofit leadership, mentoring programs, and driving positive change in local communities.', bg: 'var(--cream)', color: 'var(--crimson)', titleColor: 'var(--crimson)', descColor: 'var(--text-light)', border: '2px solid var(--crimson)' },
      { icon: '\u{1F4BC}', title: 'In Corporate America', desc: 'Professional leadership, executive presence, entrepreneurship, and navigating the corporate landscape with integrity.', bg: '#1a1a1a', color: '#fff', titleColor: 'var(--gold)', descColor: 'rgba(255,255,255,0.7)' },
    ] as ProgramContext[],
    skills: [
      { icon: '\u{1F9ED}', title: 'Strategic Vision', text: 'The ability to see beyond immediate problems, set long-term direction, and inspire others to pursue a shared vision with commitment and energy.' },
      { icon: '\u{1F465}', title: 'Team Building', text: 'Skills in assembling, motivating, and managing high-performing teams \u2014 and in maintaining team cohesion through challenge and change.' },
      { icon: '\u{1F4CA}', title: 'Organizational Development', text: 'Understanding how organizations grow, adapt, and sustain themselves \u2014 and the leader\'s role in driving positive organizational change.' },
      { icon: '\u{1F5FA}\u{FE0F}', title: 'Decision Making', text: 'Frameworks for making sound decisions under pressure, with limited information, and in ways that reflect the leader\'s values and the organization\'s mission.' },
      { icon: '\u{1F4AC}', title: 'Executive Communication', text: 'High-level communication skills including public speaking, negotiation, media relations, and the ability to communicate with clarity and conviction at the highest levels.' },
      { icon: '\u{1F504}', title: 'Adaptive Leadership', text: 'The capacity to lead through ambiguity and change \u2014 recognizing when old approaches are failing and having the courage to chart a new course.' },
    ] as ProgramSkill[],
  },
  'glad': {
    title: 'G.L.A.D.',
    subtitle: 'Greeks Learning to Avoid Debt \u2014 Empowering Tomorrow\'s Leaders Through Financial Literacy',
    slug: 'glad',
    chairman: { initials: 'JM', name: 'Jeffrey B. McGinnis', role: 'National Chairman, G.L.A.D.' },
    vision: '\u201CEmpowering Tomorrow\u2019s Leaders Through Financial Literacy\u201D',
    aboutText: [
      'G.L.A.D. \u2014 Greeks Learning to Avoid Debt \u2014 is Kappa Alpha Psi\'s national financial literacy initiative. Recognizing that financial vulnerability is one of the most significant barriers to achievement for communities of color, G.L.A.D. arms members with the knowledge, tools, and resources they need to achieve financial wellness and build lasting wealth.',
      'The program operates at both the individual and community level \u2014 providing financial education to fraternity members while also extending that knowledge outward through workshops, community events, and partnerships that reach beyond the brotherhood.',
      'G.L.A.D. leverages the iGrad platform, a leading financial wellness tool used by colleges and universities across the country, to deliver personalized, interactive financial literacy content to members wherever they are.',
    ],
    igradFeatures: [
      { title: 'Personalized Learning', text: 'Customized financial education content based on each member\'s unique financial situation, goals, and learning pace.' },
      { title: 'Comprehensive Coverage', text: 'Topics spanning the full financial lifecycle: student loans, budgeting, credit, investing, insurance, homeownership, and retirement.' },
      { title: 'Interactive Tools', text: 'Calculators, quizzes, and planning tools that turn financial knowledge into actionable decisions.' },
      { title: 'Progress Tracking', text: 'Measurable milestones and progress reports that keep members accountable and motivated on their financial wellness journey.' },
    ] as ProgramIgradFeature[],
    commitments: [
      'Champion financial literacy as a cornerstone of community empowerment and individual achievement',
      'Provide accessible, high-quality financial education resources to all members and their communities',
      'Partner with leading financial institutions and educational platforms to deliver best-in-class content',
      'Leverage the iGrad platform to deliver personalized, data-driven financial wellness programming',
      'Equip undergraduate members with the knowledge and skills to graduate debt-informed and financially prepared',
      'Support alumni members in achieving long-term financial goals including homeownership, retirement planning, and wealth building',
      'Advocate for systemic financial equity and access for communities of color across the United States',
      'Train chapter-level financial literacy ambassadors to multiply the program\u2019s impact in local communities',
      'Deliver targeted programming on student loan management, credit building, budgeting, and investing',
      'Measure and report on the program\u2019s financial literacy impact annually to the Grand Chapter',
      'Collaborate with Guide Right and Kappa League to extend financial literacy programming to youth',
      'Promote entrepreneurship and business ownership as pathways to financial independence and generational wealth',
    ],
  },
  'are-you-ok': {
    title: 'Are You OK?',
    subtitle: 'Your health matters. Your life matters. Check in with yourself and your brothers.',
    slug: 'are-you-ok',
    overview: 'Are You OK? is Kappa Alpha Psi\'s comprehensive health and wellness initiative, developed in partnership with Johnson & Johnson. The program addresses the full spectrum of health \u2014 mental, physical, nutritional, and preventive \u2014 with a particular focus on the health disparities that disproportionately affect Black men and communities of color.',
    overviewExtra: 'Too often, Black men are taught that seeking help is a sign of weakness. Are You OK? directly challenges that narrative \u2014 promoting a culture within Kappa Alpha Psi\u00AE and beyond where brothers check in with each other, prioritize their health, and seek help without shame.',
    mentalHealthStats: [
      '21% of Black Americans experience mental illness',
      'Only 39% of those affected receive care',
      '56\u201374% of those exposed to trauma require mental health services',
    ],
    prostateStats: [
      'Approximately 1 in 5 Black men will be diagnosed with prostate cancer',
      'Black men are 2\u00D7 more likely to die from prostate cancer',
      'Black men have a 1.7\u00D7 higher diagnosis rate than white men',
    ],
    areas: [
      { icon: '\u{1F9E0}', title: 'Mental Health Evaluation', text: 'Access to evidence-based mental health screening tools and assessments to help members understand their mental health status and identify when professional support may be needed.' },
      { icon: '\u{1F3E5}', title: 'Medical & Physical Health', text: 'Information and resources on preventive screenings, prostate health, cardiovascular disease, diabetes management, and other conditions that disproportionately affect Black men.' },
      { icon: '\u{1F957}', title: 'Nutrition', text: 'Practical nutritional guidance tailored to Black men\'s health needs \u2014 addressing the specific dietary factors that contribute to health disparities in the community.' },
      { icon: '\u{1F4DA}', title: 'Educational Resources', text: 'A curated library of health education materials, research, and tools covering mental health, physical wellness, and preventive care.' },
      { icon: '\u{1F3A5}', title: 'Video Support', text: 'A growing library of video content including personal testimonials from brothers who have navigated mental health challenges, expert interviews, and educational presentations.' },
      { icon: '\u{1F91D}', title: 'Get Involved', text: 'Opportunities for chapters and individual brothers to host Are You OK? events, health fairs, and wellness workshops in their communities.' },
    ] as ProgramArea[],
    partnershipText: [
      'The Are You OK? initiative was developed in partnership with Johnson & Johnson, one of the world\'s leading healthcare companies. This partnership provides Kappa Alpha Psi\u00AE with access to leading-edge health education content, clinical expertise, and resources.',
      'Johnson & Johnson\'s commitment to health equity aligns with Kappa Alpha Psi\'s mission to improve outcomes for Black men and communities of color \u2014 making this partnership a natural expression of shared values.',
    ],
  },
};

export const load: PageLoad = ({ params }) => {
  const data = programs[params.slug];
  if (!data) throw error(404, 'Not found');
  return data;
};
