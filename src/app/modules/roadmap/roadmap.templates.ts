export interface ItemTemplate {
  title: string
  description: string
  category: string
  priority: string
  tags?: string[]
}

export const randomItemTemplates: ItemTemplate[] = [
  {
    title: "Dark Mode Implementation",
    description:
      "Implement a comprehensive dark mode theme with automatic system preference detection, smooth transitions, and customizable accent colors",
    category: "UI_UX",
    priority: "HIGH",
    tags: ["theme", "accessibility", "user-experience"],
  },
  {
    title: "Real-time Push Notifications",
    description:
      "Add real-time push notifications for important updates, comments, mentions, and user interactions across all platforms with customizable preferences",
    category: "FEATURES",
    priority: "MEDIUM",
    tags: ["notifications", "real-time", "engagement"],
  },
  {
    title: "Advanced Search & Filtering",
    description:
      "Enhance search functionality with advanced filtering, faceted search, auto-complete, intelligent suggestions, and saved search queries",
    category: "FEATURES",
    priority: "LOW",
    tags: ["search", "filtering", "user-experience"],
  },
  {
    title: "Mobile-First Responsive Design",
    description:
      "Optimize the entire application for mobile devices with touch-friendly interfaces, responsive layouts, and progressive web app capabilities",
    category: "UI_UX",
    priority: "HIGH",
    tags: ["mobile", "responsive", "pwa"],
  },
  {
    title: "Intelligent API Rate Limiting",
    description:
      "Implement smart rate limiting with user-based quotas, dynamic throttling, and comprehensive monitoring to prevent API abuse",
    category: "SECURITY",
    priority: "CRITICAL",
    tags: ["security", "api", "performance"],
  },
  {
    title: "Database Query Optimization",
    description:
      "Optimize database queries, implement intelligent caching strategies, connection pooling, and improve overall data retrieval performance",
    category: "PERFORMANCE",
    priority: "HIGH",
    tags: ["database", "performance", "optimization"],
  },
  {
    title: "Third-party Service Integration",
    description:
      "Add support for popular third-party services, APIs, webhooks, and external platform integrations with OAuth authentication",
    category: "INTEGRATION",
    priority: "MEDIUM",
    tags: ["integration", "api", "oauth"],
  },
  {
    title: "Native Mobile Applications",
    description:
      "Develop native mobile applications for iOS and Android with full feature parity, offline support, and push notifications",
    category: "MOBILE",
    priority: "HIGH",
    tags: ["mobile", "native", "offline"],
  },
  {
    title: "GraphQL API Implementation",
    description:
      "Implement GraphQL endpoints for more efficient data fetching, real-time subscriptions, and improved developer experience",
    category: "API",
    priority: "MEDIUM",
    tags: ["graphql", "api", "performance"],
  },
  {
    title: "Advanced Analytics Dashboard",
    description:
      "Build comprehensive analytics dashboard with user behavior insights, custom reports, data visualization, and automated alerts",
    category: "FEATURES",
    priority: "MEDIUM",
    tags: ["analytics", "dashboard", "insights"],
  },
  {
    title: "Multi-language Localization",
    description:
      "Add internationalization support for multiple languages with dynamic content translation, RTL support, and cultural adaptations",
    category: "FEATURES",
    priority: "LOW",
    tags: ["i18n", "localization", "accessibility"],
  },
  {
    title: "Two-Factor Authentication",
    description:
      "Implement comprehensive 2FA with TOTP, SMS, backup codes, biometric authentication, and hardware security key support",
    category: "SECURITY",
    priority: "CRITICAL",
    tags: ["security", "authentication", "2fa"],
  },
  {
    title: "Real-time Performance Monitoring",
    description:
      "Add comprehensive performance monitoring with real-time alerts, metrics tracking, automated reporting, and anomaly detection",
    category: "PERFORMANCE",
    priority: "HIGH",
    tags: ["monitoring", "performance", "alerts"],
  },
  {
    title: "Automated Testing Infrastructure",
    description:
      "Implement comprehensive automated testing suite with unit, integration, end-to-end testing, and continuous quality assurance",
    category: "PLATFORM",
    priority: "MEDIUM",
    tags: ["testing", "automation", "quality"],
  },
  {
    title: "Cloud Infrastructure Migration",
    description:
      "Migrate to scalable cloud infrastructure with auto-scaling, load balancing, disaster recovery, and multi-region deployment",
    category: "PLATFORM",
    priority: "HIGH",
    tags: ["cloud", "infrastructure", "scalability"],
  },
  {
    title: "Advanced User Permissions",
    description:
      "Implement role-based access control with granular permissions, team management, audit logs, and compliance features",
    category: "SECURITY",
    priority: "HIGH",
    tags: ["permissions", "rbac", "security"],
  },
  {
    title: "Webhook Integration System",
    description:
      "Allow users to configure webhooks for real-time notifications, event streaming, and seamless third-party integrations",
    category: "INTEGRATION",
    priority: "MEDIUM",
    tags: ["webhooks", "integration", "events"],
  },
  {
    title: "Progressive Web App Features",
    description:
      "Add PWA capabilities including offline support, app-like experience, push notifications, and background sync",
    category: "MOBILE",
    priority: "MEDIUM",
    tags: ["pwa", "offline", "mobile"],
  },
  {
    title: "Advanced Data Export Tools",
    description:
      "Provide comprehensive data export functionality with multiple formats, scheduled exports, and data transformation options",
    category: "FEATURES",
    priority: "LOW",
    tags: ["export", "data", "automation"],
  },
  {
    title: "AI-Powered Recommendations",
    description:
      "Implement machine learning algorithms for intelligent content recommendations, user insights, and predictive analytics",
    category: "FEATURES",
    priority: "MEDIUM",
    tags: ["ai", "ml", "recommendations"],
  },
]

// Helper function to generate unique titles
export const generateUniqueTitle = (baseTitle: string): string => {
  const timestamp = Date.now()
  const randomNum = Math.floor(Math.random() * 1000)
  return `${baseTitle} #${timestamp}-${randomNum}`
}

// Get random template
export const getRandomTemplate = (): ItemTemplate => {
  const randomIndex = Math.floor(Math.random() * randomItemTemplates.length)
  return randomItemTemplates[randomIndex]
}

// Get multiple random templates
export const getRandomTemplates = (count: number): ItemTemplate[] => {
  const shuffled = [...randomItemTemplates].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, randomItemTemplates.length))
}
