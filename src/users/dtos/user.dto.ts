import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Transform(({ obj: { reports } }) => reports)
  @Expose()
  reports: Report[];
}
