export type UserRole = "admin" | "secretary" | "security" | "member"

export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled"

export type MaintenanceStatus = "pending" | "in_progress" | "completed" | "cancelled"

export type IncidentPriority = "low" | "medium" | "high" | "critical"

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"

export type VisitorStatus = "pending" | "approved" | "checked_in" | "checked_out" | "rejected"

export interface Profile {
  id: string
  email: string
  full_name: string
  phone?: string
  role: UserRole
  apartment_number?: string
  building_name?: string
  emergency_contact?: string
  profile_image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Facility {
  id: string
  name: string
  description?: string
  capacity?: number
  hourly_rate?: number
  image_url?: string
  amenities?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FacilityBooking {
  id: string
  facility_id: string
  user_id: string
  booking_date: string
  start_time: string
  end_time: string
  status: BookingStatus
  total_amount?: number
  purpose?: string
  approved_by?: string
  approved_at?: string
  created_at: string
  updated_at: string
  facility?: Facility
  user?: Profile
}

export interface Event {
  id: string
  title: string
  description?: string
  event_date: string
  start_time: string
  end_time: string
  location?: string
  max_attendees?: number
  registration_fee?: number
  image_url?: string
  created_by: string
  is_active: boolean
  created_at: string
  updated_at: string
  creator?: Profile
}

export interface Visitor {
  id: string
  host_id: string
  visitor_name: string
  visitor_phone: string
  visitor_id_proof?: string
  purpose?: string
  expected_date: string
  expected_time?: string
  status: VisitorStatus
  qr_code?: string
  checked_in_at?: string
  checked_out_at?: string
  checked_in_by?: string
  approved_by?: string
  approved_at?: string
  created_at: string
  updated_at: string
  host?: Profile
}

export interface MaintenanceRequest {
  id: string
  user_id: string
  title: string
  description: string
  category: string
  priority: IncidentPriority
  status: MaintenanceStatus
  estimated_cost?: number
  actual_cost?: number
  assigned_to?: string
  images?: string[]
  scheduled_date?: string
  completed_at?: string
  created_at: string
  updated_at: string
  user?: Profile
  assignee?: Profile
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  payment_type: string
  reference_id?: string
  payment_method?: string
  transaction_id?: string
  status: PaymentStatus
  payment_date?: string
  due_date?: string
  description?: string
  created_at: string
  updated_at: string
  user?: Profile
}

export interface Incident {
  id: string
  reported_by: string
  title: string
  description: string
  category: string
  priority: IncidentPriority
  location?: string
  images?: string[]
  is_emergency: boolean
  status: string
  assigned_to?: string
  resolved_at?: string
  created_at: string
  updated_at: string
  reporter?: Profile
  assignee?: Profile
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  reference_id?: string
  is_read: boolean
  created_at: string
}

export interface ChatMessage {
  id: string
  sender_id: string
  message: string
  message_type: string
  file_url?: string
  reply_to?: string
  is_announcement: boolean
  created_at: string
  sender?: Profile
}

export interface Poll {
  id: string
  created_by: string
  title: string
  description?: string
  options: any
  is_multiple_choice: boolean
  end_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
  creator?: Profile
}
