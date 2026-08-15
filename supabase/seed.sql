-- IndisStack Support Inbox — demo seed data
-- Run manually AFTER applying:
--   supabase/migrations/20250815161000_support_inbox_schema.sql
--
-- Safe to re-run: skips all inserts when any ticket already exists.
-- Does not DROP or TRUNCATE tables.

do $$
begin
  if exists (select 1 from public.tickets limit 1) then
    raise notice 'IndisStack seed skipped: tickets table already contains data.';
    return;
  end if;

  -- -------------------------------------------------------------------------
  -- tickets
  -- -------------------------------------------------------------------------

  insert into public.tickets (
    id, customer_name, customer_initials, preview, channel, language,
    priority, status, created_at, updated_at
  ) values
    (
      'a1000001-0000-4000-8000-000000000001',
      'Rahul Mehta',
      'RM',
      'Bhai payment debit ho gaya but order confirm nahi hua...',
      'WhatsApp',
      'hinglish',
      'high',
      'unresolved',
      now() - interval '10 minutes',
      now() - interval '10 minutes'
    ),
    (
      'a1000002-0000-4000-8000-000000000002',
      'Ananya Iyer',
      'AI',
      'Mera order abhi tak deliver nahi hua, 5 din ho gaye...',
      'Email',
      'hinglish',
      'medium',
      'unresolved',
      now() - interval '32 minutes',
      now() - interval '32 minutes'
    ),
    (
      'a1000003-0000-4000-8000-000000000003',
      'Vikram Singh',
      'VS',
      'Size small aa gaya, M chahiye exchange possible?',
      'Web chat',
      'hinglish',
      'medium',
      'unresolved',
      now() - interval '1 hour',
      now() - interval '1 hour'
    ),
    (
      'a1000004-0000-4000-8000-000000000004',
      'Sneha Patel',
      'SP',
      'Box khula aaya aur product toota hua tha',
      'WhatsApp',
      'hinglish',
      'high',
      'unresolved',
      now() - interval '1 hour',
      now() - interval '1 hour'
    ),
    (
      'a1000005-0000-4000-8000-000000000005',
      'Arjun Khanna',
      'AK',
      'Return ho gaya 10 din pehle refund abhi tak nahi aaya',
      'Email',
      'hinglish',
      'high',
      'unresolved',
      now() - interval '2 hours',
      now() - interval '2 hours'
    ),
    (
      'a1000006-0000-4000-8000-000000000006',
      'Kavita Desai',
      'KD',
      'शिपमेंट से पहले पता बदलना है...',
      'Web chat',
      'hindi',
      'medium',
      'unresolved',
      now() - interval '3 hours',
      now() - interval '3 hours'
    ),
    (
      'a1000007-0000-4000-8000-000000000007',
      'James Wilson',
      'JW',
      'Promo code WELCOME10 didn''t work on my cart',
      'Email',
      'english',
      'low',
      'unresolved',
      now() - interval '4 hours',
      now() - interval '4 hours'
    );

  -- -------------------------------------------------------------------------
  -- messages
  -- -------------------------------------------------------------------------

  insert into public.messages (
    id, ticket_id, sender_type, sender_name, content, created_at
  ) values
    -- Rahul Mehta
    (
      'b1000001-0000-4000-8000-000000000001',
      'a1000001-0000-4000-8000-000000000001',
      'customer',
      'Rahul Mehta',
      'Bhai payment debit ho gaya but order confirm nahi hua, please check.',
      now() - interval '12 minutes'
    ),
    (
      'b1000002-0000-4000-8000-000000000002',
      'a1000001-0000-4000-8000-000000000001',
      'agent',
      'Support',
      'Hi Rahul, thanks for reaching out. We''re looking into this.',
      now() - interval '10 minutes'
    ),
    (
      'b1000003-0000-4000-8000-000000000003',
      'a1000001-0000-4000-8000-000000000001',
      'customer',
      'Rahul Mehta',
      'UPI se 1,299 cut ho gaya, screenshot bhejun?',
      now() - interval '8 minutes'
    ),
    -- Ananya Iyer
    (
      'b1000004-0000-4000-8000-000000000004',
      'a1000002-0000-4000-8000-000000000002',
      'customer',
      'Ananya Iyer',
      'Mera order abhi tak deliver nahi hua, 5 din ho gaye. Kya ho raha hai?',
      now() - interval '40 minutes'
    ),
    (
      'b1000005-0000-4000-8000-000000000005',
      'a1000002-0000-4000-8000-000000000002',
      'agent',
      'Support',
      'Hello Ananya, we apologise for the delay.',
      now() - interval '35 minutes'
    ),
    (
      'b1000006-0000-4000-8000-000000000006',
      'a1000002-0000-4000-8000-000000000002',
      'customer',
      'Ananya Iyer',
      'Tracking pe out for delivery dikha raha hai 2 din se.',
      now() - interval '33 minutes'
    ),
    (
      'b1000007-0000-4000-8000-000000000007',
      'a1000002-0000-4000-8000-000000000002',
      'agent',
      'Support',
      'Let me check with the courier partner.',
      now() - interval '30 minutes'
    ),
    -- Vikram Singh
    (
      'b1000008-0000-4000-8000-000000000008',
      'a1000003-0000-4000-8000-000000000003',
      'customer',
      'Vikram Singh',
      'Size small aa gaya, M chahiye exchange possible?',
      now() - interval '62 minutes'
    ),
    (
      'b1000009-0000-4000-8000-000000000009',
      'a1000003-0000-4000-8000-000000000003',
      'agent',
      'Support',
      'Hi Vikram, I can help with a size exchange.',
      now() - interval '59 minutes'
    ),
    -- Sneha Patel
    (
      'b1000010-0000-4000-8000-000000000010',
      'a1000004-0000-4000-8000-000000000004',
      'customer',
      'Sneha Patel',
      'Box khula aaya aur product toota hua tha',
      now() - interval '80 minutes'
    ),
    (
      'b1000011-0000-4000-8000-000000000011',
      'a1000004-0000-4000-8000-000000000004',
      'customer',
      'Sneha Patel',
      'Photos bhej du? Ceramic mug completely cracked hai.',
      now() - interval '79 minutes'
    ),
    (
      'b1000012-0000-4000-8000-000000000012',
      'a1000004-0000-4000-8000-000000000004',
      'agent',
      'Support',
      'Sorry to hear that, Sneha. Yes, please share photos.',
      now() - interval '75 minutes'
    ),
    -- Arjun Khanna
    (
      'b1000013-0000-4000-8000-000000000013',
      'a1000005-0000-4000-8000-000000000005',
      'customer',
      'Arjun Khanna',
      'Return ho gaya 10 din pehle refund abhi tak nahi aaya',
      now() - interval '2 hours 10 minutes'
    ),
    (
      'b1000014-0000-4000-8000-000000000014',
      'a1000005-0000-4000-8000-000000000005',
      'agent',
      'Support',
      'Hi Arjun, I understand your concern about the refund timeline.',
      now() - interval '2 hours'
    ),
    (
      'b1000015-0000-4000-8000-000000000015',
      'a1000005-0000-4000-8000-000000000005',
      'customer',
      'Arjun Khanna',
      'You said 5-7 days. It''s been 12 days. Paisa wapas karo.',
      now() - interval '1 hour 55 minutes'
    ),
    -- Kavita Desai
    (
      'b1000016-0000-4000-8000-000000000016',
      'a1000006-0000-4000-8000-000000000006',
      'customer',
      'Kavita Desai',
      'शिपमेंट से पहले पता बदलना है। ऑर्डर 66018',
      now() - interval '3 hours 5 minutes'
    ),
    (
      'b1000017-0000-4000-8000-000000000017',
      'a1000006-0000-4000-8000-000000000006',
      'customer',
      'Kavita Desai',
      'नया पता: फ्लैट 302, ग्रीन पार्क, नई दिल्ली 110016',
      now() - interval '3 hours 4 minutes'
    ),
    (
      'b1000018-0000-4000-8000-000000000018',
      'a1000006-0000-4000-8000-000000000006',
      'agent',
      'Support',
      'Sure, let me verify dispatch status first.',
      now() - interval '3 hours'
    ),
    -- James Wilson
    (
      'b1000019-0000-4000-8000-000000000019',
      'a1000007-0000-4000-8000-000000000007',
      'customer',
      'James Wilson',
      'Promo code WELCOME10 didn''t work on my cart',
      now() - interval '4 hours 10 minutes'
    ),
    (
      'b1000020-0000-4000-8000-000000000020',
      'a1000007-0000-4000-8000-000000000007',
      'agent',
      'Support',
      'Hello James, I''ll check the coupon eligibility for your order.',
      now() - interval '4 hours'
    );

  -- -------------------------------------------------------------------------
  -- analyses (confidence stored as 0–100)
  -- -------------------------------------------------------------------------

  insert into public.analyses (
    id, ticket_id, intent, priority, recommended_action, confidence,
    escalation_required, suggested_reply, created_at
  ) values
    (
      'c1000001-0000-4000-8000-000000000001',
      'a1000001-0000-4000-8000-000000000001',
      'payment_debited_order_not_confirmed',
      'high',
      'Escalate to payments team for transaction verification',
      92,
      true,
      'Sorry for the inconvenience. We can help review your payment status once a support agent verifies the transaction.',
      now() - interval '10 minutes'
    ),
    (
      'c1000002-0000-4000-8000-000000000002',
      'a1000002-0000-4000-8000-000000000002',
      'delivery_delay',
      'medium',
      'Check shipment status and send updated delivery timeline',
      87,
      false,
      'Maafi chahte hain delay ke liye. Hum aapke order ki delivery status check karke update share karenge.',
      now() - interval '32 minutes'
    ),
    (
      'c1000003-0000-4000-8000-000000000003',
      'a1000003-0000-4000-8000-000000000003',
      'size_exchange',
      'medium',
      'Initiate size exchange workflow with pickup scheduling',
      80,
      false,
      'Size exchange ke liye hum pickup aur replacement steps share kar sakte hain.',
      now() - interval '1 hour'
    ),
    (
      'c1000004-0000-4000-8000-000000000004',
      'a1000004-0000-4000-8000-000000000004',
      'damaged_product_return',
      'high',
      'Open damaged-item claim and arrange replacement or return',
      84,
      false,
      'Return process ke steps aur timeline hum aapko share kar sakte hain.',
      now() - interval '1 hour'
    ),
    (
      'c1000005-0000-4000-8000-000000000005',
      'a1000005-0000-4000-8000-000000000005',
      'refund_not_credited',
      'high',
      'Escalate to refunds team to trace refund status',
      86,
      true,
      'We can help review your payment or refund status once our team verifies the transaction details.',
      now() - interval '2 hours'
    ),
    (
      'c1000006-0000-4000-8000-000000000006',
      'a1000006-0000-4000-8000-000000000006',
      'address_change',
      'medium',
      'Verify order not dispatched and update delivery address',
      82,
      false,
      'Address change possible ho to hum next steps share karenge.',
      now() - interval '3 hours'
    ),
    (
      'c1000007-0000-4000-8000-000000000007',
      'a1000007-0000-4000-8000-000000000007',
      'coupon_not_applied',
      'low',
      'Verify coupon eligibility and apply credit or explain rejection',
      79,
      false,
      'We''ll check the coupon eligibility for your order and share the next step shortly.',
      now() - interval '4 hours'
    );

  raise notice 'IndisStack seed complete: 7 tickets, messages, and analyses inserted.';
end $$;
