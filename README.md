# Suubi Healthcare

Suubi Healthcare is a modern, interactive web platform designed to connect patients with healthcare providers. Built with Next.js and a rich UI component system, the platform offers a seamless experience for users seeking medical services, doctor consultations, and health information.

## Features

### For Patients
- **Doctor Directory**: Browse through detailed profiles of healthcare professionals, including specialties, experience, and ratings
- **Service Information**: Explore comprehensive medical services with expandable detailed descriptions
- **Appointment Scheduling**: Book appointments with preferred doctors based on availability
- **Patient-Doctor Chat**: Secure, real-time messaging with healthcare providers
- **Health Assessment**: Take interactive health assessments to identify potential medical needs
- **Contact System**: Easy ways to reach out to the healthcare facility

### For Healthcare Providers
- **Patient Management**: View upcoming appointments and patient information
- **Communication Tools**: Real-time chat with patients for follow-ups and consultations
- **Service Visibility**: Showcase medical expertise and available procedures
- **Availability Management**: Update and manage appointment availability

## Technologies Used

- **Frontend Framework**: [Next.js](https://nextjs.org/) 13 (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom component system with [Radix UI](https://www.radix-ui.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://github.com/colinhacks/zod) validation
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)

## Getting Started

### Prerequisites
- Node.js 16.8.0 or higher
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/suubi-healthcare.git
   cd suubi-healthcare
   ```

2. Install the dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

### Building for Production

```bash
npm run build
# or
yarn build
```

To start the production server:
```bash
npm run start
# or
yarn start
```

## Project Structure

```
suubi/
├── app/                   # Next.js app router pages
│   ├── appointments/      # Appointment scheduling
│   ├── chat/              # Doctor-patient messaging
│   ├── contact/           # Contact information
│   ├── doctors/           # Doctor directory
│   ├── health-assessment/ # Health assessment tool
│   ├── services/          # Medical services
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components
│   └── ...                # Other components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── public/                # Static assets
└── ...                    # Configuration files
```

## UI Design

Suubi Healthcare uses a thoughtfully crafted design system featuring:

- **Color palette**: Medical green (#73A580), mustard yellow (#E1AD01), and dark purple (#3E363F)
- **Lifeline elements**: Decorative line elements representing healthcare continuity
- **Responsive layouts**: Optimized for all device sizes
- **Accessibility**: Designed with accessibility in mind
- **Animations**: Subtle animations for enhanced user experience

## Future Enhancements

- Integration with electronic health records (EHR) systems
- Telehealth video consultation capabilities
- Prescription management system
- Patient portal with health tracking
- Multi-language support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All medical images courtesy of [Unsplash](https://unsplash.com)
- Icons by [Lucide](https://lucide.dev/)
- UI component inspiration from [shadcn/ui](https://ui.shadcn.com/) 