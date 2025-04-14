# CSSI Portal - PDEU

<div>
  <img src="/public/images/logo/CSSI_WHITE.svg" alt="CSSI Logo" width="300"/>
  <p>A comprehensive platform for managing Civic & Social Service Internships at PDEU</p>
</div>

## Overview

The CSSI Portal is a web-based platform designed to streamline the Civic & Social Service Internship process at Pandit Deendayal Energy University (PDEU). It provides a centralized system for students, faculty, and administrators to manage internship documentation, tracking, and evaluation.

## Features

- **Authentication & Authorization**
  - Secure login system for students, faculty, and administrators
  - Role-based access control

- **Student Dashboard**
  - Profile management
  - Document upload system (Offer Letter, Report, Certificate, Poster)
  - Internship progress tracking
  - Schedule viewing

- **Faculty Interface**
  - Student supervision
  - Document verification
  - Performance evaluation

- **Admin Panel**
  - User management
  - Student and faculty data administration
  - System monitoring

- **Dark Mode Support**
  - Fully responsive dark/light theme
  - System preference detection

## Technology Stack

- **Frontend**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Next-themes
  - Lucide Icons

- **Backend**
  - Next.js API Routes
  - DrizzleORM
  - PostgreSQL (Neon)

- **Authentication**
  - NextAuth.js

- **File Storage**
  - Cloudinary

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/cssi-portal.git
cd cssi-portal
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Fill in your environment variables in `.env.local`

4. Run the development server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
cssi-portal/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # Reusable components
│   ├── context/            # React context providers
│   ├── drizzle/            # Database schema and configurations
│   ├── layout/             # Layout components
│   └── styles/             # Global styles and Tailwind config
├── public/                 # Static assets
└── package.json           # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- PDEU for supporting the CSSI initiative
- All contributors who have helped shape this project

## Contact

For any queries regarding the CSSI Portal, please contact:
- Project Coordinator - [Dr. Himanshu Gajera](mailto:himanshugajera.ce@gmail.com)
- Technical Support - [Vinit Thakkar](mailto:vinit.tce22@sot.pdpu.ac.in)

