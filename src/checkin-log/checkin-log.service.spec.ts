import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckinLogService } from './checkin-log.service';
import { CheckinLog } from '../entities/checkin-log.entity';

describe('CheckinLogService', () => {
  let service: CheckinLogService;
  let repository: Repository<CheckinLog>;

  const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(undefined),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckinLogService,
        {
          provide: getRepositoryToken(CheckinLog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CheckinLogService>(CheckinLogService);
    repository = module.get<Repository<CheckinLog>>(getRepositoryToken(CheckinLog));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCheckin', () => {
    it('should create a checkin successfully', async () => {
      const createCheckinDto = {
        center_id: 1,
        ci_mem_id: 1,
      };

      const result = await service.insertCheckinLog(createCheckinDto);

      expect(result).toEqual({
        success: true,
        message: '체크인이 완료되었습니다.',
      });
    });

    it('should throw an error when creation fails', async () => {
      const createCheckinDto = {
        center_id: 1,
        ci_mem_id: 1,
      };

      jest.spyOn(mockRepository, 'execute').mockRejectedValueOnce(new Error());

      await expect(service.insertCheckinLog(createCheckinDto)).rejects.toThrow();
    });
  });

  describe('getCheckinLogList', () => {
    it('should return checkin logs successfully', async () => {
      const getCheckinLogListDto = {
        mem_id: 1,
        year: '2024',
        month: '03',
      };

      const mockCheckins = [
        {
          ci_date_only: '2024-03-14',
          ci_time_only: '15:30:45',
        },
      ];

      jest.spyOn(mockRepository, 'getRawMany').mockResolvedValueOnce(mockCheckins);

      const result = await service.getCheckinLogList(getCheckinLogListDto);

      expect(result).toEqual({
        success: true,
        data: mockCheckins,
      });
    });

    it('should throw an error when query fails', async () => {
      const getCheckinLogListDto = {
        mem_id: 1,
        year: '2024',
        month: '03',
      };

      jest.spyOn(mockRepository, 'getRawMany').mockRejectedValueOnce(new Error());

      await expect(service.getCheckinLogList(getCheckinLogListDto)).rejects.toThrow();
    });
  });
}); 