# Breathe - Modern Next.js Authentication Solution

Breathe is a comprehensive authentication solution built with Next.js 15, designed to provide a robust starting point for modern web applications. It features secure password handling, email verification, and complete account management functionality.

![Breathe Authentication](public/breathe.png)

## Features

- 🔐 **Secure Authentication** - Industry-standard Argon2 password hashing with JWT tokens
- 📧 **Email Integration** - Built-in email service for password resets and notifications
- 🔄 **Password Recovery** - Time-limited tokens and email verification
- 👤 **Account Management** - User-friendly interface for settings and preferences
- 📊 **Database Ready** - Prisma ORM with MySQL support
- ⚡ **Modern Stack** - React Server Components, TypeScript, and modern security practices

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Prisma ORM
- MySQL
- Framer Motion
- Lucide Icons

## Prerequisites

- [Bun](https://bun.sh/) (preferred) or Node.js 18+
- MySQL database
- SMTP server for email functionality

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/m4yc3x/breathe.git
cd breathe
```

2. Install dependencies:

```bash
bun install
```

3. Configure environment variables:
   - Create a `.env` file in the root of the project
   - Update the following variables:
     ```env
     DATABASE_URL="mysql://user:password@localhost:3306/your_database"
     NEXTAUTH_SECRET=your_generated_secret
     NEXTAUTH_URL=http://localhost:3000
     SMTP_HOST=your_smtp_host
     SMTP_PORT=your_smtp_port
     SMTP_USER=your_smtp_user
     SMTP_PASSWORD=your_smtp_password
     EMAIL_FROM_ADDRESS=your_email
     EMAIL_FROM_NAME="Your App Name"
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```

4. Initialize the database:
```bash
bun prisma generate
bun prisma db push
```

5. Run the development server:
```bash
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
breathe/
├── src/
│ ├── app/ # Next.js app router pages
│ ├── components/ # Reusable React components
│ ├── lib/ # Utility functions and configurations
│ └── styles/ # Global styles and Tailwind configurations
├── prisma/ # Database schema and migrations
└── public/ # Static assets
```

## Development Guidelines

- Use functional components and React hooks
- Implement loading indicators for all async operations
- Keep SEO meta tags in page components
- Follow mobile-first responsive design using Tailwind CSS
- Utilize Shadcn/ui components for consistent UI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

The application is optimized for deployment on Vercel. For other platforms, ensure your deployment environment supports:

- Node.js 18+ or Bun
- MySQL database
- Environment variables configuration
- Build command: `bun run build`
- Start command: `bun run start`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, open an issue in the GitHub repository.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [Framer Motion](https://www.framer.com/motion/)

---

Built with ❤️ using Next.js and modern web technologies