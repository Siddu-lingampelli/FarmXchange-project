import './globals.css'
import './styles/auth.css'
import './styles/register-choice.css'
import './styles/home.css'
import './styles/navbar.css'
import './styles/pages.css'
import './styles/farmer-dashboard.css'
import './styles/earnings.css'
import './styles/enhanced-earnings.css'
import './styles/farmer-profile.css'
import './styles/enhanced-dashboard.css'
import './styles/customer-dashboard.css'
import './styles/secure-checkout.css'
import ErrorBoundary from './components/ErrorBoundary';

export const metadata = {
  title: 'FCM App',
  description: 'MERN Stack Application',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
