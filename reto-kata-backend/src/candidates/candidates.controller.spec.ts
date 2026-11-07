import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CandidateStatus } from '@prisma/client';
import { CandidatesController } from './candidates.controller.js';
import { CandidatesService } from './candidates.service.js';

describe('CandidatesController', () => {
  let controller: CandidatesController;
  const candidatesService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    updateStatus: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [{ provide: CandidatesService, useValue: candidatesService }],
    }).compile();

    controller = module.get(CandidatesController);
  });

  it('normalizes candidate fields before creating', async () => {
    await controller.create({
      fullName: ' Ana García ',
      email: ' ANA@EXAMPLE.COM ',
      career: ' Ingeniería ',
      semester: 6,
    });

    expect(candidatesService.create).toHaveBeenCalledWith({
      fullName: 'Ana García',
      email: 'ana@example.com',
      career: 'Ingeniería',
      semester: 6,
    });
  });

  it('rejects invalid candidate data', () => {
    expect(() =>
      controller.create({
        fullName: ' ',
        email: 'invalid',
        career: 'Ingeniería',
        semester: 0,
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects pending as an analyst decision', () => {
    expect(() =>
      controller.updateStatus(1, { status: CandidateStatus.PENDING }),
    ).toThrow(BadRequestException);
  });
});