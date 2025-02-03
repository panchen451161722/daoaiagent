export interface DAO {
  id: string;
  name: string;
  description?: string;
}

export interface CreateDAODto {
  name: string;
  description?: string;
}

export interface Proposal {
  id: string;
  title: string;
  description?: string;
  status: string;
}

export interface CreateProposalDto {
  title: string;
  description?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  status: string;
}

export interface AIA {
  id: string;
  name: string;
  description?: string;
  status: string;
}

export interface CreateAIADto {
  name: string;
  description?: string;
}

export interface UpdateAIADto {
  name?: string;
  description?: string;
  status?: string;
}
