/**
 * ContactRequest
 * Contact form submission data
 */
export interface ContactRequest {
  /** Name */
  name: string;
  /**
   * Email
   * @format email
   */
  email: string;
  /** Message */
  message: string;
}

/**
 * ContactResponse
 * Response after successful contact form submission
 */
export interface ContactResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
}

/**
 * ExpertiseItem
 * Single expertise direction item
 */
export interface ExpertiseItem {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Icon */
  icon: string;
  /** Color Accent */
  color_accent: string;
}

/**
 * ExpertiseResponse
 * List of all expertise directions
 */
export interface ExpertiseResponse {
  /** Items */
  items: ExpertiseItem[];
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/**
 * Partner
 * Single partner company
 */
export interface Partner {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Logo Url */
  logo_url: string;
  /** Website Url */
  website_url: string;
  /** Description */
  description?: string | null;
}

/**
 * PartnersResponse
 * List of all partner companies
 */
export interface PartnersResponse {
  /** Items */
  items: Partner[];
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type GetExpertiseData = ExpertiseResponse;

export type GetPartnersData = PartnersResponse;

export type SubmitContactFormData = ContactResponse;

export type SubmitContactFormError = HTTPValidationError;
