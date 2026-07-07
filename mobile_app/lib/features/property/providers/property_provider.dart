import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/entities/property_entity.dart';
import '../domain/repositories/property_repository.dart';
import '../data/repositories/property_repository_impl.dart';

final _repositoryProvider = Provider<PropertyRepository>((ref) => PropertyRepositoryImpl());

final PropertyProvider = FutureProvider<List<PropertyEntity>>((ref) async {
  final repository = ref.read(_repositoryProvider);
  return repository.load();
});
