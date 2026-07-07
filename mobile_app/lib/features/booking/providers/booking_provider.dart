import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/entities/booking_entity.dart';
import '../domain/repositories/booking_repository.dart';
import '../data/repositories/booking_repository_impl.dart';

final _repositoryProvider = Provider<BookingRepository>((ref) => BookingRepositoryImpl());

final BookingProvider = FutureProvider<List<BookingEntity>>((ref) async {
  final repository = ref.read(_repositoryProvider);
  return repository.load();
});
