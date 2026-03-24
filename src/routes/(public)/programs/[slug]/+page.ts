import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// Static program data — will be pulled from Supabase `programs` table once seeded
const programs: Record<string, { name: string; description: string; content: string; icon?: string }> = {
	'guide-right': {
		name: 'Guide Right',
		icon: '/images/programs/Guide-Right-200.png',
		description: 'Kappa Alpha Psi\'s national service initiative focused on youth development through mentoring and guidance.',
		content: `<p>Guide Right is a program of the educational and occupational guidance of youth, primarily inspirational and informative in character. Conceived by Leon W. Stewart in 1922, the program was presented at the fraternity's twelfth Grand Chapter gathering.</p>
<p>Working with J. Jerome Peters in the St. Louis Alumni Chapter, Stewart researched programs addressing underachievement in Black youth communities. The resulting program focused on providing scholarships to talented, economically disadvantaged students while informing them about career pathways and professional opportunities.</p>
<h3>Primary Objectives</h3>
<ul>
<li>Develop the next generation of leaders through leadership training</li>
<li>Prepare students for college enrollment</li>
<li>Mentor students through college completion</li>
<li>Positively impact youth via mentoring and training programs</li>
<li>Prepare youth for academic success in middle, high, and college levels</li>
</ul>
<h3>Impact</h3>
<p>With 199 active chapters and over 10,053 students currently served, Guide Right has historically mentored over 500,000 young people across the nation.</p>`
	},
	'kappa-league': {
		name: 'Kappa League',
		icon: '/images/programs/KappaLeague-200.png',
		description: 'Youth development program for male students in grades 6-12, a subset of the Guide Right initiative.',
		content: `<p>Kappa League is a subset of Guide Right, the fraternity's National Service Initiative. The program focuses on educational, occupational, and social guidance for male students in grades 6-12.</p>
<p>Founded on February 12, 1969, by the Los Angeles Alumni Chapter at Alain LeRoy Locke High School, the program was originally called the Kappa Instructional Leadership League and was adopted by the Grand Chapter in 1970. Founders: Mel L. Davis and Edgar H. Bishop.</p>
<h3>Mission</h3>
<p>Designed to help young men grow, receive, and develop their leadership talents in every phase of human endeavor. The fraternity aimed to help participants achieve worthy goals for themselves and make constructive contributions to their community.</p>
<h3>Program Structure</h3>
<p>The program is organized into a seven-phase framework, providing structured components for comprehensive youth development. Originally open to grades 10-12, it was later expanded to include grade 6 and above.</p>`
	},
	'achievement-academy': {
		name: 'Achievement Academy',
		icon: '/images/programs/AcheivementAcademy-200.png',
		description: 'Academic and leadership development program fostering achievement among young people.',
		content: `<p>The Achievement Academy is Kappa Alpha Psi's program dedicated to academic excellence and leadership development. The program provides structured learning experiences that prepare young people for success in education and professional life.</p>
<p>Through workshops, seminars, and mentoring relationships, the Achievement Academy instills the fraternity's core principle of achievement in every field of human endeavor.</p>`
	},
	'room-to-read': {
		name: 'Room To Read',
		description: 'Literacy initiative partnership promoting reading and educational development.',
		content: `<p>Room To Read is Kappa Alpha Psi's literacy initiative, partnering with communities to promote reading and educational development among young people. The program recognizes that literacy is the foundation for all achievement.</p>
<p>Through book drives, reading programs, and library initiatives, chapters across the country work to ensure that every child has access to books and the support to become lifelong readers.</p>`
	},
	'learn-to-live': {
		name: 'Learn 2 Live',
		icon: '/images/programs/Learn2Live-200.png',
		description: 'Health and wellness initiative promoting physical and mental well-being in communities.',
		content: `<p>Learn 2 Live is Kappa Alpha Psi's health and wellness initiative that focuses on promoting physical and mental well-being in the communities the fraternity serves.</p>
<p>The program addresses health disparities in African American communities through health screenings, wellness workshops, fitness challenges, and partnerships with healthcare organizations.</p>`
	},
	'uli': {
		name: 'Undergraduate Leadership Institute',
		icon: '/images/programs/ULI-200.png',
		description: 'Leadership development program designed specifically for undergraduate members of Kappa Alpha Psi.',
		content: `<p>The Undergraduate Leadership Institute (ULI) is designed to develop the leadership capacity of undergraduate members of Kappa Alpha Psi. The program provides intensive training in organizational leadership, personal development, and professional skills.</p>
<p>Through workshops, keynote sessions, and peer networking, ULI prepares young Kappa men to lead on their campuses, in their communities, and in their future careers.</p>`
	},
	'lead-kappa': {
		name: 'Lead Kappa',
		icon: '/images/programs/LEADKappa-200.png',
		description: 'Leadership training program developing the next generation of fraternity and community leaders.',
		content: `<p>Lead Kappa is a comprehensive leadership training program that develops the next generation of leaders within Kappa Alpha Psi and the broader community.</p>
<p>The program covers essential leadership competencies including strategic thinking, effective communication, conflict resolution, and community engagement. Participants emerge equipped to lead chapters, provinces, and community organizations.</p>`
	},
	'glad': {
		name: 'G.L.A.D.',
		icon: '/images/programs/GLAD-200.png',
		description: 'Community service initiative bringing together brothers for impactful local service projects.',
		content: `<p>G.L.A.D. (Greeks Lending A Difference) is Kappa Alpha Psi's community service initiative that mobilizes brothers for impactful service projects in their local communities.</p>
<p>The program coordinates service efforts across chapters, creating a unified approach to addressing community needs including food insecurity, housing, education access, and environmental stewardship.</p>`
	},
	'are-you-ok': {
		name: 'Are You OK?',
		description: 'Mental health awareness and support program prioritizing mental well-being in the African American community.',
		content: `<p>Are You OK? is Kappa Alpha Psi's mental health awareness and support program. The initiative encourages conversations about mental health, promotes access to resources, and works to reduce stigma around seeking help.</p>
<p>Let's prioritize mental health in the African American community. Encourage conversations, seek help when needed, and advocate for accessible, culturally sensitive mental health services. Your mental health matters!</p>
<h3>Key Focus Areas</h3>
<ul>
<li>Reducing stigma around mental health in the African American community</li>
<li>Providing resources and referrals for mental health support</li>
<li>Training chapter members as mental health advocates</li>
<li>Partnering with mental health organizations for community workshops</li>
<li>Supporting brothers and community members in crisis</li>
</ul>`
	}
};

export const load: PageLoad = ({ params }) => {
	const program = programs[params.slug];
	if (!program) {
		throw error(404, 'Program not found');
	}
	return { program, slug: params.slug };
};
