/**
 * Grand Chapter Awards data and member lookup utilities.
 *
 * Each award stores rows as tuples. The "name" column is always index 2.
 * Laurel Wreath rows: [#, year, name, profession, achievement]
 * Elder Watson Diggs rows: [#, year, name, chapter]
 * Guy Levis Grant rows: [#, year, name, chapter]
 * Byron K. Armstrong rows: [#, year, name, university]
 */

export interface Award {
	name: string;
	since: number;
	count: number;
	description: string;
	cols: string[];
	data: (string | number)[][];
}

export interface MemberAward {
	award: string;
	year: number;
	detail: string; // profession, chapter, or university depending on award
}

export const awards: Award[] = [
	{
		name: 'Laurel Wreath Award',
		since: 1924,
		count: 81,
		description: 'The highest award available to a member of the Fraternity for extra meritorious achievement that is at least national in scope and effect. The award consists of the Fraternity coat of arms enwreathed in laurel leaves and a framed certificate of merit.',
		cols: ['#', 'Year', 'Name', 'Profession', 'Achievement'],
		data: [
			[1,1924,'Elder Watson Diggs*','Educator','Fraternity'],[2,1924,'Robert Sengstacke Abbott*','Newspaper Publisher','Journalism'],[3,1926,'T. Giles Nutter*','Attorney','Politics'],[4,1926,'Archie A. Alexander*','Civil Engineer','Engineering'],[5,1929,'J. Ernest Wilkins*','Attorney','Academics & Fraternity'],[6,1935,'Byron Kenneth Armstrong*','College Professor','Fraternity'],[7,1936,'Armond W. Scott*','Attorney','Judiciary'],[8,1940,'Lionel F. Artis*','Housing Administrator','Journal Editor'],[9,1944,'Clarence Leon Wilson*','Obstetrician','Medicine'],[10,1945,'W. Ellis Stewart*','Insurance Executive','Business'],[11,1945,'C. C. Spaulding*','Insurance Executive','Business'],[12,1946,'R. J. Jones*','Physician','Business'],[13,1947,'Leon A. Ransom*','Attorney','Academics'],[14,1948,'Earl B. Dickerson*','Attorney','Business'],[15,1950,'George E. C. Hayes*','Attorney','Civil Rights Law'],[16,1950,'Percy H. Lee*','Educator','Fraternity'],[17,1954,'Jesse M. Tinsley*','Dentist','Civil Rights'],[18,1968,'Donald L. Hollowell*','Attorney','Civil Rights'],[19,1968,'C. Rodger Wilson*','Public Administrator','Fraternity'],[20,1970,'Allison B. Henderson*','Physician','Medicine'],[21,1970,'W. Henry Greene*','Physician','Fraternity'],[22,1974,'Thomas Bradley*','Attorney','Politics'],[23,1974,'James J. Henderson*','Insurance Executive','Finance'],[24,1976,'Edward Giles Irvin*','Journalist','Fraternity'],[25,1976,'Samuel P. Massie*','College Professor','Chemical Research'],[26,1977,'W. Thomas Carter*','College Professor','Fraternity'],[27,1977,'C. Felton Gayles*','College Athletics','Sports'],[28,1979,'Leon H. Sullivan*','Clergyman','Business & Civic'],[29,1979,'Daniel James Jr.**','Military – USAF General','Military'],[30,1980,'G. James Fleming*','Journalist','Fraternity'],[31,1982,'Howard C. Barnhill*','Educator','Fraternity'],[32,1982,'Richard B. Millspaugh','Attorney','Fraternity'],[33,1983,'Hilliary H. Holloway*','Attorney','Fraternity'],[34,1983,'A. Maceo Walker*','Insurance Executive','Civil Rights'],[35,1985,'Elbert E. Allen*','Dental Surgeon','Fraternity'],[36,1985,'Ernest H. Davenport*','CPA','Fraternity'],[37,1986,'Irven Armstrong*','Educator','Fraternity'],[38,1986,'George W. Crockett, Jr.*','US Congressman','Politics'],[39,1986,'Arthur R. Ashe*','Tennis Professional','Civil Rights'],[40,1988,'Frank M. Summers**','Attorney','Fraternity'],[41,1991,'Edward L. Ellois*','College Administrator','Civic'],[42,1991,'William L. Crump*','College Professor','Fraternity'],[43,1993,'Edward J. Perkins*','US Foreign Service','Government & Politics'],[44,1995,'Paul P. Cooke*','College Administrator','Civic & Fraternity'],[45,1999,'Johnnie L. Cochran, Esq.*','Attorney','Law'],[46,1999,'Ullysess McBride','College Administrator','Fraternity'],[47,1999,'Samuel D. Proctor**','College Professor','Civic'],[48,1999,'Oba B. White**','Physician','Fraternity'],[49,2001,'Randall C. Bacon*','Public Administrator','Fraternity'],[50,2001,'Bernard C. Harris, Jr.','Astronaut','Aviation Science'],[51,2001,'Louis B. Stokes*','Attorney','Politics'],[52,2003,'John Conyers*','US Congressman','Politics'],[53,2003,'Henry E. Frye','Judge','Government'],[54,2003,'Wellington E. Webb','Mayor','Politics'],[55,2005,'Cornelius W. Grant*','College Professor','Civic'],[56,2005,'Robert L. Harris','Lawyer','Law'],[57,2005,'Carl Ware','Corporate Executive','Business'],[58,2005,'Dr. Bobby L. Wilson','Academics','Scientific Research'],[59,2007,'Alcee L. Hastings*','US Congressman','Politics & Welfare'],[60,2007,'John E. Jacob','Corporate Executive','Business & Civil Rights'],[61,2007,'Williams G. Mays*','Industrial','Business & Fraternity'],[62,2007,'George L. Russell, Jr., Esq.','Lawyer','Law'],[63,2009,'Dr. Carl E. Anderson','College Administrator','Civic'],[64,2009,'Dr. Ralph J. Bryson*','College Professor','Fraternity'],[65,2009,'Judge Nathaniel R. Jones','Judge','Law'],[66,2009,'Dr. Thomas A. Moorehead','Business Entrepreneur','Business'],[67,2011,'Arthur Lloyd Carter*','Federal Government','Civic'],[68,2011,'Michael Victor Roberts','Entrepreneur','Business'],[69,2011,'Ronald Young*','Corporate Executive','Fraternity'],[70,2013,'Alvin H. Crawford, MD','Physician','Medicine'],[71,2013,'Bennie G. Thompson','US Congressman','Politics'],[72,2015,'General Dennis L. Via','Military','Military'],[73,2017,'Rodney C. Adkins','Corporate Executive','Business'],[74,2017,'Dr. Julian M. Earls','Physicist','Science'],[75,2019,'Samuel C. Hamilton*','Corporate Executive','Business & Fraternity'],[76,2021,'Dwayne M. Murray, Esq.','Lawyer','Business & Fraternity'],[77,2021,'Cleophus Thomas Jr.','Lawyer','Business & Fraternity'],[78,2021,'Rev. Dr. Howard-John Wesley','Clergyman','Civic'],[79,2023,'Gregory Jackson','Entrepreneur','Business'],[80,2023,'Edward Moore, Jr.','Military','Military'],[81,2023,"Amos-León' Otis",'Entrepreneur','Business']
		]
	},
	{
		name: 'Elder Watson Diggs Award',
		since: 1958,
		count: 122,
		description: 'The second highest award available to a member for meritorious achievement. The award consists of a gold medallion bearing a likeness of Founder Elder Watson Diggs and a framed certificate.',
		cols: ['#', 'Year', 'Name', 'Chapter'],
		data: [
			[1,1958,'Dr. John N. Williams','Philadelphia (PA) Alumni'],[2,1958,'Dr. Emmett T. Scales','Des Moines (IA) Alumni'],[3,1958,'Atty. Ulysses Plummer','Portland (OR) Alumni'],[4,1961,'C. Felton Gayles','Langston (OK) Alumni'],[5,1961,'Dr. W. Henry Greene','Washington (DC) Alumni'],[6,1961,'Dr. I. W. E. Taylor','Baltimore (MD) Alumni'],[7,1973,'Dr. William L. Crump','Washington (DC) Alumni'],[8,1973,'William R. Ford','Flint (MI) Alumni'],[9,1973,'Murray E. Jackson','Detroit (MI) Alumni'],[10,1973,'LaMont H. Lawson','Washington (DC) Alumni'],[11,1973,'Dr. Oba B. White','Little Rock (AR) Alumni'],[12,1974,'Charles J. Sudduth','Berkeley (CA) Alumni'],[13,1974,'Bert V. Wadkins','Oklahoma City (OK) Alumni'],[14,1976,'Thomas E. Ashe Jr.','Beckley (WVA) Alumni'],[15,1976,'Joseph R. Jenkins','Savannah (GA) Alumni'],[16,1976,'Dr. Charles O. Stout','Philadelphia (PA) Alumni'],[17,1977,'Sanford D. Bishop','Mobile (AL) Alumni'],[18,1977,'William H. Smith','Princess Anne (MD) Alumni'],[19,1977,'James O. Whaley','San Diego (CA) Alumni'],[20,1979,'Dr. E. Albert Dumas','Chicago (IL) Alumni'],[21,1979,'C. Clifford Washington','Philadelphia (PA) Alumni'],[22,1979,'Art S. Williams','Tulsa (OK) Alumni'],[23,1980,'Dr. James Egert Allen','New York (NY) Alumni'],[24,1980,'Toussaint L. Hale','Birmingham (AL) Alumni'],[25,1980,'Dr. Herman J. Tyrance','Washington (DC) Alumni'],[26,1980,'Robert L. Williams','Indianapolis (IN) Alumni'],[27,1982,'Lenzi Barnes','Durham (NC) Alumni'],[28,1982,'James L. Bradford','Berkeley (CA) Alumni'],[29,1982,'Carlyle H. Chapman','Baton Rouge (LA) Alumni'],[30,1982,'Jay Crosby','Dayton (OH) Alumni'],[31,1982,'Woodrow W. Walston','Richmond (VA) Alumni'],[32,1983,'Dr. Herman P. Bailey','El Paso/Las Cruces Alumni'],[33,1983,'Edgar H. Bishop','Los Angeles (CA) Alumni'],[34,1983,'Sylvester R. Hall','Washington (DC) Alumni'],[35,1983,'Herbert C. King','Lawton/Fort Sill (OK) Alumni'],[36,1985,'James Carter Jr.','Washington (DC) Alumni'],[37,1985,'George W. Cathcart','Detroit (MI) Alumni'],[38,1985,'Everharding Pruitt','Birmingham (AL) Alumni'],[39,1986,'Arthur L. Carter','Indianapolis (IN) Alumni'],[40,1986,'George N. Charlton Jr.','Pittsburgh (PA) Alumni'],[41,1986,'Thomas E. Howard','Shreveport (LA) Alumni'],[42,1988,'Henry E. Bennett Sr.','Gary (IN) Alumni'],[43,1988,'Dr. Cornelius W. Grant','Albany (GA) Alumni'],[44,1988,'Charles G. Tildon','Baltimore (MD) Alumni'],[45,1989,'Peter Butler','Los Angeles (CA) Alumni'],[46,1989,'Nathan J. Cooley','Gary (IN) Alumni'],[47,1989,'Julius A. Lockett','Atlanta (GA) Alumni'],[48,1989,'Judge James A. Overton','Norfolk (VA) Alumni'],[49,1991,'William G. Mays','Indianapolis (IN) Alumni'],[50,1993,'Dr. Joseph Bruton','Washington (DC) Alumni'],[51,1993,'Donald E. Grace','Austin (TX) Alumni'],[52,1993,'Crawford E. Lane','Rocky Mount (NC) Alumni'],[53,1993,'Edward Shelton Jr','Vallejo-Fairfield (CA) Alumni'],[54,1993,'Louis N. Willis','Louisville (KY) Alumni'],[55,1995,'Dr. James B. Abram Jr.','Oklahoma City (OK) Alumni'],[56,1995,'Dr. Ralph T. Bryson','Montgomery (AL) Alumni'],[57,1995,'James M. Graves','Charleston (SC) Alumni'],[58,1995,'Dr. Oscar L. Mims','Washington (DC) Alumni'],[59,1997,'Dr. K. Bernard Chase','Hyattsville/Landover (MD) Alumni'],[60,1997,'Sterling H. Dover','Seattle (WA) Alumni'],[61,1997,'Dr. Ivory Johnson','St Louis (MO) Alumni'],[62,1997,'William H. Lockhart','Opelousas (LA) Alumni'],[63,1999,'Atty. Richard Clark','Washington (DC) Alumni'],[64,1999,'Dr. Melvin Jackson','Philadelphia (PA) Alumni'],[65,1999,'James Mosby','Indianapolis (IN) Alumni'],[66,1999,'Samuel F. Sampson','San Antonio (TX) Alumni'],[67,1999,'Charles Smith','Detroit (MI) Alumni'],[68,2001,'William M. Blakeney','Charlotte (NC) Alumni'],[69,2001,'Mark Canty Jr.','Philadelphia (PA) Alumni'],[70,2001,'Willard H. Douglas Jr.','Richmond (VA) Alumni'],[71,2001,'Leonard H. Morton','Nashville (TN) Alumni'],[72,2001,'Judge Carl Walker Jr.','Houston (TX) Alumni'],[73,2003,'Dr. David M. Dupree','Augusta (GA) Alumni'],[74,2003,'Myron L. Hardiman','Indianapolis (IN) Alumni'],[75,2003,'Thomas E. Howard, Jr.','Detroit (MI) Alumni'],[76,2003,'Winfred R. Mundle, Sr., Esq.','Washington (DC) Alumni'],[77,2003,'Cleophus Thomas, Jr.','Anniston-Piedmont Alumni'],[78,2005,'Rev. Raymond A. Booton','Charlotte (NC) Alumni'],[79,2005,'Calvin D. Heard','Dayton (OH) Alumni'],[80,2005,'W. Kenneth Jackson','Atlanta (GA) Alumni'],[81,2005,'Emerson A. Lattimore','Dallas (TX) Alumni'],[82,2005,'Dr. Keflyn X. Reed','Mobile (AL) Alumni'],[83,2007,'Rhen C. Bass','Ventura (CA) Alumni'],[84,2007,'William E. Hooker','Raleigh (NC) Alumni'],[85,2007,'James C. Mitchell','Dallas (TX) Alumni'],[86,2007,'Eric S. Morris','Pittsburgh (PA) Alumni'],[87,2007,'Mark A. Scott, Esq.','Atlanta (GA) Alumni'],[88,2009,'Donald C. Bland','Fayetteville (AR) Alumni'],[89,2009,'Dr. Chuck Carr Brown','Baton Rouge (LA) Alumni'],[90,2009,'Willie H. Coleman, Jr., Esq.','Houston (TX) Alumni'],[91,2009,'Dr. Frank S. Emanuel','Jacksonville (FL) Alumni'],[92,2009,'Clarence F. Nelson, Jr.','Norfolk (VA) Alumni'],[93,2011,'Terrance G. Blount','Washington (DC) Alumni'],[94,2011,'William B. Croom','Woodbridge (VA) Alumni'],[95,2011,'Charles W. Morgan III','Wichita (KS) Alumni'],[96,2011,'Earl B. Tildon','Winter Park (FL) Alumni'],[97,2011,'Alfred E. White','Winston-Salem (NC) Alumni'],[98,2013,'George F. David III','Baltimore (MD) Alumni'],[99,2013,'Jonathan P. Hicks','New York (NY) Alumni'],[100,2013,'Col. John M. Jenkins, Ph.D.','Bowie/Mitchellville (MD) Alumni'],[101,2013,'Ocie C. Pleasant, Jr.','Memphis (TN) Alumni'],[102,2015,'Alvin L. Barrington','New Orleans (LA) Alumni'],[103,2017,'Kevin C. Cox','Oklahoma City (OK) Alumni'],[104,2017,'Michael J. Dubose','Decatur (GA) Alumni'],[105,2017,'Sheldon McAlpin','Charlotte (NC) Alumni'],[106,2017,'Dr. Edward Scott II','Tallahassee (FL) Alumni'],[107,2017,'Melvin Solomon','Atlanta (GA) Alumni'],[108,2019,'Willie F. Brooks Jr.','Memphis (TN) Alumni'],[109,2019,'John F. Burrell','Jacksonville (FL) Alumni'],[110,2019,'Edward K. Glass, Jr.','Detroit (MI) Alumni'],[111,2019,'Robert W. Scales, Jr.','Murfreesboro (TN) Alumni'],[112,2019,'Richard Lee Snow','Philadelphia (PA) Alumni'],[113,2021,'Joseph K. Davis Jr.','Durham (NC) Alumni'],[114,2021,'William H. Fields','Columbus (OH) Alumni'],[115,2021,'Warren D. Miller','Jackson (MS) Alumni'],[116,2021,'Johnny S. Newman II','Danville (VA) Alumni'],[117,2021,'Ronald E. Range','Northport (AL) Alumni'],[118,2023,'Kevin Lenel Burnett','Richardson Plano (TX) Alumni'],[119,2023,'Linnes W. Finney Jr., Esq.','Fort Pierce (FL) Alumni'],[120,2023,'Kevin J. Johnson','Pontiac (MI) Alumni'],[121,2023,'Earl F. Merritt','Harrisburg (PA) Alumni'],[122,2023,'Curtis R. Silvers Jr.','Pasadena (CA) Alumni']
		]
	},
	{
		name: 'Guy Levis Grant Award',
		since: 1976,
		count: 106,
		description: 'The highest award available exclusively to a non-alumni member for meritorious achievement. The award consists of a gold medallion bearing a likeness of Founder Guy Levis Grant and a certificate.',
		cols: ['#', 'Year', 'Name', 'Chapter'],
		data: [
			[1,1976,'Stephen Alexander','Alpha Pi'],[2,1976,'Joseph Jimerson','Beta Omega'],[3,1976,'Walter L. Peacock','Alpha Omicron'],[4,1976,'Cleophus Thomas Jr.','Eta Chi'],[5,1977,'Donald Davis','Alpha Lambda'],[6,1977,'Henry Lewis','Alpha Iota'],[7,1979,'S. Andre Rice','Alpha Lambda'],[8,1980,'Anthony Hill','Alpha Pi'],[9,1980,'Collis Ivery III','Beta Zeta'],[10,1982,'Thomas A. George III','Epsilon Rho'],[11,1982,'Gary D. Gold','Alpha'],[12,1982,'Keflyn Reed','Eta Chi'],[13,1983,'Aaron L. Addrow-Pierson','Kappa Upsilon'],[14,1983,'Mark D. Rigsby','Beta Upsilon'],[15,1985,'Robert I. Mayes','Delta Delta'],[16,1986,'Murrell W. Blackburn','Iota Omega'],[17,1986,'Richard A. Naylor II','Kappa Chi'],[18,1988,'D. Jason DeSousa','Alpha Iota'],[19,1988,'Christopher W. C. Salley','Delta Eta'],[20,1988,'Karl E. White','Alpha Xi'],[21,1989,'David Ramon Adams','Theta Iota'],[22,1989,'Richard Edwards','Beta Chi'],[23,1991,'Willie H. Harris Jr.','Beta Zeta'],[24,1991,'Kenneth S. Pugh','Theta Omicron'],[25,1991,'Tarrus Richardson','Nu'],[26,1991,'Derrick Williams','Nu Gamma'],[27,1993,'Gregory B. Atkins','Eta Sigma'],[28,1993,'Samuel J. Boyd Jr.','Alpha Nu'],[29,1993,'Reginald R. Jackson','Zeta Iota'],[30,1995,'Damon O. Barry','Gamma Eta'],[31,1995,'Craig A. Robinson','Nu Delta'],[32,1997,'Terry B. Greene','Gamma Nu'],[33,1997,'Jwyanza B. Nuriddin','Theta Eta'],[34,1997,'Anthony F. Powell','Theta Eta'],[35,1999,'Terry Eaton','Zeta Delta'],[36,1999,'John Kuykendall III','Gamma Sigma'],[37,1999,'Uhriel Wood','Gamma Nu'],[38,2001,'Travis D. Boyce','Gamma Nu'],[39,2001,'Sean E. Bradley','Mu Sigma'],[40,2001,'Aaron J. Burt','Alpha Iota'],[41,2001,'Brett D. Cook','Theta Eta'],[42,2001,'Andy S. Heniquez','Theta Eta'],[43,2001,'Christopher R. Wilks','Epsilon Beta'],[44,2003,'Enyinna O. Anthony','Alpha Iota'],[45,2003,'Nathaniel Frederick, II','Gamma Nu'],[46,2003,'Dramaine Irions','Delta Alpha'],[47,2003,'Steven J. Pritchett','Theta Eta'],[48,2003,'Steven A. Smith','Theta Eta'],[49,2003,'Walter H. Zinn, II','Omicron Omicron'],[50,2005,'Olaolu O. Davis-Balogun','Omicron Xi'],[51,2005,'Anthony Nelson Hylick','Lambda Delta'],[52,2005,'Samuel James Laurencin','Delta Eta'],[53,2005,'Larry L. London, Jr.','Beta'],[54,2005,'Gary Wayne Overstreet, Jr.','Alpha Omicron'],[55,2005,'Tourgee D. Simpson, Jr.','Kappa Theta'],[56,2007,'Jason A. Caraballo','Kappa Chi'],[57,2007,'Charles H.F. Davis','Theta Eta'],[58,2007,'Jared J. Dawson','Alpha'],[59,2007,'Mark C. McLawhorn','Zeta Epsilon'],[60,2007,'Nikul A. Parikh','Zeta Iota'],[61,2007,'O. Jerome Stewart','Psi'],[62,2009,'Michael J.A. Davis','Mu Mu'],[63,2009,'Myron L. Rolle','Theta Eta'],[64,2009,'Charles E. Morris Sims','Alpha Iota'],[65,2009,'Michael A. Thomas, Jr.','Epsilon Psi'],[66,2009,'Darryl Tricksey','Zeta Iota'],[67,2009,'Edward H. Williams','Xi'],[68,2011,'Marvin Desmond Carr','Alpha Iota'],[69,2011,'Darius Law','Zeta Delta'],[70,2011,'Amar Parikh','Zeta Iota'],[71,2011,'Danny A. Rojas','Chi'],[72,2011,'Kristerpher J. Smith','Eta Gamma'],[73,2013,'Terry L. Allen','Gamma Alpha'],[74,2013,'Christopher A. Grant','Theta Theta'],[75,2013,'Cordy B. McGill Scarlett','Theta Eta'],[76,2013,'Brennan McMurry','Mu Rho'],[77,2013,'Marcellus C. Taylor','Pi Psi'],[78,2013,'Jeremy L. Williams','Theta Theta'],[79,2015,'Wilton C. Jackson II','Kappa Iota'],[80,2015,'Kyle Julien Henley Majors','Gamma Phi'],[81,2015,'Damariye LaQuan Smith','Iota Beta'],[82,2015,'Ryan Edward Tucker','Alpha Sigma'],[83,2017,'Aaron Dwayne Dixon','Gamma Phi'],[84,2017,'Shyheme T. McElroy','Gamma'],[85,2017,'Solomon Puryear','Eta Gamma'],[86,2017,'Chase Rollins','Xi Rho'],[87,2017,'Robert Seniors III','Alpha Xi'],[88,2017,'Denzel Washington','Nu Rho'],[89,2019,'Frank Burns Jr.','Theta Beta'],[90,2019,'Christopher G. Cross','Lambda Pi'],[91,2019,'Alexander Dawes','Pi Mu'],[92,2019,'Ivan Garcia','Kappa Alpha'],[93,2019,'Cody E. Mitchell','Alpha Phi'],[94,2019,'Dominique W. Riggins','Gamma Nu'],[95,2021,'Elijah C. Vaughn, Jr.','Theta Iota'],[96,2021,'Jeremias E. Elston','Alpha Theta'],[97,2021,"Tre'R. Jeter",'Gamma Nu'],[98,2021,'Daniel I. Nixon','Omega'],[99,2021,'Traelon T. Rodgers','Beta Gamma'],[100,2021,'Micheal N. Weaver','Alpha Upsilon'],[101,2023,'Bryce T. Dickerson','Alpha Nu'],[102,2023,'Evan R. Jackson','Lambda Xi'],[103,2023,'Kevin Taylor-Jarrell II','Alpha Sigma'],[104,2023,'Austyn D. Lee','Gamma Iota'],[105,2023,'Myles Chandler Miller','Beta Xi'],[106,2023,'Jordan Ware','Alpha Omicron']
		]
	},
	{
		name: 'Byron K. Armstrong Award',
		since: 1983,
		count: 55,
		description: 'The highest award available exclusively to a non-alumni member for academic excellence. Recipients receive scholarship funding provided by the Kappa Alpha Psi Foundation.',
		cols: ['#', 'Year', 'Name', 'University'],
		data: [
			[1,1983,'Duane A. Cooper','Georgia Institute of Technology'],[2,1983,'Joseph W. Shepherd','Alabama State University'],[3,1983,'Bruce Porterfield','Alabama State University'],[4,1985,'Robert E. Banks','Alabama State University'],[5,1985,'Herman Jones, Jr.','Alabama State University'],[6,1985,'Leon N. Davis','Oakland University'],[7,1988,'Edward E. Dickerson, IV','West Virginia State College'],[8,1989,'Kirk Gilpin','Prairie View A&M University'],[9,1989,'Kevin Bruce','Memphis State University'],[10,1989,'Marvin Walton','North Carolina A&T University'],[11,1991,'Kevin M. Davis','University of North Carolina'],[12,1993,'Kevlin B. Sigler','Alabama State University'],[13,1995,'Shannon Rowley','Huston-Tillotson College'],[14,1995,'Craig A. Robinson','Emory University'],[15,1997,'Anthony F. Powell','Florida State University'],[16,1997,'Victor Guinyard','Claflin College'],[17,1999,'Uhriel E. Wood','Claflin College'],[18,1999,'Victor Guinyard','Claflin College'],[19,2001,'DeMarco D. Morgan','Jackson State University'],[20,2003,'Patrick D. Carpenter','Southern University'],[21,2003,'Gregory L. Starks','Claflin University'],[22,2005,'Martin Lemelle, Jr.','Grambling State University'],[23,2007,'Cedrick D. Smith','Georgia State University'],[24,2007,'L. B. Jeter, Jr.','University of LA at Monroe'],[25,2007,'Brandon L. Mack','Claflin University'],[26,2009,'Joshua Lamar Harris','Morehouse College'],[27,2009,'Charles E. Morris Sims','Morgan State University'],[28,2009,'Michael A. Thomas','Paine College'],[29,2011,'Darius Law','University of NC Charlotte'],[30,2011,'Ali Osman','Morehouse College'],[31,2011,'Clifton K. Thomas','Clemson University'],[32,2013,'Cordy Britton McGill Scarlett','Florida State University'],[33,2013,'Marckenley Isaac','Florida State University'],[34,2013,'Grady Lee Hart','Albany State College'],[35,2015,'Wilton C. Jackson II','University of Southern Mississippi'],[36,2015,'James Rhoden','Florida State University'],[37,2015,'Kyle J.H. Majors','Alabama A&M'],[38,2017,'Adebobola V. Owoseni','Paul Quinn College'],[39,2017,'Christopher Weathers II','Morehouse College'],[40,2017,'Shyheme McElroy','University of Iowa'],[41,2019,'Ivan Garcia','Illinois State University'],[42,2019,'Andre J. Earls','Wiley College'],[43,2019,'Cody E. Mitchell','Virginia State'],[44,2021,'Traelon T. Rodgers','Dillard University'],[45,2021,'Olufemi A. Olatidoye','North Carolina A&T University'],[46,2021,'Victor O. Agbar','University of Maryland College Park'],[47,2021,'Tevyn C. Johnson','Tennessee State University'],[48,2021,'Elijah C. Vaughn, Jr.','Massachusetts Institute of Technology'],[49,2021,'Zach Dampier','Georgetown College'],[50,2023,'Jhacolby D. Williams','Alcorn State University'],[51,2023,'NL Transou III','Rust College'],[52,2023,'Correggio L. Peagler Jr.','North Carolina A&T State University'],[53,2023,'Zachary LaDerek Cartledge','Clemson University'],[54,2023,'Bright Tsagli','Brown University'],[55,2023,'Myles Chandler Miller','University of Toledo']
		]
	}
];

