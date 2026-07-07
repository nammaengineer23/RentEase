import '../entities/onboarding_entity.dart';

abstract class OnboardingRepository {
  Future<List<OnboardingEntity>> load();
}
