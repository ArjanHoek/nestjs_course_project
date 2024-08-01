import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

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

  public async getEstimate({
    make,
    model,
    lng,
    lat,
    year,
    mileage,
  }: GetEstimateDto) {
    const estimate = await this.reportRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved = TRUE')
      .groupBy('mileage')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameter('mileage', mileage)
      .limit(3)
      .getRawOne();

    const price = estimate ? Math.floor(estimate.price) : null;
    return { price };
  }
}
