// ================================================================
// SUPABASE EDGE FUNCTION: send-contact-email
// Handles secure server-side email dispatch to Zestora company inbox
// Secrets (RESEND_API_KEY / COMPANY_EMAIL) reside in Supabase Secrets,
// never exposed to the client or in VITE_ variables.
// ================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email, and message are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const companyEmail = Deno.env.get('ZESTORA_COMPANY_EMAIL') || 'orders@zestora.com';
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    console.log(`[Contact Dispatch] New inquiry from ${name} (${email}) - Subject: ${subject || 'General Inquiry'}`);

    let emailSent = false;
    let dispatchDetails = 'Message recorded in database.';

    // If Resend API key is configured in Supabase project secrets
    if (resendApiKey) {
      const emailHtml = `
        <div style="font-family: 'Georgia', serif; color: #193826; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E8DDCD; background-color: #FBF8F2;">
          <div style="border-bottom: 2px solid #193826; padding-bottom: 12px; margin-bottom: 20px;">
            <h1 style="color: #193826; margin: 0; font-size: 24px;">ZESTORA</h1>
            <p style="color: #C5A869; margin: 4px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">New Customer Contact Inquiry</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #193826; font-weight: bold; width: 120px;">Customer Name:</td>
              <td style="padding: 8px 0; color: #193826;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #193826; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0; color: #193826;"><a href="mailto:${email}" style="color: #193826;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #193826; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0; color: #193826;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #193826; font-weight: bold;">Subject:</td>
              <td style="padding: 8px 0; color: #193826;">${subject || 'General Inquiry'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #193826; font-weight: bold;">Received At:</td>
              <td style="padding: 8px 0; color: #193826;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
            </tr>
          </table>

          <div style="background-color: #FFFFFF; border: 1px solid #E8DDCD; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #193826; text-transform: uppercase;">Message Body</h3>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333333; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="border-top: 1px solid #E8DDCD; padding-top: 12px; font-size: 12px; color: #777777;">
            <p style="margin: 0;">This email was automatically dispatched from the Zestora Storefront contact form via Supabase Edge Functions.</p>
          </div>
        </div>
      `;

      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Zestora Storefront <notifications@zestora.com>',
            to: [companyEmail],
            reply_to: email,
            subject: `[Zestora Inquiry] ${subject || 'New Customer Message'} from ${name}`,
            html: emailHtml
          })
        });

        if (res.ok) {
          emailSent = true;
          dispatchDetails = `Email dispatched to ${companyEmail} via Resend.`;
        } else {
          const errBody = await res.text();
          console.warn('Resend API dispatch error:', errBody);
          dispatchDetails = `Recorded in database. Resend status: ${res.status}`;
        }
      } catch (sendErr) {
        console.warn('Failed to call email API:', sendErr);
        dispatchDetails = 'Recorded in database. External email gateway unreachable.';
      }
    } else {
      console.log(`RESEND_API_KEY not set in Supabase Secrets. Email logged and stored in contact_messages table.`);
      dispatchDetails = 'Message securely stored in database. Configure RESEND_API_KEY in Supabase Secrets for live inbox delivery.';
    }

    return new Response(
      JSON.stringify({
        success: true,
        delivered: emailSent,
        details: dispatchDetails
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
