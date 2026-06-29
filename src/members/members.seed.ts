import { MemberStatus } from './entities/member.entity';

export interface MemberSeed {
  name: string;
  phone: string | null;
  email: string | null;
  status: MemberStatus;
  joinedAt: Date | null;
  observations: string | null;
}

export const MEMBER_SEEDS: MemberSeed[] = [
  {
    name: 'João Carlos de Souza',
    phone: '(21) 99999-1001',
    email: 'joao.carlos@email.com',
    status: 'active',
    joinedAt: new Date('2021-03-14'),
    observations: 'Membro ativo. Atua no departamento de recepção.',
  },
  {
    name: 'Maria Fernanda Lima',
    phone: '(21) 99999-1002',
    email: 'maria.lima@email.com',
    status: 'active',
    joinedAt: new Date('2019-08-22'),
    observations: 'Participa do ministério de louvor.',
  },
  {
    name: 'Pedro Henrique Alves',
    phone: '(21) 99999-1003',
    email: 'pedro.alves@email.com',
    status: 'visitor',
    joinedAt: null,
    observations: 'Visitante recorrente. Acompanhando classe de novos membros.',
  },
  {
    name: 'Ana Beatriz Rocha',
    phone: '(21) 99999-1004',
    email: 'ana.rocha@email.com',
    status: 'away',
    joinedAt: new Date('2017-11-05'),
    observations: 'Em acompanhamento pastoral.',
  },
];
