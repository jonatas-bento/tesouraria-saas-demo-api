import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberEntity } from './entities/member.entity';
import { MEMBER_SEEDS } from './members.seed';

@Injectable()
export class MembersService implements OnModuleInit {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly membersRepository: Repository<MemberEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedIfEmpty();
  }

  async findAll(): Promise<MemberEntity[]> {
    return this.membersRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<MemberEntity> {
    const member = await this.membersRepository.findOne({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException('Membro não encontrado.');
    }

    return member;
  }

  async create(dto: CreateMemberDto): Promise<MemberEntity> {
    const member = this.membersRepository.create({
      name: dto.name.trim(),
      phone: this.normalizeOptionalText(dto.phone),
      email: this.normalizeOptionalText(dto.email),
      status: dto.status ?? 'active',
      joinedAt: dto.joinedAt ? new Date(dto.joinedAt) : null,
      observations: this.normalizeOptionalText(dto.observations),
    });

    return this.membersRepository.save(member);
  }

  async update(id: string, dto: UpdateMemberDto): Promise<MemberEntity> {
    const member = await this.findOne(id);

    if (dto.name !== undefined) {
      member.name = dto.name.trim();
    }

    if (dto.phone !== undefined) {
      member.phone = this.normalizeOptionalText(dto.phone);
    }

    if (dto.email !== undefined) {
      member.email = this.normalizeOptionalText(dto.email);
    }

    if (dto.status !== undefined) {
      member.status = dto.status;
    }

    if (dto.joinedAt !== undefined) {
      member.joinedAt = dto.joinedAt ? new Date(dto.joinedAt) : null;
    }

    if (dto.observations !== undefined) {
      member.observations = this.normalizeOptionalText(dto.observations);
    }

    return this.membersRepository.save(member);
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const member = await this.findOne(id);

    await this.membersRepository.remove(member);

    return {
      id,
      deleted: true,
    };
  }

  async resetDemoData(): Promise<MemberEntity[]> {
    await this.membersRepository.clear();

    const members = MEMBER_SEEDS.map((seed) =>
      this.membersRepository.create({
        ...seed,
        joinedAt: seed.joinedAt ? new Date(seed.joinedAt) : null,
      }),
    );

    await this.membersRepository.save(members);

    return this.findAll();
  }

  private async seedIfEmpty(): Promise<void> {
    const count = await this.membersRepository.count();

    if (count === 0) {
      await this.resetDemoData();
    }
  }

  private normalizeOptionalText(value?: string): string | null {
    const normalized = value?.trim();

    return normalized ? normalized : null;
  }
}