/** Rank of each award (lower = more prestigious) */
const AWARD_RANK: Record<string, number> = {
	'Laurel Wreath Award': 1,
	'Elder Watson Diggs Award': 2,
	'Guy Levis Grant Award': 3,
	'Byron K. Armstrong Award': 4
};

/**
 * Look up all Grand Chapter awards for a member by first + last name.
 * Strips common suffixes/prefixes (Dr., Esq., Jr., etc.) for fuzzy matching.
 */
export function findMemberAwards(firstName: string, lastName: string): MemberAward[] {
	const normalize = (s: string) =>
		s.replace(/\*/g, '')
		 .replace(/\b(Dr\.|Mr\.|Rev\.|Gen\.|Col\.|Judge|Atty\.|General|Esq\.?)\b/gi, '')
		 .replace(/,?\s*(Jr\.?|Sr\.?|II|III|IV|Ph\.?D\.?|MD|M\.D\.)/gi, '')
		 .replace(/[^a-z\s]/gi, '')
		 .trim()
		 .toLowerCase()
		 .replace(/\s+/g, ' ');

	const target = normalize(`${firstName} ${lastName}`);
	const targetLast = normalize(lastName);
	const targetFirst = normalize(firstName);

	const results: MemberAward[] = [];

	for (const award of awards) {
		for (const row of award.data) {
			const rawName = String(row[2]);
			const norm = normalize(rawName);

			// Exact full-name match or last-name + first-initial match
			if (norm === target ||
				(norm.split(' ').pop() === targetLast &&
				 norm.charAt(0) === targetFirst.charAt(0) &&
				 targetFirst.length > 0)) {
				results.push({
					award: award.name,
					year: Number(row[1]),
					detail: String(row[3])
				});
			}
		}
	}

	// Sort by prestige (highest first), then by year
	results.sort((a, b) => (AWARD_RANK[a.award] ?? 99) - (AWARD_RANK[b.award] ?? 99) || a.year - b.year);

	return results;
}
