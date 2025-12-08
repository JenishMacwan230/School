import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Student from '@/models/Student';
import mongoose from 'mongoose';

// GET /api/students/[id] - Get a single student by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid student ID',
        },
        { status: 400 }
      );
    }

    await connectDB();
    const student = await Student.findById(id);
    
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: 'Student not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch student',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/students/[id] - Update a student by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid student ID',
        },
        { status: 400 }
      );
    }

    await connectDB();
    const body = await request.json();
    
    const student = await Student.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: 'Student not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update student',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}

// DELETE /api/students/[id] - Delete a student by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid student ID',
        },
        { status: 400 }
      );
    }

    await connectDB();
    const student = await Student.findByIdAndDelete(id);
    
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: 'Student not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {},
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete student',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
