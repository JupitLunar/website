import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, contactType } = body;
    
    // Debug logging
    console.log('Contact API called with:', { name, email, message, contactType });

    // Validate required fields
    if (!name || !email || !message || !contactType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message, and contactType are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate contact type
    if (!['support', 'enterprise', 'general'].includes(contactType)) {
      return NextResponse.json(
        { error: 'Invalid contact type. Must be support, enterprise, or general' },
        { status: 400 }
      );
    }

    // Validate input lengths
    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Name is too long (maximum 100 characters)' },
        { status: 400 }
      );
    }

    if (email.length > 255) {
      return NextResponse.json(
        { error: 'Email is too long (maximum 255 characters)' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message is too long (maximum 2000 characters)' },
        { status: 400 }
      );
    }

    // Use Supabase client with retry mechanism
    console.log('Supabase client initialized:', !!supabase);
    
    // Retry mechanism for database operations
    const maxRetries = 3;
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} to insert contact data`);
        
        // Insert into user_feedback table
        const { data, error } = await supabase
          .from('user_feedback')
          .insert([
            {
              name: name.trim(),
              email: email.trim().toLowerCase(),
              message: message.trim(),
              contact_type: contactType,
              // rating can be null as it's optional
              // created_at will be automatically set by the database
            }
          ])
          .select();
        
        if (error) {
          lastError = error;
          console.error(`Attempt ${attempt} failed:`, error);
          
          // If it's a connection issue and we have retries left, wait and try again
          if (attempt < maxRetries && (
            error.message.includes('connection') ||
            error.message.includes('timeout') ||
            error.code === 'PGRST301' // Connection timeout
          )) {
            console.log(`Waiting 1 second before retry ${attempt + 1}...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          
          // If it's not a connection issue or we're out of retries, break
          break;
        }
        
        // Success! Log and return
        console.log(`Contact form submitted successfully on attempt ${attempt}:`, {
          id: data[0]?.id,
          contactType,
          timestamp: new Date().toISOString()
        });
        
        return NextResponse.json(
          { 
            success: true, 
            message: 'Contact form submitted successfully',
            id: data[0]?.id 
          },
          { status: 200 }
        );
        
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} threw error:`, error);
        
        if (attempt < maxRetries) {
          console.log(`Waiting 1 second before retry ${attempt + 1}...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // If we get here, all retries failed
    const finalError = lastError;
    
    console.error('All retry attempts failed. Final error:', finalError);
    console.error('Error details:', {
      code: (finalError as any)?.code,
      message: (finalError as any)?.message,
      details: (finalError as any)?.details,
      hint: (finalError as any)?.hint
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to submit contact form after multiple attempts. Please try again.', 
        details: (finalError as any)?.message || 'Unknown error',
        retries: maxRetries
      },
      { status: 500 }
    );

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
