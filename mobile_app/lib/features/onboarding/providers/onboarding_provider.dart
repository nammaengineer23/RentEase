import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/entities/onboarding_entity.dart';
import '../domain/repositories/onboarding_repository.dart';
import '../data/repositories/onboarding_repository_impl.dart';

final _repositoryProvider = Provider<OnboardingRepository>((ref) => OnboardingRepositoryImpl());

final OnboardingProvider = FutureProvider<List<OnboardingEntity>>((ref) async {
  final repository = ref.read(_repositoryProvider);
  return repository.load();
});
