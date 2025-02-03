import { Controller, Get, Path, Post, Route, Body, Tags } from 'tsoa';
import { Proposal, CreateProposalDto } from '../types';

@Route('proposal')
@Tags('Proposals')
export class ProposalController extends Controller {
  @Get('{id}')
  public async getProposal(@Path() id: string): Promise<Proposal> {
    return {
      id,
      title: 'Sample Proposal',
      status: 'pending'
    };
  }

  @Post()
  public async createProposal(@Body() body: CreateProposalDto): Promise<void> {
    // Implementation will be added later
  }
}
