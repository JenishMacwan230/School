# School Management System

A modern school management system built with [Next.js](https://nextjs.org) and [MongoDB](https://www.mongodb.com/). This template provides a solid foundation for building a school website with database integration.

## Features

- ✅ Next.js 16 with App Router
- ✅ TypeScript for type safety
- ✅ MongoDB integration with both native driver and Mongoose
- ✅ RESTful API endpoints for student management
- ✅ Tailwind CSS for styling
- ✅ ESLint for code quality
- ✅ Environment variable configuration

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm or yarn package manager
- MongoDB database (local or MongoDB Atlas)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/JenishMacwan230/School.git
cd School
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and update it with your MongoDB connection string:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
MONGODB_DB_NAME=school
```

For local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/school
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── health/        # MongoDB health check
│   │   │   └── students/      # Student CRUD operations
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── lib/                   # Utility libraries
│   │   ├── mongodb.ts         # MongoDB native driver connection
│   │   └── mongoose.ts        # Mongoose connection
│   └── models/                # Database models
│       └── Student.ts         # Student schema
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## API Endpoints

### Health Check

**GET** `/api/health`
- Check MongoDB connection status
- Returns database name and connection health

### Students

**GET** `/api/students`
- Fetch all students
- Returns array of student objects

**POST** `/api/students`
- Create a new student
- Request body:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "grade": 10
  }
  ```

**GET** `/api/students/[id]`
- Get a specific student by ID
- Returns single student object

**PUT** `/api/students/[id]`
- Update a student by ID
- Request body: partial student object

**DELETE** `/api/students/[id]`
- Delete a student by ID
- Returns success confirmation

## Database Models

### Student Model

```typescript
{
  firstName: string;      // Required, max 60 characters
  lastName: string;       // Required, max 60 characters
  email: string;          // Required, unique, valid email format
  grade: number;          // Required, between 1-12
  enrollmentDate: Date;   // Default: current date
  active: boolean;        // Default: true
  createdAt: Date;        // Auto-generated
  updatedAt: Date;        // Auto-generated
}
```

## MongoDB Integration

This project provides two approaches to MongoDB integration:

1. **Native MongoDB Driver** (`src/lib/mongodb.ts`)
   - Direct connection to MongoDB
   - Used in the health check endpoint
   - Best for simple queries

2. **Mongoose ODM** (`src/lib/mongoose.ts`)
   - Schema validation and modeling
   - Used in student endpoints
   - Best for complex data structures

Both implementations use connection pooling and are optimized for serverless environments.

## Development

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
```

### Production

```bash
npm run start
```

## Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)

### MongoDB Resources
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Environment Variables on Vercel

Make sure to add the following environment variables in your Vercel project settings:
- `MONGODB_URI` - Your MongoDB connection string
- `MONGODB_DB_NAME` - Your database name (optional)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
