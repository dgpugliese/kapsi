// Auto-generated types will go here when running `supabase gen types`
// For now, define the core types manually matching our schema

export type MembershipStatus = 'active' | 'inactive' | 'suspended' | 'deceased';
export type MembershipType = 'undergraduate' | 'alumni' | 'life';
export type MemberRole = 'member' | 'chapter_officer' | 'province_officer' | 'national_officer' | 'ihq_staff' | 'super_admin';
export type ChapterType = 'undergraduate' | 'alumni';
export type ChapterStatus = 'active' | 'inactive' | 'suspended';
export type PaymentType = 'annual_dues' | 'life_membership' | 'life_installment' | 'special_assessment' | 'other';
export type PaymentMethod = 'stripe' | 'manual' | 'check' | 'cash' | 'other';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type Scope = 'national' | 'province' | 'chapter';
export type PostType = 'news' | 'press_release';
export type DocumentCategory = 'form' | 'manual' | 'template' | 'report' | 'other';
export type AccessLevel = 'public' | 'member' | 'chapter_officer' | 'province_officer' | 'national_officer' | 'super_admin';
export type PositionType = 'grand_board' | 'province' | 'ihq_staff' | 'commission' | 'committee' | 'past_grand_polemarch';
export type DuesType = 'undergraduate_annual' | 'alumni_annual' | 'life_membership' | 'life_installment';
export type RsvpStatus = 'attending' | 'maybe' | 'declined';

export interface Member {
	id: string;
	first_name: string;
	last_name: string;
	middle_name: string | null;
	suffix: string | null;
	email: string;
	phone: string | null;
	address_line1: string | null;
	address_line2: string | null;
	city: string | null;
	state: string | null;
	zip: string | null;
	country: string;
	date_of_birth: string | null;
	profession: string | null;
	employer: string | null;
	bio: string | null;
	profile_photo_url: string | null;
	chapter_id: string | null;
	initiation_chapter_id: string | null;
	initiation_date: string | null;
	initiation_year: number | null;
	line_number: number | null;
	line_name: string | null;
	scroll_number: string | null;
	membership_status: MembershipStatus;
	membership_type: MembershipType;
	is_life_member: boolean;
	life_member_date: string | null;
	dues_paid_through: string | null;
	show_in_directory: boolean;
	show_email: boolean;
	show_phone: boolean;
	show_address: boolean;
	role: MemberRole;
	created_at: string;
	updated_at: string;
	// Joined relations
	chapters?: Chapter | null;
}

export interface Chapter {
	id: string;
	name: string;
	greek_designation: string | null;
	chapter_type: ChapterType;
	institution: string | null;
	city: string | null;
	state: string | null;
	country: string;
	province_id: string | null;
	charter_date: string | null;
	status: ChapterStatus;
	meeting_schedule: string | null;
	contact_email: string | null;
	contact_phone: string | null;
	address: string | null;
	website_url: string | null;
	created_at: string;
	updated_at: string;
}

export interface Province {
	id: string;
	name: string;
	abbreviation: string | null;
	polemarch_member_id: string | null;
	created_at: string;
	updated_at: string;
}
