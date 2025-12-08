import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Student from '@/models/Student';

// GET /api/students - Get all students
export async function GET() {
  try {
    await connectDB();
    const students = await Student.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch students',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/students - Create a new student
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const student = await Student.create(body);
    
    return NextResponse.json(
      {
        success: true,
        data: student,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create student',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
