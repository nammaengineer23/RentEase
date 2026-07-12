import { PartialType } from '@nestjs/swagger';
import { CreatePropertyVisitDto } from './create-property-visit.dto';

export class UpdatePropertyVisitDto extends PartialType(
  CreatePropertyVisitDto,
) {}