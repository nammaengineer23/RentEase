import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/entities/splash_entity.dart';
import '../domain/repositories/splash_repository.dart';
import '../data/repositories/splash_repository_impl.dart';

final _repositoryProvider = Provider<SplashRepository>((ref) => SplashRepositoryImpl());

final SplashProvider = FutureProvider<List<SplashEntity>>((ref) async {
  final repository = ref.read(_repositoryProvider);
  return repository.load();
});
