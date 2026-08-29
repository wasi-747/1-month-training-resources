import { NextResponse } from 'next/server';
import { connectToDatabase, isUsingFallback } from '../../../lib/mongodb';
import { Conversation } from '../../../lib/models/Conversation';
import { mockStore } from '../../../lib/mockStore';

// GET /api/chat - Fetch conversation history for a listing
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId') || 'listing-1';

    const conn = await connectToDatabase();

    if (conn && !isUsingFallback()) {
      let conv = await Conversation.findOne({ listingId }).lean();
      if (!conv) {
        conv = await Conversation.create({
          listingId,
          tenantName: 'Student Tenant',
          landlordName: 'Flat Owner',
          messages: [
            {
              sender: 'system',
              text: '🔒 Privacy Shield Active: This in-app chat & call channel is private. Your phone number is hidden.',
            },
          ],
        });
      }
      return NextResponse.json({ success: true, source: 'mongodb', data: conv });
    } else {
      const conv = mockStore.getConversation(listingId);
      return NextResponse.json({ success: true, source: 'mockStore', data: conv });
    }
  } catch (error) {
    console.error('Chat GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/chat - Message, In-App Call Log, or One-Tap Close Chat
export async function POST(request) {
  try {
    const body = await request.json();
    const { listingId, action } = body;

    if (!listingId || !action) {
      return NextResponse.json(
        { success: false, error: 'listingId and action are required' },
        { status: 400 }
      );
    }

    if (action === 'send_message') {
      const { sender, text } = body;
      const res = mockStore.sendMessage(listingId, sender || 'tenant', text);
      return NextResponse.json({ success: true, data: res });
    } else if (action === 'log_call') {
      const { durationSeconds, status } = body;
      const res = mockStore.logCall(listingId, durationSeconds || 0, status || 'completed');
      return NextResponse.json({ success: true, data: res });
    } else if (action === 'close_chat') {
      const { closedBy } = body;
      const res = mockStore.closeChat(listingId, closedBy || 'tenant');
      return NextResponse.json({ success: true, data: res });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Chat POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
