-- Enable realtime for payments table
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;

-- Enable realtime for withdrawal_requests table  
ALTER PUBLICATION supabase_realtime ADD TABLE public.withdrawal_requests;

-- Enable realtime for course_submissions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.course_submissions;

-- Set REPLICA IDENTITY FULL for complete row data in updates
ALTER TABLE public.payments REPLICA IDENTITY FULL;
ALTER TABLE public.withdrawal_requests REPLICA IDENTITY FULL;
ALTER TABLE public.course_submissions REPLICA IDENTITY FULL;