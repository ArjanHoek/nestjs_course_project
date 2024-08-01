import { Report } from 'src/reports/report.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  hash: string;

  @Column({ default: true })
  isAdmin: boolean;

  @OneToMany(() => Report, ({ user }) => user)
  reports: Report[];
}
