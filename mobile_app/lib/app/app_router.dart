import 'package:go_router/go_router.dart';
import '../features/splash/presentation/pages/splash_page.dart';
import '../features/onboarding/presentation/pages/onboarding_page.dart';
import '../features/authentication/presentation/pages/authentication_page.dart';
import '../features/home/presentation/pages/home_page.dart';
import '../features/property/presentation/pages/property_page.dart';
import '../features/search/presentation/pages/search_page.dart';
import '../features/chat/presentation/pages/chat_page.dart';
import '../features/booking/presentation/pages/booking_page.dart';
import '../features/payment/presentation/pages/payment_page.dart';
import '../features/profile/presentation/pages/profile_page.dart';
import '../features/settings/presentation/pages/settings_page.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(path: '/splash', builder: (context, state) => const SplashPage()),
      GoRoute(path: '/onboarding', builder: (context, state) => const OnboardingPage()),
      GoRoute(path: '/sign-in', builder: (context, state) => const SignInPage()),
      GoRoute(path: '/home', builder: (context, state) => const HomePage()),
      GoRoute(path: '/property', builder: (context, state) => const PropertyPage()),
      GoRoute(path: '/search', builder: (context, state) => const SearchPage()),
      GoRoute(path: '/chat', builder: (context, state) => const ChatPage()),
      GoRoute(path: '/booking', builder: (context, state) => const BookingPage()),
      GoRoute(path: '/payment', builder: (context, state) => const PaymentPage()),
      GoRoute(path: '/profile', builder: (context, state) => const ProfilePage()),
      GoRoute(path: '/settings', builder: (context, state) => const SettingsPage()),
    ],
  );
}
