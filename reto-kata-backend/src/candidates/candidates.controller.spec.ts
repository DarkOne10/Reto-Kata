import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CandidateStatus } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard.js';
import { AuthService } from '../auth/auth.service.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { CandidatesController } from './candidates.controller.js';
import { CandidatesService } from './candidates.service.js';

describe('CandidatesController', () => {
  let controller: CandidatesController;
  const candidatesService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findMine: vi.fn(),
    findOne: vi.fn(),
    updateStatus: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        { provide: CandidatesService, useValue: candidatesService },
        { provide: AuthService, useValue: { getSessionUser: vi.fn() } },
        { provide: AuthGuard, useValue: { canActivate: () => true } },
        { provide: RolesGuard, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get(CandidatesController);
  });

  it('normalizes candidate fields before creating', async () => {
    await controller.create(
      {
        fullName: ' Ana García ',
        email: ' ANA@EXAMPLE.COM ',
        career: ' Ingeniería ',
        semester: 6,
      },
      { user: { id: 42, email: 'ana@example.com' } } as never,
    );

    expect(candidatesService.create).toHaveBeenCalledWith({
      fullName: 'Ana García',
      email: 'ana@example.com',
      career: 'Ingeniería',
      semester: 6,
      userId: 42,
    });
  });

  it('lists only the authenticated applicant submissions', async () => {
    await controller.findMine({ user: { id: 24 } } as never);
    expect(candidatesService.findMine).toHaveBeenCalledWith(24);
  });

  it('rejects invalid candidate data', () => {
    expect(() =>
      controller.create({
        fullName: ' ',
        email: 'invalid',
        career: 'Ingeniería',
        semester: 0,
      }, { user: { id: 42, email: 'ana@example.com' } } as never),
    ).toThrow(BadRequestException);
  });

  it('rejects pending as an analyst decision', () => {
    expect(() =>
      controller.updateStatus(1, { status: CandidateStatus.PENDING }),
    ).toThrow(BadRequestException);
  });
});