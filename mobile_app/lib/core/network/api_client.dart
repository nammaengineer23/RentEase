import 'package:dio/dio.dart';

class ApiClient {
  ApiClient() {
    _dio = Dio(
      BaseOptions(
        baseUrl: 'https://api.rentease.app',
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        contentType: Headers.jsonContentType,
      ),
    );
  }

  late final Dio _dio;

  Dio get dio => _dio;
}
