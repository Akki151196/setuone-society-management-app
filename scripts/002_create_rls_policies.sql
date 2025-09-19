-- Row Level Security Policies for Setuone Society Management App

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_select_all_for_admin" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

-- Facilities policies (readable by all, manageable by admin/secretary)
CREATE POLICY "facilities_select_all" ON public.facilities
  FOR SELECT USING (true);

CREATE POLICY "facilities_manage_admin" ON public.facilities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

-- Facility bookings policies
CREATE POLICY "facility_bookings_select_own" ON public.facility_bookings
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

CREATE POLICY "facility_bookings_insert_own" ON public.facility_bookings
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "facility_bookings_update_own" ON public.facility_bookings
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

-- Events policies
CREATE POLICY "events_select_all" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "events_manage_admin" ON public.events
  FOR ALL USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

-- Event registrations policies
CREATE POLICY "event_registrations_select_own" ON public.event_registrations
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

CREATE POLICY "event_registrations_insert_own" ON public.event_registrations
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Visitors policies
CREATE POLICY "visitors_select_own" ON public.visitors
  FOR SELECT USING (
    host_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary', 'security')
    )
  );

CREATE POLICY "visitors_insert_own" ON public.visitors
  FOR INSERT WITH CHECK (host_id = auth.uid());

CREATE POLICY "visitors_update_security" ON public.visitors
  FOR UPDATE USING (
    host_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary', 'security')
    )
  );

-- Maintenance requests policies
CREATE POLICY "maintenance_requests_select_own" ON public.maintenance_requests
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

CREATE POLICY "maintenance_requests_insert_own" ON public.maintenance_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "maintenance_requests_update_admin" ON public.maintenance_requests
  FOR UPDATE USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

-- Payments policies
CREATE POLICY "payments_select_own" ON public.payments
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

CREATE POLICY "payments_manage_admin" ON public.payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

-- Incidents policies
CREATE POLICY "incidents_select_own" ON public.incidents
  FOR SELECT USING (
    reported_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary', 'security')
    )
  );

CREATE POLICY "incidents_insert_all" ON public.incidents
  FOR INSERT WITH CHECK (reported_by = auth.uid());

CREATE POLICY "incidents_update_staff" ON public.incidents
  FOR UPDATE USING (
    reported_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary', 'security')
    )
  );

-- Staff attendance policies
CREATE POLICY "staff_attendance_select_own" ON public.staff_attendance
  FOR SELECT USING (
    staff_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

CREATE POLICY "staff_attendance_insert_own" ON public.staff_attendance
  FOR INSERT WITH CHECK (staff_id = auth.uid());

-- Notifications policies
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "notifications_insert_admin" ON public.notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

-- Chat messages policies
CREATE POLICY "chat_messages_select_all" ON public.chat_messages
  FOR SELECT USING (true);

CREATE POLICY "chat_messages_insert_own" ON public.chat_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "chat_messages_update_own" ON public.chat_messages
  FOR UPDATE USING (sender_id = auth.uid());

-- Polls policies
CREATE POLICY "polls_select_all" ON public.polls
  FOR SELECT USING (true);

CREATE POLICY "polls_manage_admin" ON public.polls
  FOR ALL USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

-- Poll votes policies
CREATE POLICY "poll_votes_select_own" ON public.poll_votes
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'secretary')
    )
  );

CREATE POLICY "poll_votes_insert_own" ON public.poll_votes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "poll_votes_update_own" ON public.poll_votes
  FOR UPDATE USING (user_id = auth.uid());
