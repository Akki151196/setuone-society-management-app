-- Seed data for facilities
INSERT INTO public.facilities (name, description, capacity, hourly_rate, amenities, image_url) VALUES
('Clubhouse', 'Main community hall with stage and sound system', 100, 500.00, ARRAY['Sound System', 'Stage', 'Air Conditioning', 'Tables & Chairs'], '/placeholder.svg?height=200&width=300'),
('Swimming Pool', 'Olympic size swimming pool with changing rooms', 50, 200.00, ARRAY['Changing Rooms', 'Lifeguard', 'Pool Equipment', 'Shower Facilities'], '/placeholder.svg?height=200&width=300'),
('Gymnasium', 'Fully equipped fitness center', 30, 150.00, ARRAY['Cardio Equipment', 'Weight Training', 'Yoga Mats', 'Air Conditioning'], '/placeholder.svg?height=200&width=300'),
('Tennis Court', 'Professional tennis court with lighting', 4, 300.00, ARRAY['Professional Court', 'Lighting', 'Net & Equipment', 'Seating Area'], '/placeholder.svg?height=200&width=300'),
('Banquet Hall', 'Elegant hall for special occasions', 150, 800.00, ARRAY['Catering Kitchen', 'Sound System', 'Decorative Lighting', 'Dance Floor'], '/placeholder.svg?height=200&width=300'),
('Kids Play Area', 'Safe play area for children', 25, 100.00, ARRAY['Play Equipment', 'Safety Mats', 'Seating for Parents', 'First Aid Kit'], '/placeholder.svg?height=200&width=300'),
('Conference Room', 'Professional meeting space', 20, 250.00, ARRAY['Projector', 'Whiteboard', 'Video Conferencing', 'High-Speed WiFi'], '/placeholder.svg?height=200&width=300'),
('Rooftop Garden', 'Beautiful garden space for events', 80, 400.00, ARRAY['Garden Setting', 'Outdoor Seating', 'Lighting', 'Water Feature'], '/placeholder.svg?height=200&width=300');
