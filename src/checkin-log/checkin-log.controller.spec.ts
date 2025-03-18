import { Test, TestingModule } from '@nestjs/testing';
import { CheckinLogController } from './checkin-log.controller';
import { CheckinLogService } from './checkin-log.service';

describe('CheckinLogController', () => {
  let controller: CheckinLogController;
  let service: CheckinLogService;

  const mockCheckinLogService = {
    createCheckin: jest.fn(),
    getCheckinLogList: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckinLogController],
      providers: [
        {
          provide: CheckinLogService,
          useValue: mockCheckinLogService,
        },
      ],
    }).compile();

    controller = module.get<CheckinLogController>(CheckinLogController);
    service = module.get<CheckinLogService>(CheckinLogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCheckin', () => {
    it('should create a checkin successfully', async () => {
      const createCheckinDto = {
        center_id: 1,
        ci_mem_id: 1,
      };

      const expectedResult = {
        success: true,
        message: '체크인이 완료되었습니다.',
      };

      jest.spyOn(service, 'insertCheckinLog').mockResolvedValue(expectedResult);

      const result = await controller.insertCheckinLog(createCheckinDto);

      expect(result).toEqual(expectedResult);
      expect(service.insertCheckinLog).toHaveBeenCalledWith(createCheckinDto);
    });
  });

  describe('getCheckinLogList', () => {
    it('should return checkin logs successfully', async () => {
      const getCheckinLogListDto = {
        mem_id: 1,
        year: '2024',
        month: '03',
      };

      const expectedResult = {
        success: true,
        data: [
          {
            ci_date_only: '2024-03-14',
            ci_time_only: '15:30:45',
          },
        ],
      };

      jest.spyOn(service, 'getCheckinLogList').mockResolvedValue(expectedResult);

      const result = await controller.getCheckinLogList(getCheckinLogListDto);

      expect(result).toEqual(expectedResult);
      expect(service.getCheckinLogList).toHaveBeenCalledWith(getCheckinLogListDto);
    });
  });
}); 