import { NextResponse } from 'next/server';
import { connectToDatabase, isUsingFallback } from '../../../lib/mongodb';
import { Listing } from '../../../lib/models/Listing';
import { mockStore } from '../../../lib/mockStore';

// GET /api/listings - Retrieve filtered listings with GPS proximity
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    // Connect to database (or check fallback)
    const conn = await connectToDatabase();

    if (conn && !isUsingFallback()) {
      // Live MongoDB filtering
      const filter = {};

      if (query.area && query.area !== 'all') {
        filter.area = query.area;
      }
      if (query.tenantType && query.tenantType !== 'all') {
        filter.tenantType = { $in: [query.tenantType, 'any'] };
      }
      if (query.propertyType && query.propertyType !== 'all') {
        filter.propertyType = query.propertyType;
      }
      if (query.minRent || query.maxRent) {
        filter.rentAmount = {};
        if (query.minRent) filter.rentAmount.$gte = Number(query.minRent);
        if (query.maxRent) filter.rentAmount.$lte = Number(query.maxRent);
      }
      if (query.status && query.status !== 'all') {
        filter.status = query.status;
      }
      if (query.search) {
        filter.$or = [
          { title: { $regex: query.search, $options: 'i' } },
          { addressText: { $regex: query.search, $options: 'i' } },
          { area: { $regex: query.search, $options: 'i' } },
        ];
      }

      let listings = await Listing.find(filter).sort({ createdAt: -1 }).lean();

      // If MongoDB is connected but collection is completely empty, attempt auto-seed or use mockStore
      if (listings.length === 0) {
        try {
          if (Object.keys(filter).length === 0) {
            const initialData = mockStore.getListings({});
            const formatted = initialData.map(({ _id, distanceKm, distanceStr, ...rest }) => rest);
            await Listing.insertMany(formatted);
            listings = await Listing.find(filter).sort({ createdAt: -1 }).lean();
          }
        } catch (seedErr) {
          console.warn('Auto-seed warning:', seedErr.message);
        }
        if (listings.length === 0) {
          listings = mockStore.getListings(query);
        }
      }

      return NextResponse.json({
        success: true,
        source: 'mongodb',
        count: listings.length,
        data: listings,
      });
    } else {
      // Reactive in-memory mock store
      const listings = mockStore.getListings(query);
      const analytics = mockStore.getAnalytics();
      return NextResponse.json({
        success: true,
        source: 'mockStore',
        count: listings.length,
        data: listings,
        analytics,
      });
    }
  } catch (error) {
    console.error('Listings GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/listings - Create new To-Let listing
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title || !body.rentAmount || !body.area) {
      return NextResponse.json(
        { success: false, error: 'Title, Rent, and Area are required fields' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();

    if (conn && !isUsingFallback()) {
      const newListing = await Listing.create(body);
      return NextResponse.json(
        { success: true, source: 'mongodb', data: newListing },
        { status: 201 }
      );
    } else {
      const newListing = mockStore.createListing(body);
      return NextResponse.json(
        { success: true, source: 'mockStore', data: newListing },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Listings POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// PATCH /api/listings - Update listing status (Available ↔ Rented)
export async function PATCH(request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Listing ID and status are required' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();

    if (conn && !isUsingFallback()) {
      const updated = await Listing.findByIdAndUpdate(id, { status }, { new: true });
      return NextResponse.json({ success: true, source: 'mongodb', data: updated });
    } else {
      const updated = mockStore.updateStatus(id, status);
      return NextResponse.json({ success: true, source: 'mockStore', data: updated });
    }
  } catch (error) {
    console.error('Listings PATCH error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/listings - Delete a listing
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();

    if (conn && !isUsingFallback()) {
      await Listing.findByIdAndDelete(id);
      return NextResponse.json({ success: true, source: 'mongodb', message: 'Listing deleted' });
    } else {
      mockStore.deleteListing(id);
      return NextResponse.json({ success: true, source: 'mockStore', message: 'Listing deleted' });
    }
  } catch (error) {
    console.error('Listings DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

