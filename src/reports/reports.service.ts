import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
  ) {}

  public create(dto: CreateReportDto, userId: string) {
    const newReport = this.reportRepository.create({
      ...dto,
      user: userId as unknown as User,
    });
    return this.reportRepository.save(newReport);
  }

  public async updateReportApproved(id: string, approved: boolean) {
    const { affected } = await this.reportRepository.update(id, { approved });

    if (!affected) {
      throw new NotFoundException('Report not found');
    }
  }
}
