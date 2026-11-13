import type { RouteObject } from "react-router-dom";
import { PublicLayout } from "@/components/shell";
import HomePage from "@/pages/Home";
import DiscoverPage from "@/pages/Discover";
import JobsPage from "@/pages/Jobs";
import FinancePage from "@/pages/Finance";
import AiPage from "@/pages/Ai";
import AuthPage from "@/pages/Auth";
import OnboardingPage from "@/pages/Onboarding";
import MessagesPage from "@/pages/Messages";
import BusinessDashboard from "@/pages/business/page";
import SeekerDashboard from "@/pages/seeker/page";
import CustomerDashboard from "@/pages/customer/page";
import AdminDashboard from "@/pages/admin/page";
import NotFound from "@/pages/NotFound";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "discover", element: <DiscoverPage /> },
      { path: "jobs", element: <JobsPage /> },
      { path: "finance", element: <FinancePage /> },
      { path: "ai", element: <AiPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/auth", element: <AuthPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },
  { path: "/messages", element: <MessagesPage /> },
  { path: "/business", element: <BusinessDashboard /> },
  { path: "/seeker", element: <SeekerDashboard /> },
  { path: "/customer", element: <CustomerDashboard /> },
  { path: "/admin", element: <AdminDashboard /> },
];

export default routes;