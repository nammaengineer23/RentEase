import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/entities/profile_entity.dart';
import '../domain/repositories/profile_repository.dart';
import '../data/repositories/profile_repository_impl.dart';

final _repositoryProvider = Provider<ProfileRepository>((ref) => ProfileRepositoryImpl());

final ProfileProvider = FutureProvider<List<ProfileEntity>>((ref) async {
  final repository = ref.read(_repositoryProvider);
  return repository.load();
});
