import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/repositories/authentication_repository_impl.dart';
import '../domain/entities/authentication_entity.dart';
import '../domain/repositories/authentication_repository.dart';

final _repositoryProvider = Provider<AuthenticationRepository>((ref) => AuthenticationRepositoryImpl());

final AuthenticationProvider = FutureProvider<List<AuthenticationEntity>>((ref) async {
  final repository = ref.read(_repositoryProvider);
  return repository.load();
});

final signInWithGoogleProvider = FutureProvider.family<bool, String>((ref, _) async {
  final repository = ref.read(_repositoryProvider);
  return repository.signInWithGoogle();
});
