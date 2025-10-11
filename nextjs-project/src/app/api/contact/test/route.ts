import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('user_feedback')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Connection test failed:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      }, { status: 500 });
    }
    
    console.log('Connection test successful');
    
    // Test table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('user_feedback')
      .select('*')
      .limit(0);
    
    if (tableError) {
      console.error('Table structure test failed:', tableError);
      return NextResponse.json({
        success: false,
        tableError: tableError.message
      }, { status: 500 });
    }
    
    // Test insert with minimal data
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      contact_type: 'support'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_feedback')
      .insert([testData])
      .select();
    
    if (insertError) {
      console.error('Insert test failed:', insertError);
      return NextResponse.json({
        success: false,
        insertError: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint
      }, { status: 500 });
    }
    
    console.log('Insert test successful:', insertData);
    
    // Clean up test data
    if (insertData && insertData[0]) {
      await supabase
        .from('user_feedback')
        .delete()
        .eq('id', insertData[0].id);
    }
    
    return NextResponse.json({
      success: true,
      message: 'All tests passed',
      connectionTest: 'OK',
      tableStructureTest: 'OK',
      insertTest: 'OK',
      testData: insertData
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
