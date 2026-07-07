import '../entities/booking_entity.dart';

abstract class BookingRepository {
  Future<List<BookingEntity>> load();
}
